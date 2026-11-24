import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../components/SearchBar";
import AppCard from "../../components/AppCard";
import { colorPalette } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import {
  bookVetAppointment,
  Doctor,
  ExternalSlotDto,
  getDoctors,
  getDoctorSlots,
} from "../../services/rafeeqService";

export interface SlotDto {
  slotId: string;
  date: string; // YYYY-MM-DD
  day: string; // Mon, Tue, ...
  time: string; // HH:mm (24h)
  status: "available" | "booked";
}

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  address: string;
  price: number;
  avgRating?: number;
  ratingsCount?: number;
  slots: SlotDto[];
}

function formatIsoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayShortLabel(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function isPastTimeForToday(isoDate: string, time24: string): boolean {
  const todayIso = formatIsoDate(0);
  if (isoDate !== todayIso) return false;

  const [hoursStr, minutesStr] = time24.split(":");
  const slotHours = Number(hoursStr);
  const slotMinutes = Number(minutesStr);
  if (Number.isNaN(slotHours) || Number.isNaN(slotMinutes)) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slotTotalMinutes = slotHours * 60 + slotMinutes;
  return slotTotalMinutes <= nowMinutes;
}

const d0 = formatIsoDate(0);
const d1 = formatIsoDate(1);
const d2 = formatIsoDate(2);
const d3 = formatIsoDate(3);
const d4 = formatIsoDate(4);
const d5 = formatIsoDate(5);
const MOCK_DOCTORS: DoctorItem[] = [
  {
    id: "doc_1",
    name: "Dr. Leen Khalil",
    specialty: "Internal Medicine & Vaccination",
    address: "Al-Malki, Damascus",
    price: 35000,
    avgRating: 4.8,
    ratingsCount: 19,
    slots: [
      { slotId: "s_0_a", date: d0, day: getDayShortLabel(0), time: "09:00", status: "available" },
      { slotId: "s_0_b", date: d0, day: getDayShortLabel(0), time: "23:30", status: "available" },
      { slotId: "s_1_a", date: d1, day: getDayShortLabel(1), time: "10:30", status: "available" },
      { slotId: "s_1_b", date: d1, day: getDayShortLabel(1), time: "14:00", status: "booked" },
      { slotId: "s_3_a", date: d3, day: getDayShortLabel(3), time: "11:00", status: "available" },
      { slotId: "s_5_a", date: d5, day: getDayShortLabel(5), time: "16:30", status: "available" },
    ],
  },
  {
    id: "doc_2",
    name: "Dr. Rami Al-Sayed",
    specialty: "Surgery & Dental Care",
    address: "Abu Rummaneh, Damascus",
    price: 45000,
    avgRating: undefined,
    ratingsCount: 0,
    slots: [
      { slotId: "s2_1_a", date: d1, day: getDayShortLabel(1), time: "12:00", status: "available" },
      { slotId: "s2_2_a", date: d2, day: getDayShortLabel(2), time: "15:00", status: "available" },
      { slotId: "s2_4_a", date: d4, day: getDayShortLabel(4), time: "13:30", status: "available" },
    ],
  },
];

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("doc_1");
  const [selectedDate, setSelectedDate] = useState<string>(d0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"error" | "success">("success");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorItem[]>(MOCK_DOCTORS);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const { user } = useAuth();

  const sevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, idx) => {
      const dateStr = formatIsoDate(idx);
      const dayTitle =
        idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : `${getDayShortLabel(idx)} ${dateStr.slice(5)}`;
      return {
        offset: idx,
        date: dateStr,
        label: dayTitle,
      };
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const [doctorList, firstSlots] = await Promise.all([
          getDoctors(),
          getDoctorSlots("vet_101"),
        ]);
        if (cancelled) return;

        const normalizedSlots = (slots: ExternalSlotDto[]): SlotDto[] =>
          slots.map((slot) => ({
            slotId: slot.externalSlotId,
            date: slot.date,
            day: slot.day,
            time: slot.time,
            status: slot.status,
          }));

        const normalized: DoctorItem[] = await Promise.all(
          doctorList.map(async (doctor: Doctor) => {
            const slots = doctor.externalDoctorId === "vet_101"
              ? firstSlots
              : await getDoctorSlots(doctor.externalDoctorId);
            return {
              id: doctor.externalDoctorId,
              name: doctor.name,
              specialty: doctor.clinicName || "Veterinary Care",
              address: doctor.address,
              price: doctor.consultationPrice || 0,
              avgRating: doctor.avgRating,
              ratingsCount: doctor.ratingsCount,
              slots: normalizedSlots(slots),
            };
          })
        );
        setDoctors(normalized);
        setSelectedDoctorId(normalized[0]?.id || "");
      } catch (error: any) {
        if (!cancelled) {
          setStatusType("error");
          setStatusMessage(error?.message || "Could not load doctors.");
        }
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    };
    void loadDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.address.toLowerCase().includes(q)
    );
  }, [searchQuery, doctors]);

  const activeDoctor = useMemo(() => {
    return (
      filteredDoctors.find((d) => d.id === selectedDoctorId) ||
      filteredDoctors[0] ||
      null
    );
  }, [filteredDoctors, selectedDoctorId]);

  const availableSlotsByDate = useMemo(() => {
    const map: Record<string, SlotDto[]> = {};
    if (!activeDoctor) return map;

    for (const slot of activeDoctor.slots) {
      if (slot.status !== "available") continue;
      if (isPastTimeForToday(slot.date, slot.time)) continue;
      if (!map[slot.date]) map[slot.date] = [];
      map[slot.date].push(slot);
    }

    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    });

    return map;
  }, [activeDoctor]);

  const firstAvailableDay = sevenDays.find(
    (dayObj) => (availableSlotsByDate[dayObj.date]?.length || 0) > 0
  );
  const visibleSelectedDate =
    availableSlotsByDate[selectedDate] && availableSlotsByDate[selectedDate].length > 0
      ? selectedDate
      : firstAvailableDay?.date || selectedDate;
  const daySlots = availableSlotsByDate[visibleSelectedDate] || [];

  const handleBook = async () => {
    if (!activeDoctor) {
      setStatusType("error");
      setStatusMessage("Please select a doctor.");
      return;
    }
    if (!selectedSlotId || !daySlots.some((slot) => slot.slotId === selectedSlotId)) {
      setStatusType("error");
      setStatusMessage("Please select a time slot.");
      return;
    }

    const petId = user?.pet?.id || user?.pet?.petId || user?.pet?.referenceCode || "current_pet";
    setBookingLoading(true);
    setStatusMessage("");
    try {
      const result = await bookVetAppointment({
        externalDoctorId: activeDoctor.id,
        externalSlotId: selectedSlotId,
        petId,
      });
      setDoctors((current) =>
        current.map((doctor) =>
          doctor.id === activeDoctor.id
            ? {
                ...doctor,
                slots: doctor.slots.map((slot) =>
                  slot.slotId === selectedSlotId ? { ...slot, status: "booked" as const } : slot
                ),
              }
            : doctor
        )
      );
      setSelectedSlotId(null);
      setStatusType("success");
      setStatusMessage(`Booking confirmed. Reference: ${result.referenceCode}`);
    } catch (error: any) {
      setStatusType("error");
      setStatusMessage(error?.message || "Could not confirm your booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 95 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text className="text-xs uppercase font-bold text-[#557FB3]">
          VETERINARY CARE
        </Text>
        <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-0.5">
          Doctors
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search doctor, specialty, or address..."
      />

      {loadingDoctors ? (
        <Text className="text-xs font-semibold text-slate-500">Loading doctors...</Text>
      ) : null}

      {statusMessage ? (
        <View className={`px-3.5 py-2.5 rounded-xl border ${statusType === "error" ? "bg-red-100 border-red-300" : "bg-emerald-100 border-emerald-300"}`}>
          <Text className={`text-xs font-bold ${statusType === "error" ? "text-red-800" : "text-emerald-800"}`}>
            {statusMessage}
          </Text>
        </View>
      ) : null}

      {/* Doctors list */}
      <View className="gap-3">
        {filteredDoctors.map((doc) => {
          const isSelectedDoc = activeDoctor?.id === doc.id;
          const ratingText =
            doc.ratingsCount && doc.ratingsCount > 0 && typeof doc.avgRating === "number"
              ? `${doc.avgRating.toFixed(1)} (${doc.ratingsCount})`
              : "No ratings yet";

          return (
            <TouchableOpacity
              key={doc.id}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedDoctorId(doc.id);
                setSelectedSlotId(null);
                setStatusMessage("");
              }}
            >
              <AppCard
                color="bg-white dark:bg-[#1E2733]"
                borderColor={
                  isSelectedDoc ? "border-[#EAB642]" : "border-slate-200 dark:border-slate-700"
                }
                className="gap-2"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-[#E4EAF1] dark:bg-slate-800 items-center justify-center">
                    <Ionicons
                      name="medkit"
                      size={20}
                      color={colorPalette.navyDark}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
                      {doc.name}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {doc.specialty} • {doc.address}
                    </Text>
                  </View>
                  <Text className="text-xs font-extrabold text-[#557FB3]">
                    {doc.price.toLocaleString()} SYP
                  </Text>
                </View>

                <Text className="text-xs font-bold text-[#557FB3]">
                  {ratingText}
                </Text>
              </AppCard>
            </TouchableOpacity>
          );
        })}
      </View>

    
      {activeDoctor ? (
        <AppCard
          color="bg-white dark:bg-[#1E2733]"
          className="gap-3 border border-slate-200 dark:border-slate-700"
        >
          <Text className="text-base font-extrabold text-[#2A4D75] dark:text-white">
            {activeDoctor.name} — Weekly Slots
          </Text>

          {/* 7-day horizontal strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {sevenDays.map((dayObj) => {
                const countForDay = availableSlotsByDate[dayObj.date]?.length || 0;
                const isDisabledDay = countForDay === 0;
                const isSelectedDay = visibleSelectedDate === dayObj.date;
                return (
                  <TouchableOpacity
                    key={dayObj.date}
                    disabled={isDisabledDay}
                    onPress={() => {
                      setSelectedDate(dayObj.date);
                      setSelectedSlotId(null);
                      setStatusMessage("");
                      setSelectedSlotId(null);
                      setStatusMessage("");
                    }}
                    className={`px-3 py-2 rounded-xl border ${
                      isDisabledDay
                        ? "bg-slate-100 border-slate-200 opacity-50"
                        : isSelectedDay
                        ? "bg-[#2A4D75] border-[#2A4D75]"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isDisabledDay
                          ? "text-slate-400"
                          : isSelectedDay
                          ? "text-white"
                          : "text-[#2A4D75]"
                      }`}
                    >
                      {dayObj.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Slots grid for selected day */}
          {daySlots.length === 0 ? (
            <Text className="text-xs font-semibold text-slate-500 py-2">
              No available times for this day.
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {daySlots.map((slot) => {
                const isPicked = selectedSlotId === slot.slotId;
                return (
                  <TouchableOpacity
                    key={slot.slotId}
                    onPress={() => {
                      setSelectedSlotId(slot.slotId);
                      setStatusMessage("");
                    }}
                    className={`px-3.5 py-2 rounded-xl border ${
                      isPicked
                        ? "bg-[#EAB642] border-[#EAB642]"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isPicked ? "text-white" : "text-[#2A4D75]"
                      }`}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          
          <TouchableOpacity
            disabled={!selectedSlotId || bookingLoading}
            onPress={handleBook}
            className={`py-3 rounded-xl items-center mt-1 ${
              selectedSlotId && !bookingLoading ? "bg-[#EAB642]" : "bg-slate-300"
            }`}
          >
            <Text className="text-xs font-extrabold text-white">
              {bookingLoading ? "Confirming..." : "Confirm Booking"}
            </Text>
          </TouchableOpacity>
        </AppCard>
      ) : null}
    </ScrollView>
  );
}