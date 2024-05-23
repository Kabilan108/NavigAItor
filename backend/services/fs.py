from fastapi import Depends, UploadFile, HTTPException
from bson.objectid import ObjectId
import boto3
import uuid

from core.config import Settings, get_settings
from schema.files import CreateFile, FileInDB, raise_upload_error
from services import mongo

Client = boto3.client


def create_s3_client(settings: Settings = Depends(get_settings)) -> Client:
    return boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def generate_file_name(file_name: str) -> str:
    """Generate unique file name"""
    ext = file_name.split(".")[-1]
    return f"{uuid.uuid4()}.{ext}"


async def upload_file(
    file: UploadFile,
    bucket: str,
    user_id: str,
    conversation_id: str,
    client: Client,
    db: mongo.AsyncClient,
):
    """Create file metadata"""

    s3_key = generate_file_name(file.filename)

    try:
        client.upload_fileobj(file.file, bucket, s3_key)
    except Exception as e:
        raise_upload_error(e)

    metadata = CreateFile(
        name=file.filename,
        type=file.content_type,
        s3_key=s3_key,
        user_id=user_id,
        conversation_id=conversation_id,
    )
    try:
        inserted = await db.files.insert_one(metadata.model_dump())
    except Exception as e:
        raise_upload_error(e)

    file = FileInDB(**metadata.model_dump(), _id=inserted.inserted_id)

    return file


async def find_file(file_id: str, user_id: str, db: mongo.AsyncClient) -> FileInDB:
    """Find file by id"""
    file = await db.files.find_one({"_id": ObjectId(file_id)})
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if file["user_id"] != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return FileInDB(**file)


async def delete_file(
    file_id: str,
    user_id: str,
    bucket: str,
    client: Client,
    db: mongo.AsyncClient,
) -> dict:
    """Delete file from S3"""
    file = await find_file(file_id, user_id, db)
    client.delete_object(Bucket=bucket, Key=file.s3_key)
    await db.files.delete_one({"_id": ObjectId(file_id)})
    return {"message": "File deleted"}
