# services/config.py
#
# Configuration for the Modal service.

from loguru import logger
import sys


def get_logger():
    """Return logger"""

    logger.add(
        sink=sys.stdout,
        format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
        level="INFO",
    )
    return logger
