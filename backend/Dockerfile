# ---------------------------------- BUILD ------------------------------------

FROM python:3.11 as build

# Keeps Python from generating .pyc files in the container
# Turns off buffering for easier container logging
# Force UTF8 encoding for funky character handling
# Needed so imports function properly
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 \
    PYTHONPATH=/app/ \
    VIRTUAL_ENV=/build/.venv \
    PATH="$VIRTUAL_ENV/bin:/root/.cargo/bin:$PATH"

WORKDIR /build

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

RUN uv venv .venv
COPY requirements.txt .
RUN uv pip install -r requirements.txt

# ---------------------------------- DIST ------------------------------------

FROM build as dist

WORKDIR /app

ENV VIRTUAL_ENV=/app/.venv \
    PATH="$VIRTUAL_ENV/bin:$PATH"

COPY --from=build /build/.venv /app/.venv

COPY . .

EXPOSE 8000/tcp
CMD ["./run.sh"]
