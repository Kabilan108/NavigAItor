import axios from "axios";

import type {
  ClientResponse,
  DocumentMetadata,
  User,
  AuthData,
} from "@/client/types";
import { Message } from "@/generated";

// TODO: standardize error handling for axios, particularly for 401s

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function getEndpoint(path: string) {
  return `${getBackendURL()}${path}`;
}

export const getBackendURL = () => {
  if (process.env.NODE_ENV === "development") {
    return import.meta.env.VITE_API_URL;
  } else {
    return window.env.API_URL;
  }
};

/*  Auth  */

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

export const credentialsLogin = async (data: AuthData): Promise<void> => {
  // TODO: send form data via POST to /auth/jwt/login
  return;
};

export const logout = async (): Promise<void> => {
  await axios.post(getEndpoint("/auth/jwt/logout"), {}, getAuthHeaders());
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
};

export const startGoogleOAuthFlow = async (): Promise<void> => {
  const response = await axios.get(getEndpoint("/auth/google/authorize"));
  window.location.href = response.data.authorization_url;
};

export const getOAuthToken = async (query: string): Promise<void> => {
  const callbackURL = `${getBackendURL()}/auth/google/callback${query}`;
  const response = await axios.get(callbackURL, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to get OAuth token");
  }
  localStorage.setItem("accessToken", response.data.access_token);
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(getEndpoint("/users/me"), getAuthHeaders());
  return response.data.data;
};

/*  Documents  */

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

/*  Chat  */

export const sendChatMessage = async (messages: Message[]) => {
  const response = await axios.post(
    getEndpoint("/chat"),
    messages,
    getAuthHeaders(),
  );
  return response.data;
};
