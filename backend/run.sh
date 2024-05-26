#!/bin/bash

export APP_MODULE=${APP_MODULE-main:app}
export HOST=${HOST-0.0.0.0}
export PORT=${PORT-8000}

# source .venv/bin/activate
# exec gunicorn "$APP_MODULE" \
#     --bind "$HOST":"$PORT" \
#     -k uvicorn.workers.UvicornWorker \
#     # --workers 2 \
#     --reload
uvicorn "$APP_MODULE" \
    --host "$HOST" \
    --port "$PORT" \
    --reload
