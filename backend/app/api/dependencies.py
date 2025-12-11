from fastapi import Depends, HTTPException, status, Query
from app.models.user import User
from app.db.session import get_db
from sqlalchemy.orm import Session

def get_current_user(
    user_id: int = Query(..., description="Authenticated user ID"),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

def get_db_session():
    db = get_db()
    try:
        yield db
    finally:
        db.close()