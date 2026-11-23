import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import NavBar from "../components/NavBar";
import RafeeqBottomNav, { MainTabKey } from "../components/RafeeqBottomNav";
import { resolveAppRole, AppRole } from "../utils/roleRouting";

import SplashScreen from "../screens/auth/SplashScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import AddPetScreen from "../screens/auth/AddPetScreen";
import LoginScreen from "../screens/auth/LoginScreen";

import DoctorsScreen from "../screens/main/DoctorsScreen";
import StoresScreen from "../screens/main/StoresScreen";
import HostCaregiversScreen from "../screens/main/HostCaregiversScreen";
import MyBookingsScreen from "../screens/main/MyBookingsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

import VetScheduleScreen from "../screens/vet/VetScheduleScreen";
import VetBookingsScreen from "../screens/vet/VetBookingsScreen";
import VetProfileScreen from "../screens/vet/VetProfileScreen";

import HostBookingsScreen from "../screens/host/HostBookingsScreen";
import HostProfileScreen from "../screens/host/HostProfileScreen";

type AuthStage = "Splash" | "Register" | "Onboarding" | "AddPet" | "Login";

const INVALID_ROLE_MESSAGE = "Invalid name or password. Please re-enter.";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { setColorScheme } = useColorScheme();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("Splash");
  const [authParams, setAuthParams] = useState<any>({});
  const [sessionError, setSessionError] = useState<string>("");

  const [currentRole, setCurrentRole] = useState<AppRole>("pet_owner");
  const [activeTab, setActiveTab] = useState<MainTabKey>("Doctors");

  // Vet state
  const vetDoctorId = "vet_101";
  const vetDoctorName = "Dr. Leen Khalil";
  const [vetScreen, setVetScreen] = useState<
    "VetSchedule" | "VetBookings" | "VetProfile"
  >("VetSchedule");

  // Host state
  const hostName = "Salma Darwish";
  const [hostScreen, setHostScreen] = useState<"HostBookings" | "HostProfile">(
    "HostBookings"
  );

  useEffect(() => {
    setColorScheme("light");
  }, [setColorScheme]);

  const handleBackendSession = (backendPayload?: any) => {
    const config = resolveAppRole(backendPayload);

    if (!config.isValid || !config.role) {
      setIsAuthenticated(false);
      setSessionError(INVALID_ROLE_MESSAGE);
      return;
    }

    setSessionError("");
    setCurrentRole(config.role);
    setIsAuthenticated(true);

    if (config.role === "vet") {
      setVetScreen(config.initialVetScreen);
    } else if (config.role === "host") {
      setHostScreen(config.initialHostScreen);
    } else {
      setActiveTab(config.initialMainTab);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionError("");
    setCurrentRole("pet_owner");
    setAuthStage("Login");
  };

  const authNavAdapter: any = {
    navigate: (routeName: string, params?: any) => {
      const merged = params ? { ...authParams, ...params } : authParams;
      if (params) setAuthParams(merged);

      if (routeName === "MainApp") {
        handleBackendSession(merged);
        return;
      }
      setSessionError("");
      setAuthStage(routeName as AuthStage);
    },
    goBack: () => {
      setSessionError("");
      setAuthStage("Splash");
    },
  };

  const renderAuthFlow = () => {
    switch (authStage) {
      case "Splash":
        return (
          <SplashScreen
            navigation={authNavAdapter}
            route={{ key: "Splash", name: "Splash" }}
          />
        );
      case "Register":
        return <RegisterScreen navigation={authNavAdapter} />;
      case "Onboarding":
        return (
          <OnboardingScreen
            navigation={authNavAdapter}
            route={{
              key: "Onboarding",
              name: "Onboarding",
              params: authParams,
            }}
          />
        );
      case "AddPet":
        return (
          <AddPetScreen
            navigation={authNavAdapter}
            route={{ key: "AddPet", name: "AddPet", params: authParams }}
          />
        );
      case "Login":
        return <LoginScreen navigation={authNavAdapter} />;
      default:
        return (
          <SplashScreen
            navigation={authNavAdapter}
            route={{ key: "Splash", name: "Splash" }}
          />
        );
    }
  };

  const renderMainUserTabs = () => {
    switch (activeTab) {
      case "Doctors":
        return <DoctorsScreen />;
      case "Stores":
        return <StoresScreen />;
      case "Care":
        return <HostCaregiversScreen />;
      case "Bookings":
        return <MyBookingsScreen />;
      case "Profile":
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <DoctorsScreen />;
    }
  };

  const renderVetFlow = () => (
    <View className="flex-1">
      <View className="flex-row justify-center gap-2 px-4 pb-2">
        {(["VetSchedule", "VetBookings", "VetProfile"] as const).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setVetScreen(s)}
            className={`px-3 py-1.5 rounded-xl border ${
              vetScreen === s
                ? "bg-[#2A4D75] border-[#2A4D75]"
                : "bg-white border-slate-300"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                vetScreen === s ? "text-white" : "text-[#2A4D75]"
              }`}
            >
              {s === "VetSchedule"
                ? "Schedule"
                : s === "VetBookings"
                ? "Bookings"
                : "Profile"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1">
        {vetScreen === "VetSchedule" && (
          <VetScheduleScreen
            externalDoctorId={vetDoctorId}
            doctorName={vetDoctorName}
          />
        )}
        {vetScreen === "VetBookings" && (
          <VetBookingsScreen externalDoctorId={vetDoctorId} />
        )}
        {vetScreen === "VetProfile" && (
          <VetProfileScreen
            externalDoctorId={vetDoctorId}
            onLogout={handleLogout}
          />
        )}
      </View>
    </View>
  );

  const renderHostFlow = () => (
    <View className="flex-1">
      <View className="flex-row justify-center gap-2 px-4 pb-2">
        {(["HostBookings", "HostProfile"] as const).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setHostScreen(s)}
            className={`px-3 py-1.5 rounded-xl border ${
              hostScreen === s
                ? "bg-[#2A4D75] border-[#2A4D75]"
                : "bg-white border-slate-300"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                hostScreen === s ? "text-white" : "text-[#2A4D75]"
              }`}
            >
              {s === "HostBookings" ? "Bookings" : "Profile"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1">
        {hostScreen === "HostBookings" && (
          <HostBookingsScreen hostName={hostName} />
        )}
        {hostScreen === "HostProfile" && (
          <HostProfileScreen hostName={hostName} onLogout={handleLogout} />
        )}
      </View>
    </View>
  );

  const topSpacing = Math.max(insets.top, 20);
  const bottomSpacing = Math.max(insets.bottom, 10);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E4EAF1",
        paddingTop: topSpacing,
        paddingBottom: bottomSpacing,
      }}
    >
      <StatusBar style="dark" />
      <NavBar brandTitle="Rafeeq" />

      {/* Quick role simulator bar for local testing */}
      <View className="flex-row items-center justify-between px-5 py-1.5">
        <View className="flex-row gap-1.5">
          <TouchableOpacity
            onPress={() => handleBackendSession({ role: "pet_owner" })}
            className="px-2.5 py-1 rounded-lg bg-[#EAB642]"
          >
            <Text className="text-[10px] font-bold text-white">Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBackendSession({ role: "vet" })}
            className="px-2.5 py-1 rounded-lg bg-[#557FB3]"
          >
            <Text className="text-[10px] font-bold text-white">Vet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBackendSession({ role: "host" })}
            className="px-2.5 py-1 rounded-lg bg-[#2A4D75]"
          >
            <Text className="text-[10px] font-bold text-white">Host</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBackendSession({})}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-300"
          >
            <Text className="text-[10px] font-bold text-[#2A4D75]">No Role</Text>
          </TouchableOpacity>
        </View>
      </View>

      {sessionError ? (
        <View className="mx-5 mb-2 px-3.5 py-2 rounded-xl bg-red-100 border border-red-300">
          <Text className="text-xs font-bold text-red-800">{sessionError}</Text>
        </View>
      ) : null}

      <View className="flex-1">
        {!isAuthenticated
          ? renderAuthFlow()
          : currentRole === "vet"
          ? renderVetFlow()
          : currentRole === "host"
          ? renderHostFlow()
          : renderMainUserTabs()}
      </View>

      {isAuthenticated && currentRole === "pet_owner" ? (
        <RafeeqBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          canHost={false}
        />
      ) : null}
    </View>
  );
}