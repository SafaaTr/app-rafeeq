import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface AppButtonProps extends Omit<TouchableOpacityProps, "className"> {
  title: string;
  onPress: () => void;
  color?: string; // لون خلفية (Hex أو class مثل bg-blue-600)
  textColor?: string; // لون نص (Hex أو class مثل text-white)
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export default function AppButton({
  title,
  onPress,
  color,
  textColor,
  loading = false,
  disabled = false,
  className = "",
  textClassName = "",
  style,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const bgClass = color?.startsWith("bg-") ? color : "";
  const bgStyle = color && !color.startsWith("bg-") ? { backgroundColor: color } : undefined;

  const txtClass = textColor?.startsWith("text-") ? textColor : "";
  const txtStyle =
    textColor && !textColor.startsWith("text-") ? { color: textColor } : undefined;

  const loaderColor =
    textColor && !textColor.startsWith("text-") ? textColor : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[bgStyle, style]}
      className={`py-3.5 px-5 rounded-xl flex-row items-center justify-center ${bgClass} ${
        isDisabled ? "opacity-50" : ""
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <Text style={txtStyle} className={`text-base font-semibold ${txtClass} ${textClassName}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}