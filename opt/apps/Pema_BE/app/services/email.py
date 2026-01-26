"""
Email Service for sending emails using Google SMTP

Muhammad once tried to email a cloud, but it just evaporated!
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
import logging
from datetime import date

from app.core.config import settings
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via Google SMTP"""

    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.username = settings.GMAIL_USERNAME
        self.password = settings.GMAIL_APP_PASSWORD

    async def send_deposit_confirmation_email(
        self,
        guest_email: str,
        guest_name: str,
        check_in_date: date,
        check_out_date: date,
        room_name: str,
        room_count: int,
        adults: int,
        caregiver: bool,
        total_amount: float,
        deposit_amount: float = 0.0,
        confirmation_number: Optional[str] = None
    ) -> bool:
        """
        Send deposit confirmation email to guest after successful IDS booking

        Args:
            guest_email: Guest's email address
            guest_name: Guest's full name
            check_in_date: Check-in date
            check_out_date: Check-out date
            room_name: Room type name
            room_count: Number of rooms
            adults: Number of adults
            caregiver: Whether caregiver is required
            total_amount: Total booking amount in rupees
            deposit_amount: Deposit amount in rupees
            confirmation_number: Booking confirmation number

        Returns:
            bool: True if email sent successfully
        """
        try:
            # Amounts are already in rupees
            logger.warning(f"Email service received: total_amount={total_amount}, deposit_amount={deposit_amount}")
            total_rupees = total_amount
            deposit_rupees = deposit_amount
            half_package = total_rupees / 2
            balance_at_confirmation = half_package - deposit_rupees
            balance_due_before_checkin = total_rupees - half_package

            # Format amounts with Indian numbering
            def format_currency(amount: int) -> str:
                return f"{amount:,}"

            subject = "Your Pema Wellness deposit has been received"

            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.username
            msg['To'] = guest_email
            msg['CC'] = 'enquiry@pemawellness.com'

            # Email body
            html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Pema Wellness deposit has been received</title>
    <!-- Importing fonts for better fidelity, though email clients might fall back to Georgia/serif -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        /* Assuming IvyOra Display is a custom font, falling back to Georgia/serif as requested by the original style */
        .ivyora-font {{ font-family: "IvyOra Display", Georgia, serif; }}
        .crimson-font {{ font-family: "Crimson Text", Georgia, serif; }}
        .text-dark {{ color: #333333; }} /* rgb(51, 51, 51) */
        .text-accent {{ color: #4A778C; }} /* rgb(74, 119, 140) */
        .text-muted {{ color: #848484; }} /* rgb(132, 132, 132) */
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
<!-- Main Container Table (Full width background) -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff;">
    <tr>
        <td align="center" style="padding: 20px 0;">
            <!-- Content Wrapper Table (Max width 600px) -->
            <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-collapse: collapse;">

                <!-- Spacer/Logo Area (Optional - keeping it clean like the source) -->
                <tr>
                    <td height="40" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>

                <!-- Greeting -->
                <tr>
                    <td style="padding: 0 40px; text-align: left;">
                        <p class="ivyora-font" style="font-family: 'IvyOra Display', Georgia, serif; font-size: 16px; color: #333333; line-height: 25px; margin: 0 0 15px 0;">
                            Dear {guest_name},
                        </p>
                    </td>
                </tr>

                <!-- Main Confirmation Text -->
                <tr>
                    <td style="padding: 0 40px; text-align: left;">
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 25px 0;">
                            Thank you for your deposit. We are pleased to confirm that we have received INR {format_currency(deposit_rupees)} towards your upcoming stay at Pema Wellness.
                        </p>
                    </td>
                </tr>

                <!-- Booking Summary Section Title -->
                <tr>
                    <td align="center" style="padding: 0 40px 15px 40px;">
                        <p class="ivyora-font text-dark" style="text-align: center; font-family: 'IvyOra Display', Georgia, serif; font-size: 18px; color: #333333; line-height: 25px; margin: 0;">
                            Booking summary
                        </p>
                    </td>
                </tr>

                <!-- Booking Summary Table -->
                <tr>
                    <td align="center" style="padding: 0 40px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin-bottom: 25px;">
                            <tbody>
                                <!-- Detail Rows -->
                                <tr><td style="padding: 4px 0;">Confirmation Number:</td><td align="right" style="padding: 4px 0;"><strong>{confirmation_number or "[ids_reference_number]"}</strong></td></tr>
                                <tr><td style="padding: 4px 0;">Check-in:</td><td align="right" style="padding: 4px 0;">{check_in_date.strftime('%B %d, %Y')}</td></tr>
                                <tr><td style="padding: 4px 0;">Check-out:</td><td align="right" style="padding: 4px 0;">{check_out_date.strftime('%B %d, %Y')}</td></tr>
                                <tr><td style="padding: 4px 0;">Room type:</td><td align="right" style="padding: 4px 0;">{room_name}</td></tr>

                                <!-- Separator for Financials -->
                                <tr><td colspan="2" height="15" style="border-top: 1px solid #eeeeee; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

                                <tr><td style="padding: 4px 0;">Your total wellness investment:</td><td align="right" style="padding: 4px 0;">INR {format_currency(total_rupees)}</td></tr>
                                <tr><td style="padding: 4px 0;">Deposit received:</td><td align="right" style="padding: 4px 0;">INR {format_currency(deposit_rupees)}</td></tr>
                                <tr><td style="padding: 4px 0;">Balance at confirmation (50% minus deposit):</td><td align="right" style="padding: 4px 0;">INR {format_currency(balance_at_confirmation)}</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Balance due before check-in:</strong></td><td align="right" style="padding: 4px 0;"><strong>INR {format_currency(balance_due_before_checkin)}</strong></td></tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <!-- Please Note -->
                <tr>
                    <td style="padding: 0 40px 25px 40px; text-align: center;">
                        <p class="crimson-font text-muted" style="font-family: 'Crimson Text', Georgia, serif; font-size: 14px; color: #848484; line-height: 18px; margin: 0;">
                            Please note: To keep your experience safe and well-supported, we confirm bookings only after our medical team approves your stay and we receive at least 50% of your total payment.
                        </p>
                    </td>
                </tr>

                <!-- Next Steps Section Title (Accent Color) -->
                <tr>
                    <td align="center" style="padding: 0 40px 15px 40px;">
                        <p class="ivyora-font text-accent" style="text-align: center; font-family: 'IvyOra Display', Georgia, serif; font-size: 20px; color: #4A778C; line-height: 25px; margin: 0;">
                            Next steps
                        </p>
                    </td>
                </tr>

                <!-- Next Steps Content -->
                <tr>
                    <td style="padding: 0 40px 25px 40px; text-align: left;">
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 15px 0;">
                            1. You'll receive your medical form shortly. When you fill it in, our doctors will review it and begin shaping your retreat with intention.
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 15px 0;">
                            2. After your form is approved, we'll share the payment link for the remaining 50 percent, with your deposit already adjusted.
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 15px 0;">
                            3. Once this payment is complete, your stay will be confirmed. Our team will reach out to you with next steps.
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 15px 0;">
                            4. The last leg of the payment can be taken care of before check-in.
                        </p>
                    </td>
                </tr>

                <!-- Assistance/Closing Text -->
                <tr>
                    <td style="padding: 0 40px 25px 40px; text-align: left;">
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 15px 0;">
                            If you need any assistance with travel, room arrangements, caregiver planning, or to know more about our family program, our team will be happy to help.
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #333333; line-height: 22px; margin: 0 0 30px 0;">
                            We look forward to welcoming you into the Healing Hills of Pema Wellness.
                        </p>
                    </td>
                </tr>

                <!-- Signature -->
                <tr>
                    <td style="padding: 0 40px 60px 40px; text-align: left;">
                        <p class="ivyora-font" style="font-family: 'IvyOra Display', Georgia, serif; font-size: 16px; color: #333333; line-height: 25px; margin: 0;">
                            Warm regards,<br>
                            Pema Wellness Reservations Team
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #4A778C; line-height: 25px; margin: 10px 0 5px 0;">
                            +91 95777 09494
                        </p>
                        <p class="crimson-font" style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #4A778C; line-height: 25px; margin: 0;">
                            <a href="http://www.pemawellness.com" target="_blank" style="color: #4A778C; text-decoration: none;">pemawellness.com</a>
                        </p>
                    </td>
                </tr>

                <!-- Bottom Spacer -->
                <tr>
                    <td height="40" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>

            </table>
            <!-- End Content Wrapper Table -->
        </td>
    </tr>
</table>
<!-- End Main Container Table -->

</body>
</html>
"""

            # Create plain text version as fallback
            text_body = f"""Your Pema Wellness deposit has been received

Dear {guest_name},

Thank you for your deposit. We are pleased to confirm that we have received INR {format_currency(deposit_rupees)} towards your upcoming stay at Pema Wellness.

Here are the details as per your booking:

Booking summary

Confirmation Number: {confirmation_number or "[ids_reference_number]"}
Check-in: {check_in_date.strftime('%B %d, %Y')}
Check-out: {check_out_date.strftime('%B %d, %Y')}
Room type: {room_name}
Number of rooms: {room_count}
Guests: {adults}
Caregiver: {"Yes" if caregiver else "No"}
Your total wellness investment: INR {format_currency(total_rupees)}
Deposit received: INR {format_currency(deposit_rupees)}
Balance at confirmation: INR {format_currency(balance_at_confirmation)}
Balance due before check-in: INR {format_currency(balance_due_before_checkin)}

Please note: To keep your experience safe and well-supported, we confirm bookings only after our medical team approves your stay and we receive at least 50% of your total payment.

Next steps

1. You'll receive your medical form shortly. When you fill it in, our doctors will review it and begin shaping your retreat with intention.

2. After your form is approved, we'll share the payment link for the remaining 50 percent, with your deposit already adjusted.

3. Once this payment is complete, your stay will be confirmed. Our team will reach out to you with next steps.

4. The last leg of the payment can be taken care of before check-in.

If you need any assistance with travel, room arrangements, caregiver planning, or to know more about our family program, our team will be happy to help.

We look forward to welcoming you into the Healing Hills of Pema Wellness.

Warm regards,

Pema Wellness Reservations Team
+91 95777 09494
pemawellness.com
"""

            # Attach parts
            part1 = MIMEText(text_body, 'plain')
            part2 = MIMEText(html_body, 'html')
            msg.attach(part1)
            msg.attach(part2)

            # Send email
            await self._send_email(msg)
            logger.info(f"Deposit confirmation email sent successfully to {guest_email} (CC: enquiry@pemawellness.com)")
            return True

        except Exception as e:
            logger.error(f"Failed to send deposit confirmation email to {guest_email} (CC: enquiry@pemawellness.com): {e}")
            return False

    async def send_custom_email(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None
    ) -> bool:
        """
        Send a custom email

        Args:
            to_email: Recipient email
            subject: Email subject
            body_text: Plain text body
            body_html: Optional HTML body

        Returns:
            bool: True if email sent successfully
        """
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.username
            msg['To'] = to_email

            # Attach parts
            part1 = MIMEText(body_text, 'plain')
            msg.attach(part1)

            if body_html:
                part2 = MIMEText(body_html, 'html')
                msg.attach(part2)

            await self._send_email(msg)
            logger.info(f"Custom email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send custom email to {to_email}: {e}")
            return False

    async def _send_email(self, msg: MIMEMultipart) -> None:
        """Internal method to send email via SMTP"""
        if not self.username or not self.password:
            raise ValueError("Gmail credentials not configured. Set GMAIL_USERNAME and GMAIL_APP_PASSWORD in .env file.")

        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)

            # Build recipient list including CC
            recipients = [msg['To']]
            if msg.get('CC'):
                recipients.append(msg['CC'])

            server.send_message(msg, to_addrs=recipients)
            server.quit()
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            raise
