from pydantic_settings import BaseSettings
from loguru import logger

from pathlib import Path
import logging
import sys

from core.logging import InterceptHandler

ROOT = Path(__file__).parent.parent


class Settings(BaseSettings):
    API_V1_STR: str | None = "/api/v1"
    # SECRET_KEY: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int | None = 60 * 24 * 8
    ALGORITHM: str | None = "HS256"

    CLIENT_URL: str = "http://localhost:3000"

    LOG_LEVEL: int = logging.INFO

    MONGO_URI: str
    MONGO_DB: str

    SESSION_TOKEN: str

    class Config:
        case_sensitive = True
        # env_file = ROOT / ".env"


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


settings = Settings()
