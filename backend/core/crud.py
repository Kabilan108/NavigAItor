from bson.objectid import ObjectId

from schema.auth import OAuthUserInDB, raise_auth_failure
from schema.conversations import ConversationInDB, NewConversation, UpdateConversation
from schema.files import FileInDB, NewFile
from services.mongo import AsyncClient


async def get_user(db: AsyncClient, user_id: str) -> OAuthUserInDB:
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise_auth_failure("User not found")
    return OAuthUserInDB(**user)


async def update_user(
    db: AsyncClient, user_id: str, user_update: dict
) -> OAuthUserInDB:
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": user_update})
    updated_user_data = await db.users.find_one({"_id": ObjectId(user_id)})
    return OAuthUserInDB(**updated_user_data)


async def delete_user(db: AsyncClient, user_id: str):
    await db.users.delete_one({"_id": ObjectId(user_id)})


async def create_file(db: AsyncClient, file: NewFile) -> FileInDB:
    inserted = await db.files.insert_one(file.model_dump())
    return FileInDB(**file.model_dump(), id=inserted.inserted_id)


async def get_file(db: AsyncClient, file_id: str, user_id: str) -> FileInDB:
    file = await db.files.find_one({"_id": ObjectId(file_id), "user_id": user_id})
    return FileInDB(**file)


async def update_file(
    db: AsyncClient, file_id: str, user_id: str, file_update: dict
) -> FileInDB:
    await db.files.update_one(
        {"_id": ObjectId(file_id), "user_id": user_id}, {"$set": file_update}
    )
    updated_file_data = await db.files.find_one(
        {"_id": ObjectId(file_id), "user_id": user_id}
    )
    return FileInDB(**updated_file_data)


async def delete_file(db: AsyncClient, file_id: str, user_id: str):
    await db.files.delete_one({"_id": ObjectId(file_id), "user_id": user_id})


async def create_conversation(
    db: AsyncClient, conversation: NewConversation
) -> ConversationInDB:
    inserted = await db.conversations.insert_one(conversation.model_dump())
    return ConversationInDB(**conversation.model_dump(), id=inserted.inserted_id)


async def get_conversation(
    db: AsyncClient, conversation_id: str, user_id: str
) -> ConversationInDB:
    conversation = await db.conversations.find_one(
        {"_id": conversation_id, "user_id": user_id}
    )
    return ConversationInDB(**conversation)


async def update_conversation(
    db: AsyncClient, conversation_id: str, user_id: str, update: UpdateConversation
) -> ConversationInDB:
    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id},
        {"$set": update.model_dump()},
    )
    updated_conversation_data = await db.conversations.find_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id}
    )
    return ConversationInDB(**updated_conversation_data)


async def delete_conversation(db: AsyncClient, conversation_id: str, user_id: str):
    await db.conversations.delete_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id}
    )
