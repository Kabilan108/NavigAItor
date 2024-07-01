from beanie import PydanticObjectId
from fastapi_users import schemas


class UserRead(schemas.BaseUser[PydanticObjectId]):
    pass


class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass
