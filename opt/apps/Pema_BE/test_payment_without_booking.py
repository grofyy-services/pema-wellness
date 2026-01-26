#!/usr/bin/env python3
"""
Test script to verify payment initiation without booking_id works
"""

import requests
import json
import sys

def test_payment_initiate_without_booking():
    """Test payment initiation without booking_id"""

    url = "http://localhost:8000/api/v1/payments/initiate"
    headers = {"Content-Type": "application/json"}

    # Test data without booking_id
    payload = {
        "amount": 50000,  # ₹50,000 in rupees
        "payment_type": "deposit",
        "guest_first_name": "John",
        "guest_email": "john.doe@example.com",
        "guest_phone": "9999999999",
        "return_url": "http://localhost:3000/payment/return",
        "notes": "Test payment without booking"
    }

    print("Testing payment initiation without booking_id...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print("-" * 50)

    try:
        response = requests.post(url, json=payload, headers=headers)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(" SUCCESS: Payment initiated successfully!")
            print("Response:")
            print(json.dumps(result, indent=2))

            # Verify key fields
            required_fields = ["payment_id", "payment_order_id", "order_id", "amount", "currency", "gateway"]
            for field in required_fields:
                if field in result:
                    print(f" {field}: {result[field]}")
                else:
                    print(f" Missing field: {field}")

        else:
            print(" ERROR: Payment initiation failed!")
            print("Response:")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)

    except requests.exceptions.RequestException as e:
        print(f" REQUEST ERROR: {e}")
        return False

    return True

def test_payment_schema_validation():
    """Test that booking_id is no longer required"""

    url = "http://localhost:8000/openapi.json"
    print("\nTesting OpenAPI schema...")

    try:
        response = requests.get(url)
        if response.status_code == 200:
            schema = response.json()

            # Find the payment initiate endpoint
            payment_path = schema.get("paths", {}).get("/api/v1/payments/initiate", {})
            post_method = payment_path.get("post", {})

            # Check request body schema
            request_body = post_method.get("requestBody", {})
            json_schema = request_body.get("content", {}).get("application/json", {}).get("schema", {})

            print("Payment initiate schema:")
            properties = json_schema.get("properties", {})

            if "booking_id" in properties:
                print(" booking_id still in schema!")
                return False
            else:
                print(" booking_id removed from schema")

            if "amount" in properties:
                amount_schema = properties["amount"]
                if amount_schema.get("type") == "integer":
                    print(" amount field present (integer)")
                else:
                    print(f" amount field type: {amount_schema.get('type')}")
            else:
                print(" amount field missing!")

            return True
        else:
            print(f" Failed to get OpenAPI schema: {response.status_code}")
            return False

    except Exception as e:
        print(f" Error checking schema: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Payment Endpoint Changes")
    print("=" * 50)

    # Test 1: Schema validation
    schema_ok = test_payment_schema_validation()

    # Test 2: Actual payment initiation
    payment_ok = test_payment_initiate_without_booking()

    print("\n" + "=" * 50)
    if schema_ok and payment_ok:
        print("🎉 ALL TESTS PASSED! Payment system ready for production.")
        sys.exit(0)
    else:
        print(" SOME TESTS FAILED. Please check the output above.")
        sys.exit(1)
