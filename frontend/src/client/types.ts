export enum AuthProviders {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  // sub: string;
  // email_verified: boolean;
  // name: string;
  // picture: string;
  // given_name: string;
  // family_name: string;
  // created_at: string;
  // updated_at: string;
  // last_login: string;
}

export enum DocumentType {
  SLIDES = "slides",
  DOCUMENT = "document",
  RECORDING = "recording",
  UPLOAD = "upload",
}

export interface Document {
  id: string;
  user_id: string;
  conversation_id: string;
  file_type: string;
  object_key: string;
  metadata: {
    [key: string]: string | string[];
    name: string;
    document_type: DocumentType;
    tags: string[];
  };
}

export type ClientResponse = {
  message?: string;
  data?: Record<string, unknown> | object | null;
};

export type DocumentMetadata = {
  name: string;
  tags?: Array<string>;
  document_type: DocumentType;
};

export interface Chunk {
  document_id: string;
  document_name: string;
  document_type: string;
  tags: string[];
  title: string;
  text: string;
  image: string; // base64 encoded image
}

export enum Role {
  ASSISTANT = "assistant",
  SYSTEM = "system",
  USER = "user",
}

export type Message = {
  role: Role;
  content: string;
};
