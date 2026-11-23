import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

export interface HostBookingItem {
  id: string;
  referenceCode: string;
  ownerName: string;
  petSummary: string;
  dateRange: string;
  foodNotes: string;
  totalPrice: number;
  status: "pending" | "approved" | "rejected";
  isStayCompleted: boolean;
  canRate: boolean;
  myRating?: number;
}

const INITIAL_HOST_BOOKINGS: HostBookingItem[] = [
  {
    id: "hb_1",
    referenceCode: "540921-HST",
    ownerName: "Nour Al-Ahmad",
    petSummary: "Luna • Cat • 2 yrs",
    dateRange: "25-11-2026 – 28-11-2026",
    foodNotes: "Dry food twice a day, fresh water always.",
    totalPrice: 75000,
    status: "pending",
    isStayCompleted: false,
    canRate: false,
  },
  {
    id: "hb_2",
    referenceCode: "318472-HST",
    ownerName: "Tarek Mansour",
    petSummary: "Max • Dog • 3 yrs",
    dateRange: "05-11-2026 – 08-11-2026",
    foodNotes: "Chicken & rice evening meal, no sweets.",
    totalPrice: 112000,
    status: "approved",
    isStayCompleted: true,
    canRate: true,
  },
];

export default function HostBookingsScreen({
  hostName = "Salma Darwish",
}: {
  hostName?: string;
}) {
  const [bookings, setBookings] =
    useState<HostBookingItem[]>(INITIAL_HOST_BOOKINGS);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleConfirmBooking = (id: string) => {
    setFeedbackMsg(null);
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item
      )
    );
    setActiveTab("approved");
  };

  const handleSubmitOwnerRating = (bookingId: string) => {
    setFeedbackMsg(null);

    if (selectedStars < 1 || selectedStars > 5) {
      setFeedbackMsg({
        type: "error",
        text: "Please select a rating.",
      });
      return;
    }

    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId
          ? { ...item, canRate: false, myRating: selectedStars }
          : item
      )
    );

    setRatingBookingId(null);
    setSelectedStars(0);
    setComment("");
    setFeedbackMsg({
      type: "success",
      text: "Thank you for your rating.",
    });
  };

  const visibleBookings = bookings.filter((b) =>
    activeTab === "pending" ? b.status === "pending" : b.status === "approved"
  );
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const approvedCount = bookings.filter((b) => b.status === "approved").length;

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 45 }}
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          HOST CAREGIVER • {hostName}
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Bookings
        </Text>
      </View>

      {feedbackMsg ? (
        <View
          className={`px-3.5 py-2.5 rounded-xl border ${
            feedbackMsg.type === "error"
              ? "bg-red-100 border-red-300"
              : "bg-emerald-100 border-emerald-300"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              feedbackMsg.type === "error" ? "text-red-800" : "text-emerald-800"
            }`}
          >
            {feedbackMsg.text}
          </Text>
        </View>
      ) : null}

      <View className="flex-row gap-2.5 bg-white/70 dark:bg-[#1E2733] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          activeOpacity={0.85}
          className={`flex-1 py-2.5 rounded-xl items-center ${
            activeTab === "pending" ? "bg-[#EAB642]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-extrabold ${
              activeTab === "pending"
                ? "text-white"
                : "text-[#2A4D75] dark:text-slate-200"
            }`}
          >
            Pending ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("approved")}
          activeOpacity={0.85}
          className={`flex-1 py-2.5 rounded-xl items-center ${
            activeTab === "approved" ? "bg-[#2A4D75]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-extrabold ${
              activeTab === "approved"
                ? "text-white"
                : "text-[#2A4D75] dark:text-slate-200"
            }`}
          >
            Confirmed ({approvedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {visibleBookings.length === 0 ? (
        <AppCard
          color="bg-white dark:bg-[#1E2733]"
          className="items-center py-8 gap-2"
        >
          <Ionicons
            name={
              activeTab === "approved"
                ? "checkmark-done-circle-outline"
                : "time-outline"
            }
            size={30}
            color={colorPalette.softBlue}
          />
          <Text className="text-sm font-bold text-[#2A4D75] dark:text-white">
            {activeTab === "approved"
              ? "No confirmed bookings yet"
              : "No pending bookings right now"}
          </Text>
        </AppCard>
      ) : (
        visibleBookings.map((item) => {
          const isRatingOpen = ratingBookingId === item.id;
          return (
            <AppCard
              key={item.id}
              color="bg-white dark:bg-[#1E2733]"
              className="gap-3 border border-slate-200 dark:border-slate-700"
            >
              <View className="flex-row justify-between items-start gap-2">
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
                    {item.petSummary}
                  </Text>
                  <Text className="text-xs text-slate-500 mt-0.5">
                    Owner: {item.ownerName} • #{item.referenceCode}
                  </Text>
                  <Text className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Dates: {item.dateRange}
                  </Text>
                  <Text className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Food notes: {item.foodNotes}
                  </Text>
                </View>

                <View
                  className={`px-2.5 py-1 rounded-full ${
                    item.status === "approved"
                      ? "bg-emerald-100"
                      : "bg-[#F6D28B]/50"
                  }`}
                >
                  <Text className="text-[11px] font-bold text-[#2A4D75] capitalize">
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-1">
                <Text className="text-sm font-extrabold text-[#557FB3]">
                  {item.totalPrice.toLocaleString()} SYP
                </Text>

                {item.status === "pending" ? (
                  <TouchableOpacity
                    onPress={() => handleConfirmBooking(item.id)}
                    className="px-4 py-2 rounded-xl bg-[#EAB642] flex-row items-center gap-1"
                  >
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <Text className="text-xs font-bold text-white">Confirm</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {item.status === "approved" && item.isStayCompleted ? (
                <View className="pt-2 border-t border-slate-100 dark:border-slate-700 gap-2">
                  {item.canRate ? (
                    <TouchableOpacity
                      onPress={() => {
                        setRatingBookingId(isRatingOpen ? null : item.id);
                        setSelectedStars(0);
                        setComment("");
                        setFeedbackMsg(null);
                      }}
                      className="py-2 rounded-xl bg-[#EAB642] items-center"
                    >
                      <Text className="text-xs font-extrabold text-white">
                        {isRatingOpen ? "Close Rating" : "Rate Owner"}
                      </Text>
                    </TouchableOpacity>
                  ) : typeof item.myRating === "number" ? (
                    <Text className="text-xs font-bold text-[#557FB3]">
                      Owner rating: {item.myRating} / 5
                    </Text>
                  ) : null}

                  {isRatingOpen ? (
                    <View className="gap-2 pt-1">
                      <View className="flex-row gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setSelectedStars(star)}
                            className={`px-3 py-1.5 rounded-xl border ${
                              selectedStars >= star
                                ? "bg-[#EAB642] border-[#EAB642]"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold ${
                                selectedStars >= star
                                  ? "text-white"
                                  : "text-[#2A4D75]"
                              }`}
                            >
                              {star}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TextInput
                        value={comment}
                        onChangeText={(txt) => setComment(txt.slice(0, 300))}
                        placeholder="Optional comment (up to 300 chars)"
                        placeholderTextColor="#94A3B8"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2A4D75]"
                      />

                      <TouchableOpacity
                        onPress={() => handleSubmitOwnerRating(item.id)}
                        className="py-2.5 rounded-xl bg-[#2A4D75] items-center"
                      >
                        <Text className="text-xs font-bold text-white">
                          Submit Rating
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </AppCard>
          );
        })
      )}
    </ScrollView>
  );
}