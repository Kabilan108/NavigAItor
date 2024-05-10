from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from fastapi import Depends

from core.config import Settings


def get_settings():
    return Settings()


def get_db_sync(settings: Settings = Depends(get_settings)) -> MongoClient:
    client = MongoClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB]
    return db


async def get_db(settings: Settings = Depends(get_settings)) -> AsyncIOMotorClient:
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB]
    return db