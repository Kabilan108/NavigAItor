import axios from "axios";

import { Document } from "@/lib/utils";
import { User } from "@/client/types";

// TODO: standardize error handling for axios, particularly for 401s

export const backendURL = () => {
  if (process.env.NODE_ENV === "development") {
    return import.meta.env.VITE_API_URL;
  } else {
    return window.env.API_URL;
  }
};

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
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
