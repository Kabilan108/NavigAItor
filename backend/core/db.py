from pydantic import Field

from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser, BeanieUserDatabase
from beanie import Document, init_beanie

from core.config import get_settings
from services.mongo import get_db


class OAuthAccount(BaseOAuthAccount):
    pass


class User(BeanieBaseUser, Document):
    oauth_accounts: list[OAuthAccount] = Field(default_factory=list)


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)


async def init_db():
    await init_beanie(
        database=await get_db(get_settings()),
        document_models=[User],
    )
