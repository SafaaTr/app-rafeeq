import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colorPalette } from "../constants/colors";

export type MainTabKey =
  | "Doctors"
  | "Stores"
  | "Care"
  | "Bookings"
  | "Profile";

interface RafeeqBottomNavProps {
  activeTab: MainTabKey;
  onSelectTab: (tab: MainTabKey) => void;
  canHost?: boolean; // يحدد ظهور تبويب Care للمربي / الدور المزدوج
}

export default function RafeeqBottomNav({
  activeTab,
  onSelectTab,
  canHost = true,
}: RafeeqBottomNavProps) {
  const tabs: {
    key: MainTabKey;
    label: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
    show: boolean;
  }[] = [
    {
      key: "Doctors",
      label: "Doctors",
      activeIcon: "medkit",
      inactiveIcon: "medkit-outline",
      show: true,
    },
    {
      key: "Stores",
      label: "Stores",
      activeIcon: "bag-handle",
      inactiveIcon: "bag-handle-outline",
      show: true,
    },
    {
      key: "Care",
      label: "Care",
      activeIcon: "home",
      inactiveIcon: "home-outline",
      show: true,
    },
    {
      key: "Bookings",
      label: "Bookings",
      activeIcon: "calendar",
      inactiveIcon: "calendar-outline",
      show: true,
    },
    {
      key: "Profile",
      label: "Profile",
      activeIcon: "person",
      inactiveIcon: "person-outline",
      show: true,
    },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  return (
    <View
      style={{ backgroundColor: "#FBF9F5" }}
      className="flex-row items-center justify-around pt-3 pb-2 px-2 border-t border-slate-200/80 rounded-t-3xl"
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.8}
            className="items-center justify-center min-w-[60px] py-1"
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.inactiveIcon}
              size={22}
              color={colorPalette.navyDark}
            />
            <Text
              style={{
                color: colorPalette.navyDark,
                fontWeight: isActive ? "700" : "500",
              }}
              className="text-[11px] mt-1"
            >
              {tab.label}
            </Text>

            {/* الخط الأزرق الصغير أسفل التبويب النشط مثل التصميم */}
            <View
              style={{
                backgroundColor: isActive ? colorPalette.softBlue : "transparent",
              }}
              className="w-7 h-[3px] rounded-full mt-1.5"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}