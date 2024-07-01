from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin
from fastapi_users import BaseUserManager, FastAPIUsers
from httpx_oauth.clients.google import GoogleOAuth2
from fastapi import APIRouter, Depends, Request
from beanie import PydanticObjectId

from schema.auth import UserCreate, UserRead, UserUpdate
from core.db import User, get_user_db
from core.config import settings


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = settings.AUTH_SECRET_KEY
    verification_token_secret = settings.AUTH_SECRET_KEY

    async def on_after_register(self, user: User, request: Request | None = None):
        # TODO: send request for verification token
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Request | None = None
    ):
        # TODO: send email with reset token
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Request | None = None
    ):
        # TODO: send email with verification token
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.AUTH_SECRET_KEY, lifetime_seconds=3600)


bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/jwt/login")

google_oauth_client = GoogleOAuth2(
    client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
    client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET,
)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](
    get_user_manager,
    [auth_backend],
)

get_current_user = fastapi_users.current_user(optional=False, active=True)


def mount_auth_endpoints(app: APIRouter):
    app.include_router(
        fastapi_users.get_auth_router(auth_backend),
        prefix="/auth/jwt",
        tags=["auth"],
    )

    app.include_router(
        fastapi_users.get_register_router(UserRead, UserCreate),
        prefix="/auth",
        tags=["auth"],
    )

    app.include_router(
        fastapi_users.get_reset_password_router(),
        prefix="/auth",
        tags=["auth"],
    )

    app.include_router(
        fastapi_users.get_verify_router(UserRead),
        prefix="/auth",
        tags=["auth"],
    )

    app.include_router(
        fastapi_users.get_users_router(UserRead, UserUpdate),
        prefix="/users",
        tags=["users"],
    )

    app.include_router(
        fastapi_users.get_oauth_router(
            google_oauth_client,
            auth_backend,
            settings.AUTH_SECRET_KEY,
            redirect_url="http://localhost:3000/oauth-callback",
            associate_by_email=True,
            is_verified_by_default=True,  # Google OAuth validates email
        ),
        prefix="/auth/google",
        tags=["auth"],
    )
