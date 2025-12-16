from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class RentalBase(BaseModel):
    vehicle_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    total_cost: Optional[float] = None

class RentalCreate(RentalBase):
    user_id: int

class RentalUpdate(BaseModel):
    end_time: Optional[datetime] = None
    total_cost: Optional[float] = None

class Rental(RentalBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)