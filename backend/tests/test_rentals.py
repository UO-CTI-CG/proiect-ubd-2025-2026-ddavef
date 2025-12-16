from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.dependencies import get_current_user
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.models.vehicle import Vehicle

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def test_user(db_session):
    user = User(
        username="tester",
        email="tester@example.com",
        full_name="Test User",
        hashed_password=hash_password("secret"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def test_vehicle(db_session):
    vehicle = Vehicle(
        name="City Bike",
        vehicle_type="bike",
        description="A simple city bike",
        available=True,
        price_per_hour=5.0,
    )
    db_session.add(vehicle)
    db_session.commit()
    db_session.refresh(vehicle)
    return vehicle


@pytest.fixture(autouse=True)
def override_user_dependency(test_user):
    app.dependency_overrides[get_current_user] = lambda: test_user
    yield
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture()
def client():
    return TestClient(app)


def _rental_payload(test_user, test_vehicle):
    return {
        "user_id": test_user.id,
        "vehicle_id": test_vehicle.id,
        "start_time": datetime(2023, 10, 1, 10, 0, 0).isoformat(),
        "end_time": datetime(2023, 10, 1, 12, 0, 0).isoformat(),
        "total_cost": 10.0,
    }


def test_create_rental(client, test_user, test_vehicle):
    payload = _rental_payload(test_user, test_vehicle)
    response = client.post("/rentals/", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["user_id"] == test_user.id
    assert body["vehicle_id"] == test_vehicle.id


def test_get_rental(client, test_user, test_vehicle):
    payload = _rental_payload(test_user, test_vehicle)
    created = client.post("/rentals/", json=payload).json()
    response = client.get(f"/rentals/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_update_rental(client, test_user, test_vehicle):
    payload = _rental_payload(test_user, test_vehicle)
    created = client.post("/rentals/", json=payload).json()
    response = client.put(
        f"/rentals/{created['id']}",
        json={"end_time": datetime(2023, 10, 1, 13, 0, 0).isoformat()},
    )
    assert response.status_code == 200
    assert "13:00:00" in response.json()["end_time"]


def test_delete_rental(client, test_user, test_vehicle):
    payload = _rental_payload(test_user, test_vehicle)
    created = client.post("/rentals/", json=payload).json()
    response = client.delete(f"/rentals/{created['id']}")
    assert response.status_code == 204
    response = client.get(f"/rentals/{created['id']}")
    assert response.status_code == 404


def test_login_returns_token(client, test_user):
    response = client.post(
        "/users/login",
        data={"username": test_user.email, "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_create_and_list_vehicle(client, test_user):
    vehicle_payload = {
        "name": "Scooter",
        "vehicle_type": "scooter",
        "description": "Electric scooter",
        "price_per_hour": 7.5,
        "available": True,
    }
    created = client.post("/vehicles/", json=vehicle_payload)
    assert created.status_code == 201

    listed = client.get("/vehicles/")
    assert listed.status_code == 200
    assert any(v["name"] == "Scooter" for v in listed.json())