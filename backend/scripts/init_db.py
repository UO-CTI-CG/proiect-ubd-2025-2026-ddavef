from pathlib import Path
import sys
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.core.config import settings

from app.models import user, vehicle, rental  # noqa: F401

def _sqlite_file_exists(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme.startswith("sqlite"):
        path_str = parsed.path
        if path_str.startswith("/"):
            path_str = path_str[1:] if path_str.startswith("//") else path_str
        db_path = Path(path_str)
        return db_path.exists()
    return False

def init_db():
    db_url = settings.DATABASE_URL
    if _sqlite_file_exists(db_url):
        return
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()