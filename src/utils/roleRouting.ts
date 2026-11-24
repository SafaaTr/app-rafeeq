export type AppRole = "pet_owner" | "vet" | "host";

export interface ResolvedRoleConfig {
  isValid: boolean;
  role: AppRole | null;
  initialMainTab: "Doctors" | "Stores" | "Care" | "Bookings" | "Profile";
  initialVetScreen: "VetSchedule" | "VetBookings" | "VetProfile";
  initialHostScreen: "HostBookings" | "HostProfile";
}

function normalizeSingleRole(raw: unknown): AppRole | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().toLowerCase();

  if (
    cleaned === "host" ||
    cleaned === "host_caregiver" ||
    cleaned === "caregiver" ||
    cleaned === "pet_host"
  ) {
    return "host";
  }

  if (
    cleaned === "vet" ||
    cleaned === "veterinarian" ||
    cleaned === "doctor"
  ) {
    return "vet";
  }

  if (
    cleaned === "pet_owner" ||
    cleaned === "owner" ||
    cleaned === "user" ||
    cleaned === "customer"
  ) {
    return "pet_owner";
  }

  return null;
}

export function resolveAppRole(payload?: any): ResolvedRoleConfig {
  const defaultInvalid: ResolvedRoleConfig = {
    isValid: false,
    role: null,
    initialMainTab: "Doctors",
    initialVetScreen: "VetSchedule",
    initialHostScreen: "HostBookings",
  };

  if (!payload) return defaultInvalid;

  const candidateUser =
    payload?.user ?? payload?.data?.user ?? payload?.data ?? payload;

  const candidates: unknown[] = [
    ...(Array.isArray(candidateUser?.roles) ? candidateUser.roles : []),
    ...(Array.isArray(payload?.roles) ? payload.roles : []),
    candidateUser?.role,
    payload?.role,
  ];


  const mappedRoles = candidates
    .map(normalizeSingleRole)
    .filter((r): r is AppRole => r !== null);

  if (mappedRoles.length === 0) {
    return defaultInvalid;
  }

  const resolvedRole: AppRole = mappedRoles.includes("host")
    ? "host"
    : mappedRoles.includes("vet")
    ? "vet"
    : mappedRoles[0];

  return {
    isValid: true,
    role: resolvedRole,
    initialMainTab: "Doctors",
    initialVetScreen: "VetSchedule",
    initialHostScreen: "HostBookings",
  };
}