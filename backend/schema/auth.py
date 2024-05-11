from pydantic import BaseModel, field_serializer
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


class User(BaseModel):
    user: OAuthUserInDB | int | None = None
