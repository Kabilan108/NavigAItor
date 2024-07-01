from fastapi import APIRouter, Depends

from schema.conversations import ConversationInDB, UpdateConversation
from core.auth import get_current_user
from services import mongo
from core.db import User
from core import crud

router = APIRouter()


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> ConversationInDB:
    return await crud.get_conversation(db, conversation_id, user.id)


@router.put("/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    update: UpdateConversation,
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> ConversationInDB:
    return await crud.update_conversation(db, conversation_id, user.id, update)


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> None:
    await crud.delete_conversation(db, conversation_id, user.id)


# @router.post("/{conversation_id}/messages")
# async def create_message(
#     conversation_id: str,
#     message: MessageInDB,
#     user: User = Depends(get_current_user),
#     db: mongo.AsyncClient = Depends(mongo.get_db),
# ) -> MessageInDB:
#     return crud.create_message(db, conversation_id, user.id, message)
