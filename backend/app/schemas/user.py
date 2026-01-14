from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class User(UserBase):
    id: int
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class UserInDB(User):
    hashed_password: str


class UserRead(User):
    pass