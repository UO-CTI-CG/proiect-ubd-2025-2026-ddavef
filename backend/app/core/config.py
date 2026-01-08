from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Project root is three levels up from this file: backend/app/core -> project root.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DB_PATH = PROJECT_ROOT / "db" / "app.db"


class Settings(BaseSettings):
    # Use an absolute path so the DB is always in one place regardless of cwd.
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()