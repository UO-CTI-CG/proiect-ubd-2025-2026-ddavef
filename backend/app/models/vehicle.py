from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    vehicle_type = Column(String, index=True)
    available = Column(Boolean, default=True)
    price_per_hour = Column(Integer)

    rentals = relationship("Rental", back_populates="vehicle")

    def __repr__(self):
        return f"<Vehicle(id={self.id}, name={self.name}, type={self.vehicle_type}, available={self.available})>"