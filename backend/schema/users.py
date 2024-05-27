from schema.base import Response
from schema.auth import OAuthUserInDB


class UserResponse(Response):
    data: OAuthUserInDB
