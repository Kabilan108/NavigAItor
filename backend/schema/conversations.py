from pydantic import BaseModel, computed_field

from schema.base import DBBase, BaseInDB
from schema.chat import Message
from schema.documents import Document


class NewConversation(DBBase):
    user_id: str

    title: str
    messages: list[Message]
    documents: list[Document]
    description: str | None = None

    @computed_field(return_type=int)
    def total_file_size(self):
        return sum(file.size for file in self.files)

    @computed_field(return_type=dict)
    def chat_history(self):
        return [message.model_dump() for message in self.messages]


class ConversationInDB(NewConversation, BaseInDB):
    pass


class UpdateConversation(BaseModel):
    title: str | None = None
    description: str | None = None
