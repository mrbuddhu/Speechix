export interface User {
  id: string;
  email: string;
  role?: "user" | "admin";
  credits?: number;
  usedCredits?: number;
  subscriptionExpiry?: string;
  plan?: string;
  status?: "active" | "disabled";
}

export interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = "speechix_token";
const USER_KEY = "speechix_user";
const GUEST_KEY = "speechix_guest";

export const auth = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) return JSON.parse(userStr);
    
    // Return guest user if in guest mode
    if (auth.isGuest()) {
      return {
        id: "guest",
        email: "guest@speechix.com",
        role: "user",
        credits: 100,
        usedCredits: 0,
        plan: "Guest",
      };
    }
    
    return null;
  },

  setAuth: (token: string, user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(GUEST_KEY); // Clear guest mode
  },

  clearAuth: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_KEY);
  },

  isAuthenticated: (): boolean => {
    return auth.getToken() !== null || auth.isGuest();
  },

  isGuest: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(GUEST_KEY) === "true";
  },

  setGuest: (): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_KEY, "true");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.role === "admin";
  },
};

