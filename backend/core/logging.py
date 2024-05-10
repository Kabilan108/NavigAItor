from loguru import logger

from types import FrameType
from typing import cast
import logging


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        # get loguru level
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = str(record.levelno)

        # find caller from where originated the logging call
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = cast(FrameType, frame.f_back)
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )
