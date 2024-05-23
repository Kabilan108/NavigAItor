# services/config.py
#
# Configuration for the Modal service.

from loguru import logger
import sys


DATA_DIR = "/data"
MODEL_DIR = "/models"
WHISPER_MODEL = "openai/whisper-large-v3"

logger.add(
    sink=sys.stdout,
    format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
    level="INFO",
)
