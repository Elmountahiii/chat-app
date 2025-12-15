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
	process.env.NEXT_PUBLIC_BACKEND_URL,
);

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

			const result: HttpResponse<User> = await response.json();
			if (!result.success) {
				set({
					isLoading: false,
					error: result.errorMessage,
				});
				return;
			}

			set({
				isLoading: false,
				successMessage: result.successMessage,
				isAuthenticated: true,
				user: result.data,
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
			const result: HttpResponse<User> = await response.json();

			if (!result.success) {
				set({
					isLoading: false,
					error: result.errorMessage,
				});
				return;
			}

			set({
				isLoading: false,
				isRegistered: true,
				successMessage: result.successMessage,
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
			const result: HttpResponse<null> = await response.json();
			if (!result.success) {
				console.warn(`Logout failed:`, result.errorMessage);
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
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result: HttpResponse<User> = await response.json();
			if (!result.success) {
				set({
					isLoading: false,
				});
				return;
			}
			set({
				isLoading: false,
				isAuthenticated: true,
				successMessage: result.successMessage,
				user: result.data,
				error: null,
			});
		} catch (e) {
			console.warn(`error in login : ${e}`);
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
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
