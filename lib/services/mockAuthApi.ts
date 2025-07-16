// Mock Auth API for frontend testing without backend

// Simulate network delay
const simulateDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for demo
const mockStorage = {
  users: [] as any[],
  otpCodes: new Map<string, { code: string; expires: number }>()
};

export const mockAuthApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    await simulateDelay(1500);
    
    // Simulate login validation
    const user = mockStorage.users.find(u => u.email === email);
    if (!user) {
      throw new Error("User not found");
    }
    
    if (user.password !== password) {
      throw new Error("Invalid password");
    }
    
    // Return a mock JWT token
    const mockToken = btoa(JSON.stringify({
      sub: email,
      user_id: user.id,
      tenant_id: "demo_tenant",
      status: "active",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      iat: Math.floor(Date.now() / 1000)
    }));
    
    return { access_token: mockToken };
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
    await simulateDelay(2000);
    
    // Simulate email validation
    const existingUser = mockStorage.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    
    // Create mock user
    const newUser = {
      id: mockStorage.users.length + 1,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      countryCode,
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    mockStorage.users.push(newUser);
    
    return {
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    };
  },

  sendOTP: async ({ phoneNumber, countryCode }: { phoneNumber: string; countryCode: string }) => {
    await simulateDelay(1500);
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneKey = `${countryCode}${phoneNumber}`;
    
    // Store OTP with 5-minute expiry
    mockStorage.otpCodes.set(phoneKey, {
      code: otp,
      expires: Date.now() + (5 * 60 * 1000) // 5 minutes
    });
    
    // In real app, this would send SMS
    console.log(`🔐 Mock OTP for ${countryCode} ${phoneNumber}: ${otp}`);
    
    // Show OTP in browser alert for demo purposes
    if (typeof window !== 'undefined') {
      alert(`Demo OTP Code: ${otp}\n\n(In production, this would be sent via SMS)`);
    }
    
    return {
      message: "OTP sent successfully",
      // In demo mode, return the OTP for easy testing
      demo_otp: otp
    };
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
    await simulateDelay(1000);
    
    const phoneKey = `${countryCode}${phoneNumber}`;
    const storedOTP = mockStorage.otpCodes.get(phoneKey);
    
    if (!storedOTP) {
      throw new Error("OTP not found or expired");
    }
    
    if (Date.now() > storedOTP.expires) {
      mockStorage.otpCodes.delete(phoneKey);
      throw new Error("OTP has expired");
    }
    
    if (storedOTP.code !== otp) {
      throw new Error("Invalid OTP code");
    }
    
    // OTP is valid, remove it
    mockStorage.otpCodes.delete(phoneKey);
    
    return {
      message: "OTP verified successfully",
      verified: true
    };
  },

  logout: async () => {
    await simulateDelay(500);
    return { message: "Logged out successfully" };
  }
};

// Helper function to check if we're in demo mode
export const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('demo=true') || 
         localStorage.getItem('demo_mode') === 'true';
};

// Function to enable demo mode
export const enableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demo_mode', 'true');
  }
};

// Function to disable demo mode
export const disableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_mode');
  }
};

// Get mock data for debugging
export const getMockData = () => mockStorage; 