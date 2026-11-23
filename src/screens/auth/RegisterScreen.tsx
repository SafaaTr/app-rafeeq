import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";

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
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegister = () => {
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (
      !trimmedName ||
      !trimmedPhone ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const isValidName = NAME_REGEX.test(trimmedName);
    const isValidPhone = PHONE_REGEX.test(trimmedPhone);
    const isValidPassword =
      password.length >= 8 && password === confirmPassword;

    if (!isValidName || !isValidPhone || !isValidPassword) {
      setErrorMessage(
        "Invalid name, password, or phone number. Please re-enter."
      );
      return;
    }

    navigation.navigate("MainApp", {
      role: "pet_owner",
      roles: ["pet_owner"],
      user: {
        name: trimmedName,
        phone: trimmedPhone,
        roles: ["pet_owner"],
      },
    });
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

        <TextInput
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Password (min 8 characters)"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TextInput
          value={confirmPassword}
          onChangeText={(txt) => {
            setConfirmPassword(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Confirm Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <AppButton
          title="Register"
          onPress={handleRegister}
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