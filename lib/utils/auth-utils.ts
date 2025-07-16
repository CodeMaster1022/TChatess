import {jwtDecode} from 'jwt-decode';

const ACCESS_TOKEN_KEY = "access_chatess_Token";
const REFRESH_TOKEN_KEY = "refresh_chatess_Token";

export interface JwtPayload {
  sub: string;         // User email
  status: 'active' | 'inactive' | 'pending' | 'trial' | 'suspended';
  user_id: number;
  tenant_id: number | null;
  role: 'viewer' | 'admin' | 'editor';  // Add other possible roles
  exp: number;          // Expiration timestamp
}
// Set JWT token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

// Get JWT token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// Remove JWT token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

// Set refresh token in localStorage
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Remove refresh token from localStorage
export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// Add token to API request headers
export const addAuthHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getAuthToken()
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return headers
}

// Parse JWT token (simplified version)
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true

  // Check if expiration time is past current time
  const currentTime = Date.now() / 1000
  return decoded.exp < currentTime
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getTokenData = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;
  return decodeToken(token);
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  const now = Date.now() / 1000;
  return decoded.exp > now;
};