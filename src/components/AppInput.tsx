import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface AppInputProps extends Omit<TextInputProps, "className"> {
  label?: string;
  error?: string;
  color?: string; // لون خلفية الحقل (Hex أو class مثل bg-white)
  textColor?: string; // لون النص (Hex أو class مثل text-slate-900)
  borderColor?: string; // لون الحدود (Hex أو class مثل border-slate-300)
  placeholderColor?: string; // لون الـ placeholder مباشرة للـ TextInput
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export default function AppInput({
  label,
  error,
  color,
  textColor,
  borderColor,
  placeholderColor = "#94A3B8",
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  style,
  ...rest
}: AppInputProps) {
  const bgClass = color?.startsWith("bg-") ? color : "";
  const bgStyle =
    color && !color.startsWith("bg-") ? { backgroundColor: color } : undefined;

  const txtClass = textColor?.startsWith("text-") ? textColor : "";
  const txtStyle =
    textColor && !textColor.startsWith("text-") ? { color: textColor } : undefined;

  const bdrClass = borderColor?.startsWith("border-") ? borderColor : "";
  const bdrStyle =
    borderColor && !borderColor.startsWith("border-")
      ? { borderColor }
      : undefined;

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text className={`text-sm font-medium mb-1.5 ${labelClassName}`}>
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={placeholderColor}
        style={[bgStyle, txtStyle, bdrStyle, style]}
        className={`w-full py-3 px-4 rounded-xl border text-base ${bgClass} ${txtClass} ${bdrClass} ${
          error ? "border-red-500" : ""
        } ${inputClassName}`}
        {...rest}
      />

      {error ? (
        <Text className={`text-xs text-red-500 mt-1 ${errorClassName}`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}