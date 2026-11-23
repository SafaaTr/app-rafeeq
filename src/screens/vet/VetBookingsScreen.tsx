import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

export interface VetBookingRequest {
  id: string;
  doctorId: string;
  referenceCode: string;
  customerName: string;
  petSummary: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentTime: string;
  slotStatus: "available" | "booked";
  status: "pending" | "approved" | "rejected";
}

const INITIAL_VET_BOOKINGS: VetBookingRequest[] = [
  {
    id: "vb_1",
    doctorId: "vet_101",
    referenceCode: "VET-739104",
    customerName: "Maya Haddad",
    petSummary: "Luna • Cat • 2 yrs",
    appointmentDate: "2026-11-24",
    appointmentDay: "Tue",
    appointmentTime: "10:00",
    slotStatus: "available",
    status: "pending",
  },
  {
    id: "vb_2",
    doctorId: "vet_101",
    referenceCode: "VET-618290",
    customerName: "Omar Al-Khatib",
    petSummary: "Rocky • Dog • 4 yrs",
    appointmentDate: "2026-11-25",
    appointmentDay: "Wed",
    appointmentTime: "11:30",
    slotStatus: "booked",
    status: "approved",
  },
];

export default function VetBookingsScreen({
  externalDoctorId = "vet_101",
}: {
  externalDoctorId?: string;
}) {
  const [bookings, setBookings] =
    useState<VetBookingRequest[]>(INITIAL_VET_BOOKINGS);

  const doctorBookings = bookings.filter(
    (b) => b.doctorId === externalDoctorId
  );

  const handleDecision = (id: string, decision: "approved" | "rejected") => {
    setBookings((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: decision,
          slotStatus: decision === "approved" ? "booked" : "available",
        };
      })
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 45 }}
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          WEEKLY CALENDAR & REQUESTS
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          My Appointments
        </Text>
      </View>

      {doctorBookings.map((booking) => (
        <AppCard
          key={booking.id}
          color="bg-white dark:bg-[#1E2733]"
          className="gap-3 border border-slate-200 dark:border-slate-700"
        >
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
                {booking.petSummary}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5">
                Owner: {booking.customerName} • #{booking.referenceCode}
              </Text>
              <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                {booking.appointmentDay} • {booking.appointmentDate} •{" "}
                {booking.appointmentTime}
              </Text>
            </View>

            <View
              className={`px-2.5 py-1 rounded-full ${
                booking.status === "approved"
                  ? "bg-emerald-100"
                  : booking.status === "rejected"
                  ? "bg-red-100"
                  : "bg-[#F6D28B]/50"
              }`}
            >
              <Text className="text-[11px] font-bold text-[#2A4D75] capitalize">
                {booking.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-1">
            <Text className="text-xs font-bold text-[#557FB3]">
              Slot status: {booking.slotStatus}
            </Text>

            {booking.status === "pending" ? (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleDecision(booking.id, "rejected")}
                  className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 flex-row items-center gap-1"
                >
                  <Ionicons
                    name="close"
                    size={16}
                    color={colorPalette.navyDark}
                  />
                  <Text className="text-xs font-bold text-[#2A4D75]">
                    Reject
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDecision(booking.id, "approved")}
                  className="px-3.5 py-2 rounded-xl bg-[#EAB642] flex-row items-center gap-1"
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text className="text-xs font-bold text-white">Confirm</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </AppCard>
      ))}
    </ScrollView>
  );
}