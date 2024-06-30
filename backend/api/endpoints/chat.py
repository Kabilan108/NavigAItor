from fastapi import APIRouter
from pydantic import BaseModel, Field
import logfire

from datetime import datetime
from enum import Enum

from core.chat import get_chat_client, get_embedding_client, retrieve_chunks
from core.config import get_settings

router = APIRouter()
chat_client = get_chat_client(get_settings())
embed_client = get_embedding_client(get_settings())

logfire.instrument_anthropic(chat_client)
logfire.instrument_openai(embed_client)


class Chunk(BaseModel):
    document_id: str
    document_name: str
    tags: list[str]
    document_type: str
    title: str
    text: str
    image: str | None = None
    distance: float


class Role(str, Enum):
    ASSISTANT = "assistant"
    SYSTEM = "system"
    USER = "user"


class Message(BaseModel):
    role: Role = Field(..., title="One of ASSISTANT|SYSTEM|USER")
    content: str = Field(..., title="The content of the message")


class AssistantMessage(BaseModel):
    role: Role = Field(Role.ASSISTANT, title="One of ASSISTANT|SYSTEM|USER")
    content: str = Field(title="The content of the message")
    sources: list[Chunk] | None = None


SYSTEM_PROMPT = f"""\
The assistant is Navigaitor, based created by Navigaitor. The current date is {datetime.now().strftime("%B %dth, %Y")}.

Navigaitor's knowledge base was last updated on August 2023. It answers questions about events prior to and after August 2023 the way a highly informed individual in August 2023 would if they were talking to someone from the above date, and can let the human know this when relevant.

It should give concise responses to very simple questions, but provide thorough responses to more complex and open-ended questions.

If it is asked to assist with tasks involving the expression of views held by a significant number of people, Navigaitor provides assistance with the task even if it personally disagrees with the views being expressed, but follows this with a discussion of broader perspectives.

Navigaitor doesn't engage in stereotyping, including the negative stereotyping of majority groups.

If asked about controversial topics, Navigaitor tries to provide careful thoughts and objective information without downplaying its harmful content or implying that there are reasonable perspectives on both sides.

It is happy to help with writing, analysis, question answering, math, coding, and all sorts of other tasks. It uses markdown for coding.

It does not mention this information about itself unless the information is directly pertinent to the human's query.

It helps college students by answering questions about their course material and helping them study. It can also help with writing, coding, and other tasks.

It always responds in markdown.
"""

RAG_PROMPT = """\
Context information is provided below:

<context>
{context}
</context>

Given the context information, and your prior knowledge, please respond to the query from the user

User query: {user_message}
Answer:
"""


@router.post("")
async def create_chat(
    messages: list[Message | AssistantMessage],
    top_k: int = 3,
) -> AssistantMessage:
    context_chunks = await retrieve_chunks(
        messages[-1].content, top_k=top_k, client=embed_client
    )

    if context_chunks:
        messages[-1] = Message(
            role=Role.USER,
            content=RAG_PROMPT.format(
                user_message=messages[-1].content,
                context="\n\n".join(
                    [f"* {c['title']}:\n{c['text']}" for c in context_chunks]
                ),
            ),
        )
        sources = context_chunks
    else:
        sources = None

    response = await chat_client.messages.create(
        model="claude-3-haiku-20240307",
        system=SYSTEM_PROMPT,
        temperature=1.0,
        max_tokens=512,
        messages=[m.model_dump() for m in messages],
    )
    response_message = response.content[0].text
    return AssistantMessage(
        role=Role.ASSISTANT, content=response_message, sources=sources
    )
