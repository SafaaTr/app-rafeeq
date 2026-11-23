import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";

interface LoginScreenProps {
  navigation: {
    navigate: (routeName: string, params?: any) => void;
  };
}

const INVALID_CREDENTIALS_MSG = "Invalid name or password. Please re-enter.";

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = () => {
    setErrorMessage("");

    const trimmedName = name.trim();
    if (!trimmedName || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Local authentication simulation according to v1.2 specifications
    const lowerName = trimmedName.toLowerCase();

    if (lowerName.includes("leen") || lowerName.includes("vet")) {
      navigation.navigate("MainApp", {
        role: "vet",
        roles: ["vet"],
        user: { name: trimmedName, roles: ["vet"] },
      });
      return;
    }

    if (lowerName.includes("salma") || lowerName.includes("host")) {
      navigation.navigate("MainApp", {
        role: "host",
        roles: ["host"],
        user: { name: trimmedName, roles: ["host"] },
      });
      return;
    }

    if (lowerName.includes("maya") || lowerName.includes("owner") || lowerName.includes("user")) {
      navigation.navigate("MainApp", {
        role: "pet_owner",
        roles: ["pet_owner"],
        user: { name: trimmedName, roles: ["pet_owner"] },
      });
      return;
    }

    // Default error handling for unknown users
    setErrorMessage(INVALID_CREDENTIALS_MSG);
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          WELCOME BACK
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Login
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
          placeholder="Name"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TextInput
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <AppButton
          title="Login"
          onPress={handleLogin}
          color="bg-[#2A4D75]"
          textColor="text-white"
          className="mt-1"
        />
      </AppCard>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        className="items-center py-2"
      >
        <Text className="text-xs font-bold text-[#2A4D75] dark:text-slate-200">
          Don&apos;t have an account? Register as Pet Owner
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}