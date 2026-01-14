from pathlib import Path
import sys
from sqlalchemy.engine import make_url

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.core.config import settings
from app.core.security import hash_password

from app.models import user, vehicle, rental
from app.models.user import User


def _sqlite_path(url: str) -> Path | None:
    parsed = make_url(url)
    if parsed.get_backend_name() != "sqlite":
        return None
    return Path(parsed.database) if parsed.database else None

def init_db():
    db_url = settings.DATABASE_URL
    db_path = _sqlite_path(db_url)
    if db_path:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        if db_path.exists():
            engine = create_engine(db_url)
            _ensure_admin(engine)
            return
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)
    _ensure_admin(engine)


def _ensure_admin(engine):
    admin_email = settings.ADMIN_EMAIL
    admin_username = settings.ADMIN_USERNAME
    admin_password = settings.ADMIN_PASSWORD
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        exists = session.query(User).filter(
            (User.email == admin_email) | (User.username == admin_username)
        ).first()
        if exists:
            return
        admin_user = User(
            username=admin_username,
            email=admin_email,
            full_name="Admin",
            hashed_password=hash_password(admin_password),
            is_active=True,
        )
        session.add(admin_user)
        session.commit()
    finally:
        session.close()

if __name__ == "__main__":
    init_db()