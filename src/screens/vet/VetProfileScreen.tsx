import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import {
  getVetAppointmentsAndProfile,
  updateVetProfileInfo,
  VetDoctorAccount,
} from "../../services/rafeeqService";

interface VetProfileScreenProps {
  externalDoctorId?: string;
  doctorName?: string;
  onLogout: () => void;
}

export default function VetProfileScreen({
  externalDoctorId = "vet_101",
  doctorName = "Dr. Leen Khalil",
  onLogout,
}: VetProfileScreenProps) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<VetDoctorAccount | null>(null);
  const [nameInput, setNameInput] = useState(doctorName);
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [clinicInput, setClinicInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getVetAppointmentsAndProfile(externalDoctorId)
      .then((result) => {
        if (cancelled) return;
        const doctor = result.doctor;
        setProfile(doctor);
        setNameInput(doctor.name);
        setPhoneInput(doctor.phone);
        setAddressInput(doctor.address);
        setClinicInput(doctor.clinicName || "");
        setPriceInput(doctor.consultationPrice ? String(doctor.consultationPrice) : "");
        setSpecializationInput(doctor.specialization || "");
        setBioInput(doctor.bio || "");
      })
      .catch((error: any) => {
        if (!cancelled) setFeedback({ type: "error", text: error?.message || "Could not load profile." });
      });
    return () => {
      cancelled = true;
    };
  }, [externalDoctorId]);

  const handleSave = async () => {
    setFeedback(null);
    const parsedPrice = Number(priceInput.trim());
    if (!nameInput.trim() || !phoneInput.trim() || !addressInput.trim()) {
      setFeedback({ type: "error", text: "Name, phone, and address are required." });
      return;
    }
    if (priceInput.trim() && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
      setFeedback({ type: "error", text: "Consultation price must be a valid number." });
      return;
    }

    setSaving(true);
    try {
      const updated = await updateVetProfileInfo({
        externalDoctorId,
        name: nameInput.trim(),
        phone: phoneInput.trim(),
        address: addressInput.trim(),
        clinicName: clinicInput.trim() || undefined,
        consultationPrice: priceInput.trim() ? parsedPrice : undefined,
        specialization: specializationInput.trim() || undefined,
        bio: bioInput.trim() || undefined,
      });
      setProfile(updated);
      setNameInput(updated.name);
      updateUser({ name: updated.name, phone: updated.phone });
      setIsEditing(false);
      setFeedback({ type: "success", text: "Profile updated successfully." });
    } catch (error: any) {
      setFeedback({ type: "error", text: error?.message || "Could not update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 45 }}
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          VETERINARIAN ACCOUNT
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Profile
        </Text>
      </View>

      {feedback ? (
        <View className={`px-3.5 py-2.5 rounded-xl border ${feedback.type === "error" ? "bg-red-100 border-red-300" : "bg-emerald-100 border-emerald-300"}`}>
          <Text className={`text-xs font-bold ${feedback.type === "error" ? "text-red-800" : "text-emerald-800"}`}>
            {feedback.text}
          </Text>
        </View>
      ) : null}

      <AppCard color="bg-white dark:bg-[#1E2733]" className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 rounded-full bg-[#F6D28B]/50 items-center justify-center">
            <Ionicons name="medical" size={28} color={colorPalette.navyDark} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-[#2A4D75] dark:text-white">
              {profile?.name || nameInput || doctorName}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-300">
              Veterinarian
            </Text>
          </View>
        </View>

        <View className="border-t border-slate-200 dark:border-slate-700 pt-3 gap-1">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-300">Doctor ID</Text>
          <Text className="text-sm font-semibold text-[#2A4D75] dark:text-white">{externalDoctorId}</Text>
          {profile?.clinicName ? <Text className="text-xs text-slate-600 dark:text-slate-300">Clinic: {profile.clinicName}</Text> : null}
          {profile?.address ? <Text className="text-xs text-slate-600 dark:text-slate-300">Address: {profile.address}</Text> : null}
          {typeof profile?.consultationPrice === "number" ? <Text className="text-xs text-slate-600 dark:text-slate-300">Consultation: {profile.consultationPrice.toLocaleString()} SYP</Text> : null}
        </View>

        <TouchableOpacity
          onPress={() => {
            setFeedback(null);
            setIsEditing((visible) => !visible);
          }}
          className="py-2.5 rounded-xl bg-[#2A4D75] items-center"
        >
          <Text className="text-xs font-bold text-white">{isEditing ? "Close Editor" : "Edit Profile"}</Text>
        </TouchableOpacity>

        {isEditing ? (
          <View className="gap-2.5 pt-1">
            <TextInput value={nameInput} onChangeText={setNameInput} placeholder="Name" placeholderTextColor="#94A3B8" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={phoneInput} onChangeText={setPhoneInput} placeholder="Phone" keyboardType="phone-pad" placeholderTextColor="#94A3B8" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={clinicInput} onChangeText={setClinicInput} placeholder="Clinic name" placeholderTextColor="#94A3B8" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={addressInput} onChangeText={setAddressInput} placeholder="Clinic address" placeholderTextColor="#94A3B8" multiline className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={specializationInput} onChangeText={setSpecializationInput} placeholder="Specialization" placeholderTextColor="#94A3B8" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={bioInput} onChangeText={setBioInput} placeholder="Professional bio" placeholderTextColor="#94A3B8" multiline numberOfLines={3} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TextInput value={priceInput} onChangeText={setPriceInput} placeholder="Consultation price" keyboardType="numeric" placeholderTextColor="#94A3B8" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#2A4D75]" />
            <TouchableOpacity onPress={() => void handleSave()} disabled={saving} className={`py-3 rounded-xl items-center ${saving ? "bg-slate-400" : "bg-[#EAB642]"}`}>
              <Text className="text-xs font-extrabold text-white">{saving ? "Saving..." : "Save Changes"}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </AppCard>

      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 dark:border-red-900 dark:bg-[#1E2733]"
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <Ionicons name="log-out-outline" size={18} color="#B91C1C" />
        <Text className="text-sm font-bold text-red-700 dark:text-red-300">
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
