export type AppRole = "pet_owner" | "vet" | "host";

export type VetScreenKey = "VetSchedule" | "VetBookings" | "VetProfile";
export type HostScreenKey = "HostBookings" | "HostProfile";
export type MainTabKey = "Doctors" | "Stores" | "Care" | "Bookings" | "Profile";

export interface SessionRouteConfig {
  isValid: boolean;
  role: AppRole | null;
  initialMainTab: MainTabKey;
  initialVetScreen: VetScreenKey;
  initialHostScreen: HostScreenKey;
}

/**
 * Resolves application role strictly based on Version 1.2 technical specifications.
 * Roles map to: 'pet_owner', 'vet' (veterinarian), or 'host' (host_caregiver).
 * Invalid or missing roles return isValid: false.
 */
export function resolveAppRole(payload?: {
  role?: string;
  roles?: string[];
  user?: { role?: string; roles?: string[] };
  doctor?: { role?: string };
  host?: { role?: string };
}): SessionRouteConfig {
  const candidates: string[] = [];

  if (payload?.role) candidates.push(payload.role);
  if (Array.isArray(payload?.roles)) candidates.push(...payload.roles);
  if (payload?.user?.role) candidates.push(payload.user.role);
  if (Array.isArray(payload?.user?.roles)) candidates.push(...payload.user.roles);
  if (payload?.doctor?.role) candidates.push(payload.doctor.role);
  if (payload?.host?.role) candidates.push(payload.host.role);

  const normalized = candidates.map((r) => r.toLowerCase().trim());

  let resolvedRole: AppRole | null = null;

  if (
    normalized.some(
      (r) => r === "vet" || r === "doctor" || r === "veterinarian"
    )
  ) {
    resolvedRole = "vet";
  } else if (
    normalized.some(
      (r) => r === "host" || r === "caregiver" || r === "host_caregiver"
    )
  ) {
    resolvedRole = "host";
  } else if (
    normalized.some(
      (r) => r === "pet_owner" || r === "owner" || r === "user" || r === "customer"
    )
  ) {
    resolvedRole = "pet_owner";
  }

  // Strictly according to Spec 1.2 (Section 4.5): Unknown or missing role must fail login resolution
  if (!resolvedRole) {
    return {
      isValid: false,
      role: null,
      initialMainTab: "Doctors",
      initialVetScreen: "VetSchedule",
      initialHostScreen: "HostBookings",
    };
  }

  return {
    isValid: true,
    role: resolvedRole,
    initialMainTab: "Doctors",
    initialVetScreen: "VetSchedule",
    initialHostScreen: "HostBookings",
  };
}