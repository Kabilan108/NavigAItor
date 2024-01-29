#!/bin/bash

set -e

cd "$(dirname "$0")/../backend"

source "$(poetry env info --path)/bin/activate"

poetry install --no-root

poetry run python -m uvicorn api.index:app \
    --host $API_HOST \
    --port $API_PORT \
    --reload

# Deactivate Poetry environment
deactivate
