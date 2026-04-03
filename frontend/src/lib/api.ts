const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export type User = {
  id: number;
  full_name: string;
  email: string;
  auth_provider: string;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "detail" in data && typeof data.detail === "string"
        ? data.detail
        : "Something went wrong";
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  signup: (payload: { full_name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    request<User>("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
