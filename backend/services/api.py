# services/api.py
#
# API server running serverless with Modal.
# Provides endpoints for GPU inference of different models.

from fastapi import (
    Depends,
    File,
    FastAPI,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from typing import NamedTuple
import time
import os

from .main import data_volume, transcribe, stub
from .config import logger
from . import utils


MAX_JOB_AGE_SECS = 10 * 60

app = FastAPI()
auth_scheme = HTTPBearer()


class RunningJob(NamedTuple):
    call_id: str
    start_time: int


# TODO: make this also accept a URL to a file
@app.post("/transcribe")
async def transcribe_job(
    file: UploadFile = File(...),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme),
):
    """Start transcription jobs"""

    path, filename = utils.save_file(file)
    data_volume.commit()

    if token.credentials != os.environ["ACCESS_TOKEN"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    now = int(time.time())

    try:
        job = stub.jobs[filename]

        if isinstance(job, RunningJob) and (now - job.start_time) < MAX_JOB_AGE_SECS:
            call_id = job.call_id
            logger.info(
                f"Found existing, unexpired job for {filename}. Returning call_id {call_id}."
            )
            return {"call_id": call_id}
    except KeyError:
        pass

    call = transcribe.spawn(audiofile=path)
    stub.jobs[filename] = RunningJob(
        call_id=call.object_id,
        start_time=now,
    )

    return {"call_id": call.object_id}


@app.get("/status/{call_id}")
async def poll_status(call_id: str):
    """Check status of a running job"""

    from modal.functions import FunctionCall

    function_call = FunctionCall.from_id(call_id)

    try:
        transcript = function_call.get(timeout=0.1)
    except TimeoutError:
        return {"status": "running"}
    except Exception as exc:
        if exc.args:
            inner_exc = exc.args[0]
            if "HTTPError 403" in inner_exc:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Permission denied on transcription job",
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unknown error processing job",
        )

    logger.info(f"Received segments for {call_id}")
    logger.info(f"Segments: {transcript['text']}")

    return {
        "status": "complete",
        "transcript": transcript["text"],
        "timestamps": transcript["timestamps"],
    }
