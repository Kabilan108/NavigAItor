from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request

import time

from core.config import settings, setup_logging
from api import api_router

setup_logging(settings)
app = FastAPI(
    title="navigAItor-server",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # docs_url=f"{settings.API_V1_STR}/docs",
    # redoc_url=f"{settings.API_V1_STR}/redoc",
    version="0.1.0",
)

# TODO: Use a secure secret key
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_TOKEN)

if settings.CLIENT_URL:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.CLIENT_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
