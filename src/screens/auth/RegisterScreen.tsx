import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import { useAuth } from "../../context/AuthContext";

interface RegisterScreenProps {
  navigation: {
    navigate: (routeName: string, params?: any) => void;
    goBack?: () => void;
  };
}

const NAME_REGEX = /^[A-Za-z\u0600-\u06FF\s]+$/;
const PHONE_REGEX = /^09\d{8}$/;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { register, loading } = useAuth();

 const handleRegister = async () => {
  setErrorMessage("");

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirm = confirmPassword.trim();

  if (!trimmedName) {
    setErrorMessage("Name field is empty.");
    return;
  }
  if (!trimmedPhone) {
    setErrorMessage("Phone field is empty.");
    return;
  }
  if (!trimmedPassword) {
    setErrorMessage("Password field is empty.");
    return;
  }
  if (!trimmedConfirm) {
    setErrorMessage("Confirm Password field is empty.");
    return;
  }

  const isValidName = NAME_REGEX.test(trimmedName);
  const isValidPhone = PHONE_REGEX.test(trimmedPhone);
  const isValidPassword =
    trimmedPassword.length >= 8 && trimmedPassword === trimmedConfirm;

  if (!isValidName) {
    setErrorMessage("Invalid name format.");
    return;
  }
  if (!isValidPhone) {
    setErrorMessage("Phone must be 10 digits starting with 09.");
    return;
  }
  if (!isValidPassword) {
    setErrorMessage(
      "Password must be at least 8 characters and match Confirm Password."
    );
    return;
  }

  try {
    const createdUser: any = await register(
      trimmedName,
      trimmedPhone,
      trimmedPassword,
      trimmedConfirm
    );
    void createdUser;
    navigation.navigate("Login");
  } catch (err: any) {
    setErrorMessage(
      err?.message || "Could not create account. Please try again."
    );
  }
};
  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          PET OWNER REGISTRATION
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Create Account
        </Text>
      </View>

      {errorMessage ? (
        <View className="px-3.5 py-2.5 rounded-xl bg-red-100 border border-red-300">
          <Text className="text-xs font-bold text-red-800">{errorMessage}</Text>
        </View>
      ) : null}

      <AppCard
        color="bg-white dark:bg-[#1E2733]"
        className="gap-3 border border-slate-200 dark:border-slate-700"
      >
        <TextInput
          value={name}
          onChangeText={(txt) => {
            setName(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Name (Arabic or English)"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TextInput
          value={phone}
          onChangeText={(txt) => {
            setPhone(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Phone (09XXXXXXXX)"
          keyboardType="phone-pad"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <View className="relative justify-center">
          <TextInput
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Password (min 8 characters)"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            className="bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-[#2A4D75]"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 h-10 w-8 items-center justify-center"
          >
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View className="relative justify-center">
          <TextInput
            value={confirmPassword}
            onChangeText={(txt) => {
              setConfirmPassword(txt);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Confirm Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showConfirmPassword}
            className="bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-[#2A4D75]"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 h-10 w-8 items-center justify-center"
          >
            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <AppButton
          title={loading ? "Creating account..." : "Register"}
          onPress={handleRegister}
          disabled={loading}
          color="bg-[#EAB642]"
          textColor="text-white"
          className="mt-1"
        />
      </AppCard>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="items-center py-2"
      >
        <Text className="text-xs font-bold text-[#2A4D75] dark:text-slate-200">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}