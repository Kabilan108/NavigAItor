from pydantic import BaseModel, Field, field_serializer, field_validator
from fastapi import HTTPException
from bson import ObjectId

from datetime import datetime


class CreateFile(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    name: str
    user_id: str
    conversation_id: str | None = None
    s3_key: str

    class Config:
        arbitrary_types_allowed = True

    @field_serializer("created_at", "updated_at")
    def serialize_created_at(self, v: datetime) -> str:
        return v.isoformat()


class FileInDB(CreateFile):
    id: str = Field(..., alias="_id")

    @field_validator("id", mode="before")
    def validate_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    def model_dump(self):
        return super(FileInDB, self).model_dump(by_alias=True)


def raise_upload_error(e: Exception):
    raise HTTPException(status_code=400, detail=f"Error uploading file: {e}")
