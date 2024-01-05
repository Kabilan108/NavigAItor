#!/bin/bash

set -e

# install poetry
# pip3 install poetry

# install dependencies
poetry shell
poetry install

# run server
poetry run python -m uvicorn api.index:app \
    --host $API_HOST \
    --port $API_PORT \
    --reload
