import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextState {
  user?: {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    created_at: string;
    last_login: string;
  };
  loading: boolean;
  login: () => void;
  logout: () => void;
  saveToken: () => void;
}

export const AuthContext = createContext<AuthContextState>({
  user: undefined,
  loading: true,
  login: () => {},
  logout: async () => {},
  saveToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextState["user"]>(undefined);
  const [loading, setLoading] = useState(true);

  function saveToken() {
    const token = new URL(window.location.href).hash.split("=")[1];
    console.log("token", token);

    if (token) {
      localStorage.setItem("token", token);
      window.location.hash = "";
    }
  }

  useEffect(() => {
    saveToken();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.user === 0) {
          setUser(undefined);
          return;
        } else {
          setUser(response.data.user);
          console.log("User fetched:", response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(undefined);
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
    localStorage.removeItem("token");
    setUser(undefined);
    window.location.href = "/";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    saveToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
