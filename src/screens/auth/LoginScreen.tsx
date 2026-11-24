import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../components/AppButton";
import AppCard from "../../components/AppCard";
import { useAuth } from "../../context/AuthContext";

interface LoginScreenProps {
  navigation: {
    navigate: (routeName: string, params?: any) => void;
  };
}

const SYRIAN_PHONE_REGEX = /^09\d{8}$/;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    setErrorMessage("");

    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedPhone || !trimmedPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (!SYRIAN_PHONE_REGEX.test(trimmedPhone)) {
      setErrorMessage("Please enter a valid 10-digit phone number (09XXXXXXXX).");
      return;
    }

    try {
      const user = await login(trimmedPhone, trimmedPassword);

      const roles =
        Array.isArray(user?.roles) && user.roles.length > 0
          ? user.roles
          : ["pet_owner"];

      navigation.navigate("MainApp", {
        user,
        roles,
        role: roles[0],
      });
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Invalid phone number or password. Please re-enter."
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
          value={phone}
          onChangeText={(txt) => {
            setPhone(txt);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Phone Number (09XXXXXXXX)"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          maxLength={10}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75] dark:text-white dark:bg-slate-800"
        />

        <View className="relative justify-center">
          <TextInput
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            className="bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-12 py-2 text-xs text-[#2A4D75] dark:text-white dark:bg-slate-800"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 h-10 w-8 items-center justify-center"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        <AppButton
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
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