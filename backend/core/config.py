from pydantic_settings import BaseSettings
from loguru import logger

from pathlib import Path
import logging
import sys

from core.logging import InterceptHandler

ROOT = Path(__file__).parent.parent


class Settings(BaseSettings):
    TEMP_DIR: str = "navigaitor"
    API_PATH: str | None = "/api/v1"
    # SECRET_KEY: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int | None = 60 * 24 * 8
    REFRESH_TOKEN_EXPIRE_DAYS: int | None = 7
    ALGORITHM: str | None = "HS256"

    CLIENT_URL: str = "http://localhost:3000"

    LOG_LEVEL: int = logging.INFO

    MONGO_URI: str
    MONGO_DB: str

    AUTH_SECRET_KEY: str
    AUTH_ALGORITHM: str
    SESSION_TOKEN: str
    COOKIE_DOMAIN: str | None = None

    GOOGLE_OAUTH_CLIENT_ID: str
    GOOGLE_OAUTH_CLIENT_SECRET: str

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    AWS_BUCKET: str

    LOGFIRE_TOKEN: str

    ANTHROPIC_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    COHERE_API_KEY: str | None = None

    class Config:
        case_sensitive = True


def setup_logging(settings: Settings):
    LOGGERS = ("uvicorn.asgi", "uvicorn.access")
    logging.getLogger().handlers = [InterceptHandler()]
    for logger_name in LOGGERS:
        logging_logger = logging.getLogger(logger_name)
        logging_logger.handlers = [InterceptHandler(level=settings.LOG_LEVEL)]

    logger.configure(
        handlers=[
            {
                "sink": sys.stderr,
                "level": settings.LOG_LEVEL,
                "format": "<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
            }
        ]
    )


def get_settings():
    return Settings()


settings = get_settings()
