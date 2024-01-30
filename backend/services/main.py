# services/main.py
#
# Modal entrypoint to support GPU inference for NavigAItor

from modal import (
    Dict,
    Image,
    Secret,
    Stub,
    Volume,
    asgi_app,
    gpu,
)

from .config import get_logger
from . import config, utils


GPU_CONFIG = gpu.A100()

logger = get_logger()

model_volume = Volume.persisted("NavigAItor-inference-models")
data_volume = Volume.persisted("NavigAItor-inference-data")

api_image = Image.debian_slim(python_version="3.10").pip_install(
    "fastapi==0.108.0",
    "pydantic==2.6.0",
    "loguru==0.7.2",
)
whisper_image = (
    Image.from_registry(
        "nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04", add_python="3.10"
    )
    .apt_install("ffmpeg")
    .pip_install(
        "torch==2.1.2+cu118", index_url="https://download.pytorch.org/whl/cu118"
    )
    .pip_install(
        "transformers==4.36.2",
        "loguru==0.7.2",
        "ffmpeg-python==0.2.0",
        "optimum",
        "accelerate",
    )
)

stub = Stub("NavigAItor-inference")

stub.in_progress = Dict.new()


@stub.function(
    image=api_image,
    secret=Secret.from_name("NavigAItor-inference-secrets"),
)
@asgi_app()
def fastapi_app():
    from .api import app

    return app


@stub.function(
    gpu=GPU_CONFIG,
    image=whisper_image,
    volumes={config.MODEL_DIR: model_volume},
    secret=Secret.from_name("NavigAItor-inference-secrets"),
)
def download_model():
    """Save the model to the modal volume"""
    _ = utils.load_whisper_pipeline()
    model_volume.commit()


@stub.function(
    # gpu=GPU_CONFIG,
    gpu=gpu.T4(),
    image=whisper_image,
    volumes={
        config.MODEL_DIR: model_volume,
        config.DATA_DIR: data_volume,
    },
    secret=Secret.from_name("NavigAItor-inference-secrets"),
)
def transcribe():
    """Transcribe an audio file"""

    audiofile = f"{config.DATA_DIR}/ben-shapiro-clip.wav"

    pipeline = utils.load_whisper_pipeline()

    segments = utils.transcribe(pipeline, audiofile)

    print(segments)
