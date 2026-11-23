import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import AppRadioButton from "../../components/AppRadioButton";
import AppButton from "../../components/AppButton";
import AppCard from "../../components/AppCard";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

export default function OnboardingScreen({ navigation, route }: Props) {
  const [hasPet, setHasPet] = useState<boolean | null>(null);
  const [canHost, setCanHost] = useState<boolean | null>(null);

  const isBothNo = hasPet === false && canHost === false;

  const handleNext = () => {
    if (hasPet === null || canHost === null || isBothNo) return;

    if (hasPet) {
      // إذا يملك حيوان (سواء يستضيف أم لا) يتجه لإدخال الحيوان أولاً
      navigation.navigate("AddPet", { ...route.params, hasPet, canHost });
    } else if (canHost) {
      // يملك فقط قدرة استضافة
      navigation.navigate("HostSetup", { ...route.params, hasPet: false, canHost: true });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 24, flexGrow: 1 }}
    >
      <Text className="text-xs uppercase font-bold text-[#557FB3]">01 / 03 • YOUR RAFEEQ</Text>
      <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-1">
        Better, together.
      </Text>
      <Text className="text-sm text-slate-600 mt-1 mb-6">
        Tell us how you’d like to be part of the pack.
      </Text>

      <View className="gap-6">
        {/* السؤال الأول */}
        <AppCard color="bg-white dark:bg-slate-800" className="gap-3 border border-slate-200">
          <View className="flex-row items-center gap-2">
            <Ionicons name="paw-outline" size={24} color="#2A4D75" />
            <Text className="text-lg font-bold text-[#2A4D75] dark:text-white">Own a pet?</Text>
          </View>
          <Text className="text-xs text-slate-500">Find everyday essentials and trusted care.</Text>
          <AppRadioButton
            options={[
              { label: "✕   No", value: false },
              { label: "✓   Yes", value: true },
            ]}
            selectedValue={hasPet}
            onSelect={setHasPet}
          />
        </AppCard>

        {/* السؤال الثاني */}
        <AppCard color="bg-white dark:bg-slate-800" className="gap-3 border border-slate-200">
          <View className="flex-row items-center gap-2">
            <Ionicons name="home-outline" size={24} color="#2A4D75" />
            <Text className="text-lg font-bold text-[#2A4D75] dark:text-white">Host a pet?</Text>
          </View>
          <Text className="text-xs text-slate-500">Open your home to a new little friend.</Text>
          <AppRadioButton
            options={[
              { label: "✕   No", value: false },
              { label: "✓   Yes", value: true },
            ]}
            selectedValue={canHost}
            onSelect={setCanHost}
          />
        </AppCard>

        {/* تحذير عدم الأهلية عند إجابة No على السؤالين */}
        {isBothNo ? (
          <AppCard color="bg-[#F6D28B]/40" borderColor="border-[#EAB642]" className="gap-2">
            <Text className="text-sm font-bold text-[#2A4D75]">
              We need one At least Yes.
            </Text>
            <Text className="text-xs text-slate-700">
              Sorry, this application is not intended for you.
            </Text>
          </AppCard>
        ) : null}

        <AppButton
          title="Choose a role to continue  →"
          onPress={handleNext}
          disabled={hasPet === null || canHost === null || isBothNo}
          color="bg-[#EAB642]"
          textColor="text-white"
          className="mt-4"
        />
      </View>
    </ScrollView>
  );
}