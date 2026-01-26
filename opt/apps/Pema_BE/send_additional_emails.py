#!/usr/bin/env python3
"""
Send IDS booking confirmation emails to additional test recipients
"""

import asyncio
import sys
import os
from datetime import date
sys.path.append('/Users/kundanforpema/Desktop/Pema_BE')

from app.core.config import settings
from app.services.email import EmailService


async def send_emails_to_recipients():
    """Send IDS booking confirmation emails to multiple recipients"""
    try:
        print("🔧 Initializing EmailService...")
        email_service = EmailService()

        # Email recipients
        recipients = [
            ("hridikkaa@thedataduck.com", "Hridika"),
            ("kundan@thedataduck.com", "Kundan")
        ]

        # Booking details for testing
        check_in_date = date(2025, 12, 20)
        check_out_date = date(2025, 12, 23)
        room_name = "Premium Garden"
        room_count = 1
        adults = 2
        caregiver = True
        total_amount = 366000  # INR 3,660 in rupees
        deposit_amount = 50000   # INR 500 in rupees

        print(f"📧 Sending IDS booking confirmation emails to {len(recipients)} recipients...")
        print("=" * 60)

        success_count = 0

        for email, name in recipients:
            print(f"📧 Sending to {email} ({name})...")

            success = await email_service.send_deposit_confirmation_email(
                guest_email=email,
                guest_name=name,
                check_in_date=check_in_date,
                check_out_date=check_out_date,
                room_name=room_name,
                room_count=room_count,
                adults=adults,
                caregiver=caregiver,
                total_amount=total_amount,
                deposit_amount=deposit_amount,
                confirmation_number=None  # Not available in this context
            )

            if success:
                print(f"    Email sent successfully to {email}")
                success_count += 1
            else:
                print(f"    Failed to send email to {email}")

        print("=" * 60)
        print(f"📊 Results: {success_count}/{len(recipients)} emails sent successfully")

        return success_count == len(recipients)

    except Exception as e:
        print(f" Error sending emails: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Sending IDS Booking Confirmation Emails to Additional Recipients")
    print("=" * 70)

    result = asyncio.run(send_emails_to_recipients())

    print("=" * 70)
    if result:
        print("🎉 All emails sent successfully!")
        print("📧 Recipients should check their email for the booking confirmation.")
    else:
        print("💥 Some emails failed to send!")
        sys.exit(1)
