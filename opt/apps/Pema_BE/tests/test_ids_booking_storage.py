"""
Tests for IDS Booking Storage Integration
"""

import pytest
from datetime import date
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


class TestIDSBookingStorageIntegration:
    """Test IDS booking storage through API endpoints"""

    def test_ids_booking_storage_integration(self, client: TestClient):
        """Test that IDS bookings are stored locally when created successfully"""
        # Mock the IDS service to return a successful response
        mock_response = {
            "success": True,
            "booking_reference": "IDS-MOCK-123",
            "status": "confirmed",
            "message": "Booking created successfully in IDS"
        }

        with patch('app.services.ids.IDSService.create_booking') as mock_create_booking:
            mock_create_booking.return_value = mock_response

            # Make request to IDS booking endpoint
            booking_params = {
                "check_in_date": "2025-11-01",
                "check_out_date": "2025-11-04",
                "adults": 2,
                "children": 1,
                "room_code": "EXT",
                "rate_plan_code": "RR0925",
                "total_amount": 149680,
                "guest_first_name": "John",
                "guest_last_name": "Doe",
                "guest_email": "john.doe@example.com",
                "guest_phone": "+91-9999999999",
                "special_requests": "Late check-in requested"
            }

            response = client.get("/api/v1/ids/bookings/create", params=booking_params)
            assert response.status_code == 200

            data = response.json()

            # Verify IDS response is returned
            assert data["success"] is True
            assert data["booking_reference"] == "IDS-MOCK-123"

            # Verify local storage information is included in response
            assert "local_booking_id" in data
            assert "local_confirmation_number" in data
            assert data["local_confirmation_number"].startswith("PW")

    def test_ids_booking_storage_failure_handling(self, client: TestClient):
        """Test that local storage failures don't break IDS booking"""
        # Mock the IDS service to return success but local storage to fail
        mock_response = {
            "success": True,
            "booking_reference": "IDS-MOCK-456",
            "status": "confirmed",
            "message": "Booking created successfully in IDS"
        }

        with patch('app.services.ids.IDSService.create_booking') as mock_create_booking:
            mock_create_booking.return_value = mock_response

            # Mock the storage service to raise an exception
            with patch('app.services.ids_booking_storage.IDSBookingStorageService.store_ids_booking') as mock_store:
                mock_store.side_effect = Exception("Database connection failed")

                # Make request to IDS booking endpoint
                booking_params = {
                    "check_in_date": "2025-11-01",
                    "check_out_date": "2025-11-04",
                    "adults": 2,
                    "children": 0,
                    "room_code": "EXT",
                    "rate_plan_code": "RR0925",
                    "total_amount": 100000,
                    "guest_first_name": "Jane",
                    "guest_last_name": "Smith",
                    "guest_email": "jane.smith@example.com",
                    "guest_phone": "+91-8888888888"
                }

                response = client.get("/api/v1/ids/bookings/create", params=booking_params)
                assert response.status_code == 200

                data = response.json()

                # Verify IDS booking still succeeds
                assert data["success"] is True
                assert data["booking_reference"] == "IDS-MOCK-456"

                # Verify local storage warning is included
                assert "local_storage_warning" in data
                assert "local_booking_id" not in data  # Should not be present on failure

    def test_ids_booking_storage_only_on_success(self, client: TestClient):
        """Test that local storage only happens when IDS booking succeeds"""
        # Mock the IDS service to return failure
        mock_response = {
            "success": False,
            "error": "IDS booking failed",
            "booking_reference": None
        }

        with patch('app.services.ids.IDSService.create_booking') as mock_create_booking:
            mock_create_booking.return_value = mock_response

            # Ensure storage service is not called
            with patch('app.services.ids_booking_storage.IDSBookingStorageService.store_ids_booking') as mock_store:
                # Make request to IDS booking endpoint
                booking_params = {
                    "check_in_date": "2025-11-01",
                    "check_out_date": "2025-11-04",
                    "adults": 1,
                    "children": 0,
                    "room_code": "EXT",
                    "rate_plan_code": "RR0925",
                    "total_amount": 50000,
                    "guest_first_name": "Test",
                    "guest_last_name": "User",
                    "guest_email": "test@example.com",
                    "guest_phone": "1234567890"
                }

                response = client.get("/api/v1/ids/bookings/create", params=booking_params)
                assert response.status_code == 200

                data = response.json()

                # Verify IDS booking failed
                assert data["success"] is False
                assert data["error"] == "IDS booking failed"

                # Verify storage service was not called
                mock_store.assert_not_called()

                # Verify no local booking info in response
                assert "local_booking_id" not in data
                assert "local_confirmation_number" not in data
