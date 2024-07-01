from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from fastapi import Depends
from pydantic import Field

from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser, BeanieUserDatabase
from beanie import Document, init_beanie

from core.config import Settings, get_settings


def get_db_sync(settings: Settings = Depends(get_settings)) -> MongoClient:
    client = MongoClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB]
    return db


async def get_db(settings: Settings = Depends(get_settings)) -> AsyncIOMotorClient:
    client = AsyncIOMotorClient(settings.MONGO_URI, uuidRepresentation="standard")
    db = client[settings.MONGO_DB]
    return db


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
