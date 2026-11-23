import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";

export interface VetSlotItem {
  slotId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  day: string; // Mon, Tue, ...
  time: string; // HH:mm (24h)
  status: "available" | "booked";
}

interface VetScheduleScreenProps {
  externalDoctorId?: string;
  doctorName?: string;
}

const INITIAL_SLOTS: VetSlotItem[] = [
  {
    slotId: "slot_1",
    doctorId: "vet_101",
    date: "2026-11-24",
    day: "Tue",
    time: "10:00",
    status: "available",
  },
  {
    slotId: "slot_2",
    doctorId: "vet_101",
    date: "2026-11-24",
    day: "Tue",
    time: "14:00",
    status: "booked",
  },
];

export default function VetScheduleScreen({
  externalDoctorId = "vet_101",
  doctorName = "Dr. Leen Khalil",
}: VetScheduleScreenProps) {
  const [slots, setSlots] = useState<VetSlotItem[]>(INITIAL_SLOTS);
  const [dateInput, setDateInput] = useState("2026-11-25");
  const [dayInput, setDayInput] = useState("Wed");
  const [timeInput, setTimeInput] = useState("11:30");
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const doctorSlots = slots.filter((s) => s.doctorId === externalDoctorId);

  const handleAddSlot = () => {
    setFeedback(null);

    if (!dateInput.trim() || !dayInput.trim() || !timeInput.trim()) {
      setFeedback({
        type: "error",
        text: "Please fill in all fields.",
      });
      return;
    }

    const newSlot: VetSlotItem = {
      slotId: `slot_${Date.now()}`,
      doctorId: externalDoctorId,
      date: dateInput.trim(),
      day: dayInput.trim(),
      time: timeInput.trim(),
      status: "available",
    };

    setSlots((prev) => [newSlot, ...prev]);
    setTimeInput("");
    setFeedback({
      type: "success",
      text: "Available slot added to your schedule.",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 45 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          VETERINARIAN • {doctorName}
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Add Appointments
        </Text>
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
        <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
          New Available Slot
        </Text>

        <TextInput
          value={dateInput}
          onChangeText={setDateInput}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TextInput
          value={dayInput}
          onChangeText={setDayInput}
          placeholder="Day (e.g. Mon, Tue, Wed)"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TextInput
          value={timeInput}
          onChangeText={setTimeInput}
          placeholder="Time (HH:mm, 24h format)"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2A4D75]"
        />

        <TouchableOpacity
          onPress={handleAddSlot}
          className="py-3 rounded-xl bg-[#EAB642] items-center mt-1"
        >
          <Text className="text-xs font-extrabold text-white">Add Slot</Text>
        </TouchableOpacity>
      </AppCard>

      <AppCard
        color="bg-white dark:bg-[#1E2733]"
        className="gap-2.5 border border-slate-200 dark:border-slate-700"
      >
        <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
          Scheduled Slots
        </Text>

        {doctorSlots.map((slot) => (
          <View
            key={slot.slotId}
            className="flex-row items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <View className="flex-row items-center gap-2.5">
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colorPalette.navyDark}
              />
              <Text className="text-xs font-bold text-[#2A4D75] dark:text-white">
                {slot.day} • {slot.date} • {slot.time}
              </Text>
            </View>

            <View
              className={`px-2.5 py-1 rounded-full ${
                slot.status === "available"
                  ? "bg-emerald-100"
                  : "bg-[#F6D28B]/50"
              }`}
            >
              <Text className="text-[11px] font-bold text-[#2A4D75] capitalize">
                {slot.status}
              </Text>
            </View>
          </View>
        ))}
      </AppCard>
    </ScrollView>
  );
}