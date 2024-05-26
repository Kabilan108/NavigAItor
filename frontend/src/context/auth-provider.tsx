import React, { createContext, useState, useEffect } from "react";

import { User } from "@/lib/utils";

import axios from "axios";

interface AuthContextState {
  user?: User;
  loading: boolean;
  login: () => void;
  logout: () => void;
  saveTokens: () => void;
}

export const AuthContext = createContext<AuthContextState>({
  user: undefined,
  loading: true,
  login: () => {},
  logout: async () => {},
  saveTokens: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextState["user"]>(undefined);
  const [loading, setLoading] = useState(true);

  function saveTokens() {
    const hash = new URL(window.location.href).hash;
    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.hash = "";
    }
  }

  useEffect(() => {
    saveTokens();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        if (response.data.user === 0) {
          setUser(undefined);
          return;
        } else {
          setUser(response.data.data.user);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          try {
            if (!localStorage.getItem("refreshToken")) {
              setUser(undefined);
              return;
            } else {
              const refreshResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh`,
                {
                  refresh_token: localStorage.getItem("refreshToken"),
                },
              );
              localStorage.setItem(
                "accessToken",
                refreshResponse.data.access_token,
              );
              await fetchUser();
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            setUser(undefined);
          }
        } else {
          setUser(undefined);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(undefined);
    window.location.href = "/";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    saveTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
