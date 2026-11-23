import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggleButton from "./ThemeToggleButton";
import { colorPalette } from "../constants/colors";

export type AppScreenKey =
  | "Splash"
  | "Register"
  | "Onboarding"
  | "AddPet"
  | "HostSetup"
  | "Login"
  | "Doctors"
  | "Stores"
  | "HostCaregivers"
  | "MyBookings"
  | "Profile"
  | "VetLogin"
  | "VetBookings"
  | "VetSchedule"
  | "VetProfile";

interface DevScreenNavigatorProps {
  currentScreen: AppScreenKey;
  onSelectScreen: (screen: AppScreenKey) => void;
}

const SCREEN_GROUPS: {
  title: string;
  items: { key: AppScreenKey; label: string }[];
}[] = [
  {
    title: "Auth & Onboarding",
    items: [
      { key: "Splash", label: "01 • Splash" },
      { key: "Register", label: "02 • Register" },
      { key: "Onboarding", label: "03 • Onboarding" },
      { key: "AddPet", label: "04 • Add Pet" },
      { key: "HostSetup", label: "05 • Host Setup" },
      { key: "Login", label: "06 • Login" },
    ],
  },
  {
    title: "Pet Owner & Host App",
    items: [
      { key: "Doctors", label: "07 • Doctors & DayStrip" },
      { key: "Stores", label: "08 • Stores & Cart" },
      { key: "HostCaregivers", label: "09 • Host Caregivers" },
      { key: "MyBookings", label: "10 • My Bookings" },
      { key: "Profile", label: "11 • User Profile" },
    ],
  },
  {
    title: "Veterinarian Portal",
    items: [
      { key: "VetLogin", label: "Vet • Login" },
      { key: "VetBookings", label: "Vet • Appointments" },
      { key: "VetSchedule", label: "Vet • Weekly Schedule" },
      { key: "VetProfile", label: "Vet • Profile" },
    ],
  },
];

export default function DevScreenNavigator({
  currentScreen,
  onSelectScreen,
}: DevScreenNavigatorProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* شريط تنقل علوي بسيط وواضح للتجربة والانتقال */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white dark:bg-[#1E2733] border-b border-slate-200 dark:border-slate-700">
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.8}
          className="flex-row items-center gap-2 bg-[#EAB642] px-3 py-1.5 rounded-xl"
        >
          <Ionicons name="menu" size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-xs">Screens</Text>
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          className="text-xs font-extrabold text-[#2A4D75] dark:text-white flex-1 text-center mx-2"
        >
          {currentScreen}
        </Text>

        <ThemeToggleButton />
      </View>

      {/* قائمة اختيار أي شاشة */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#EFECE6] dark:bg-[#121820] rounded-t-3xl p-5 max-h-[82%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-extrabold text-[#2A4D75] dark:text-white">
                Rafeeq Screens Switcher
              </Text>
              <TouchableOpacity
                onPress={() => setMenuOpen(false)}
                className="p-1.5 rounded-full bg-white dark:bg-slate-800"
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={colorPalette.navyDark}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
              {SCREEN_GROUPS.map((group) => (
                <View key={group.title} className="gap-2">
                  <Text className="text-xs font-extrabold uppercase text-[#557FB3]">
                    {group.title}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {group.items.map((item) => {
                      const active = currentScreen === item.key;
                      return (
                        <TouchableOpacity
                          key={item.key}
                          onPress={() => {
                            onSelectScreen(item.key);
                            setMenuOpen(false);
                          }}
                          activeOpacity={0.8}
                          style={{
                            backgroundColor: active
                              ? colorPalette.navyDark
                              : "#FFFFFF",
                            borderColor: active
                              ? colorPalette.navyDark
                              : "#CBD5E1",
                          }}
                          className="px-3.5 py-2 rounded-xl border"
                        >
                          <Text
                            style={{
                              color: active ? "#FFFFFF" : "#2A4D75",
                            }}
                            className="text-xs font-bold"
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}