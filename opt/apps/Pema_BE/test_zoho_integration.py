#!/usr/bin/env python3
"""
Test script to verify Zoho form integration works
"""
import asyncio
import httpx
from app.schemas.contact import ContactCreate, ContactReason

# Import the submit function
from app.api.v1.contact import submit_to_zoho_form

async def test_zoho_submission():
    """Test the Zoho form submission"""
    print("Testing Zoho form integration...")

    # Create a test contact
    contact = ContactCreate(
        name="John Doe Test",
        email="test@example.com",
        phone="+15551234567",  # Test phone number in E.164 format
        reason=ContactReason.guidance_in_choosing_program,
        message="This is a test message for Zoho integration"
    )

    print(f"Submitting contact: {contact.name}")
    print(f"Email: {contact.email}")
    print(f"Phone: {contact.phone}")
    print(f"Reason: {contact.reason.value}")
    print(f"Message: {contact.message}")

    try:
        await submit_to_zoho_form(contact)
        print("Submission completed successfully!")
        print("Check your Zoho form to see if the entry was created.")
    except Exception as e:
        print(f" Submission failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_zoho_submission())
