from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException
from starlette.config import Config
from jose import jwt, JWTError

from datetime import datetime, timedelta
from typing import MutableMapping

from schema.auth import OAuthUser, OAuthUserInDB
from api.deps import AsyncIOMotorClient
from core.config import ROOT, settings

config = Config(ROOT / ".env")
oauth = OAuth(config)

CONF_URL = "https://accounts.google.com/.well-known/openid-configuration"
oauth.register(
    name="google",
    server_metadata_url=CONF_URL,
    client_kwargs={"scope": "openid email profile"},
)

JWTPayLoad = MutableMapping[str, datetime | bool | str | list[str] | list[int]]


def _create_token(
    token_type: str,
    lifetime: timedelta,
    sub: str,
) -> str:
    payload = {}
    expire = datetime.utcnow() + lifetime
    payload["type"] = token_type
    payload["exp"] = expire
    payload["iat"] = datetime.utcnow()
    payload["sub"] = str(sub)
    return jwt.encode(
        payload, settings.AUTH_SECRET_KEY, algorithm=settings.AUTH_ALGORITHM
    )


def create_access_token(*, sub: str) -> str:
    return _create_token(
        token_type="access_token",
        lifetime=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        sub=sub,
    )


async def authenticate_user(
    db: AsyncIOMotorClient, user_info: OAuthUser
) -> OAuthUserInDB:
    """Authenticate a user and return the user object.

    If the user does not exist, create a new user.
    """
    user_data = await db.users.find_one({"email": user_info.email})
    last_login = datetime.now()

    if user_data:
        await db.users.update_one(
            {"email": user_info.email}, {"$set": {"last_login": last_login}}
        )
        user = OAuthUserInDB(**user_data)
        user.last_login = last_login
        return user
    else:
        user = OAuthUserInDB.from_oauth_user(user_info)
        await db.users.insert_one(user.model_dump())
        return user


async def get_current_user(access_token: str, db: AsyncIOMotorClient) -> OAuthUserInDB:
    def credential_exception(e: Exception):
        return HTTPException(
            status_code=401,
            detail=f"Unauthorized: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            access_token, settings.AUTH_SECRET_KEY, algorithms=[settings.AUTH_ALGORITHM]
        )
        sub = payload.get("sub")
        if not sub:
            raise credential_exception("JWT sub is not found")
        user = await db.users.find_one({"sub": sub})
        if not user:
            raise credential_exception("User not found")
        return OAuthUserInDB(**user)
    except JWTError as e:
        raise credential_exception(e)
