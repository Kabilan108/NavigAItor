#!/bin/bash

set -e

# Activate Poetry environment
source "$(poetry env info --path)/bin/activate"

# Install dependencies
poetry install

# Run server
poetry run python -m uvicorn api.index:app \
    --host $API_HOST \
    --port $API_PORT \
    --reload

# Deactivate Poetry environment
deactivate
