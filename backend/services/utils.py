# services/utils.py

from . import config


def load_whisper_pipeline():
    """Load the Whisper ASR pipeline"""

    from transformers import pipeline
    import torch

    gpu = torch.cuda.is_available()
    device = "cuda" if gpu else "cpu"

    pipeline = pipeline(
        "automatic-speech-recognition",
        model=config.WHISPER_MODEL,
        torch_dtype=torch.float16 if gpu else torch.int8,
        device=device,
    )

    return pipeline


def transcribe(pipe, audiofile):
    """Transcribe an audio file"""

    import torch

    segments = pipe(
        audiofile,
        chunk_length_s=30,
        batch_size=12,
        return_timestamps=True,
        generate_kwargs={
            "task": "transcribe",
            "language": "en",
        },
    )
    torch.cuda.empty_cache()

    return segments
