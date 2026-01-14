from datetime import timedelta
from typing import List

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()


def require_admin(current_user: User):
    if current_user.email != settings.ADMIN_EMAIL:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current_user

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if user_service.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if user_service.get_user_by_username(db, username=user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    try:
        return user_service.create_user(db=db, user=user)
    except ValueError:
        raise HTTPException(status_code=400, detail="Username or email already registered")

@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = user_service.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserRead])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    return user_service.get_all_users(db)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    target = user_service.get_user_by_id(db, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.email == settings.ADMIN_EMAIL:
        raise HTTPException(status_code=400, detail="Cannot delete admin user")
    user_service.delete_user(db, user_id)
    return None