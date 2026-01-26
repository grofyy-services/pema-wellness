"""
Estimate endpoint scenarios covering adults distribution, children, caregiver, and suites
"""

from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession


def _rates_for_category(category: str, nights: int):
    # Wellness rates (< 8 nights) and Clinical rates (>= 8 nights)
    wellness_single = {
        "Standard": 47000,
        "Premium Balcony": 60000,
        "Premium Garden": 64000,
        "Executive": 84000,
        "Executive Junior Suite": 130000,
        "Executive Suite": 130000,
        "Elemental Villa": 200000,
        "Pema Suite": 290000,
    }
    wellness_double = {
        "Standard": 83000,
        "Premium Balcony": 98000,
        "Premium Garden": 107000,
        "Executive": 130000,
        "Executive Junior Suite": 177000,
        "Executive Suite": 177000,
        "Elemental Villa": 260000,
        "Pema Suite": 370000,
    }
    clinical_single = {
        "Standard": 45000,
        "Premium Balcony": 57000,
        "Premium Garden": 61000,
        "Executive": 80000,
        "Executive Junior Suite": 124000,
        "Executive Suite": 124000,
        "Elemental Villa": 190000,
        "Pema Suite": 280000,
    }
    clinical_double = {
        "Standard": 79000,
        "Premium Balcony": 93000,
        "Premium Garden": 102000,
        "Executive": 124000,
        "Executive Junior Suite": 169000,
        "Executive Suite": 169000,
        "Elemental Villa": 250000,
        "Pema Suite": 350000,
    }
    if nights >= 8:
        return clinical_single[category], clinical_double[category]
    return wellness_single[category], wellness_double[category]


def _expected_total_inr(
    category: str,
    nights: int,
    single_rooms: int,
    double_rooms: int,
    children_5_12_count: int = 0,
    caregiver_share: bool = False,
    caregiver_separate: bool = False,
):
    rate_single, rate_double = _rates_for_category(category, nights)
    base_inr = (single_rooms * rate_single + double_rooms * rate_double) * nights
    children_inr = children_5_12_count * 7000 * nights
    caregiver_inr = 0
    if caregiver_share:
        caregiver_inr += 8000 * nights
    if caregiver_separate:
        caregiver_room_rates = {
            "Standard": 20000,
            "Premium Balcony": 25000,
            "Premium Garden": 28000,
        }
        if category in caregiver_room_rates:
            caregiver_inr += caregiver_room_rates[category] * nights
        else:
            # Guest pricing fallback: single occupancy guest pricing
            caregiver_inr += rate_single * nights

    subtotal_paise = int((base_inr + children_inr + caregiver_inr) * 100)
    # Taxes removed: prices are tax-inclusive in DB/rate tables
    total_paise = subtotal_paise
    return round(total_paise / 100.0, 2)


def _build_req(
    category: str,
    nights: int,
    adults_total: int,
    children_under4: int = 0,
    children_5_12: int = 0,
    teens: int = 0,
    caregiver_required: bool = False,
    caregiver_stay_with_guest: bool = False,
    number_of_rooms: int = 1,
):
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=nights)
    return {
        "room_pricing_category": category,
        "check_in_date": check_in.isoformat(),
        "check_out_date": check_out.isoformat(),
        "number_of_rooms": number_of_rooms,
        "adults_total": adults_total,
        "children_total_under_4": children_under4,
        "children_total_5to12": children_5_12,
        "teens_13to18": teens,
        "caregiver_required": caregiver_required,
        "caregiver_stay_with_guest": caregiver_stay_with_guest,
    }


# suite room is provided via fixture test_suite_room


