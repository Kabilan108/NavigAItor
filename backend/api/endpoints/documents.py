from fastapi import APIRouter, Depends, UploadFile, HTTPException

from core.config import Settings, get_settings
from core.auth import get_current_user
from core.db import User
from core import crud
from schema.documents import Document, DocumentMetadataUpload
from services import docstore, mongo
from schema.base import Response


router = APIRouter()

default = {
    "name": "test",
    "document_type": "test",
    "tags": ["slides"],
}


# TODO: add conversation id
# TODO: should be able to handle multiple files and metadata
# TODO: file ingestion (chunking, metadata extraction, etc.)
@router.post("/upload", response_model=Response)
async def upload_document(
    file: UploadFile,
    metadata: DocumentMetadataUpload,
    user: User = Depends(get_current_user),
    s3: docstore.Client = Depends(docstore.create_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    conversation_id = None
    doc = await docstore.upload_doc(
        user_id=str(user.id),
        conversation_id=conversation_id,
        metadata=metadata.model_dump() if metadata else {},
        file=file,
        client=s3,
        db=db,
        settings=settings,
    )
    return {"message": "Document uploaded", "data": {"document_id": doc.id}}


@router.delete("/{document_id}", response_model=Response)
async def delete_document(
    document_id: str,
    user: User = Depends(get_current_user),
    s3: docstore.Client = Depends(docstore.create_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    await docstore.delete_doc(
        user_id=str(user.id),
        doc_id=document_id,
        bucket=settings.AWS_BUCKET,
        client=s3,
        db=db,
    )
    return {"message": "Document deleted"}


@router.get("")
async def list_documents(
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> list[Document]:
    return await docstore.list_docs(user_id=str(user.id), db=db)


@router.get("/{document_id}")
async def get_document(
    document_id: str,
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> Document:
    return await docstore.get_doc(user_id=str(user.id), doc_id=document_id, db=db)


@router.put("/{document_id}")
async def update_document(
    document_id: str,
    document_update: dict,
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> Response:
    try:
        doc = await crud.update_document(
            db=db,
            doc_id=document_id,
            user_id=str(user.id),
            doc_update=document_update,
        )
        return {"message": "Document updated", "data": doc}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating document: {e}")
