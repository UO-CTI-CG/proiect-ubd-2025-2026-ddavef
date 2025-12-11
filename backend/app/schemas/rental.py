from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class RentalBase(BaseModel):
    user_id: int
    vehicle_id: int
    start_time: datetime
    end_time: datetime
    total_cost: float

class RentalCreate(RentalBase):
    pass

class RentalUpdate(BaseModel):
    end_time: Optional[datetime] = None
    total_cost: Optional[float] = None

class Rental(RentalBase):
    id: int

    model_config = ConfigDict(from_attributes=True)