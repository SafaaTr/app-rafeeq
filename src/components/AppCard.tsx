import React from "react";
import {
  View,
  TouchableOpacity,
  ViewProps,
  TouchableOpacityProps,
} from "react-native";

interface AppCardProps extends Omit<ViewProps, "className"> {
  children: React.ReactNode;
  onPress?: TouchableOpacityProps["onPress"];
  color?: string; // لون خلفية البطاقة (Hex أو class مثل bg-white)
  borderColor?: string; // لون الحدود (Hex أو class مثل border-slate-200)
  className?: string;
}

export default function AppCard({
  children,
  onPress,
  color,
  borderColor,
  className = "",
  style,
  ...rest
}: AppCardProps) {
  const bgClass = color?.startsWith("bg-") ? color : "";
  const bgStyle =
    color && !color.startsWith("bg-") ? { backgroundColor: color } : undefined;

  const bdrClass = borderColor?.startsWith("border-") ? borderColor : "";
  const bdrStyle =
    borderColor && !borderColor.startsWith("border-")
      ? { borderColor }
      : undefined;

  const baseClass = `w-full p-4 rounded-2xl ${bgClass} ${bdrClass} ${className}`;
  const combinedStyle = [bgStyle, bdrStyle, style];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={combinedStyle}
        className={baseClass}
        {...(rest as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={combinedStyle} className={baseClass} {...rest}>
      {children}
    </View>
  );
}