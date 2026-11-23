// src/services/legacyDoctorAuth.ts
// خدمة مستقلة لتجربة تسجيل دخول الطبيب على الباك القديم الخاص بالدكتور

// عدّلي هذا الرابط حسب عنوان السيرفر الذي يشغّل راوتر الدكتور
// ملاحظة: على Android Emulator استخدمي http://10.0.2.2:<PORT>/api/doctors
// وعلى جهاز حقيقي استخدمي IP جهازك على نفس الشبكة مثل http://192.168.1.X:<PORT>/api/doctors
export const LEGACY_DOCTOR_API_BASE_URL = "http://192.168.1.10:5000/api/doctors";

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
  // 1. نحدد وين موجود كائن الطبيب داخل الاستجابة
  const doctorObj =
    payload?.data?.doctor ||
    payload?.doctor ||
    payload?.data?.user ||
    payload?.user ||
    payload?.data ||
    payload ||
    {};

  // 2. نلتقط التوكن إذا كان موجوداً بأي مسمى شائع
  const token =
    payload?.token ||
    payload?.data?.token ||
    payload?.accessToken ||
    payload?.data?.accessToken;

  // 3. نحول السعر بأمان إلى رقم
  const rawPrice = doctorObj?.price;
  const parsedPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : rawPrice !== undefined && rawPrice !== null && rawPrice !== ""
      ? Number(rawPrice)
      : 0;

  // 4. نبني الكائن الموحّد للطبيب
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
  const response = await fetch(`${LEGACY_DOCTOR_API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phone.trim(), password }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error || "Unable to sign in. Please try again."
    );
  }

  return normalizeDoctorPayload(payload);
}