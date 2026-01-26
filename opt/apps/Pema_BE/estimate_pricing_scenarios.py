import asyncio
import httpx
from tabulate import tabulate
from datetime import date, timedelta

# --- Configuration ---
BASE_URL = "http://127.0.0.1:8000"
ESTIMATE_ENDPOINT = f"{BASE_URL}/api/v1/bookings/estimate"

ROOM_CATEGORIES = [
    "Standard",
    "Premium Balcony",
    "Premium Garden",
    "Executive",
    "Executive Junior Suite",
    "Executive Suite",
    "Elemental Villa",
    "Pema Suite",
]

SCENARIOS = [
    {"desc": "1 Adult", "adults": 1, "children": 0},
    {"desc": "1 Adult, 1 Child", "adults": 1, "children": 1, "child_ages": [8]},
    {"desc": "3 Adults", "adults": 3, "children": 0},
    {"desc": "4 Adults", "adults": 4, "children": 0},
    {"desc": "3 Adults, 1 Child", "adults": 3, "children": 1, "child_ages": [8]},
    {"desc": "4 Adults, 1 Child", "adults": 4, "children": 1, "child_ages": [8]},
]

DURATIONS = [3, 10] # 3 for wellness, 10 for clinical

# --- Helper Functions ---
def build_request_body(category, scenario, nights):
    """Builds the JSON payload for the estimate endpoint."""
    check_in_date = date.today() + timedelta(days=30)
    check_out_date = check_in_date + timedelta(days=nights)
    
    body = {
        "room_pricing_category": category,
        "check_in_date": check_in_date.isoformat(),
        "check_out_date": check_out_date.isoformat(),
        "adults_total": scenario["adults"],
        "children_total_5to12": scenario["children"],
        "program_id": None,
        # Add caregiver if children are present to satisfy validation
        "caregiver_required": scenario["children"] > 0,
        "caregiver_stay_with_guest": scenario["children"] > 0, # Assume they share a room
    }
    return body

async def get_estimate(client, category, scenario, nights):
    """Calls the estimate endpoint and returns the total price."""
    body = build_request_body(category, scenario, nights)
    try:
        response = await client.post(ESTIMATE_ENDPOINT, json=body, timeout=20.0)
        if response.status_code == 200:
            data = response.json()
            total_price = data.get("price_breakdown", {}).get("total", 0.0)
            return f"₹{total_price:,.2f}"
        else:
            error_detail = response.json().get("detail", response.text)
            return f"Error: {response.status_code} - {error_detail}"
    except httpx.ConnectError as e:
        return f"Connection Error: Is the server running on {BASE_URL}?"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

# --- Main Execution ---
async def main():
    """Runs all scenarios and prints the results table."""
    headers = [
        "Room Category",
        "Scenario",
        "Duration (Nights)",
        "Estimated Price (INR)",
    ]
    table_data = []

    async with httpx.AsyncClient() as client:
        for category in ROOM_CATEGORIES:
            for scenario in SCENARIOS:
                for duration in DURATIONS:
                    print(f"Estimating: {category}, {scenario['desc']}, {duration} nights...")
                    price = await get_estimate(client, category, scenario, duration)
                    table_data.append([
                        category,
                        scenario["desc"],
                        duration,
                        price
                    ])
            table_data.append(["---"] * len(headers)) # Add a separator line

    print("\n\n--- Pricing Estimation Report ---")
    print(tabulate(table_data, headers=headers, tablefmt="grid"))
    print("--- End of Report ---")


if __name__ == "__main__":
    asyncio.run(main())
