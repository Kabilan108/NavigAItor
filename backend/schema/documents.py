from pydantic import BaseModel
from fastapi import HTTPException

from enum import Enum

from schema.base import BaseInDB, DBBase, UploadBase


class DocumentType(str, Enum):
    SLIDES = "slides"
    DOCUMENT = "document"
    RECORDING = "recording"
    UPLOAD = "upload"


class DocumentMetadata(BaseModel):
    name: str
    tags: list[str] = []
    document_type: DocumentType


class DocumentMetadataUpload(DocumentMetadata, UploadBase):
    pass


class NewDocument(DBBase):
    user_id: str
    conversation_id: str | None = None
    object_key: str
    file_name: str
    file_type: str
    metadata: DocumentMetadata


class Document(NewDocument, BaseInDB):
    pass


def raise_upload_error(e: Exception):
    raise HTTPException(status_code=400, detail=f"Error uploading file: {e}")
