import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

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

      <AppCard color="bg-white dark:bg-[#1E2733]" className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 rounded-full bg-[#F6D28B]/50 items-center justify-center">
            <Ionicons name="medical" size={28} color={colorPalette.navyDark} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-[#2A4D75] dark:text-white">
              {doctorName}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-300">
              Veterinarian
            </Text>
          </View>
        </View>

        <View className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-300">
            Doctor ID
          </Text>
          <Text className="text-sm font-semibold text-[#2A4D75] dark:text-white mt-1">
            {externalDoctorId}
          </Text>
        </View>
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
