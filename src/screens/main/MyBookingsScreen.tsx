import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";
import { submitRating } from "../../services/rafeeqService";

export interface OwnerBookingItem {
  id: string;
  referenceCode: string;
  title: string;
  subtitle: string;
  dateTime: string;
  price: number;
  kind: "doctor" | "host";
  status: "pending" | "approved" | "rejected";
  isServiceCompleted: boolean;
  canRate: boolean;
  myRating?: number;
}

const INITIAL_OWNER_BOOKINGS: OwnerBookingItem[] = [
  {
    id: "ob_1",
    referenceCode: "VET-482910",
    title: "Dr. Leen Khalil",
    subtitle: "Luna • Paws Care Clinic",
    dateTime: "24-11-2026 • 11:00",
    price: 35000,
    kind: "doctor",
    status: "pending",
    isServiceCompleted: false,
    canRate: false,
  },
  {
    id: "ob_2",
    referenceCode: "918273-HST",
    title: "Salma Darwish",
    subtitle: "Luna • Al-Malki",
    dateTime: "10-11-2026 – 12-11-2026",
    price: 50000,
    kind: "host",
    status: "approved",
    isServiceCompleted: true,
    canRate: true,
  },
];

export default function MyBookingsScreen() {
  const [bookings, setBookings] =
    useState<OwnerBookingItem[]>(INITIAL_OWNER_BOOKINGS);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const visibleBookings = bookings.filter((b) =>
    activeTab === "pending" ? b.status === "pending" : b.status === "approved"
  );

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const approvedCount = bookings.filter((b) => b.status === "approved").length;

  const handleSubmitRating = async (bookingId: string) => {
    setFeedbackMsg(null);

    if (selectedStars < 1 || selectedStars > 5) {
      setFeedbackMsg({
        type: "error",
        text: "Please select a rating.",
      });
      return;
    }

    const booking = bookings.find((item) => item.id === bookingId);
    setRatingLoading(true);
    try {
      await submitRating({
        bookingId,
        bookingType: booking?.kind === "doctor" ? "vet_booking" : "host_booking",
        rating: selectedStars,
        comment: comment.trim(),
      });
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
    } catch (error: any) {
      setFeedbackMsg({
        type: "error",
        text: error?.message || "Could not submit your rating.",
      });
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 95 }}
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          APPOINTMENTS & HOSTING
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          My Bookings
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
        visibleBookings.map((booking) => {
          const isRatingOpen = ratingBookingId === booking.id;
          return (
            <AppCard
              key={booking.id}
              color="bg-white dark:bg-[#1E2733]"
              className="gap-2.5 border border-slate-200 dark:border-slate-700"
            >
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-row items-center gap-2.5 flex-1">
                  <View className="w-10 h-10 rounded-2xl bg-[#E4EAF1] dark:bg-slate-800 items-center justify-center">
                    <Ionicons
                      name={booking.kind === "doctor" ? "medkit" : "home"}
                      size={20}
                      color={colorPalette.navyDark}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
                      {booking.title}
                    </Text>
                    <Text className="text-xs text-slate-500 mt-0.5">
                      {booking.subtitle} • #{booking.referenceCode}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-2.5 py-1 rounded-full ${
                    booking.status === "approved"
                      ? "bg-emerald-100"
                      : "bg-[#F6D28B]/50"
                  }`}
                >
                  <Text className="text-[11px] font-bold text-[#2A4D75] capitalize">
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-1">
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {booking.dateTime}
                </Text>
                <Text className="text-sm font-extrabold text-[#557FB3]">
                  {booking.price.toLocaleString()} SYP
                </Text>
              </View>

              {booking.status === "approved" && booking.isServiceCompleted ? (
                <View className="pt-2 border-t border-slate-100 dark:border-slate-700 gap-2">
                  {booking.canRate ? (
                    <TouchableOpacity
                      onPress={() => {
                        setRatingBookingId(isRatingOpen ? null : booking.id);
                        setSelectedStars(0);
                        setComment("");
                        setFeedbackMsg(null);
                      }}
                      className="py-2 rounded-xl bg-[#EAB642] items-center"
                    >
                      <Text className="text-xs font-extrabold text-white">
                        {isRatingOpen ? "Close Rating" : "Rate"}
                      </Text>
                    </TouchableOpacity>
                  ) : typeof booking.myRating === "number" ? (
                    <Text className="text-xs font-bold text-[#557FB3]">
                      Your rating: {booking.myRating} / 5
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
                        onPress={() => void handleSubmitRating(booking.id)}
                        disabled={ratingLoading}
                        className={`py-2.5 rounded-xl items-center ${ratingLoading ? "bg-slate-400" : "bg-[#2A4D75]"}`}
                      >
                        <Text className="text-xs font-bold text-white">
                          {ratingLoading ? "Submitting..." : "Submit Rating"}
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