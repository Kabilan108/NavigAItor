# services/main.py
#
# Modal entrypoint to support GPU inference for NavigAItor

from modal import Dict, Image, Secret, Stub, Volume, asgi_app

from .utils import get_logger


logger = get_logger()

volume = Volume.persisted("NavigAItor-inference-data")
images = {
    "app": Image.debian_slim().pip_install(
        "fastapi==0.108.0",
        "pydantic==2.6.0",
        "loguru==0.7.2",
    )
}

stub = Stub(
    "NavigAItor-inference",
    image=images["app"],
)

stub.in_progress = Dict.new()


@stub.function(
    secret=Secret.from_name("NavigAItor-inference-secrets"),
)
@asgi_app()
def fastapi_app():
    from .api import app

    return app


@stub.function(
    volumes={"/data": volume},
)
def slow_operation():
    import time

    time.sleep(60)
    return "Done"
