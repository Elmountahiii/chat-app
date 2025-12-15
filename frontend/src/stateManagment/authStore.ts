import { create } from "zustand";
import { HttpResponse } from "@/types/httpResponse";
import { User } from "@/types/user";
import { SignUpDataType } from "@/schema/auth/signUpSchema";

interface AuthenticationState {
	// state
	user: User | null;
	isAuthenticated: boolean;
	isRegistered: boolean;
	isLoading: boolean;
	error: string | null;
	successMessage: string | null;

	// actions
	login: (email: string, password: string) => Promise<void>;
	signUp: (userData: SignUpDataType) => Promise<void>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	checkAuthStatus: () => Promise<void>;
	setUser: (user: User | null) => void;
	clearSuccessMessage: () => void;
	setSuccessMessage: (message: string) => void;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://localhost:3001/api";

export const useAuthStore = create<AuthenticationState>((set) => ({
	// State
	user: null,
	isAuthenticated: false,
	isRegistered: false,
	isLoading: false,
	error: null,
	successMessage: null,

	// Actions
	login: async (email: string, password: string) => {
		console.log(
			"%c 🌐 [HTTP] Logging in...",
			"color: #eab308; font-weight: bold;",
			{ email },
		);
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
				console.log(
					"%c ❌ [HTTP] Login Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				set({
					isLoading: false,
					error: result.errorMessage,
				});
				return;
			}
			console.log(
				"%c ✅ [HTTP] Login Success:",
				"color: #22c55e; font-weight: bold;",
				result.data,
			);

			set({
				isLoading: false,
				successMessage: result.successMessage,
				isAuthenticated: true,
				user: result.data,
				error: null,
			});
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Login Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({
				isLoading: false,
				error: "Something went wrong. Please try again later.",
			});
		}
	},

	signUp: async (userData: SignUpDataType) => {
		console.log(
			"%c 🌐 [HTTP] Signing Up...",
			"color: #eab308; font-weight: bold;",
			userData,
		);
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
				console.log(
					"%c ❌ [HTTP] Sign Up Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				set({
					isLoading: false,
					error: result.errorMessage,
				});
				return;
			}
			console.log(
				"%c ✅ [HTTP] Sign Up Success:",
				"color: #22c55e; font-weight: bold;",
				result.data,
			);

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
			console.log(
				"%c ❌ [HTTP] Sign Up Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({
				isLoading: false,
				error:
					"Unable to create account. Please check your connection and try again.",
			});
		}
	},

	logout: async () => {
		console.log(
			"%c 🌐 [HTTP] Logging out...",
			"color: #eab308; font-weight: bold;",
		);
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
				console.log(
					"%c ❌ [HTTP] Logout Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
			} else {
				console.log(
					"%c ✅ [HTTP] Logout Success:",
					"color: #22c55e; font-weight: bold;",
				);
			}

			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				successMessage: "Logged out successfully",
			});
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Logout Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
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
		console.log(
			"%c 🌐 [HTTP] Checking Auth Status...",
			"color: #eab308; font-weight: bold;",
		);
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
				console.log(
					"%c ❌ [HTTP] Check Auth Status Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				set({
					isLoading: false,
				});
				return;
			}
			console.log(
				"%c ✅ [HTTP] Auth Status Checked:",
				"color: #22c55e; font-weight: bold;",
				result.data,
			);
			set({
				isLoading: false,
				isAuthenticated: true,
				successMessage: result.successMessage,
				user: result.data,
				error: null,
			});
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Check Auth Status Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
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
