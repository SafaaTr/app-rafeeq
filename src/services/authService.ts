export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  // اربط هنا طلبك الحقيقي (مثلاً Axios أو fetch)
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!email.trim() || !password.trim()) {
    throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
  }

  return {
    id: "1",
    name: "مستخدم التطبيق",
    email,
    token: "sample-token",
  };
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  // اربط هنا طلبك الحقيقي (مثلاً Axios أو fetch)
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error("يرجى تعبئة جميع الحقول المطلوبة");
  }

  return {
    id: "2",
    name,
    email,
    token: "sample-new-token",
  };
}