const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_BASE_URL = API_URL.replace(/\/+$/, "");

export interface AuthResponse {
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: {
    id?: number;
    username?: string;
    role?: string;
  };
  message?: string;
}

type ApiOptions = RequestInit & {
  token?: string;
};

function getErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object" || !("message" in data)) {
    return undefined;
  }

  const message = data.message;
  if (Array.isArray(message)) {
    return message.map(String).join(", ");
  }

  return typeof message === "string" ? message : undefined;
}

async function request<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`,
      {
        ...requestOptions,
        headers: requestHeaders,
      }
    );
  } catch {
    throw new Error(
      "Cannot connect to backend. Check your API URL or server."
    );
  }

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(
      `Invalid API response. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data) || `Request failed: ${response.status}`
    );
  }

  return data as T;
}

export async function registerUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getCurrentUser(token: string): Promise<AuthResponse> {
  return request<AuthResponse>("auth/profile", {
    method: "GET",
    token,
  });
}

