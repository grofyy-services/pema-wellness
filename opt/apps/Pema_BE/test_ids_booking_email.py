#!/usr/bin/env python3
"""
Test script to verify the exact email sent after successful IDS booking
"""

import asyncio
import sys
import os
from datetime import date
sys.path.append('/Users/kundanforpema/Desktop/Pema_BE')

from app.core.config import settings
from app.services.email import EmailService


async def test_ids_booking_email():
    """Test the exact email that gets sent after successful IDS booking"""
    try:
        print("🔧 Initializing EmailService...")
        email_service = EmailService()

        print("📧 Sending IDS booking confirmation email to kundan@thedataduck.com...")

        # Simulate the exact same data that would be sent after a successful IDS booking
        # Using realistic test data that matches what would come from an actual booking
        guest_email = "kundan@thedataduck.com"  # Override to send to test email
        guest_name = "Kundan Kumar"  # Would normally be from booking data

        # Booking details that would come from IDS booking
        check_in_date = date(2025, 12, 1)  # Future date for testing
        check_out_date = date(2025, 12, 4)  # 3 nights stay
        room_name = "Executive Room"
        room_count = 1
        adults = 2
        caregiver = False  # No caregiver in this booking
        total_amount = 149680  # INR 1,496.80 in paise (3 nights at some rate)
        deposit_amount = 100000  # INR 1,000 in paise

        # Send the exact same email that would be sent after IDS booking
        success = await email_service.send_deposit_confirmation_email(
            guest_email=guest_email,
            guest_name=guest_name,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            room_name=room_name,
            room_count=room_count,
            adults=adults,
            caregiver=caregiver,
            total_amount=total_amount,
            deposit_amount=deposit_amount
        )

        if success:
            print(" IDS booking confirmation email sent successfully!")
            print("📬 Check kundan@thedataduck.com for the booking confirmation email")
            print("\n📋 Email Details:")
            print(f"   To: {guest_email}")
            print(f"   Subject: Your Pema Wellness deposit is received")
            print(f"   Guest Name: {guest_name}")
            print(f"   Check-in: {check_in_date.strftime('%B %d, %Y')}")
            print(f"   Check-out: {check_out_date.strftime('%B %d, %Y')}")
            print(f"   Room: {room_name}")
            print(f"   Guests: {adults}")
            print(f"   Total Amount: INR {total_amount // 100:,}")
            print(f"   Deposit: INR {deposit_amount // 100:,}")
            return True
        else:
            print(" Failed to send IDS booking confirmation email")
            return False

    except Exception as e:
        print(f" Error testing IDS booking email: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Testing IDS Booking Confirmation Email")
    print("=" * 60)

    result = asyncio.run(test_ids_booking_email())

    print("=" * 60)
    if result:
        print("🎉 IDS booking confirmation email test completed successfully!")
        print("📧 The email sent is identical to what guests receive after successful IDS bookings.")
    else:
        print("💥 IDS booking confirmation email test failed!")
        sys.exit(1)
