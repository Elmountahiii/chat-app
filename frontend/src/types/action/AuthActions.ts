import { User } from "../user";

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearSuccessMessage: () => void;
  setSuccessMessage: (message: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
};
