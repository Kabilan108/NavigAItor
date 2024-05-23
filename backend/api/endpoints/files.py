from fastapi import APIRouter, Depends, UploadFile, File

from core.auth import get_current_user
from schema.auth import OAuthUserInDB
from core.config import Settings, get_settings
from services import fs, mongo

router = APIRouter()


# TODO: add conversation id
# TODO: file ingestion (chunking, metadata extraction, etc.)
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user: OAuthUserInDB = Depends(get_current_user),
    s3: fs.Client = Depends(fs.create_s3_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    conversation_id = None
    file = await fs.upload_file(
        file, user.id, settings.AWS_BUCKET, conversation_id, s3, db
    )
    return {"file_id": file.id}


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    user: OAuthUserInDB = Depends(get_current_user),
    s3: fs.Client = Depends(fs.create_s3_client),
    db: mongo.AsyncClient = Depends(mongo.get_db),
    settings: Settings = Depends(get_settings),
) -> dict:
    return await fs.delete_file(file_id, user.id, settings.AWS_BUCKET, s3, db)
