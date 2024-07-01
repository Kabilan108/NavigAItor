import React, { createContext, useState, useEffect } from "react";

import type { User, LoginData, SignupData } from "@/client/types";
import { AuthProviders } from "@/client/types";
import * as client from "@/client";

interface AuthContextType {
  user: User | undefined;
  login: (provider: AuthProviders, data?: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  checkAuth: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
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

  const login = async (provider: AuthProviders, data?: LoginData) => {
    try {
      if (provider === AuthProviders.CREDENTIALS && data) {
        await client.credentialsLogin(data);
        const currentUser = await client.getCurrentUser();
        setUser(currentUser);
      } else if (provider === AuthProviders.GOOGLE) {
        await client.startGoogleOAuthFlow();
      }
    } catch (error) {
      console.error(`Login failed: ${error}`);
    }
  };

  const logout = () => client.logout();

  const signup = async (data: SignupData) => client.credentialsSignup(data);

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
    signup,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
