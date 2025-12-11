from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)

class UserInDB(User):
    hashed_password: str


class UserRead(User):
    """Public representation returned by API responses."""
    pass