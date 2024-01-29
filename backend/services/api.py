# services/api.py
#
# API server running serverless with Modal.
# Provides endpoints for GPU inference of different models.

from fastapi import FastAPI, Depends, Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse

from modal.functions import FunctionCall

from .main import slow_operation


app = FastAPI()
auth_scheme = HTTPBearer()


@app.post("/accept")
async def accept_json(
    request: Request, token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    import os

    if token.credentials != os.environ["ACCESS_TOKEN"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    call = slow_operation.spawn()

    return JSONResponse(
        {"call_id": call.object_id},
        status_code=status.HTTP_200_OK,
    )


@app.get("/status/{call_id}")
async def poll_status(call_id: str):
    call = FunctionCall.from_id(call_id)

    try:
        return call.get(timeout=0)
    except TimeoutError:
        return JSONResponse({}, status_code=status.HTTP_202_ACCEPTED)
