// src/lib/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { 
  setAuthToken, 
  removeAuthToken, 
  getAuthToken 
} from "@/lib/utils/auth-utils";
import { authApi } from "@/lib/services/authAPi";
import { tenantApi } from "@/lib/services/tenantApi";

interface JwtPayload {
  sub: string;
  user_id: number;
  tenant_id: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'user' | 'viewer';
  exp: number;
  iat: number;
}

interface AuthState {
  user_id: number | null;
  tenant_id: string | null;
  userEmail: string | null;
  role: 'admin' | 'user' | 'viewer' | null;
  status: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiry: number | null;
  
  // Registration flow state
  registrationStep: 'form' | 'otp' | 'completed';
  pendingRegistrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
  } | null;
  otpSent: boolean;
  otpVerified: boolean;
  tenant_name?: string | null;
  tenant_role?: any | null;
}

const getInitialAuthState = (): AuthState => {
  const token = getAuthToken();
  
  if (!token) {
    return {
      user_id: null,
      userEmail: null,
      tenant_id: null,
      role: null,
      status: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      tokenExpiry: null,
      registrationStep: 'form',
      pendingRegistrationData: null,
      otpSent: false,
      otpVerified: false,
      tenant_name: null,
      tenant_role: null
    };
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired =false;

    return {
      user_id: isExpired ? null : decoded.user_id,
      userEmail: isExpired ? null : decoded.sub,
      tenant_id: isExpired ? null : decoded.tenant_id,
      role: isExpired ? null : decoded.role,
      status: isExpired ? null : decoded.status,
      isAuthenticated: !isExpired,
      isLoading: false,
      error: isExpired ? 'Session expired' : null,
      tokenExpiry: decoded.exp,
      registrationStep: 'form',
      pendingRegistrationData: null,
      otpSent: false,
      otpVerified: false,
      tenant_name: null,
      tenant_role: null
    };
  } catch (error) {
    removeAuthToken();
    return {
      user_id: null,
      userEmail: null,
      tenant_id: null,
      role: null,
      status: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Invalid token',
      tokenExpiry: null,
      registrationStep: 'form',
      pendingRegistrationData: null,
      otpSent: false,
      otpVerified: false,
      tenant_name: null,
      tenant_role: null
    };
  }
};

const initialState: AuthState = getInitialAuthState();

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { access_token } = await authApi.login(credentials);
      setAuthToken(access_token);
      return jwtDecode<JwtPayload>(access_token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    phoneNumber: string;
    countryCode: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return { response, userData };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        'Registration failed'
      );
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (data: { 
    phoneNumber: string; 
    countryCode: string; 
    userData?: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
      countryCode: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOTP({ 
        phoneNumber: data.phoneNumber, 
        countryCode: data.countryCode 
      });
      return { ...response, userData: data.userData };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        'Failed to send OTP'
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data: { 
    phoneNumber: string; 
    countryCode: string; 
    otp: string; 
    email: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOTP(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        'OTP verification failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout", 
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
    } finally {
      removeAuthToken();
      dispatch(resetAuthState());
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No token found');
      
      const decoded = jwtDecode<JwtPayload>(token);
      // if (decoded.exp * 1000 < Date.now()) {
      //   throw new Error('Token expired');
      // }
      
      return decoded;
    } catch (error: any) {
      removeAuthToken();
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTenantDetails = createAsyncThunk(
  "auth/fetchTenantDetails",
  async (email: string, { rejectWithValue }) => {
    try {
      const result = await tenantApi.getTenantByEmail(email);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tenant details');
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => getInitialAuthState(),
    refreshAuthState: (state) => {
      const newState = getInitialAuthState();
      Object.assign(state, newState);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationFlow: (state) => {
      state.registrationStep = 'form';
      state.pendingRegistrationData = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user_id = payload.user_id;
        state.userEmail = payload.sub;
        state.tenant_id = payload.tenant_id;
        state.role = payload.role;
        state.status = payload.status;
        state.tokenExpiry = payload.exp;
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.registrationStep = 'completed';
        state.otpVerified = true;
        // Clear pending data as registration is now complete
        state.pendingRegistrationData = null;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.otpSent = true;
        state.registrationStep = 'otp';
        // Store user data for registration after OTP verification
        if (payload.userData) {
          state.pendingRegistrationData = {
            firstName: payload.userData.firstName,
            lastName: payload.userData.lastName,
            email: payload.userData.email,
            phoneNumber: payload.userData.phoneNumber,
            countryCode: payload.userData.countryCode
          };
        }
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpVerified = true;
        // Keep registration step as 'otp' until actual registration completes
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, () => getInitialAuthState())

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user_id = payload.user_id;
        state.userEmail = payload.sub;
        state.tenant_id = payload.tenant_id;
        state.role = payload.role;
        state.status = payload.status;
        state.tokenExpiry = payload.exp;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = payload as string;
      })

      // Fetch Tenant Details
      .addCase(fetchTenantDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantDetails.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.tenant_id = payload.tenant_id;
        state.tenant_name = payload.tenant_name;
        state.tenant_role = payload.tenant_role;
        state.error = null;
      })
      .addCase(fetchTenantDetails.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });
  },
});

export const { resetAuthState, refreshAuthState, clearError, resetRegistrationFlow } = authSlice.actions;
export default authSlice.reducer;