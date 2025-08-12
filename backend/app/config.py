import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = os.getenv(
        'DATABASE_URL', 'postgresql+asyncpg://postgres:postgres@db:5432/appdb')
    secret_key: str = os.getenv(
        'SECRET_KEY', 'your-super-secret-key-change-me-in-production')
    jwt_secret_key: str = os.getenv(
        'JWT_SECRET_KEY', 'your-jwt-secret-key-change-me')
    access_token_expire_minutes: int = 30 * 24 * 8  # 8 days
    cors_origins: List[str] = [
        "http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
