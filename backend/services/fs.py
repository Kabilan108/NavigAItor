from fastapi import Depends, UploadFile, HTTPException
import boto3
import uuid

from core.config import Settings, get_settings
from core import crud
from schema.files import NewFile, FileInDB, raise_upload_error
from services import mongo

Client = boto3.client


def create_s3_client(settings: Settings = Depends(get_settings)) -> Client:
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


# TODO: use folders: user_id/file_id
async def upload_file(
    user_id: str,
    conversation_id: str,
    bucket: str,
    file: UploadFile,
    client: Client,
    db: mongo.AsyncClient,
):
    """Create file metadata"""

    s3_key = generate_file_name(user_id, file.filename)

    try:
        client.upload_fileobj(file.file, bucket, s3_key)
    except Exception as e:
        raise_upload_error(e)

    metadata = NewFile(
        name=file.filename,
        type=file.content_type,
        s3_key=s3_key,
        user_id=user_id,
        conversation_id=conversation_id,
    )
    try:
        file = await crud.create_file(db, metadata)
    except Exception as e:
        raise_upload_error(e)

    return file


async def get_file(file_id: str, user_id: str, db: mongo.AsyncClient) -> FileInDB:
    """Find file by id"""
    file = await crud.get_file(db, file_id, user_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if file["user_id"] != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return FileInDB(**file)


async def delete_file(
    user_id: str,
    file_id: str,
    bucket: str,
    client: Client,
    db: mongo.AsyncClient,
) -> dict:
    """Delete file from S3"""
    file = await get_file(file_id, user_id, db)
    client.delete_object(Bucket=bucket, Key=file.s3_key)
    await crud.delete_file(db, file_id, user_id)
    return


async def list_files(user_id: str, db: mongo.AsyncClient) -> list[FileInDB]:
    """List files for user"""
    files = await db.files.find({"user_id": user_id}).to_list(None)
    return [FileInDB(**file) for file in files]
