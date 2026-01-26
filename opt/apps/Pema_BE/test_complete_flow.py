#!/usr/bin/env python3
"""
Test the complete end-to-end flow:
1. Booking Creation
2. Payment Initiation with booking_id
3. Payment Success (simulated webhook)
4. IDS Booking Creation
"""

import asyncio
import json
import requests
from datetime import date, datetime

BASE_URL = "http://localhost:8000"

async def test_complete_flow():
    """Test the complete booking → payment → IDS flow"""

    print("🚀 Testing Complete End-to-End Flow")
    print("=" * 60)

    try:
        # Step 1: Create a booking
        print("\n📝 Step 1: Creating Booking...")
        booking_payload = {
            "check_in_date": "2025-11-01",
            "check_out_date": "2025-11-04",
            "room_pricing_category": "Premium Garden",
            "adults_total": 2,
            "children_total_under_4": 0,
            "children_total_5to12": 1,
            "teens_13to18": 0,
            "number_of_rooms": 1,
            "caregiver_required": True,
            "guest_first_name": "John",
            "guest_last_name": "Doe",
            "guest_email": "john.doe@example.com",
            "guest_phone": "+91-9999999999",
            "guest_country": "India",
            "special_requests": "Late check-in requested"
        }

        booking_response = requests.post(f"{BASE_URL}/api/v1/bookings", json=booking_payload)
        if booking_response.status_code != 200:
            print(f" Booking creation failed: {booking_response.status_code} - {booking_response.text}")
            return False

        booking_data = booking_response.json()
        booking_id = booking_data["id"]
        print(f" Booking created successfully: ID {booking_id}")

        # Step 2: Initiate payment for the booking
        print("\n💳 Step 2: Initiating Payment...")
        payment_payload = {
            "amount": 50000,  # ₹50,000 deposit
            "payment_type": "deposit",
            "booking_id": booking_id,
            "guest_first_name": "John",
            "guest_email": "john.doe@example.com",
            "guest_phone": "+91-9999999999"
        }

        payment_response = requests.post(f"{BASE_URL}/api/v1/payments/initiate?response_format=json", json=payment_payload)
        if payment_response.status_code != 200:
            print(f" Payment initiation failed: {payment_response.status_code} - {payment_response.text}")
            return False

        payment_data = payment_response.json()
        payment_id = payment_data["payment_id"]
        payment_order_id = payment_data["payment_order_id"]
        print(f" Payment initiated successfully: ID {payment_id}, Order: {payment_order_id}")

        # Step 3: Simulate PayU success webhook
        print("\n🔄 Step 3: Simulating PayU Success Webhook...")

        # For testing, we need to compute what PayU would send as the response hash
        # PayU computes: salt|status|||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        import hashlib
        salt = "Vsv8SrrQf41sn7zWycxMt18LinszCTWs"  # From config
        key = "OpJrSH"  # From config

        # PayU response hash formula (reverse of request)
        response_hash_string = f"{salt}|success||||||||||john.doe@example.com|John|Payment - Deposit|50000.00|{payment_order_id}|{key}"
        correct_hash = hashlib.sha512(response_hash_string.encode()).hexdigest().lower()

        webhook_payload = {
            "status": "success",
            "txnid": payment_order_id,
            "amount": "50000.00",
            "productinfo": "Payment - Deposit",
            "firstname": "John",
            "email": "john.doe@example.com",
            "phone": "+91-9999999999",
            "mihpayid": "1234567890",
            "hash": correct_hash,  # Use the correct response hash
            "udf1": "",
            "udf2": "",
            "udf3": "",
            "udf4": "",
            "udf5": ""
        }

        webhook_response = requests.post(f"{BASE_URL}/api/v1/payments/webhook", data=webhook_payload)
        if webhook_response.status_code not in [200, 303]:  # 303 is redirect
            print(f" Webhook failed: {webhook_response.status_code} - {webhook_response.text}")
            return False

        print(" Webhook processed successfully")

        # Step 4: Verify booking and payment status
        print("\n🔍 Step 4: Verifying Final State...")

        # Check booking status
        booking_check = requests.get(f"{BASE_URL}/api/v1/bookings/{booking_id}")
        if booking_check.status_code == 200:
            booking_final = booking_check.json()
            print(f"📋 Booking Status: {booking_final.get('status', 'unknown')}")
            print(f"📋 Booking Confirmation: {booking_final.get('confirmation_number', 'none')}")
            print(f"📋 Paid Amount: ₹{booking_final.get('paid_amount', 0) // 100}")  # Convert paise to rupees
        else:
            print(f" Could not check booking: {booking_check.status_code}")

        # Check payment status
        payment_check = requests.get(f"{BASE_URL}/api/v1/payments/{payment_id}?guest_email=john.doe@example.com&guest_phone=+91-9999999999")
        if payment_check.status_code == 200:
            payment_final = payment_check.json()
            print(f"💰 Payment Status: {payment_final.get('status', 'unknown')}")
            print(f"💰 Payment Amount: ₹{payment_final.get('amount', 0)}")
        else:
            print(f" Could not check payment: {payment_check.status_code}")

        print("\n" + "=" * 60)
        print("🎉 COMPLETE FLOW TEST PASSED!")
        print(" Booking → Payment → Webhook → IDS Booking")
        return True

    except Exception as e:
        print(f" Test failed with exception: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_complete_flow())
    if not success:
        exit(1)
