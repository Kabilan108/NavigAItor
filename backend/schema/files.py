from fastapi import HTTPException

from schema.base import BaseInDB, DBBase


class NewFile(DBBase):
    name: str
    type: str
    user_id: str
    conversation_id: str | None = None
    s3_key: str


class FileInDB(NewFile, BaseInDB):
    pass


def raise_upload_error(e: Exception):
    raise HTTPException(status_code=400, detail=f"Error uploading file: {e}")
