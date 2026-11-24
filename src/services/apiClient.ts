// src/services/apiClient.ts


export const USE_MOCK = false;


export const API_BASE_URL = "http://192.168.10.78:3001/api/v1"; 

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// ط°ط§ظƒط±ط© ظ…ط¤ظ‚طھط© ظ„ظ„طھظˆظƒظ†
let currentAuthToken: string | null = null;

export function setClientToken(token: string | null) {
  currentAuthToken = token;
}

export function getClientToken(): string | null {
  return currentAuthToken;
}

/**
 * ط¯ط§ظ„ط© ط¬ظ„ط¨ ظ…ظˆط­ط¯ط© طھطھط¹ط§ظ…ظ„ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ظ…ط¹ ط§ظ„ظ€ Mock ط£ظˆ ط§ظ„ظ€ Real NestJS Backend
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<T>
): Promise<T> {
  if (USE_MOCK && mockFallback) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockFallback();
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(currentAuthToken ? { Authorization: "Be" + "arer " + currentAuthToken } : {}),
    ...(options.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Server is taking too long to respond. Please try again.");
    }
    throw new Error("Cannot connect to the server. Check your network and API address.");
  } finally {
    clearTimeout(timeout);
  }

  let resData: any;
  try {
    resData = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  // طھط؛ط·ظٹط© ط§ط³طھط¬ط§ط¨ط§طھ NestJS ط§ظ„ظ…طھظ†ظˆط¹ط© (Standard & Wrapped)
  if (!response.ok) {
    const errorMsg = Array.isArray(resData?.message)
      ? resData.message.join(", ")
      : resData?.message || "Invalid request. Please try again.";
    throw new Error(errorMsg);
  }

  // ط¥ط°ط§ ظƒط§ظ† ط§ظ„ط¨ط§ظƒ ط¥ظ†ط¯ ظٹط؛ظ„ظپ ط§ظ„ط§ط³طھط¬ط§ط¨ط© ط¨ظ€ { success: true, data: ... }
  if (resData && typeof resData === "object" && "data" in resData && "success" in resData) {
    return resData.data;
  }

  return resData as T;
}
