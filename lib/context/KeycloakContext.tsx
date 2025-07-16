import React, { createContext, useContext, useEffect, useState } from "react";
import keycloak from "../config/keycloak";
import { useDispatch } from "react-redux";
import { login } from "@/lib/features/auth/authSlice";
import { AppDispatch } from "@/lib/store";

interface KeycloakContextType {
  keycloak: typeof keycloak;
  initialized: boolean;
  isActivated: boolean;
}

const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const API_BASE_URL = "https://api.chatess.com/api";
const KeycloakContext = createContext<KeycloakContextType>({
  keycloak,
  initialized: false,
  isActivated: false,
});

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const password = "password";
  const verifyUserWithBackend = async (email: string) => {
    try {
      const token = keycloak.token;
      if (!token) return { isActivated: false, refreshToken: null };

      const parsedToken = keycloak.tokenParsed;

      const roles = parsedToken?.resource_access?.["chatess-id"]?.roles || [];
      if (!roles.includes("chatess-access")) {
        setIsActivated(false);
      }

      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        return {
          isActivated: true,
          refreshToken: resultAction.payload,
        };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return {
        isActivated: false,
        refreshToken: null,
      };
    }
  };

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          pkceMethod: "S256",
        });
        if (authenticated) {
          const email = keycloak.tokenParsed?.email;
          if (email) {
            const { isActivated, refreshToken } = await verifyUserWithBackend(
              email
            );
            setIsActivated(isActivated);

            if (isActivated && refreshToken) {
              localStorage.setItem(TOKEN_KEY, keycloak.token || "");
            } else {
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(REFRESH_TOKEN_KEY);
            }
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          setIsActivated(false);
        }
      } catch (error) {
        console.error("Failed to initialize Keycloak:", error);
        localStorage.removeItem(TOKEN_KEY);
        setIsActivated(false);
      } finally {
        setInitialized(true);
      }
    };

    initKeycloak();

    // Set up token refresh
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(70).catch(() => {
        console.error("Failed to refresh token");
        // Clear local storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // Logout the user
        keycloak.logout();
      });
    };

    return () => {
      keycloak.onTokenExpired = () => {};
    };
  }, [dispatch]);

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized, isActivated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }
  return context;
};