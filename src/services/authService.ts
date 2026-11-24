import { fetchApi, setClientToken } from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  roles: string[];
  token: string;
  location?: string;
  avatarUrl?: string;
  pet?: {
    id?: string;
    petId?: string;
    referenceCode?: string;
  };
}

function extractAuthPayload(result: any) {
  const payload = result?.data ?? result ?? {};
  const token =
    payload?.accessToken ||
    payload?.access_token ||
    payload?.token ||
    result?.accessToken ||
    result?.access_token ||
    result?.token ||
    "";

  const userObj = payload?.user ?? result?.user ?? payload ?? {};
  const roles =
    Array.isArray(userObj?.roles) && userObj.roles.length > 0
      ? userObj.roles
      : Array.isArray(payload?.roles) && payload.roles.length > 0
      ? payload.roles
      : userObj?.role
      ? [userObj.role]
      : ["pet_owner"];

  return { token, userObj, roles };
}

export async function loginRequest(
  phone: string,
  password: string
): Promise<AuthUser> {
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();

  if (!trimmedPhone || !trimmedPassword) {
    throw new Error("Please fill in all fields.");
  }

const result = await fetchApi<any>(
  "/auth/login",
  {
    method: "POST",
    body: JSON.stringify({
      phone: trimmedPhone,
      password: trimmedPassword,
    }),
  },
  async () => ({
    id: "mock_1",
    name: trimmedPhone,
    phone: trimmedPhone,
    roles: ["pet_owner"],
    token: "mock_jwt_token",
  })
);

  const { token, userObj, roles } = extractAuthPayload(result);

  if (token) {
    setClientToken(token);
  }

  return {
    id: userObj?.id || "1",
    name: userObj?.name || userObj?.phone || trimmedPhone,
    phone: userObj?.phone || trimmedPhone,
    roles,
    token,
  };
}

export async function updateOwnerProfile(payload: {
  name: string;
  phone: string;
  location?: string;
  avatarUrl?: string;
}): Promise<AuthUser> {
  const result = await fetchApi<any>(
    "/auth/profile",
    { method: "PATCH", body: JSON.stringify(payload) },
    async () => ({
      id: "1",
      name: payload.name,
      phone: payload.phone,
      location: payload.location,
      avatarUrl: payload.avatarUrl,
      roles: ["pet_owner"],
      token: "",
    })
  );

  const { token, userObj, roles } = extractAuthPayload(result);
  return {
    id: userObj?.id || "1",
    name: userObj?.name || payload.name,
    phone: userObj?.phone || payload.phone,
    location: userObj?.location || payload.location,
    avatarUrl: userObj?.avatarUrl || payload.avatarUrl,
    roles,
    token,
  };
}

export async function registerRequest(
  name: string,
  phone: string,
  password: string,
  confirmPassword?: string
): Promise<AuthUser> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirm = (confirmPassword ?? password).trim();

  if (!trimmedName || !trimmedPhone || !trimmedPassword || !trimmedConfirm) {
    throw new Error("Please fill in all fields.");
  }

  const result = await fetchApi<any>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        name: trimmedName,
        phone: trimmedPhone,
        password: trimmedPassword,
        confirmPassword: trimmedConfirm,
        roles: ["pet_owner"],
      }),
    },
    async () => ({
      id: "mock_2",
      name: trimmedName,
      phone: trimmedPhone,
      roles: ["pet_owner"],
      token: "mock_registered_token",
    })
  );

  const { token, userObj, roles } = extractAuthPayload(result);

  if (token) {
    setClientToken(token);
  }

  return {
    id: userObj?.id || "2",
    name: userObj?.name || trimmedName,
    phone: userObj?.phone || trimmedPhone,
    roles,
    token,
  };
}