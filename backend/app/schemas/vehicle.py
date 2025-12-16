from pydantic import BaseModel, ConfigDict
from typing import Optional


class VehicleBase(BaseModel):
    name: str
    vehicle_type: str
    description: Optional[str] = None
    price_per_hour: float
    available: bool = True


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    vehicle_type: Optional[str] = None
    description: Optional[str] = None
    price_per_hour: Optional[float] = None
    available: Optional[bool] = None


class Vehicle(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)