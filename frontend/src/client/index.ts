import axios from "axios";

import { Document } from "@/lib/utils";
import { ClientResponse, DocumentMetadata, User } from "@/client/types";
import { Message } from "@/client/generated";

// TODO: standardize error handling for axios, particularly for 401s

export const backendURL = () => {
  if (process.env.NODE_ENV === "development") {
    return import.meta.env.VITE_API_URL;
  } else {
    return window.env.API_URL;
  }
};

function getAuthHeaders() {
  // const token = localStorage.getItem("accessToken");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNzE3Nzg2NTI1LCJpYXQiOjE3MTcwOTUzMjUsInN1YiI6IjY2NGVkMzZhZWE2MjllMzhkOTYzMWZiMyJ9.hHIbdzapdB4Ir1MUIdGHL8XtdB0Aaomb8c6PkiBSX4o";
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function getEndpoint(path: string) {
  return `${backendURL()}${path}`;
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(getEndpoint("/users/me"), getAuthHeaders());
  return response.data.data;
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await axios.get(getEndpoint("/documents"), getAuthHeaders());
  return response.data;
};

export const uploadDocument = async (
  file: File,
  metadata: DocumentMetadata | null = null,
): Promise<ClientResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }

  const response = await axios.post(
    getEndpoint("/documents/upload"),
    formData,
    {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteDocument = async (
  documentId: string,
): Promise<ClientResponse> => {
  const response = await axios.delete(
    getEndpoint(`/documents/${documentId}`),
    getAuthHeaders(),
  );
  return response.data;
};

export const refreshToken = async (): Promise<void> => {
  try {
    const response = await axios.post(getEndpoint("/auth/refresh"), {
      refresh_token: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("accessToken", response.data.access_token);
  } catch (error) {
    console.error(error);
  }
};

export const logIn = (): void => {
  window.location.href = `${backendURL()}/auth/login`;
};

export const logOut = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
};

export const sendChatMessage = async (messages: Message[]) => {
  const response = await axios.post(
    getEndpoint("/chat"),
    messages,
    getAuthHeaders(),
  );
  return response.data;
};
