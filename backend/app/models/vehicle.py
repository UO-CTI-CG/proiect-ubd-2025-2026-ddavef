from sqlalchemy import Column, Integer, String, Boolean, Float, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    vehicle_type = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    available = Column(Boolean, default=True)
    price_per_hour = Column(Float, nullable=False)

    rentals = relationship("Rental", back_populates="vehicle")

    def __repr__(self):
        return f"<Vehicle(id={self.id}, name={self.name}, type={self.vehicle_type}, available={self.available})>"