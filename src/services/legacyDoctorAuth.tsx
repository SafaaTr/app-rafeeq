// src/services/legacyDoctorAuth.ts
// خدمة مستقلة لتجربة تسجيل دخول الطبيب على الباك القديم الخاص بالدكتور


export const LEGACY_DOCTOR_API_BASE_URL = "http://192.168.10.78:3001/api/doctors";

export interface LegacyDoctorUser {
  _id: string;
  name: string;
  phone: string;
  role: "vet";
  roles: ("vet")[];
  clinicName?: string;
  location?: string;
  price?: number;
  workingHours?: string;
  workingDays: string[];
  isActive: boolean;
  timeSlots: any[];
}

export interface LegacyDoctorLoginResult {
  doctor: LegacyDoctorUser;
  token?: string;
  raw: any;
}

function normalizeDoctorPayload(payload: any): LegacyDoctorLoginResult {
  const doctorObj =
    payload?.data?.doctor ||
    payload?.doctor ||
    payload?.data?.user ||
    payload?.user ||
    payload?.data ||
    payload ||
    {};

  const token =
    payload?.token ||
    payload?.data?.token ||
    payload?.accessToken ||
    payload?.data?.accessToken;

  const rawPrice = doctorObj?.price;
  const parsedPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : rawPrice !== undefined && rawPrice !== null && rawPrice !== ""
      ? Number(rawPrice)
      : 0;

  const normalizedDoctor: LegacyDoctorUser = {
    _id: String(doctorObj?._id ?? doctorObj?.id ?? ""),
    name: String(doctorObj?.name ?? doctorObj?.fullName ?? "Doctor").trim() || "Doctor",
    phone: String(doctorObj?.phone ?? "").trim(),
    role: "vet",
    roles: ["vet"],
    clinicName: doctorObj?.clinicName ? String(doctorObj.clinicName) : undefined,
    location: doctorObj?.location
      ? String(doctorObj.location)
      : doctorObj?.address
      ? String(doctorObj.address)
      : undefined,
    price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
    workingHours: doctorObj?.workingHours
      ? String(doctorObj.workingHours)
      : undefined,
    workingDays: Array.isArray(doctorObj?.workingDays)
      ? doctorObj.workingDays
      : [],
    isActive: doctorObj?.isActive !== false,
    timeSlots: Array.isArray(doctorObj?.timeSlots) ? doctorObj.timeSlots : [],
  };

  return {
    doctor: normalizedDoctor,
    token: token ? String(token) : undefined,
    raw: payload,
  };
}

export async function loginLegacyDoctor(
  phone: string,
  password: string
): Promise<LegacyDoctorLoginResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;
  try {
    response = await fetch(`${LEGACY_DOCTOR_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone.trim(), password }),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Server is taking too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let payload: any;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }
  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error || "Unable to sign in. Please try again."
    );
  }

  return normalizeDoctorPayload(payload);
}
