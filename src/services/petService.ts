import { API_BASE_URL, getClientToken } from "./apiClient";

export { API_BASE_URL };

export interface CreatePetPayload {
  petType: string;
  age: number;
  lastVetVisitDate: string;
  vaccinationRecordUrl: string;
  photoUrl: string;
}

export async function savePetRequest(
  payload: CreatePetPayload,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token || getClientToken()) {
    headers.Authorization = "Bearer " + (token || getClientToken());
  }

  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || "Failed to save pet details on server.";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return data?.pet ?? data?.data ?? data;
}