import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colorPalette } from "../constants/colors";

interface Option {
  label: string;
  value: string | boolean;
}

interface AppRadioButtonProps {
  label?: string;
  options: Option[];
  selectedValue: string | boolean | null;
  onSelect: (value: any) => void;
  className?: string;
}

export default function AppRadioButton({
  label,
  options,
  selectedValue,
  onSelect,
  className = "",
}: AppRadioButtonProps) {
  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text className="text-sm font-semibold text-[#2A4D75] dark:text-slate-200 mb-2">
          {label}
        </Text>
      ) : null}

      <View className="flex-row gap-3">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.8}
              style={{
                backgroundColor: isSelected ? colorPalette.accentGold : "#FFFFFF",
                borderColor: isSelected ? colorPalette.accentGold : "#CBD5E1",
              }}
              className={`flex-1 py-3 px-4 rounded-xl border flex-row items-center justify-center gap-2 shadow-sm`}
            >
              <Text
                style={{ color: isSelected ? "#FFFFFF" : "#2A4D75" }}
                className="text-base font-bold"
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}