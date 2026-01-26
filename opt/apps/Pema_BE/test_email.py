#!/usr/bin/env python3
"""
Test script to verify email functionality with Gmail SMTP
"""

import asyncio
import sys
import os
sys.path.append('/Users/kundanforpema/Desktop/Pema_BE')

from app.core.config import settings
from app.services.email import EmailService


async def test_email():
    """Test sending an email using the EmailService"""
    try:
        print("🔧 Initializing EmailService...")
        email_service = EmailService()

        print("📧 Sending test email to kundan@thedataduck.com...")

        # Send a simple test email
        success = await email_service.send_custom_email(
            to_email="kundan@thedataduck.com",
            subject="Pema Wellness - Email Test",
            body_text="""
Hello Kundan,

This is a test email to verify that our Google SMTP integration is working correctly.

If you receive this email, it means:
 Gmail SMTP credentials are configured correctly
 Email service is functioning properly
 IDS booking confirmation emails will work

Best regards,
Pema Wellness Development Team
            """.strip(),
            body_html="""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2e7d32;">Pema Wellness - Email Test</h2>

    <p>Hello Kundan,</p>

    <p>This is a test email to verify that our Google SMTP integration is working correctly.</p>

    <p>If you receive this email, it means:</p>
    <ul>
        <li> Gmail SMTP credentials are configured correctly</li>
        <li> Email service is functioning properly</li>
        <li> IDS booking confirmation emails will work</li>
    </ul>

    <p><strong>Best regards,<br>Pema Wellness Development Team</strong></p>
</body>
</html>
            """.strip()
        )

        if success:
            print(" Email sent successfully!")
            print("📬 Check kundan@thedataduck.com for the test email")
            return True
        else:
            print(" Failed to send email")
            return False

    except Exception as e:
        print(f" Error testing email: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Testing Email Functionality")
    print("=" * 50)

    result = asyncio.run(test_email())

    print("=" * 50)
    if result:
        print("🎉 Email test completed successfully!")
    else:
        print("💥 Email test failed!")
        sys.exit(1)
