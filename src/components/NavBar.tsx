import React from "react";
import { View, Text } from "react-native";
import ThemeToggleButton from "./ThemeToggleButton";

interface NavBarProps {
  brandTitle?: string;
}

export default function NavBar({ brandTitle = "رفيق" }: NavBarProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-[#E4EAF1] dark:bg-[#121820] border-b border-slate-200/60 dark:border-slate-800">
      <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white tracking-wide">
        {brandTitle}
      </Text>
      <ThemeToggleButton />
    </View>
  );
}