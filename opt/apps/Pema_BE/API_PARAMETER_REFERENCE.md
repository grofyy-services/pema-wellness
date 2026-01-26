# IDS Booking API - Parameter Reference Guide

## 🎯 Quick Reference

This document provides detailed parameter formats for the IDS booking API endpoints.

---

## 📋 GET Endpoint: `/api/v1/ids/bookings/create`

### Endpoint URL
```
https://dev.pemawellness.com/api/v1/ids/bookings/create
```

### HTTP Method
`GET` (also available as `POST` with JSON body)

---

## 📝 Parameters

### Required Parameters

| Parameter | Type | Format | Example | Description |
|-----------|------|--------|---------|-------------|
| `check_in_date` | Date | YYYY-MM-DD | `2025-11-01` | Check-in date (must be future) |
| `check_out_date` | Date | YYYY-MM-DD | `2025-11-04` | Check-out date (min 3 nights) |
| `adults` | Integer | 1-10 | `2` | Number of adult guests |
| `room_code` | String | - | `EXT` | IDS room type code |
| `rate_plan_code` | String | - | `RR0925` | IDS rate plan code |
| `total_amount` | Integer | INR | `149680` | Total amount in INR |
| `guest_first_name` | String | - | `John` | Guest first name |
| `guest_last_name` | String | - | `Doe` | Guest last name |
| `guest_email` | Email | - | `john@example.com` | Guest email address |

### Optional Parameters

| Parameter | Type | Default | Example | Description |
|-----------|------|---------|---------|-------------|
| `children` | Integer | `0` | `1` | Number of children (0-10) |
| `currency_code` | String | `INR` | `INR` | Currency code |
| `guest_phone` | String | `NA` | `+91-9999999999` | Guest phone number |
| `guest_country` | String | `India` | `India` | Guest country |
| `unique_id` | String | auto-generated | `BOOKING-123` | Unique booking identifier |
| `special_requests` | String | `null` | `Early check-in` | Special requests/comments |

---

##  Business Rules

### 🔴 Critical Rules
- **Minimum Stay:** 3 nights (enforced by IDS)
- **Future Dates:** Check-in date must be in the future
- **Date Logic:** Check-out date must be after check-in date

### 💰 Amount Format
- Amount is in **INR (Indian Rupees)**
- Example: `149680` = ₹1,496.80
- No decimal points (whole number only)

### 📧 Email Format
- Must be valid email format
- Example: `john.doe@example.com`

### 📱 Phone Format
- Recommended: `+91-9999999999`
- Acceptable: `NA` if not available
- Include country code for international numbers

---

## 📚 Example Requests

### Minimal Request (3 nights)
```bash
curl "https://dev.pemawellness.com/api/v1/ids/bookings/create?check_in_date=2025-11-01&check_out_date=2025-11-04&adults=2&room_code=EXT&rate_plan_code=RR0925&total_amount=149680&guest_first_name=John&guest_last_name=Doe&guest_email=john@example.com"
```

### Full Request (all parameters)
```bash
curl "https://dev.pemawellness.com/api/v1/ids/bookings/create?unique_id=BOOKING-123&check_in_date=2025-11-01&check_out_date=2025-11-04&adults=2&children=1&room_code=EXT&rate_plan_code=RR0925&total_amount=149680&currency_code=INR&guest_first_name=John&guest_last_name=Doe&guest_email=john@example.com&guest_phone=+91-9999999999&guest_country=India&special_requests=Early%20check-in%20requested"
```

### Browser URL (copy-paste)
```
https://dev.pemawellness.com/api/v1/ids/bookings/create?check_in_date=2025-11-01&check_out_date=2025-11-04&adults=2&room_code=EXT&rate_plan_code=RR0925&total_amount=149680&guest_first_name=Test&guest_last_name=Guest&guest_email=test@example.com
```

---

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "booking_reference": "85a07847-a4f5-4dee-9ee8-54b84bac1109",
  "status": "confirmed",
  "error": null,
  "message": "Booking created successfully in IDS"
}
```

### Error Response
```json
{
  "success": false,
  "booking_reference": "BOOKING-123",
  "status": null,
  "error": "Start date cannot be in the past",
  "message": null
}
```

---

## 🔄 Internal Flow

### What Happens Behind the Scenes

1. **API Receives:** GET request with URL parameters
2. **Validation:** Parameters validated (dates, amounts, email format)
3. **XML Generation:** Converts JSON to exact OTA XML format (MakeMyTrip compatible)
4. **Authentication:** Adds HTTP Basic Auth header
5. **Post to IDS:** Sends XML to `https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017`
6. **Response Processing:** Parses IDS XML response
7. **Return Result:** Converts back to JSON for client

```
GET Request → Validation → JSON → XML → IDS Server → XML Response → JSON Response
```

---

## 🏨 Room & Rate Plan Codes

### Available Room Codes
| Code | Description |
|------|-------------|
| `EXT` | Executive Room |
| `DLX` | Deluxe Room |
| `STD` | Standard Room |

### Available Rate Plan Codes
| Code | Description |
|------|-------------|
| `RR0925` | Regular Rate September 2025 |

> **Note:** Contact IDS support to get the complete list of room codes and rate plans for your property.

---

## 🐛 Troubleshooting

### Common Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Start date cannot be in the past" | Check-in date is not in future | Use future date |
| "Minimum stay: 3 nights" | Less than 3 nights stay | Increase nights to minimum 3 |
| "Invalid email format" | Email format incorrect | Use valid email format |
| "Room code not found" | Invalid room code | Use valid room code (e.g., EXT) |
| "Rate plan not found" | Invalid rate plan | Use valid rate plan (e.g., RR0925) |

### Validation Checklist
-  Check-in date is in the future
-  At least 3 nights between check-in and check-out
-  Adults count is 1-10
-  Children count is 0-10
-  Email is valid format
-  Total amount is positive integer
-  Room code and rate plan exist in IDS

---

## 📞 Support & Documentation

### Related Documents
- **Main Integration Guide:** `IDS_MAKE_MY_TRIP_INTEGRATION_GUIDE.md`
- **XML Format Details:** See main guide Section 5
- **Authentication:** See main guide Section 4

### API Documentation
- **Swagger UI:** `https://dev.pemawellness.com/swagger/`
- **Live Endpoint:** `https://dev.pemawellness.com/api/v1/ids/bookings/create`

### Contact
- **IDS Support:** Contact for room codes, rate plans, permissions
- **Technical Issues:** Check logs, verify credentials, test connectivity

---

## 🎯 Quick Test

### Test Booking (Safe - Future Dates)
```bash
curl "https://dev.pemawellness.com/api/v1/ids/bookings/create?check_in_date=2025-12-01&check_out_date=2025-12-04&adults=2&room_code=EXT&rate_plan_code=RR0925&total_amount=149680&guest_first_name=Test&guest_last_name=Booking&guest_email=test@example.com" | python3 -m json.tool
```

### Expected Result
```json
{
    "success": true,
    "booking_reference": "UUID-HERE",
    "status": "confirmed",
    "message": "Booking created successfully in IDS"
}
```

---

**Last Updated:** October 25, 2025  
**Version:** 1.0  
**Status:**  Production Ready

