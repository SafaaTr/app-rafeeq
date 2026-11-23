// src/services/apiClient.ts

// مفتاح للتحكم: true للعمل بالبيانات الوهمية محلياً، و false عند تشغيل NestJS
export const USE_MOCK = true;

export const API_BASE_URL = "http://10.0.2.2:4000/api/doctors"; // عنوان NestJS محلياً (Android Emulator)

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * دالة جلب موحدة تتعامل تلقائياً مع الـ Mock أو الـ Real NestJS Backend
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<T>
): Promise<T> {
  if (USE_MOCK && mockFallback) {
    // محاكاة تأخير الشبكة (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockFallback();
  }

  const token = ""; // يمكن جلبه من AsyncStorage مستقبلاً
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const resData: ApiResponse<T> = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Something went wrong");
  }

  return resData.data;
}