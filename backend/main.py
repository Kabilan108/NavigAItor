from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import logfire

from contextlib import asynccontextmanager
import time

from core.config import settings
from core.db import init_db
from api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="navigAItor-server",
    openapi_url=f"{settings.API_PATH}/openapi.json",
    # docs_url=f"{settings.API_PATH}/docs",
    # redoc_url=f"{settings.API_PATH}/redoc",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_TOKEN)

if settings.CLIENT_URL:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            settings.CLIENT_URL,
            "http://100.99.171.107:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

logfire.configure(token=settings.LOGFIRE_TOKEN)
logfire.instrument_fastapi(app)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.middleware("http")
async def force_https(request: Request, call_next):
    if (
        "X-Forwarded-Proto" in request.headers
        and request.headers["X-Forwarded-Proto"] == "https"
    ):
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response


app.include_router(api_router, prefix=settings.API_PATH)


@app.route("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
