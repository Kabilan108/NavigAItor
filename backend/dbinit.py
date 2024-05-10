from rich.console import Console
import asyncio

from api.deps import get_db, AsyncIOMotorClient
from core.config import settings


async def init_users(db: AsyncIOMotorClient):
    users = db.get_collection("users")
    res = await users.create_index([("email", 1), ("sub", 1)], unique=True)
    return res


async def main():
    console = Console()

    try:
        db = await get_db(settings)
        console.print("[green]Database connection successful.")
    except Exception as e:
        console.print(f"[red]Failed to connect to the database: {e}")
        db = None

    if db is not None:
        with console.status("[cyan]Initializing collections..."):
            res = await init_users(db)
            if res:
                console.print("[green]'users' collection initialized")
            else:
                console.print("[red]'users' collection initialization failed")


if __name__ == "__main__":
    asyncio.run(main())
