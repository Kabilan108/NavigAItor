from fastapi import APIRouter, Depends, HTTPException

from schema.auth import OAuthUserInDB
from schema.base import Response
from schema.users import UserResponse
from core.auth import get_current_user
from services import mongo
from core import crud

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(user: OAuthUserInDB = Depends(get_current_user)):
    return {"message": "User fetched", "data": user}


@router.put("/{user_id}", response_model=Response)
async def update_user(
    user_id: str,
    user_update: dict,
    current_user: OAuthUserInDB = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> UserResponse:
    if user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this user"
        )
    updated_user = await crud.update_user(db, user_id, user_update)
    return {"message": "User updated", "data": {"user": updated_user}}


@router.delete("/{user_id}", response_model=Response)
async def delete_user(
    user_id: str,
    current_user: OAuthUserInDB = Depends(get_current_user),
    db: mongo.AsyncClient = Depends(mongo.get_db),
) -> Response:
    if user_id != current_user.sub:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this user"
        )
    await crud.delete_user(db, user_id)
    return {"message": "User deleted"}
