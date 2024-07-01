from motor.motor_asyncio import AsyncIOMotorClient as AsyncClient
from pymongo import MongoClient as Client
from fastapi import Depends

from core.config import Settings, get_settings


def get_db_sync(settings: Settings = Depends(get_settings)) -> Client:
    client = Client(settings.MONGO_URI)
    db = client[settings.MONGO_DB]
    return db


async def get_db(settings: Settings = Depends(get_settings)) -> AsyncClient:
    client = AsyncClient(settings.MONGO_URI, uuidRepresentation="standard")
    db = client[settings.MONGO_DB]
    return db
