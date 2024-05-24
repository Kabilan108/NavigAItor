from fastapi import APIRouter, Depends, UploadFile, File

from core.config import Settings, get_settings
from core.auth import get_current_user
from schema.auth import OAuthUserInDB
from schema.files import FileInDB
from schema.base import Response
from services import fs, mongo

router = APIRouter()


# TODO: add conversation id
# TODO: file ingestion (chunking, metadata extraction, etc.)
@router.post("/upload", response_model=Response)
async def upload_file(
    file: UploadFile = File(...),
    user: OAuthUserInDB = Depends(get_current_user),
    s3: fs.Client = Depends(fs.create_s3_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    conversation_id = None
    file = await fs.upload_file(
        user_id=user.id,
        conversation_id=conversation_id,
        bucket=settings.AWS_BUCKET,
        file=file,
        client=s3,
        db=db,
    )
    return {"message": "File uploaded", "data": {"file_id": file.id}}


@router.delete("/{file_id}", response_model=Response)
async def delete_file(
    file_id: str,
    user: OAuthUserInDB = Depends(get_current_user),
    s3: fs.Client = Depends(fs.create_s3_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    await fs.delete_file(
        user_id=user.id,
        file_id=file_id,
        bucket=settings.AWS_BUCKET,
        client=s3,
        db=db,
    )
    return {"message": "File deleted"}


@router.get("")
async def list_files(
    user: OAuthUserInDB = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> list[FileInDB]:
    return await fs.list_files(user_id=user.id, db=db)


@router.get("/{file_id}")
async def get_file(
    file_id: str,
    user: OAuthUserInDB = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> FileInDB:
    return await fs.get_file(user_id=user.id, file_id=file_id, db=db)
