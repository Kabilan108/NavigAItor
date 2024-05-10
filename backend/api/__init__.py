from fastapi import APIRouter, Request

from api.endpoints import auth


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])


@api_router.get("/")
async def root(request: Request):
    if request.session.get("user"):
        return {"message": "Hello World", "user": request.session.get("user")}
    else:
        return {"message": "Hello World"}
