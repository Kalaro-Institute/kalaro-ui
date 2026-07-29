const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const REFRESH_TOKEN_KEY = "kalaro_rt";

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}
export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Access token lives only in memory — wiped on page refresh, restored via refresh token
let _accessToken: string | null = null;
export function getAccessToken(): string | null {
  return _accessToken;
}
export function setAccessToken(token: string): void {
  _accessToken = token;
}
export function clearAccessToken(): void {
  _accessToken = null;
}

export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

function parseError(body: unknown): Pick<ApiError, "message" | "fieldErrors"> {
  if (typeof body !== "object" || body === null) {
    return { message: "An unexpected error occurred." };
  }

  const b = body as Record<string, unknown>;

  const envelope = (b.error ?? b) as Record<string, unknown>;

  const topMessage =
    typeof envelope.message === "string" ? envelope.message : null;

  if (Array.isArray(envelope.details) && envelope.details.length > 0) {
    const fieldErrors: Record<string, string[]> = {};

    for (const err of envelope.details as Array<{
      loc: string[];
      msg: string;
      type: string;
    }>) {
      // loc is ["body", "payload", "field_name"] — we want the last element
      const field = err.loc?.[err.loc.length - 1] ?? "non_field";
      if (!fieldErrors[field]) fieldErrors[field] = [];
      // Use msg if present, otherwise fall back to a readable type label
      fieldErrors[field].push(err.msg ?? err.type ?? "Invalid value.");
    }

    const firstMsg =
      (envelope.details as Array<{ msg?: string }>)[0]?.msg ??
      topMessage ??
      "Validation error.";

    return { message: firstMsg, fieldErrors };
  }

  if (topMessage) return { message: topMessage };

  if (typeof b.detail === "string") return { message: b.detail };
  if (Array.isArray(b.detail)) {
    const first = (b.detail as Array<{ msg: string }>)[0];
    return { message: first?.msg ?? "Request failed." };
  }

  return { message: "An unexpected error occurred." };
}

let _isRefreshing = false;
let _queue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  if (_isRefreshing) {
    return new Promise((resolve) => {
      _queue.push(resolve);
    });
  }

  _isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearAccessToken();
      clearRefreshToken();
      _queue.forEach((cb) => cb(null));
      _queue = [];
      return null;
    }

    const data = (await res.json()) as { access: string };
    setAccessToken(data.access);
    _queue.forEach((cb) => cb(data.access));
    _queue = [];
    return data.access;
  } finally {
    _isRefreshing = false;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth = false, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string> | undefined),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const exec = async (overrideToken?: string): Promise<Response> => {
    if (overrideToken) headers["Authorization"] = `Bearer ${overrideToken}`;
    return fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await exec();

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await exec(newToken);
    } else {
      clearAccessToken();
      clearRefreshToken();
      window.location.href = "/login";
      throw {
        status: 401,
        message: "Session expired. Please log in again.",
      } as ApiError;
    }
  }

  if (!res.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
    } catch {
      /* empty */
    }
    const { message, fieldErrors } = parseError(errorBody);
    throw { status: res.status, message, fieldErrors } as ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      const retry = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (!retry.ok) {
        let errorBody: unknown = null;
        try {
          errorBody = await retry.json();
        } catch {
          /* empty */
        }
        const { message, fieldErrors } = parseError(errorBody);
        throw { status: retry.status, message, fieldErrors } as ApiError;
      }
      return retry.json() as Promise<T>;
    } else {
      clearAccessToken();
      clearRefreshToken();
      window.location.href = "/login";
      throw { status: 401, message: "Session expired." } as ApiError;
    }
  }

  if (!res.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
    } catch {
      /* empty */
    }
    const { message, fieldErrors } = parseError(errorBody);
    throw { status: res.status, message, fieldErrors } as ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}