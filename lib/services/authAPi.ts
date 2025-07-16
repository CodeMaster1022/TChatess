import { addAuthHeader, setAuthToken } from "@/lib/utils/auth-utils"

const API_BASE_URL = "https://api.chatess.com/api"

export const authApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }
    return data
  },

  register: async ({ 
    firstName, 
    lastName, 
    email, 
    password, 
    phoneNumber, 
    countryCode 
  }: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    phoneNumber: string; 
    countryCode: string; 
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        password, 
        phoneNumber, 
        countryCode
      }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || error.detail || "Registration failed")
    }
    return response.json()
  },

  sendOTP: async ({ phoneNumber, countryCode }: { phoneNumber: string; countryCode: string }) => {
    const fullPhoneNumber = `${countryCode.replace('+', '')}${phoneNumber}`;
    const response = await fetch('https://api.chatess.com/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: fullPhoneNumber,
        sender_name: "ChatESS"
      })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return {
        message: data.message || "OTP sent successfully",
        otpId: data.otp_id
      };
    } else {
      throw new Error(data.detail || 'Failed to send OTP');
    }
  },

  verifyOTP: async ({ 
    phoneNumber, 
    countryCode, 
    otp, 
    email 
  }: { 
    phoneNumber: string; 
    countryCode: string; 
    otp: string; 
    email: string; 
  }) => {
    const fullPhoneNumber = `${countryCode.replace('+', '')}${phoneNumber}`;
    const response = await fetch('https://api.chatess.com/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: fullPhoneNumber,
        otp_code: otp
      })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return {
        message: "OTP verified successfully",
        verified: true,
        phoneVerified: data.phone_verified
      };
    } else {
      throw new Error(data.detail || 'Invalid OTP code');
    }
  },

  logout: async () => {
    // For JWT-based auth, logout is handled client-side by removing the token
    return { success: true }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to get user")
    }

    const data = await response.json()
    return data.user
  },
}

export function setRefreshToken(token: string) {
  localStorage.setItem("refresh_chatess_Token", token);
}
