import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

type PlaceType = "home" | "barn";
type PricingType = "free" | "paid";

interface HostProfileData {
  name: string;
  phone: string;
  placeType: PlaceType;
  address: string;
  acceptedPetType: string;
  pricingType: PricingType;
  dailyPrice: number | null;
  foodCost: string;
  avgRating?: number;
  ratingsCount?: number;
}

const INITIAL_HOST_PROFILE: HostProfileData = {
  name: "Salma Darwish",
  phone: "0933456789",
  placeType: "home",
  address: "Al-Malki, Damascus",
  acceptedPetType: "Cats & Small Dogs",
  pricingType: "paid",
  dailyPrice: 25000,
  foodCost: "Not needed",
  avgRating: 4.8,
  ratingsCount: 12,
};

export default function HostProfileScreen({
  hostName,
  onLogout,
}: {
  hostName?: string;
  onLogout: () => void;
}) {
  const [profile, setProfile] = useState<HostProfileData>({
    ...INITIAL_HOST_PROFILE,
    name: hostName || INITIAL_HOST_PROFILE.name,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [phoneInput, setPhoneInput] = useState(profile.phone);
  const [placeTypeInput, setPlaceTypeInput] = useState<PlaceType>(
    profile.placeType
  );
  const [addressInput, setAddressInput] = useState(profile.address);
  const [acceptedPetInput, setAcceptedPetInput] = useState(
    profile.acceptedPetType
  );
  const [pricingTypeInput, setPricingTypeInput] = useState<PricingType>(
    profile.pricingType
  );
  const [dailyPriceInput, setDailyPriceInput] = useState(
    profile.dailyPrice ? String(profile.dailyPrice) : ""
  );
  const [foodCostInput, setFoodCostInput] = useState(profile.foodCost);

  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveProfile = () => {
    setFeedback(null);

    const trimmedName = nameInput.trim();
    const trimmedPhone = phoneInput.trim();
    const trimmedAddress = addressInput.trim();
    const trimmedAcceptedPet = acceptedPetInput.trim();
    const trimmedFoodCost = foodCostInput.trim();

    let parsedDailyPrice: number | null = null;
    if (pricingTypeInput === "paid") {
      const numericPrice = Number(dailyPriceInput.trim());
      if (
        !dailyPriceInput.trim() ||
        Number.isNaN(numericPrice) ||
        numericPrice <= 0
      ) {
        setFeedback({
          type: "error",
          text: "Please fill in all fields.",
        });
        return;
      }
      parsedDailyPrice = numericPrice;
    }

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedAddress ||
      !trimmedAcceptedPet ||
      !trimmedFoodCost
    ) {
      setFeedback({
        type: "error",
        text: "Please fill in all fields.",
      });
      return;
    }

    setProfile((prev) => ({
      ...prev,
      name: trimmedName,
      phone: trimmedPhone,
      placeType: placeTypeInput,
      address: trimmedAddress,
      acceptedPetType: trimmedAcceptedPet,
      pricingType: pricingTypeInput,
      dailyPrice: pricingTypeInput === "paid" ? parsedDailyPrice : null,
      foodCost: trimmedFoodCost,
    }));

    setIsEditing(false);
    setFeedback({
      type: "success",
      text: "Your profile has been updated.",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 45 }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs uppercase font-bold text-[#557FB3]">
            HOST CAREGIVER ACCOUNT
          </Text>
          <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
            Profile
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setFeedback(null);
            setIsEditing((prev) => !prev);
          }}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200"
        >
          <Text className="text-xs font-extrabold text-[#2A4D75]">
            {isEditing ? "Cancel" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      {feedback ? (
        <View
          className={`px-3.5 py-2.5 rounded-xl border ${
            feedback.type === "error"
              ? "bg-red-100 border-red-300"
              : "bg-emerald-100 border-emerald-300"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              feedback.type === "error" ? "text-red-800" : "text-emerald-800"
            }`}
          >
            {feedback.text}
          </Text>
        </View>
      ) : null}

      <AppCard
        color="bg-white dark:bg-[#1E2733]"
        className="gap-3 border border-slate-200 dark:border-slate-700"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-2xl bg-[#E4EAF1] dark:bg-slate-800 items-center justify-center">
            <Ionicons name="home" size={24} color={colorPalette.navyDark} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-[#2A4D75] dark:text-white">
              {profile.name}
            </Text>
            <Text className="text-xs font-bold text-[#557FB3]">
              {profile.ratingsCount && profile.ratingsCount > 0 && typeof profile.avgRating === "number"
                ? `${profile.avgRating.toFixed(1)} (${profile.ratingsCount})`
                : "No ratings yet"}
            </Text>
          </View>
        </View>

        {!isEditing ? (
          <View className="gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Phone: <Text className="font-bold text-[#2A4D75] dark:text-white">{profile.phone}</Text>
            </Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Place Type:{" "}
              <Text className="font-bold text-[#2A4D75] dark:text-white">
                {profile.placeType}
              </Text>
            </Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Address:{" "}
              <Text className="font-bold text-[#2A4D75] dark:text-white">
                {profile.address}
              </Text>
            </Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Accepted Pet Type:{" "}
              <Text className="font-bold text-[#2A4D75] dark:text-white">
                {profile.acceptedPetType}
              </Text>
            </Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Pricing Type:{" "}
              <Text className="font-bold text-[#2A4D75] dark:text-white">
                {profile.pricingType}
              </Text>
            </Text>
            {profile.pricingType === "paid" && typeof profile.dailyPrice === "number" ? (
              <Text className="text-xs text-slate-600 dark:text-slate-300">
                Daily Price:{" "}
                <Text className="font-bold text-[#557FB3]">
                  {profile.dailyPrice.toLocaleString()} SYP
                </Text>
              </Text>
            ) : null}
            <Text className="text-xs text-slate-600 dark:text-slate-300">
              Food Cost:{" "}
              <Text className="font-bold text-[#2A4D75] dark:text-white">
                {profile.foodCost}
              </Text>
            </Text>
          </View>
        ) : (
          <View className="gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Full name"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="Phone (09XXXXXXXX)"
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />

            <View className="flex-row gap-2">
              {(["home", "barn"] as const).map((pt) => (
                <TouchableOpacity
                  key={pt}
                  onPress={() => setPlaceTypeInput(pt)}
                  className={`flex-1 py-2 rounded-xl border items-center ${
                    placeTypeInput === pt
                      ? "bg-[#2A4D75] border-[#2A4D75]"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      placeTypeInput === pt ? "text-white" : "text-[#2A4D75]"
                    }`}
                  >
                    {pt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={addressInput}
              onChangeText={setAddressInput}
              placeholder="Address"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />
            <TextInput
              value={acceptedPetInput}
              onChangeText={setAcceptedPetInput}
              placeholder="Accepted pet type"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />

            <View className="flex-row gap-2">
              {(["free", "paid"] as const).map((pr) => (
                <TouchableOpacity
                  key={pr}
                  onPress={() => setPricingTypeInput(pr)}
                  className={`flex-1 py-2 rounded-xl border items-center ${
                    pricingTypeInput === pr
                      ? "bg-[#EAB642] border-[#EAB642]"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      pricingTypeInput === pr ? "text-white" : "text-[#2A4D75]"
                    }`}
                  >
                    {pr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {pricingTypeInput === "paid" ? (
              <TextInput
                value={dailyPriceInput}
                onChangeText={setDailyPriceInput}
                placeholder="Daily price (SYP)"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
              />
            ) : null}

            <TextInput
              value={foodCostInput}
              onChangeText={setFoodCostInput}
              placeholder="Food cost (number or Not needed)"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
            />

            <TouchableOpacity
              onPress={handleSaveProfile}
              className="py-2.5 rounded-xl bg-[#EAB642] items-center"
            >
              <Text className="text-xs font-extrabold text-white">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </AppCard>

      {!showLogoutConfirm ? (
        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          activeOpacity={0.85}
          className="mt-1 py-3.5 rounded-2xl bg-[#2A4D75] items-center flex-row justify-center gap-2"
        >
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text className="text-sm font-bold text-white">Log Out</Text>
        </TouchableOpacity>
      ) : (
        <AppCard
          color="bg-white dark:bg-[#1E2733]"
          className="gap-3 border border-slate-200 dark:border-slate-700"
        >
          <Text className="text-sm font-bold text-[#2A4D75] dark:text-white">
            Are you sure you want to logout?
          </Text>
          <View className="flex-row gap-2.5">
            <TouchableOpacity
              onPress={() => setShowLogoutConfirm(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-300 items-center"
            >
              <Text className="text-xs font-bold text-[#2A4D75]">No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogout}
              className="flex-1 py-2.5 rounded-xl bg-[#2A4D75] items-center"
            >
              <Text className="text-xs font-bold text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </AppCard>
      )}
    </ScrollView>
  );
}