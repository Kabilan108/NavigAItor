import {
  DocumentMetadata as DocumentMetadataGenerated,
  Response,
} from "@/client/generated";

export interface User {
  id: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export enum DocumentType {
  SLIDES = "slides",
  DOCUMENT = "document",
  RECORDING = "recording",
  UPLOAD = "upload",
}

export type ClientResponse = Response;
export type DocumentMetadata = DocumentMetadataGenerated;

export interface Chunk {
  document_id: string;
  document_name: string;
  document_type: string;
  tags: string[];
  title: string;
  text: string;
  image: string; // base64 encoded image
}
