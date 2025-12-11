from fastapi.testclient import TestClient
from app.main import app
from app.models.rental import Rental
from app.schemas.rental import RentalCreate, RentalUpdate

client = TestClient(app)

def test_create_rental():
    rental_data = {
        "user_id": 1,
        "vehicle_id": 1,
        "start_time": "2023-10-01T10:00:00",
        "end_time": "2023-10-01T12:00:00"
    }
    response = client.post("/rentals/", json=rental_data)
    assert response.status_code == 201
    assert response.json()["user_id"] == rental_data["user_id"]
    assert response.json()["vehicle_id"] == rental_data["vehicle_id"]

def test_get_rental():
    response = client.get("/rentals/1")
    assert response.status_code == 200
    assert "user_id" in response.json()
    assert "vehicle_id" in response.json()

def test_update_rental():
    rental_update_data = {
        "end_time": "2023-10-01T13:00:00"
    }
    response = client.put("/rentals/1", json=rental_update_data)
    assert response.status_code == 200
    assert response.json()["end_time"] == rental_update_data["end_time"]

def test_delete_rental():
    response = client.delete("/rentals/1")
    assert response.status_code == 204
    response = client.get("/rentals/1")
    assert response.status_code == 404