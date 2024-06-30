#!/bin/bash

export APP_MODULE=${APP_MODULE-main:app}
export HOST=${HOST-0.0.0.0}
export PORT=${PORT-8000}

# source .venv/bin/activate
uvicorn "$APP_MODULE" \
    --host "$HOST" \
    --port "$PORT" \
    --workers 2 \
    --reload
