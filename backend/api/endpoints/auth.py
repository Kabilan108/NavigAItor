from fastapi import APIRouter, Request, HTTPException, Depends
from authlib.integrations.starlette_client import OAuthError
from fastapi.responses import RedirectResponse

from api.deps import get_settings, Settings
from core.auth import oauth

router = APIRouter()


@router.get("/login", name="login")
async def login(request: Request):
    redirect_uri = request.url_for("token")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/token", name="token")
async def auth(request: Request, settings: Settings = Depends(get_settings)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=f"Failed to authenticate user: {e}")
    user = token.get("userinfo")
    if user:
        request.session["user"] = user
    return RedirectResponse(url=f"{settings.CLIENT_URL}/app")


@router.get("/logout", name="logout")
async def logout(request: Request, settings: Settings = Depends(get_settings)):
    request.session.pop("user", None)
    return RedirectResponse(url=settings.CLIENT_URL)
