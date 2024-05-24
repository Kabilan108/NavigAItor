from schema.auth import OAuthUserInDB
from services.mongo import AsyncClient


async def update_user(
    db: AsyncClient, user_id: str, user_update: dict
) -> OAuthUserInDB:
    """
    Update a user's data in the database.

    Args:
        db (AsyncClient): The MongoDB client.
        user_id (str): The user's unique identifier.
        user_update (dict): A dictionary containing the fields to update and their new values.
            Example: {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "age": 30
            }

    Returns:
        OAuthUserInDB: The updated user data.
    """
    await db.users.update_one({"sub": user_id}, {"$set": user_update})
    updated_user_data = await db.users.find_one({"sub": user_id})
    return OAuthUserInDB(**updated_user_data)


async def delete_user(db: AsyncClient, user_id: str):
    await db.users.delete_one({"sub": user_id})
