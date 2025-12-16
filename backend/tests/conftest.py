from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.core.security import hash_password
from app.db.base import Base
from app.models import user as user_model  # noqa: F401
from app.models import vehicle as vehicle_model  # noqa: F401
from app.models import rental as rental_model  # noqa: F401
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.models.vehicle import Vehicle

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
# StaticPool keeps the same in-memory DB across connections during tests
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
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


@pytest.fixture()
def client():
    return TestClient(app)
