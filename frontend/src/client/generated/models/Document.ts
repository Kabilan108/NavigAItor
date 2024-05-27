/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentMetadata } from "./DocumentMetadata";
export type Document = {
  _id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  conversation_id?: string | null;
  object_key: string;
  file_name: string;
  file_type: string;
  metadata: DocumentMetadata;
};
