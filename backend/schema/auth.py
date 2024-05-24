from fastapi import HTTPException
from pydantic import BaseModel

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


class OAuthUserInDB(OAuthUser, DBBase, BaseInDB):
    last_login: datetime

    @classmethod
    def from_oauth_user(cls, user: OAuthUser) -> "OAuthUserInDB":
        return cls(
            **user.model_dump(),
            created_at=datetime.now(),
            last_login=datetime.now(),
        )


def raise_auth_failure(detail: str = "Unauthorized"):
    raise HTTPException(
        status_code=401,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )
