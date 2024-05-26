/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileInDB } from "./FileInDB";
import type { Message } from "./Message";
export type ConversationInDB = {
  _id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  title: string;
  messages: Array<Message>;
  files: Array<FileInDB>;
  description?: string | null;
  readonly total_file_size: number;
  readonly chat_history: Record<string, any>;
};
