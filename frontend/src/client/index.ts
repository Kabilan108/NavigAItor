import axios from "axios";

import { Document } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function getEndpoint(path: string) {
  return `${API_URL}${path}`;
}

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await axios.get(getEndpoint("/files"), getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw new Error("Failed to fetch documents");
  }
};
