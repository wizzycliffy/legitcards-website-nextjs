'use client';

import { createContext, useContext, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login as loginAction, signup as signupAction, logout as logoutAction, activateAccount as activateAccountAction, resendCode as resendCodeAction, updateProfile as updateProfileAction, sendPinOtp as sendPinOtpAction, setPin as setPinAction } from "@/store/slices/authSlice";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  registrationStep: 'signup' | 'activation' | 'profile' | 'pin' | 'completed';
  tempEmail: string | null;
  tempUserId: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  signup: (userData: any) => Promise<any>;
  activateAccount: (email: string, code: string) => Promise<any>;
  resendCode: (email: string) => Promise<any>;
  updateProfile: (profileData: any) => Promise<any>;
  sendPinOtp: (payload: { id: string; password?: string }) => Promise<any>;
  setPin: (payload: { id: string; pin: string; token: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error, registrationStep, tempEmail, tempUserId } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginAction({ email, password })).unwrap();
  };

  const signup = async (userData: any) => {
    return dispatch(signupAction(userData)).unwrap();
  };

  const activateAccount = async (email: string, code: string) => {
    return dispatch(activateAccountAction({ email, code })).unwrap();
  };

  const resendCode = async (email: string) => {
    return dispatch(resendCodeAction(email)).unwrap();
  };

  const updateProfile = async (profileData: any) => {
    return dispatch(updateProfileAction(profileData)).unwrap();
  };

  const sendPinOtp = async (payload: { id: string; password?: string }) => {
    return dispatch(sendPinOtpAction(payload)).unwrap();
  };

  const setPin = async (payload: { id: string; pin: string; token: string }) => {
    return dispatch(setPinAction(payload)).unwrap();
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isLoading,
      error,
      registrationStep,
      tempEmail,
      tempUserId,
      login,
      logout,
      signup,
      activateAccount,
      resendCode,
      updateProfile,
      sendPinOtp,
      setPin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
