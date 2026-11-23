import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function ThemeToggleButton() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleToggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <TouchableOpacity
      onPress={handleToggleTheme}
      activeOpacity={0.8}
      className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E2733] border border-slate-300 dark:border-slate-700"
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={15}
        color={isDark ? "#F6D28B" : "#2A4D75"}
      />
      <Text className="text-[11px] font-bold text-[#2A4D75] dark:text-slate-100">
        {isDark ? "Light" : "Dark"}
      </Text>
    </TouchableOpacity>
  );
}