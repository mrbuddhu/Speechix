from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Speechix API"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/speechix"
    TEST_DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/speechix_test"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # Storage
    STORAGE_TYPE: str = "local"  # 'local' or 's3'
    LOCAL_STORAGE_PATH: str = "data/storage"
    S3_BUCKET_NAME: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    
    # TTS Settings
    MAX_TEXT_LENGTH: int = 1000  # characters
    MAX_AUDIO_DURATION: int = 600  # seconds
    
    # Worker
    WORKER_CONCURRENCY: int = 4
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create data directories if they don't exist
os.makedirs("data/storage/audios", exist_ok=True)
os.makedirs("data/storage/reference_audios", exist_ok=True)

settings = Settings()
