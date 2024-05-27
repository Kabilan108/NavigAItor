from pydantic import BaseModel, Field
from fastapi import HTTPException

from datetime import datetime

from schema.base import BaseInDB, DBBase


class OAuthUser(BaseModel):
    sub: str
    email: str
    email_verified: bool
    name: str
    picture: str
    given_name: str
    family_name: str


class NewOAuthUser(OAuthUser, DBBase):
    last_login: datetime = Field(default_factory=datetime.now)

    @classmethod
    def from_oauth_user(cls, user: OAuthUser) -> "NewOAuthUser":
        return cls(**user.model_dump())


class OAuthUserInDB(NewOAuthUser, BaseInDB):
    pass


def raise_auth_failure(detail: str = "Unauthorized"):
    raise HTTPException(
        status_code=401,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )
