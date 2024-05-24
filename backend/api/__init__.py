from fastapi import APIRouter

from api.endpoints import auth, conversations, files, users


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(
    conversations.router, prefix="/conversations", tags=["conversations"]
)
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
