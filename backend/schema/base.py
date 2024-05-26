from pydantic import (
    BaseModel,
    Field,
    field_validator,
    model_serializer,
    model_validator,
)
from bson import ObjectId

from datetime import datetime
import json


class DBBase(BaseModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        arbitrary_types_allowed = True

    @model_serializer()
    def serialize_model(self):
        return {
            key: (value.isoformat() if isinstance(value, datetime) else value)
            for key, value in self.__dict__.items()
        }


class BaseInDB(BaseModel):
    id: str = Field(..., alias="_id")

    @field_validator("id", mode="before")
    def validate_id(cls, v: str) -> str:
        if isinstance(v, ObjectId):
            return str(v)
        return v

    def model_dump(self, **kwargs):
        return super(BaseInDB, self).model_dump(by_alias=True, **kwargs)


class UploadBase(BaseModel):
    """This is a base model for metadata included in file uploads"""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        return json.loads(data)


class Response(BaseModel):
    message: str = "Success"
    data: dict | BaseModel | None = None
