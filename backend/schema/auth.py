from pydantic import BaseModel, Field, field_serializer, field_validator
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime


class OAuthUser(BaseModel):
    sub: str
    email: str
    email_verified: bool
    name: str
    picture: str
    given_name: str
    family_name: str


class OAuthUserInDB(OAuthUser):
    created_at: datetime
    last_login: datetime
    id: str = Field(..., alias="_id")

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def from_oauth_user(cls, user: OAuthUser) -> "OAuthUserInDB":
        return cls(
            **user.model_dump(),
            created_at=datetime.now(),
            last_login=datetime.now(),
        )

    @field_serializer("created_at", "last_login")
    def serialize_date_time(self, v):
        return v.isoformat()

    @field_validator("id", mode="before")
    def validate_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v


class User(BaseModel):
    user: OAuthUserInDB | None = None


def raise_auth_failure(detail: str = "Unauthorized"):
    raise HTTPException(
        status_code=401,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )
