/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileMetadata } from "./FileMetadata";
export type FileInDB = {
  _id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  conversation_id?: string | null;
  object_key: string;
  file_type: string;
  metadata: FileMetadata;
};
