from pydantic import BaseModel, Field

from enum import Enum


class Role(str, Enum):
    ASSISTANT = "assistant"
    SYSTEM = "system"
    USER = "user"


class Message(BaseModel):
    role: Role = Field(title="One of ASSISTANT|SYSTEM|USER")
    content: str = Field(title="The content of the message")
