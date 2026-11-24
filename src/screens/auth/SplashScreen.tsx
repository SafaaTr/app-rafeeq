import React from "react";
import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import AppButton from "../../components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { colorPalette } from "../../constants/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  return (
    <View className="flex-1 justify-between p-6 bg-[#E4EAF1] dark:bg-[#121820]">
      <View className="flex-1 justify-center items-center">
        <View className="w-64 h-64 rounded-full bg-[#F6D28B]/50 justify-center items-center relative">
          <Ionicons name="paw" size={100} color={colorPalette.navyDark} />
        </View>

        <Text className="text-4xl font-extrabold text-[#2A4D75] dark:text-white mt-8 tracking-tight">
          Rafeeq
        </Text>
        <Text className="text-base text-[#557FB3] dark:text-slate-300 mt-2 text-center max-w-[250px]">
          A little care. A lifelong companion.
        </Text>
      </View>

      <View className="gap-3 mb-6">
        <AppButton
          title="Find your Rafeeq  →"
          onPress={() => navigation.navigate("Register")}
          color="bg-[#EAB642]"
          textColor="text-white"
        />
      </View>
    </View>
  );
}