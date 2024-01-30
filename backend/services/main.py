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

from .config import logger
from . import config, utils


GPU_CONFIG = gpu.T4()

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
        "pandas",
    )
)

stub = Stub("NavigAItor-inference")

stub.jobs = Dict.new()


@stub.function(
    image=api_image,
    volumes={config.DATA_DIR: data_volume},
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
    gpu=GPU_CONFIG,
    image=whisper_image,
    volumes={
        config.MODEL_DIR: model_volume,
        config.DATA_DIR: data_volume,
    },
    secret=Secret.from_name("NavigAItor-inference-secrets"),
)
def transcribe(audiofile: str) -> dict:
    """Transcribe an audio file

    @param audiofile: path to audio file. must be a wav file stored in the data volume
    """

    data_volume.reload()

    logger.info(f"Starting transcription job for {audiofile}")

    pipeline = utils.load_whisper_pipeline()
    segments = utils.transcribe(pipeline, audiofile)

    logger.info(f"Finished transcription job for {audiofile}")

    for i, chk in enumerate(segments["chunks"]):
        segments["chunks"][i] = {
            "start": chk["timestamp"][0],
            "end": chk["timestamp"][1],
            "text": chk["text"],
        }

    return {"text": segments["text"], "timestamps": segments["chunks"]}
