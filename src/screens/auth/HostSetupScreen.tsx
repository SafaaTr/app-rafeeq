import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import AppInput from "../../components/AppInput";
import AppRadioButton from "../../components/AppRadioButton";
import AppButton from "../../components/AppButton";

type Props = NativeStackScreenProps<AuthStackParamList, "HostSetup">;

export default function HostSetupScreen({ navigation }: Props) {
  const [placeType, setPlaceType] = useState<"home" | "barn">("home");
  const [address, setAddress] = useState("");
  const [acceptedPetType, setAcceptedPetType] = useState("Cats & small dogs");
  const [pricingType, setPricingType] = useState<"free" | "paid">("paid");
  const [dailyPrice, setDailyPrice] = useState("50000");
  const [foodCost, setFoodCost] = useState("10000");

  const handleFinish = () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please fill in all empty fields.");
      return;
    }
    Alert.alert("Success", "Host caregiver profile created successfully!");
  };

  return (
    <ScrollView className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]" contentContainerStyle={{ padding: 24 }}>
      <Text className="text-xs uppercase font-bold text-[#557FB3]">03 / 03 • HOST PROFILE</Text>
      <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-1">
        Make room for joy.
      </Text>
      <Text className="text-sm text-slate-600 mt-1 mb-6">Set up a safe place for someone’s best friend.</Text>

      <View className="gap-5">
        <AppRadioButton
          label="Housing space"
          options={[
            { label: "🏠  Home", value: "home" },
            { label: "🛖  Barn", value: "barn" },
          ]}
          selectedValue={placeType}
          onSelect={setPlaceType}
        />

        <AppInput label="Address" placeholder="e.g. Abu Rummaneh, Damascus" value={address} onChangeText={setAddress} color="bg-white" />

        <AppInput label="Pet types you can host" value={acceptedPetType} onChangeText={setAcceptedPetType} color="bg-white" />

        <AppRadioButton
          label="Your hosting rate"
          options={[
            { label: "Free", value: "free" },
            { label: "✓ Paid", value: "paid" },
          ]}
          selectedValue={pricingType}
          onSelect={setPricingType}
        />

        {pricingType === "paid" ? (
          <View className="flex-row gap-3">
            <AppInput
              label="Daily price - SYP"
              value={dailyPrice}
              onChangeText={setDailyPrice}
              keyboardType="numeric"
              className="flex-1"
              color="bg-white"
            />
            <AppInput
              label="Food / day - SYP"
              value={foodCost}
              onChangeText={setFoodCost}
              className="flex-1"
              color="bg-white"
            />
          </View>
        ) : null}

        <AppButton title="Become a host  ♡" onPress={handleFinish} color="bg-[#EAB642]" textColor="text-white" className="mt-4" />
      </View>
    </ScrollView>
  );
}