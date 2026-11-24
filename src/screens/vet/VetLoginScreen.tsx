import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import {
  loginLegacyDoctor,
  LegacyDoctorLoginResult,
} from "../../services/legacyDoctorAuth";
import { colorPalette } from "../../constants/colors";

interface VetLoginScreenProps {
  onLoginSuccess?: (result: LegacyDoctorLoginResult) => void;
}

export default function VetLoginScreen({ onLoginSuccess }: VetLoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<string>("");

  const handleLogin = async () => {
    setErrorMsg("");
    setSuccessInfo("");

    // التحقق الأساسي من إدخال رقم الهاتف وكلمة المرور
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone.trim()) || password.length < 8) {
      setErrorMsg("Invalid name or password. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const result = await loginLegacyDoctor(phone, password);
      setSuccessInfo(`Welcome, ${result.doctor.name}`);
      onLoginSuccess?.(result);
    } catch (err: any) {
      setErrorMsg(err?.message || "Invalid name or password. Please re-enter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-6">
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          VETERINARIAN ACCESS
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-1">
          Doctor Sign In
        </Text>
        <Text className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Sign in with your phone number and password.
        </Text>
      </View>

      <View className="bg-[#F6D28B]/35 p-4 rounded-2xl flex-row items-center gap-3 mb-6 border border-[#EAB642]">
        <Ionicons name="medkit-outline" size={26} color={colorPalette.navyDark} />
        <Text className="text-sm font-bold text-[#2A4D75] flex-1">
          Manage your appointments, schedule, and clinic profile.
        </Text>
      </View>

      <View className="gap-4">
        <AppInput
          label="Phone number"
          placeholder="09XXXXXXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
          color="bg-white dark:bg-slate-800"
          borderColor="border-slate-300 dark:border-slate-700"
          textColor="text-[#2A4D75] dark:text-white"
        />

        <AppInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightAccessory={(
            <TouchableOpacity
              onPress={() => setShowPassword((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              className="h-10 w-8 items-center justify-center"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          )}
          color="bg-white dark:bg-slate-800"
          borderColor="border-slate-300 dark:border-slate-700"
          textColor="text-[#2A4D75] dark:text-white"
          error={errorMsg || undefined}
        />

        {successInfo ? (
          <View className="p-3 rounded-xl bg-emerald-100 border border-emerald-300">
            <Text className="text-xs font-bold text-emerald-800">
              {successInfo}
            </Text>
          </View>
        ) : null}

        <AppButton
          title="Log In"
          onPress={handleLogin}
          loading={loading}
          color="bg-[#EAB642]"
          textColor="text-white"
          className="mt-2"
        />
      </View>
    </ScrollView>
  );
}