import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/auth/SplashScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import AddPetScreen from "../screens/auth/AddPetScreen";
import HostSetupScreen from "../screens/auth/HostSetupScreen";
import LoginScreen from "../screens/auth/LoginScreen";

export type AuthStackParamList = {
  Splash: undefined;
  Register: undefined;
  Onboarding: { name?: string; phone?: string; password?: string };
  AddPet: {
    hasPet?: boolean;
    canHost?: boolean;
    name?: string;
    phone?: string;
    password?: string;
  };
  HostSetup: { hasPet?: boolean; canHost?: boolean; petData?: any };
  Login: undefined;
  MainApp: {
    hasPet?: boolean;
    canHost?: boolean;
    name?: string;
    phone?: string;
    password?: string;
    petData?: {
      petType: string;
      age: number;
      petName: string;
      lastVetVisitDate: string;
      vaccinationRecordUrl: string | null;
    };
    user?: { name: string; phone: string };
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="HostSetup" component={HostSetupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}