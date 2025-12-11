from pydantic import BaseModel, ConfigDict
from typing import Optional

class VehicleBase(BaseModel):
    name: str
    description: Optional[str] = None
    price_per_hour: float
    available: bool

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)