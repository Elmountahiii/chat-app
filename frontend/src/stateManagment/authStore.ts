import { AuthActions } from "@/types/action/AuthActions";
import { AuthState } from "@/types/state/authState";
import { create } from "zustand";
import { HttpResponse } from "@/types/httpResponse";
import { User } from "@/types/user";

type AuthStore = AuthState & AuthActions;
const apiUrl = "http://localhost:3000/api";

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
      console.log(`${apiUrl}/auth/login`);
      const response = await fetch(`${apiUrl}/auth/login`, {
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

  signUp: async (username: string, email: string, password: string) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
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
        isRegistered: true,
        successMessage: data.successMessage,
        user: data.data,
        error: null,
      });
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
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
  resetPassword: async (email: string) => {},
  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch(`${apiUrl}/auth/me`, {
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
