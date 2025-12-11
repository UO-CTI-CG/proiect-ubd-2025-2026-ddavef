from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    start_time = Column(String)
    end_time = Column(String)
    total_cost = Column(Integer)

    user = relationship("User", back_populates="rentals")
    vehicle = relationship("Vehicle", back_populates="rentals")