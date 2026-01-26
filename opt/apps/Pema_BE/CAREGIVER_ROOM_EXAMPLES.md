# Caregiver Room Category Examples

## Overview

The `/api/v1/bookings/estimate` endpoint now supports specifying different room categories for guests and caregivers when using separate caregiver rooms.

## Parameters

- `room_pricing_category`: Room category for the main guest booking
- `caregiver_room_pricing_category`: **NEW** - Room category for caregiver separate room (optional)

When `caregiver_room_pricing_category` is not provided, the system uses the guest room category for caregiver pricing.

## Caregiver Room Pricing

| Room Category | Caregiver Separate Room Rate |
|---------------|------------------------------|
| Standard | ₹20,000/night |
| Premium Balcony | ₹25,000/night |
| Premium Garden | ₹28,000/night |
| Executive, Executive Junior Suite, Executive Suite, Elemental Villa, Pema Suite | **Complimentary (₹0)** |

## Example Requests

### 1. Same Room Category for Guest and Caregiver (Default Behavior)

```json
{
  "room_pricing_category": "Premium Garden",
  "check_in_date": "2025-12-01",
  "check_out_date": "2025-12-05",
  "adults_total": 2,
  "children_total_under_4": 1,
  "children_total_5to12": 0,
  "teens_13to18": 0,
  "caregiver_required": true,
  "caregiver_stay_with_guest": false,
  "caregiver_meal": "simple"
}
```

**Result:** Caregiver gets Premium Garden room at ₹28,000/night (4 nights = ₹1,12,000)

### 2. Different Room Categories: Premium Garden for Guest, Standard for Caregiver

```json
{
  "room_pricing_category": "Premium Garden",
  "caregiver_room_pricing_category": "Standard",
  "check_in_date": "2025-12-01",
  "check_out_date": "2025-12-05",
  "adults_total": 2,
  "children_total_under_4": 1,
  "children_total_5to12": 0,
  "teens_13to18": 0,
  "caregiver_required": true,
  "caregiver_stay_with_guest": false,
  "caregiver_meal": "simple"
}
```

**Result:** Guest gets Premium Garden room, Caregiver gets Standard room at ₹20,000/night (4 nights = ₹80,000)

### 3. Executive Guest Room with Complimentary Caregiver Room

```json
{
  "room_pricing_category": "Executive",
  "caregiver_room_pricing_category": "Executive Suite",
  "check_in_date": "2025-12-01",
  "check_out_date": "2025-12-05",
  "adults_total": 2,
  "children_total_under_4": 0,
  "children_total_5to12": 1,
  "teens_13to18": 0,
  "caregiver_required": true,
  "caregiver_stay_with_guest": false,
  "caregiver_meal": "restaurant_dining"
}
```

**Result:** Both guest and caregiver rooms are complimentary (₹0 each)

### 4. Caregiver Sharing Room (No Separate Category Needed)

```json
{
  "room_pricing_category": "Standard",
  "check_in_date": "2025-12-01",
  "check_out_date": "2025-12-05",
  "adults_total": 2,
  "children_total_under_4": 1,
  "children_total_5to12": 0,
  "teens_13to18": 0,
  "caregiver_required": true,
  "caregiver_stay_with_guest": true,
  "caregiver_meal": "restaurant_dining"
}
```

**Result:** Caregiver shares guest room, `caregiver_room_pricing_category` is ignored

## Use Cases

1. **Cost Optimization:** Put guests in premium rooms while giving caregivers more economical options
2. **Availability Management:** Choose different room categories based on availability
3. **Guest Preferences:** Assign specific room types to caregivers based on requirements
4. **Package Deals:** Create custom combinations for different guest types

## Response Structure

The response includes detailed pricing breakdown showing both guest and caregiver room costs:

```json
{
  "price_breakdown": {
    "lines": [
      {
        "description": "Premium Garden - Double Occupancy",
        "amount": 229000.0,
        "nights": 4,
        "quantity": 1
      },
      {
        "description": "Caregiver separate room (Standard)",
        "amount": 80000.0,
        "nights": 4,
        "quantity": 1
      }
    ],
    "total": 309000.0
  }
}
```

## Notes

- The `caregiver_room_pricing_category` parameter only affects pricing when `caregiver_stay_with_guest: false`
- If `caregiver_room_pricing_category` is not provided, the guest room category is used
- Complimentary categories (Executive, Suites, Villas) always result in ₹0 caregiver room costs
- Caregiver meals are separate from room pricing and follow the same rules regardless of room category
