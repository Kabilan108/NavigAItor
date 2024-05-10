from fastapi import APIRouter, Request, HTTPException, Depends
from authlib.integrations.starlette_client import OAuthError
from fastapi.responses import RedirectResponse

from api.deps import get_db, get_settings, AsyncIOMotorClient, Settings
from schema.auth import OAuthUser, OAuthUserInDB
from core.auth import oauth, get_or_create_user

router = APIRouter()


@router.get("/login", name="login")
async def login(request: Request):
    redirect_uri = request.url_for("token")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/token", name="token")
async def token(
    request: Request,
    settings: Settings = Depends(get_settings),
    db: AsyncIOMotorClient = Depends(get_db),
) -> RedirectResponse:
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=f"Failed to authenticate user: {e}")

    user_info = OAuthUser(**token.get("userinfo"))
    user: OAuthUserInDB = await get_or_create_user(db, user_info)
    request.session["user"] = user.model_dump()

    return RedirectResponse(url=f"{settings.CLIENT_URL}/app")


@router.get("/logout", name="logout")
async def logout(request: Request, settings: Settings = Depends(get_settings)):
    request.session.pop("user", None)
    return RedirectResponse(url=settings.CLIENT_URL)
