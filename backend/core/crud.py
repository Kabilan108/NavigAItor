from bson.objectid import ObjectId

from schema.auth import OAuthUserInDB, raise_auth_failure
from schema.conversations import ConversationInDB, NewConversation, UpdateConversation
from schema.documents import Document, NewDocument
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


async def create_document(db: AsyncClient, doc: NewDocument) -> Document:
    inserted = await db.documents.insert_one(doc.model_dump())
    return Document(**doc.model_dump(), _id=inserted.inserted_id)


async def get_document(db: AsyncClient, doc_id: str, user_id: str) -> Document:
    doc = await db.documents.find_one({"_id": ObjectId(doc_id), "user_id": user_id})
    return Document(**doc)


async def update_document(
    db: AsyncClient, doc_id: str, user_id: str, doc_update: dict
) -> Document:
    await db.documents.update_one(
        {"_id": ObjectId(doc_id), "user_id": user_id}, {"$set": doc_update}
    )
    updated_doc = await db.documents.find_one(
        {"_id": ObjectId(doc_id), "user_id": user_id}
    )
    return Document(**updated_doc)


async def delete_document(db: AsyncClient, doc_id: str, user_id: str):
    await db.documents.delete_one({"_id": ObjectId(doc_id), "user_id": user_id})


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