class TestEstimateScenarios:
    def test_pg_single_adult(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=3, adults_total=1)
        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=1, double_rooms=0)
        assert data["price_breakdown"]["total"] == expected
        assert data["full_payment_required"] is False
        assert data["deposit_required"] == "50000.00"

    def test_pg_double_two_adults(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=3, adults_total=2)
        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=0, double_rooms=1)
        assert data["price_breakdown"]["total"] == expected
        assert data["deposit_required"] == "50000.00"

    def test_pg_three_adults(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=3, adults_total=3)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=1, double_rooms=1)
        assert data["price_breakdown"]["total"] == expected

    def test_pg_four_adults(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=3, adults_total=4)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=0, double_rooms=2)
        assert data["price_breakdown"]["total"] == expected

    def test_pg_child_5_to_12_meal(self, client: TestClient, test_room):
        req = _build_req(
            "Premium Garden", nights=3, adults_total=2, children_5_12=1,
            caregiver_required=True, caregiver_stay_with_guest=True
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr(
            "Premium Garden", 3, single_rooms=0, double_rooms=1, children_5_12_count=1, caregiver_share=True
        )
        assert data["price_breakdown"]["total"] == expected

    def test_pg_child_under_4_free(self, client: TestClient, test_room):
        req = _build_req(
            "Premium Garden", nights=3, adults_total=2, children_under4=1,
            caregiver_required=True, caregiver_stay_with_guest=True
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr(
            "Premium Garden", 3, single_rooms=0, double_rooms=1, caregiver_share=True
        )
        assert data["price_breakdown"]["total"] == expected

    def test_pg_caregiver_share(self, client: TestClient, test_room):
        req = _build_req(
            "Premium Garden", nights=3, adults_total=2, caregiver_required=True, caregiver_stay_with_guest=True
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=0, double_rooms=1, caregiver_share=True)
        assert data["price_breakdown"]["total"] == expected

    def test_pg_caregiver_separate_room(self, client: TestClient, test_room):
        req = _build_req(
            "Premium Garden", nights=3, adults_total=2, caregiver_required=True, caregiver_stay_with_guest=False
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr(
            "Premium Garden", 3, single_rooms=0, double_rooms=1, caregiver_separate=True
        )
        assert data["price_breakdown"]["total"] == expected

    def test_suite_double_full_payment(self, client: TestClient, test_suite_room):
        req = _build_req("Executive Suite", nights=3, adults_total=2)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Executive Suite", 3, single_rooms=0, double_rooms=1)
        assert data["price_breakdown"]["total"] == expected
        assert data["full_payment_required"] is True
        # For suites, deposit_required equals full total, formatted as string with 2 decimals
        assert data["deposit_required"] == f"{expected:.2f}"

    def test_suite_caregiver_separate_guest_pricing(self, client: TestClient, test_suite_room):
        req = _build_req(
            "Executive Suite", nights=3, adults_total=2, caregiver_required=True, caregiver_stay_with_guest=False
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr(
            "Executive Suite", 3, single_rooms=0, double_rooms=1, caregiver_separate=True
        )
        assert data["price_breakdown"]["total"] == expected
        assert data["full_payment_required"] is True
        assert data["deposit_required"] == f"{expected:.2f}"

    def test_clinical_rates_double_two_adults_8_nights(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=8, adults_total=2)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 8, single_rooms=0, double_rooms=1)
        assert data["price_breakdown"]["total"] == expected

    def test_clinical_rates_single_one_adult_8_nights(self, client: TestClient, test_room):
        req = _build_req("Premium Garden", nights=8, adults_total=1)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 8, single_rooms=1, double_rooms=0)
        assert data["price_breakdown"]["total"] == expected

    def test_teens_count_as_adults_two_adults_one_teen(self, client: TestClient, test_room):
        # 2 adults + 1 teen => effective 3 adults => 1 double + 1 single
        req = _build_req("Premium Garden", nights=3, adults_total=2, teens=1)
        res = client.post("/api/v1/bookings/estimate", json=req)
        data = res.json()
        expected = _expected_total_inr("Premium Garden", 3, single_rooms=1, double_rooms=1)
        assert data["price_breakdown"]["total"] == expected


