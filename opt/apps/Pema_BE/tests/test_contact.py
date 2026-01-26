
import pytest
from httpx import Response
from pytest_httpx import HTTPXMock

from app.main import app
from app.schemas.contact import ContactReason

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio


async def test_create_contact_and_submit_to_zoho(async_client, httpx_mock: HTTPXMock):
    """
    Tests that the contact form creates a contact and submits data to Zoho form correctly.
    """
    # Mock the Zoho form submission endpoint
    zoho_url = "https://forms.zohopublic.in/pemawellness5391/form/Contact/formperma/Sn1r6UqncqbVHHgFAUQtdHGs0X6m1HIbzmvYFfOuOnk/htmlRecords/submit"
    httpx_mock.add_response(
        url=zoho_url,
        method="POST",
        status_code=200,
        text="Record Added Successfully"
    )

    contact_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+15551234567",
        "reason": ContactReason.guidance_in_choosing_program.value,
        "message": "This is a test message."
    }

    # Make the API call to our contact form endpoint
    response = await async_client.post("/api/v1/contact", json=contact_data)

    # Assert our API call was successful
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["email"] == contact_data["email"]
    assert response_json["name"] == contact_data["name"]

    # Assert that the request to Zoho was made correctly
    requests = httpx_mock.get_requests(url=zoho_url, method="POST")
    assert len(requests) == 1
    
    # Check the payload sent to Zoho
    request_payload = requests[0].content
    
    # httpx encodes form data, so we need to parse it
    from urllib.parse import parse_qsl
    sent_data = dict(parse_qsl(request_payload.decode()))

    # Check that the key fields are present and correct
    assert sent_data["Name_First"] == "John"
    assert sent_data["Name_Last"] == "Doe"
    assert sent_data["Email"] == "john.doe@example.com"
    assert sent_data["Dropdown"] == "Other"
    assert sent_data["allow-others-text"] == ContactReason.guidance_in_choosing_program.value
    assert sent_data["MultiLine"] == "This is a test message."
    # Hidden fields may or may not be included when empty

async def test_create_contact_with_single_name(async_client, httpx_mock: HTTPXMock):
    """
    Tests Zoho submission when only a single name is provided.
    """
    zoho_url = "https://forms.zohopublic.in/pemawellness5391/form/Contact/formperma/Sn1r6UqncqbVHHgFAUQtdHGs0X6m1HIbzmvYFfOuOnk/htmlRecords/submit"
    httpx_mock.add_response(url=zoho_url, method="POST", status_code=200)

    contact_data = {
        "name": "Jane",
        "email": "jane@example.com",
        "phone": "+15557654321",
        "reason": ContactReason.availability_and_pricing_details.value,
        "message": "Single name test."
    }

    response = await async_client.post("/api/v1/contact", json=contact_data)
    assert response.status_code == 200

    requests = httpx_mock.get_requests(url=zoho_url, method="POST")
    assert len(requests) == 1
    
    from urllib.parse import parse_qsl
    sent_data = dict(parse_qsl(requests[0].content.decode()))

    assert sent_data["Name_First"] == "Jane"
    # Name_Last is not included when empty (single name case)
    assert "Name_Last" not in sent_data or sent_data.get("Name_Last") == ""
    assert sent_data["Email"] == "jane@example.com"
    assert sent_data["Dropdown"] == "Other"
    assert sent_data["allow-others-text"] == ContactReason.availability_and_pricing_details.value
    assert sent_data["MultiLine"] == "Single name test."
