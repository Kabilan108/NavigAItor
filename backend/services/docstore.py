from fastapi import Depends, UploadFile, HTTPException
from botocore.client import BaseClient as Client
import boto3
import uuid

from pathlib import Path
import tempfile

from core.config import Settings, get_settings
from core import crud
from schema.documents import (
    NewDocument,
    Document,
    DocumentType,
    raise_upload_error,
)
from services import mongo


def create_client(settings: Settings = Depends(get_settings)) -> Client:
    return boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def generate_file_name(user_id: str, file_name: str) -> str:
    """Generate unique file name"""
    ext = file_name.split(".")[-1]
    return f"{user_id}/{uuid.uuid4()}.{ext}"


async def upload_doc(
    user_id: str,
    conversation_id: str,
    metadata: dict,
    file: UploadFile,
    client: Client,
    db: mongo.AsyncClient,
    settings: Settings,
):
    """Create document metadata"""

    object_key = generate_file_name(user_id, file.filename)

    try:
        client.upload_fileobj(file.file, settings.AWS_BUCKET, object_key)
    except Exception as e:
        raise_upload_error(e)

    if not metadata:
        metadata = {
            "name": file.filename,
            "document_type": DocumentType.UPLOAD,
        }

    new_doc = NewDocument(
        user_id=user_id,
        conversation_id=conversation_id,
        file_name=file.filename,
        file_type=file.content_type,
        object_key=object_key,
        metadata=metadata,
    )
    try:
        doc = await crud.create_document(db, new_doc)
    except Exception as e:
        raise_upload_error(e)

    return doc


def get_temp_file_path(file_name: str, settings: Settings) -> str:
    path = Path(tempfile.gettempdir()) / settings.TEMP_DIR / file_name
    if not path.parent.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
    return path


async def download_doc(
    doc_id: str,
    user_id: str,
    db: mongo.AsyncClient,
    client: Client,
    settings: Settings,
) -> dict:
    """Download document from S3"""
    doc = await get_doc(doc_id, user_id, db)
    filepath = get_temp_file_path(doc.object_key, settings)
    client.download_file(settings.AWS_BUCKET, doc.object_key, filepath)
    return doc, filepath


async def get_doc(doc_id: str, user_id: str, db: mongo.AsyncClient) -> Document:
    """Find document by id"""
    doc = await crud.get_document(db, doc_id, user_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.user_id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return doc


async def delete_doc(
    user_id: str,
    doc_id: str,
    bucket: str,
    client: Client,
    db: mongo.AsyncClient,
) -> dict:
    """Delete document from S3 and MongoDB"""
    doc = await get_doc(doc_id, user_id, db)
    client.delete_object(Bucket=bucket, Key=doc.object_key)
    await crud.delete_document(db, doc_id, user_id)
    return


async def list_docs(user_id: str, db: mongo.AsyncClient) -> list[Document]:
    """List documents for user"""
    docs = await db.documents.find({"user_id": user_id}).to_list(None)
    return [Document(**doc) for doc in docs]
