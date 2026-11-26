const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export const TOKEN_KEY = "salonbook_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const token = auth ? getToken() : null;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    cache: "no-store",
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | (T & { message?: string; success?: boolean })
    | null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}.`);
  }
  if (!payload) throw new Error("The server returned an empty response.");
  return payload;
}

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("image", file);
  const result = await apiRequest<{ success: boolean; url: string; message: string }>("/api/uploads", {
    method: "POST",
    body: form,
    auth: false,
  });
  return result.url;
}
