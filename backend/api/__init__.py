from fastapi import APIRouter

from api.endpoints import chat, conversations, documents
from core.auth import mount_auth_endpoints


api_router = APIRouter()

mount_auth_endpoints(api_router)

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(
    conversations.router, prefix="/conversations", tags=["conversations"]
)
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
