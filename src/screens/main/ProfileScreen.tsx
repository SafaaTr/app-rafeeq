import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

interface PetData {
  referenceCode: string;
  petType: string;
  age: number;
  lastVetVisitDate: string;
  vaccinationRecordUrl: string;
  photoUrl: string;
}

interface ProfileScreenProps {
  ownerName?: string;
  phone?: string;
  onLogout: () => void;
}

const INITIAL_PET: PetData = {
  referenceCode: "PET-409128",
  petType: "Cat",
  age: 2,
  lastVetVisitDate: "15-10-2026",
  vaccinationRecordUrl: "luna-vaccination-record.pdf",
  photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
};

export default function ProfileScreen({
  ownerName = "Maya Haddad",
  phone = "0944123456",
  onLogout,
}: ProfileScreenProps) {
  const [pet, setPet] = useState<PetData>(INITIAL_PET);
  const [isEditingPet, setIsEditingPet] = useState(false);

  const [petTypeInput, setPetTypeInput] = useState(pet.petType);
  const [ageInput, setAgeInput] = useState(String(pet.age));
  const [lastVetVisitInput, setLastVetVisitInput] = useState(
    pet.lastVetVisitDate
  );
  const [vaccinationPdfInput, setVaccinationPdfInput] = useState(
    pet.vaccinationRecordUrl
  );
  const [photoUrlInput, setPhotoUrlInput] = useState(pet.photoUrl);

  const [petFeedback, setPetFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSavePet = () => {
    setPetFeedback(null);
    const parsedAge = Number(ageInput.trim());

    if (
      !petTypeInput.trim() ||
      !ageInput.trim() ||
      Number.isNaN(parsedAge) ||
      parsedAge < 0 ||
      !lastVetVisitInput.trim() ||
      !vaccinationPdfInput.trim() ||
      !photoUrlInput.trim()
    ) {
      setPetFeedback({
        type: "error",
        text: "Please fill in all fields.",
      });
      return;
    }

    setPet((prev) => ({
      ...prev,
      petType: petTypeInput.trim(),
      age: parsedAge,
      lastVetVisitDate: lastVetVisitInput.trim(),
      vaccinationRecordUrl: vaccinationPdfInput.trim(),
      photoUrl: photoUrlInput.trim(),
    }));
    setIsEditingPet(false);
    setPetFeedback({
      type: "success",
      text: "Your profile has been updated.",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 95 }}
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          PET OWNER ACCOUNT
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Profile
        </Text>
      </View>

      {petFeedback ? (
        <View
          className={`px-3.5 py-2.5 rounded-xl border ${
            petFeedback.type === "error"
              ? "bg-red-100 border-red-300"
              : "bg-emerald-100 border-emerald-300"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              petFeedback.type === "error" ? "text-red-800" : "text-emerald-800"
            }`}
          >
            {petFeedback.text}
          </Text>
        </View>
      ) : null}

      {/* Owner basic details */}
      <AppCard
        color="bg-white dark:bg-[#1E2733]"
        className="gap-2 border border-slate-200 dark:border-slate-700"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-2xl bg-[#E4EAF1] dark:bg-slate-800 items-center justify-center">
            <Ionicons name="person" size={22} color={colorPalette.navyDark} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
              {ownerName}
            </Text>
            <Text className="text-xs text-slate-500">{phone}</Text>
          </View>
        </View>
      </AppCard>

      {/* Pet profile */}
      <AppCard
        color="bg-white dark:bg-[#1E2733]"
        className="gap-3 border border-slate-200 dark:border-slate-700"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="paw" size={20} color={colorPalette.navyDark} />
            <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
              Pet Profile
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setPetFeedback(null);
              setIsEditingPet((prev) => !prev);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#E4EAF1]"
          >
            <Text className="text-xs font-bold text-[#2A4D75]">
              {isEditingPet ? "Cancel" : "Edit Pet"}
            </Text>
          </TouchableOpacity>
        </View>

        {!isEditingPet ? (
          <View className="gap-1.5 pt-1">
            <Text className="text-xs font-bold text-[#557FB3]">
              Reference Code: {pet.referenceCode}
            </Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">
              Pet Type: <Text className="font-bold">{pet.petType}</Text>
            </Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">
              Age: <Text className="font-bold">{pet.age}</Text>
            </Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">
              Last Vet Visit:{" "}
              <Text className="font-bold">{pet.lastVetVisitDate}</Text>
            </Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">
              Vaccination Record (PDF):{" "}
              <Text className="font-bold">{pet.vaccinationRecordUrl}</Text>
            </Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">
              Photo URL: <Text className="font-bold">{pet.photoUrl}</Text>
            </Text>
          </View>
        ) : (
          <View className="gap-2.5 pt-1">
            <TextInput
              value={petTypeInput}
              onChangeText={setPetTypeInput}
              placeholder="Pet type (e.g. Cat, Dog)"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={ageInput}
              onChangeText={setAgeInput}
              placeholder="Age (numeric)"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={lastVetVisitInput}
              onChangeText={setLastVetVisitInput}
              placeholder="Last vet visit date (DD-MM-YYYY)"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={vaccinationPdfInput}
              onChangeText={setVaccinationPdfInput}
              placeholder="Vaccination record PDF URL"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={photoUrlInput}
              onChangeText={setPhotoUrlInput}
              placeholder="Pet photo URL"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />

            <TouchableOpacity
              onPress={handleSavePet}
              className="py-2.5 rounded-xl bg-[#EAB642] items-center"
            >
              <Text className="text-xs font-extrabold text-white">Save Pet</Text>
            </TouchableOpacity>
          </View>
        )}
      </AppCard>

      {/* Logout confirmation flow */}
      {!showLogoutConfirm ? (
        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          activeOpacity={0.85}
          className="mt-1 py-3.5 rounded-2xl bg-[#2A4D75] items-center flex-row justify-center gap-2"
        >
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text className="text-sm font-bold text-white">Log Out</Text>
        </TouchableOpacity>
      ) : (
        <AppCard
          color="bg-white dark:bg-[#1E2733]"
          className="gap-3 border border-slate-200 dark:border-slate-700"
        >
          <Text className="text-sm font-bold text-[#2A4D75] dark:text-white">
            Are you sure you want to logout?
          </Text>
          <View className="flex-row gap-2.5">
            <TouchableOpacity
              onPress={() => setShowLogoutConfirm(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-300 items-center"
            >
              <Text className="text-xs font-bold text-[#2A4D75]">No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogout}
              className="flex-1 py-2.5 rounded-xl bg-[#2A4D75] items-center"
            >
              <Text className="text-xs font-bold text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </AppCard>
      )}
    </ScrollView>
  );
}