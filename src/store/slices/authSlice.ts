import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  _id?: string;
  userid?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  phoneNumber?: string;
  username?: string;
  gender?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationStep: "signup" | "activation" | "profile" | "pin" | "completed";
  tempUserId: string | null;
  tempEmail: string | null;
  tempPassword: string | null;
  tempFullName: string | null;
  tempPhone: string | null;
}

// SSR-safe initialState — localStorage is not available on the server
const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isLoading: false,
  error: null,
  registrationStep: "signup",
  tempUserId: null,
  tempEmail: null,
  tempPassword: null,
  tempFullName: null,
  tempPhone: null,
};

const BASE_URL = "https://legitcards-api.onrender.com/api";

const getDeviceInfo = () => {
  // Guard for SSR
  if (typeof navigator === "undefined") {
    return {
      devicename: "Web Browser",
      devicetype: "Desktop",
      deviceos: "Unknown",
    };
  }
  const ua = navigator.userAgent;
  let devicename = "Web Browser";
  let devicetype = "Desktop";
  let deviceos = navigator.platform;

  if (/Mobi|Android/i.test(ua)) {
    devicetype = "Mobile";
  } else {
    devicetype = "Laptop";
  }

  if (/Windows/i.test(ua)) {
    deviceos = "Windows 10";
    devicename = "Windows PC";
  } else if (/Mac/i.test(ua)) {
    deviceos = "macOS";
    devicename = "Mac";
  } else if (/Linux/i.test(ua)) {
    deviceos = "Linux";
    devicename = "Linux Machine";
  } else if (/Android/i.test(ua)) {
    deviceos = "Android";
    devicename = "Android Device";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    deviceos = "iOS";
    devicename = "iPhone/iPad";
  }

  return { devicename, devicetype, deviceos };
};

// Helper: set auth cookie for Next.js middleware (7-day expiry)
const setAuthCookie = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
};

// Helper: clear auth cookie on logout
const clearAuthCookie = () => {
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { email: string; password: string; phoneNumber?: string; fullName?: string }, { rejectWithValue }) => {
    try {
      const deviceInfo = getDeviceInfo();

      // Normalize phone to +234 format, or omit if not provided
      let normalizedPhone: string | undefined;
      if (userData.phoneNumber) {
        const p = userData.phoneNumber.trim();
        if (p.startsWith('+')) {
          normalizedPhone = p;
        } else if (p.startsWith('0')) {
          normalizedPhone = `+234${p.slice(1)}`;
        } else if (p.length > 0) {
          normalizedPhone = `+${p}`;
        }
      }

      // Only send fields the API expects — fullName is NOT a create-endpoint field
      const body: Record<string, any> = {
        email: userData.email,
        password: userData.password,
        ...deviceInfo,
      };
      if (normalizedPhone) body.phoneNumber = normalizedPhone;

      const response = await fetch(`${BASE_URL}/auth/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Signup failed");
      return { ...data, email: userData.email };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);


export const activateAccount = createAsyncThunk(
  "auth/activate",
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Activation failed");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users/resend_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to resend code");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const password = state.auth.tempPassword;
      const fullName = state.auth.tempFullName || "";
      const phone = state.auth.tempPhone || "";

      // Derive firstname, lastname, username from fullName if not provided
      const parts = fullName.trim().split(" ");
      const firstname = profileData.firstname || (parts[0] ?? "");
      const lastname = profileData.lastname || (parts.length > 1 ? parts.slice(1).join(" ") : parts[0] ?? "");
      const username = profileData.username || `${parts[0] ?? "user"}${Math.floor(1000 + Math.random() * 900000)}`;
      const phoneNumber = profileData.phoneNumber || phone || undefined;

      const payload = {
        ...profileData,
        firstname,
        lastname,
        username,
        phoneNumber,
        password,
        gender: profileData.gender || "Undefined",
      };

      const response = await fetch(`${BASE_URL}/auth/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Profile update failed");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const sendPinOtp = createAsyncThunk(
  "auth/sendPinOtp",
  async (payload: { id: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/users/account/pin/send_otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to send PIN OTP");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const setPin = createAsyncThunk(
  "auth/setPin",
  async (
    payload: { id: string; pin: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users/account/pin/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to set PIN");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/users/account/profile?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to fetch profile");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    profileData: { id: string; [key: string]: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/users/account/profile/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(profileData),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to update profile");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    passwordData: { id: string; oldPassword: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/users/account/password/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(passwordData),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to change password");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const deviceInfo = getDeviceInfo();
      const response = await fetch(`${BASE_URL}/auth/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          ...deviceInfo,
        }),
      });
      const data = await response.json();

      // Unverified account: API sends OTP and returns LOGIN_CODE_SENT
      if (data.statusCode === "LOGIN_CODE_SENT") {
        return rejectWithValue({
          type: "LOGIN_CODE_SENT",
          email: credentials.email,
          message: data.message || "Please verify your email to continue.",
        });
      }

      if (!response.ok) return rejectWithValue(data.message || "Login failed");

      const firstItem = Array.isArray(data.data)
        ? data.data[0]
        : data.data || data;
      const token = firstItem?.token || data.token;
      const user = firstItem?.userInfo || firstItem?.user || firstItem;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuthCookie(token);
      }

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.registrationStep = "signup";
      state.tempPassword = null;
      state.tempFullName = null;
      state.tempPhone = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Clear cookie for Next.js middleware
      clearAuthCookie();
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationStep: (
      state,
      action: PayloadAction<AuthState["registrationStep"]>,
    ) => {
      state.registrationStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationStep = "activation";
        state.tempEmail = action.payload.email;
        state.tempPassword = action.meta.arg.password || null;
        state.tempFullName = action.meta.arg.fullName || null;
        state.tempPhone = action.meta.arg.phoneNumber || null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(activateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationStep = "profile";
        state.tempUserId = action.payload.data[0].userid;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationStep = "pin";
        state.tempPassword = null;
        state.tempFullName = null;
        state.tempPhone = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(setPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPin.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationStep = "completed";
      })
      .addCase(setPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setRegistrationStep } = authSlice.actions;
export default authSlice.reducer;
