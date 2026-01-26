"""
Public API tests (no authentication required)
"""

import pytest
from fastapi.testclient import TestClient


class TestPublicAPI:
    """Test public API endpoints"""
    
    def test_list_published_programs(self, client: TestClient):
        """Test listing published programs"""
        response = client.get("/api/v1/programs")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_programs_with_filters(self, client: TestClient):
        """Test listing programs with filters"""
        params = {
            "program_type": "wellness",
            "page": 1,
            "limit": 10
        }
        
        response = client.get("/api/v1/programs", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned programs should match filter criteria when present
        for program in data:
            assert program.get("program_type") == "wellness"
    
    def test_search_programs(self, client: TestClient):
        """Test program search functionality"""
        params = {
            "search": "wellness",
            "limit": 5
        }
        
        response = client.get("/api/v1/programs", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_program_by_id_not_found(self, client: TestClient):
        """Test getting program details by id (non-existent)"""
        response = client.get("/api/v1/programs/999999")
        assert response.status_code == 404
    
    def test_get_program_nonexistent(self, client: TestClient):
        """Test getting program with non-existent id"""
        response = client.get("/api/v1/programs/999999")
        assert response.status_code == 404
    
    def test_list_available_rooms(self, client: TestClient, test_room):
        """Test listing available rooms"""
        response = client.get("/api/v1/rooms")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Check if our test room is included
        room_ids = [r["id"] for r in data]
        assert test_room.id in room_ids
        
        # Verify room structure
        room = next(r for r in data if r["id"] == test_room.id)
        assert room["name"] == test_room.name
        # Category is coerced to brochure enum; ensure value is one of allowed labels
        assert room["category"] in [
            "Standard", "Premium Balcony", "Premium Garden", "Executive",
            "Executive Junior Suite", "Executive Suite", "Elemental Villa", "Pema Suite"
        ]
        assert room["occupancy_max_adults"] == test_room.occupancy_max_adults
    
    def test_list_rooms_with_filters(self, client: TestClient, test_room):
        """Test listing rooms with filters"""
        params = {
            "category": "deluxe",
            "min_adults": 2,
            "page": 1,
            "limit": 10
        }
        
        response = client.get("/api/v1/rooms", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned rooms should match filter criteria (occupancy)
        for room in data:
            assert room["occupancy_max_adults"] >= 2
    
    def test_get_room_details(self, client: TestClient, test_room):
        """Test getting room details"""
        response = client.get(f"/api/v1/rooms/{test_room.id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == test_room.id
        assert data["name"] == test_room.name
        assert data["category"] in [
            "Standard", "Premium Balcony", "Premium Garden", "Executive",
            "Executive Junior Suite", "Executive Suite", "Elemental Villa", "Pema Suite"
        ]
        assert data["description"] == test_room.description
        # Endpoints return rupees; model also stores rupees now
        assert data["price_per_night_single"] == test_room.price_per_night_single
        assert data["price_per_night_double"] == test_room.price_per_night_double
    
    def test_get_room_nonexistent(self, client: TestClient):
        """Test getting non-existent room"""
        response = client.get("/api/v1/rooms/999999")
        assert response.status_code == 404
        
        # Body structure may vary; only assert status code
    
    def test_get_program_types(self, client: TestClient):
        """Test getting available program types"""
        response = client.get("/api/v1/program-types")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3
        
        # Check expected program types
        types = [item["value"] for item in data]
        assert "medical" in types
        assert "wellness" in types
        assert "lite" in types
        
        # Verify structure
        for item in data:
            assert "value" in item
            assert "label" in item
    
    def test_get_room_categories(self, client: TestClient):
        """Test getting available room categories"""
        response = client.get("/api/v1/room-categories")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        
        # Check expected categories
        categories = [item["value"] for item in data]
        assert "suite" in categories
        assert "premium" in categories
        assert "deluxe" in categories
        assert "standard" in categories
        
        # Verify structure
        for item in data:
            assert "value" in item
            assert "label" in item
    
    def test_pagination_programs(self, client: TestClient):
        """Test pagination for programs"""
        params = {
            "page": 1,
            "limit": 1
        }
        
        response = client.get("/api/v1/programs", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 1
    
    def test_pagination_rooms(self, client: TestClient):
        """Test pagination for rooms"""
        params = {
            "page": 1,
            "limit": 1
        }
        
        response = client.get("/api/v1/rooms", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 1
