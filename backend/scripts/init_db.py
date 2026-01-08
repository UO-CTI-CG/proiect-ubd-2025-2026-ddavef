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

from app.models import user, vehicle, rental  # noqa: F401


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
            return
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()