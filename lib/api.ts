import { auth, User, AuthResponse } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = auth.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge existing headers if they exist
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me: async (): Promise<User> => {
    return request<User>("/auth/me");
  },
};

// TTS API
export interface TTSRequest {
  text: string;
  voiceId?: string;
  language?: string;
}

export interface TTSResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  audioUrl?: string;
  error?: string;
}

export interface TTSHistoryItem {
  id: string;
  text: string;
  voiceId: string;
  status: string;
  audioUrl?: string;
  createdAt: string;
}

export const ttsAPI = {
  submit: async (data: TTSRequest): Promise<TTSResponse> => {
    return request<TTSResponse>("/tts/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  status: async (id: string): Promise<TTSResponse> => {
    return request<TTSResponse>(`/tts/status?id=${id}`);
  },

  cancel: async (id: string): Promise<void> => {
    return request<void>("/tts/cancel", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  history: async (): Promise<TTSHistoryItem[]> => {
    return request<TTSHistoryItem[]>("/tts/history");
  },
};

// Voices API
export interface Voice {
  id: string;
  name: string;
  audioUrl?: string;
  createdAt: string;
}

export const voicesAPI = {
  upload: async (file: File): Promise<Voice> => {
    const formData = new FormData();
    formData.append("file", file);
    const token = auth.getToken();
    const response = await fetch(`${API_BASE}/voices/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    return response.json();
  },

  list: async (): Promise<Voice[]> => {
    return request<Voice[]>("/voices/list");
  },
};

// Admin API
export interface AdminUser extends User {
  createdAt: string;
}

export interface UpdateSubscriptionRequest {
  userId: string;
  credits?: number;
  subscriptionExpiry?: string;
  status?: "active" | "disabled";
}

export const adminAPI = {
  getUsers: async (): Promise<AdminUser[]> => {
    return request<AdminUser[]>("/admin/users");
  },

  getUser: async (id: string): Promise<AdminUser> => {
    return request<AdminUser>(`/admin/user?id=${id}`);
  },

  updateSubscription: async (
    data: UpdateSubscriptionRequest
  ): Promise<AdminUser> => {
    return request<AdminUser>("/admin/update-subscription", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

