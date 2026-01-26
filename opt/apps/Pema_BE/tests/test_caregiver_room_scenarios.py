"""
Comprehensive caregiver room scenarios testing the new caregiver_room_pricing_category parameter
"""

from datetime import date, timedelta
from fastapi.testclient import TestClient


def _build_estimate_req(
    guest_category: str,
    nights: int = 3,
    adults_total: int = 2,
    children_under4: int = 0,
    children_5_12: int = 0,
    teens: int = 0,
    caregiver_required: bool = False,
    caregiver_stay_with_guest: bool = False,
    caregiver_meal: str = None,
    caregiver_room_category: str = None,
    number_of_rooms: int = 1,
):
    """Build estimate request payload"""
    check_in = date.today() + timedelta(days=10)
    check_out = check_in + timedelta(days=nights)
    req = {
        "room_pricing_category": guest_category,
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
    if caregiver_meal:
        req["caregiver_meal"] = caregiver_meal
    if caregiver_room_category:
        req["caregiver_room_pricing_category"] = caregiver_room_category
    return req


def _find_line_by_description(lines, description_contains):
    """Find price line containing specific description text"""
    for line in lines:
        if description_contains.lower() in line["description"].lower():
            return line
    return None


class TestCaregiverRoomScenarios:
    """Test all caregiver room scenarios with the new parameter"""

    def test_non_executive_guest_separate_caregiver_room_same_category(self, client: TestClient, test_room):
        """Test non-executive room (Premium Garden) with caregiver in separate room using same category"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=2,
            children_5_12=1,  # Requires caregiver
            caregiver_required=True,
            caregiver_stay_with_guest=False  # Separate room
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Check caregiver room pricing (Premium Garden = ₹28,000/night)
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room")
        assert caregiver_line is not None
        assert "Premium Garden" in caregiver_line["description"]
        assert caregiver_line["amount"] == 28000 * 3  # 3 nights
        assert caregiver_line["nights"] == 3

    def test_non_executive_guest_separate_caregiver_room_different_category(self, client: TestClient, test_room):
        """Test Premium Garden guest room with Standard caregiver room"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False,
            caregiver_room_category="Standard"  # Different category for caregiver
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Check caregiver room pricing (Standard = ₹20,000/night)
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room")
        assert caregiver_line is not None
        assert "Standard" in caregiver_line["description"]
        assert caregiver_line["amount"] == 20000 * 3  # 3 nights
        assert caregiver_line["nights"] == 3

    def test_caregiver_shared_room_single_occupancy(self, client: TestClient, test_room):
        """Test caregiver sharing room with single occupancy guest"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=1,  # Single occupancy
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=True  # Shares room
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Check caregiver sharing pricing (₹8,000/night)
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver (sharing guest room)")
        assert caregiver_line is not None
        assert caregiver_line["amount"] == 8000 * 3  # 3 nights

    def test_caregiver_complimentary_meal(self, client: TestClient, test_room):
        """Test caregiver with complimentary simple meal"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=True,
            caregiver_meal="simple"  # Complimentary
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Check meal line shows complimentary (₹0)
        meal_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver meals: simple")
        assert meal_line is not None
        assert meal_line["amount"] == 0

    def test_caregiver_restaurant_dining_meal_shared_room(self, client: TestClient, test_room):
        """Test caregiver with restaurant dining meal when sharing room"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=True,  # Sharing room
            caregiver_meal="restaurant_dining"
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Restaurant dining charges extra when sharing room (₹8,000/night)
        meal_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver meal upgrade: restaurant dining")
        assert meal_line is not None
        assert meal_line["amount"] == 8000 * 3  # 3 nights

    def test_caregiver_restaurant_dining_meal_separate_room(self, client: TestClient, test_room):
        """Test caregiver with restaurant dining meal when in separate room"""
        req = _build_estimate_req(
            guest_category="Premium Garden",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False,  # Separate room
            caregiver_meal="restaurant_dining"
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Restaurant dining is included when separate room (₹0 extra)
        meal_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver meal upgrade: restaurant dining (included)")
        assert meal_line is not None
        assert meal_line["amount"] == 0

    def test_executive_guest_caregiver_complimentary_separate_room(self, client: TestClient, test_executive_room):
        """Test Executive guest room with complimentary caregiver separate room"""
        req = _build_estimate_req(
            guest_category="Executive",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Executive caregiver room should be complimentary
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room (complimentary")
        assert caregiver_line is not None
        assert "Executive" in caregiver_line["description"]
        assert caregiver_line["amount"] == 0

    def test_executive_suite_guest_caregiver_complimentary_separate_room(self, client: TestClient, test_suite_room):
        """Test Executive Suite guest room with complimentary caregiver separate room"""
        req = _build_estimate_req(
            guest_category="Executive Suite",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Executive Suite caregiver room should be complimentary
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room (complimentary")
        assert caregiver_line is not None
        assert "Executive Suite" in caregiver_line["description"]
        assert caregiver_line["amount"] == 0

    def test_pema_suite_guest_caregiver_complimentary_separate_room(self, client: TestClient, test_pema_suite_room):
        """Test Pema Suite guest room with complimentary caregiver separate room"""
        req = _build_estimate_req(
            guest_category="Pema Suite",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Pema Suite caregiver room should be complimentary
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room (complimentary")
        assert caregiver_line is not None
        assert "Pema Suite" in caregiver_line["description"]
        assert caregiver_line["amount"] == 0

    def test_elemental_villa_guest_caregiver_complimentary_separate_room(self, client: TestClient, test_elemental_villa_room):
        """Test Elemental Villa guest room with complimentary caregiver separate room"""
        req = _build_estimate_req(
            guest_category="Elemental Villa",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Elemental Villa caregiver room should be complimentary
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room (complimentary")
        assert caregiver_line is not None
        assert "Elemental Villa" in caregiver_line["description"]
        assert caregiver_line["amount"] == 0

    def test_executive_guest_caregiver_complimentary_shared_room(self, client: TestClient, test_executive_room):
        """Test Executive guest room with complimentary caregiver shared room"""
        req = _build_estimate_req(
            guest_category="Executive",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=True  # Shared room
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Executive caregiver sharing should be complimentary
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver (sharing guest room - complimentary)")
        assert caregiver_line is not None
        assert caregiver_line["amount"] == 0

    def test_standard_guest_caregiver_fallback_pricing(self, client: TestClient, test_room):
        """Test Standard guest with caregiver in Executive Junior Suite (complimentary category)"""
        # Create a Standard room fixture for this test
        import asyncio
        from app.models.room import Room
        from tests.conftest import TestSessionLocal

        async def create_standard_room():
            async with TestSessionLocal() as session:
                standard_room = Room(
                    name="Standard Room Test",
                    category="Standard",
                    pricing_category="Standard",
                    description="Standard Room",
                    occupancy_max_adults=2,
                    occupancy_max_children=2,
                    occupancy_max_total=4,
                    price_per_night_single=47000,  # matches pricing tables
                    price_per_night_double=83000,
                    inventory_count=3,
                    is_active=True,
                    maintenance_mode=False
                )
                session.add(standard_room)
                await session.commit()

        asyncio.get_event_loop().run_until_complete(create_standard_room())

        req = _build_estimate_req(
            guest_category="Standard",
            adults_total=2,
            children_5_12=1,
            caregiver_required=True,
            caregiver_stay_with_guest=False,
            caregiver_room_category="Executive Junior Suite"  # Executive category = complimentary
        )

        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200
        data = res.json()

        # Executive Junior Suite is complimentary, so caregiver room should be free
        caregiver_line = _find_line_by_description(data["price_breakdown"]["lines"], "caregiver separate room (complimentary")
        assert caregiver_line is not None
        assert "Executive Junior Suite" in caregiver_line["description"]
        assert caregiver_line["amount"] == 0  # Complimentary

    def test_caregiver_room_category_parameter_validation(self, client: TestClient, test_room):
        """Test that caregiver_room_pricing_category accepts valid values"""
        # Valid category should work
        req = _build_estimate_req(
            guest_category="Premium Garden",
            caregiver_room_category="Standard",
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )
        res = client.post("/api/v1/bookings/estimate", json=req)
        assert res.status_code == 200

        # Invalid category should fail validation
        req_invalid = _build_estimate_req(
            guest_category="Premium Garden",
            caregiver_room_category="InvalidCategory",
            caregiver_required=True,
            caregiver_stay_with_guest=False
        )
        res_invalid = client.post("/api/v1/bookings/estimate", json=req_invalid)
        assert res_invalid.status_code == 422  # Validation error
