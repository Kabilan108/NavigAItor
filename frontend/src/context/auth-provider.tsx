import React, { createContext, useState, useEffect } from "react";

import * as client from "@/client";
import { type User, type AuthData, AuthProviders } from "@/client/types";

interface AuthContextType {
  user: User | undefined;
  login: (provider: AuthProviders, data?: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => {},
  logout: async () => {},
  checkAuth: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await client.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(`Failed to fetch user: ${error}`);
      }
    };

    fetchUser();
  }, []);

  const login = async (provider: AuthProviders, data?: AuthData) => {
    if (provider === AuthProviders.CREDENTIALS && data) {
      await client.credentialsLogin(data);
    } else if (provider === AuthProviders.GOOGLE) {
      await client.startGoogleOAuthFlow();
    }
  };

  const logout = () => client.logout();

  const checkAuth = () => {
    // TODO: figure out what to do when token is expired
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return true;
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
