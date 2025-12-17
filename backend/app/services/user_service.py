from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password


class UserService:
    def create_user(self, db: Session, user: UserCreate) -> User:
        hashed = hash_password(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name or user.username,
            hashed_password=hashed,
            is_active=True,
        )
        db.add(db_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise ValueError("Duplicate username or email")
        db.refresh(db_user)
        return db_user

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
