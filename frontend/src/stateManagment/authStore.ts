import { AuthActions } from "@/types/action/AuthActions";
import { AuthState } from "@/types/state/authState";
import { create } from "zustand";
import { HttpResponse } from "@/types/httpResponse";
import { User } from "@/types/user";
import { SignUpDataType } from "@/schema/auth/signUpSchema";

type AuthStore = AuthState & AuthActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:3001/api";

console.log(
  "auth store NEXT_PUBLIC_BACKEND_URL : ",
  process.env.NEXT_PUBLIC_BACKEND_URL
);

console.log("Auth store API_BASE_URL : ", API_BASE_URL);

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isRegistered: false,
  isLoading: false,
  error: null,
  successMessage: null,

  // Actions
  login: async (email: string, password: string) => {
    try {
      set({
        isLoading: true,
        error: null,
      });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: HttpResponse<User> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        isLoading: false,
        successMessage: data.successMessage,
        isAuthenticated: true,
        user: data.data,
        error: null,
      });
    } catch (e) {
      console.warn(`error in login : ${e}`);
      set({
        isLoading: false,
        error: "Something went wrong. Please try again later.",
      });
    }
  },

  signUp: async (userData: SignUpDataType) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data: HttpResponse<User> = await response.json();

      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }

      set({
        isLoading: false,
        isRegistered: true,
        successMessage: data.successMessage,
        error: null,
      });

      setTimeout(() => {
        set({
          isRegistered: false,
        });
      }, 500);
    } catch (e) {
      console.warn(`Signup error:`, e);
      set({
        isLoading: false,
        error:
          "Unable to create account. Please check your connection and try again.",
      });
    }
  },

  logout: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: HttpResponse<null> = await response.json();
      if (!data.success) {
        console.warn(`Logout failed:`, data.errorMessage);
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        successMessage: "Logged out successfully",
      });
    } catch (e) {
      console.warn(`Logout error:`, e);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        successMessage: "Logged out successfully",
      });
    }
  },

  resetPassword: async (email: string) => {
    console.log("Reset password for:", email);
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data: HttpResponse<User> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        isLoading: false,
        isAuthenticated: true,
        successMessage: data.successMessage,
        user: data.data,
        error: null,
      });
    } catch (e) {
      console.warn(`error in login : ${e}`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Unable to verify authentication status.",
      });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
}));
