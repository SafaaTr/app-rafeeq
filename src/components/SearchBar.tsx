import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colorPalette } from "../constants/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white dark:bg-[#1E2733] border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 gap-2.5">
      <Ionicons
        name="search-outline"
        size={20}
        color={colorPalette.softBlue}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        returnKeyType="search"
        clearButtonMode="never"
        className="flex-1 text-sm text-[#2A4D75] dark:text-white py-0"
      />

      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color="#94A3B8" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}