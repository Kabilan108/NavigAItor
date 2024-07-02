from fastapi import Depends
import anthropic
import lancedb
import openai

from core.config import settings

VECTORDB_URI = settings.ROOT_DIR / "data" / "user-documents"


async def get_db_tbl():
    db = await lancedb.connect_async(VECTORDB_URI)
    return await db.open_table("embedded_docs")


def get_chat_client(settings):
    return anthropic.AsyncClient(api_key=settings.ANTHROPIC_API_KEY)


def get_embedding_client(settings):
    return openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def get_embedding(
    texts: list[str], client: openai.AsyncOpenAI
) -> list[list[float]]:
    r = await client.embeddings.create(input=texts, model="text-embedding-3-small")
    return [x.embedding for x in r.data]


async def retrieve_chunks(
    query: str,
    top_k: int = 3,
    client: openai.AsyncOpenAI = Depends(get_embedding_client),
):
    tbl = await get_db_tbl()
    q_embed = (await get_embedding([query], client))[0]
    chunks = await tbl.vector_search(q_embed).limit(top_k).to_pandas()
    chunks = (
        chunks.sort_values(by="_distance", ascending=True)
        .drop(columns=["vector"])
        .rename(columns={"_distance": "distance"})
    )
    chunks = chunks.loc[chunks["distance"] < 1.0]
    if chunks.empty:
        return []
    else:
        return chunks.to_dict(orient="records")
