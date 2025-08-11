import { User } from "../user";

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};
