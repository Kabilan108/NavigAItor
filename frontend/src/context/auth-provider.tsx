import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

import * as client from "@/client";
import { User } from "@/client/types";

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
        const user = await client.getCurrentUser();
        if (user) {
          setUser(user);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          try {
            if (!localStorage.getItem("refreshToken")) {
              setUser(undefined);
              return;
            } else {
              await client.refreshToken();
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

  const login = () => client.logIn();

  const logout = () => client.logOut();

  const value = {
    user,
    loading,
    login,
    logout,
    saveTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
