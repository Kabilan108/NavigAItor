from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from datetime import datetime

from schema.auth import OAuthUser, OAuthUserInDB
from api.deps import AsyncIOMotorClient
from core.config import ROOT

config = Config(ROOT / ".env")
oauth = OAuth(config)

CONF_URL = "https://accounts.google.com/.well-known/openid-configuration"
oauth.register(
    name="google",
    server_metadata_url=CONF_URL,
    client_kwargs={"scope": "openid email profile"},
)


async def get_or_create_user(
    db: AsyncIOMotorClient, user_info: OAuthUser
) -> OAuthUserInDB:
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
