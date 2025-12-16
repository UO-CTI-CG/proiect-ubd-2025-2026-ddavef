import pytest

from app.api.dependencies import get_current_user
from app.main import app


@pytest.fixture(autouse=True)
def override_user_dependency(test_user):
    app.dependency_overrides[get_current_user] = lambda: test_user
    yield
    app.dependency_overrides.pop(get_current_user, None)


def test_list_vehicles(client, test_vehicle):
    response = client.get("/vehicles/")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["name"] == test_vehicle.name


def test_create_vehicle(client):
    payload = {
        "name": "Scooter",
        "vehicle_type": "scooter",
        "description": "Electric scooter",
        "available": True,
        "price_per_hour": 7.5,
    }
    response = client.post("/vehicles/", json=payload)
    assert response.status_code == 201
    assert response.json()["vehicle_type"] == "scooter"


def test_update_vehicle(client, test_vehicle):
    response = client.put(
        f"/vehicles/{test_vehicle.id}",
        json={"available": False, "price_per_hour": 6.0},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["available"] is False
    assert body["price_per_hour"] == 6.0


def test_delete_vehicle(client, test_vehicle):
    response = client.delete(f"/vehicles/{test_vehicle.id}")
    assert response.status_code == 204
    response = client.get(f"/vehicles/{test_vehicle.id}")
    assert response.status_code == 404
