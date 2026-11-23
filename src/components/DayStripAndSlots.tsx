import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ExternalSlotDto } from "../services/rafeeqService";
import { colorPalette } from "../constants/colors";

interface DayStripAndSlotsProps {
  slots: ExternalSlotDto[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: ExternalSlotDto | null) => void;
  onValidationError?: (message: string) => void;
}

interface DayGroup {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Today | Tomorrow | Tue ...
  dayNumber: string; // DD
  availableSlots: ExternalSlotDto[];
  isDisabled: boolean;
}

function getCurrentTimeHHmm(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDateYYYYMMDD(dateObj: Date): string {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DayStripAndSlots({
  slots,
  selectedSlotId,
  onSelectSlot,
}: DayStripAndSlotsProps) {
  const dayGroups = useMemo<DayGroup[]>(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const todayStr = formatDateYYYYMMDD(todayDate);

    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const tomorrowStr = formatDateYYYYMMDD(tomorrowDate);

    const currentTime = getCurrentTimeHHmm();

    // تجميع المواعيد حسب date
    const groupedMap = new Map<string, ExternalSlotDto[]>();
    for (const slot of slots) {
      const list = groupedMap.get(slot.date) ?? [];
      list.push(slot);
      groupedMap.set(slot.date, list);
    }

    // بناء قائمة 7 أيام قادمة من اليوم
    const days: DayGroup[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() + i);
      const dateStr = formatDateYYYYMMDD(d);
      const dayNumber = String(d.getDate()).padStart(2, "0");
      const rawSlots = groupedMap.get(dateStr) ?? [];

      const filteredAvailable = rawSlots
        .filter((s) => s.status === "available")
        .filter((s) => (dateStr === todayStr ? s.time > currentTime : true))
        .sort((a, b) => a.time.localeCompare(b.time));

      let dayLabel = sFallbackDayName(d, rawSlots[0]?.day);
      if (dateStr === todayStr) dayLabel = "Today";
      else if (dateStr === tomorrowStr) dayLabel = "Tomorrow";

      days.push({
        date: dateStr,
        dayLabel,
        dayNumber,
        availableSlots: filteredAvailable,
        isDisabled: filteredAvailable.length === 0,
      });
    }

    return days.sort((a, b) => a.date.localeCompare(b.date));
  }, [slots]);

  const firstEnabledDate = useMemo(() => {
    const found = dayGroups.find((d) => !d.isDisabled);
    return found ? found.date : dayGroups[0]?.date ?? "";
  }, [dayGroups]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const effectiveSelectedDate =
    selectedDate && dayGroups.some((day) => day.date === selectedDate)
      ? selectedDate
      : firstEnabledDate;

  const activeDay = useMemo(
    () => dayGroups.find((d) => d.date === effectiveSelectedDate),
    [dayGroups, effectiveSelectedDate]
  );

  const handleDayPress = (day: DayGroup) => {
    if (day.isDisabled) return;
    setSelectedDate(day.date);
    onSelectSlot(null);
  };

  return (
    <View className="w-full gap-4">
      <Text className="text-base font-bold text-[#2A4D75] dark:text-white">
        Select a day
      </Text>

      {/* شريط الأيام الأفقي */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
      >
        {dayGroups.map((day) => {
          const isSelected = day.date === effectiveSelectedDate && !day.isDisabled;
          return (
            <TouchableOpacity
              key={day.date}
              disabled={day.isDisabled}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.8}
              style={{
                backgroundColor: day.isDisabled
                  ? "#E2E8F0"
                  : isSelected
                  ? colorPalette.accentGold
                  : "#FFFFFF",
                borderColor: day.isDisabled
                  ? "#CBD5E1"
                  : isSelected
                  ? colorPalette.accentGold
                  : "#E2E8F0",
              }}
              className={`w-20 py-3 px-2 rounded-2xl border items-center justify-center ${
                day.isDisabled ? "opacity-60" : ""
              }`}
            >
              <Text
                style={{
                  color: day.isDisabled
                    ? "#94A3B8"
                    : isSelected
                    ? "#FFFFFF"
                    : "#2A4D75",
                }}
                className="text-xs font-bold"
              >
                {day.dayLabel}
              </Text>
              <Text
                style={{
                  color: day.isDisabled
                    ? "#94A3B8"
                    : isSelected
                    ? "#FFFFFF"
                    : "#557FB3",
                }}
                className="text-lg font-extrabold mt-1"
              >
                {day.dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* شبكة الساعات */}
      <Text className="text-base font-bold text-[#2A4D75] dark:text-white mt-1">
        Available times {activeDay ? `(${activeDay.dayLabel})` : ""}
      </Text>

      {!activeDay || activeDay.availableSlots.length === 0 ? (
        <View className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Text className="text-sm text-slate-500">
            No available times for this day.
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-2.5">
          {activeDay.availableSlots.map((slot) => {
            const isSlotSelected = slot.externalSlotId === selectedSlotId;
            return (
              <TouchableOpacity
                key={slot.externalSlotId}
                onPress={() => onSelectSlot(slot)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: isSlotSelected
                    ? colorPalette.navyDark
                    : "#FFFFFF",
                  borderColor: isSlotSelected
                    ? colorPalette.navyDark
                    : "#CBD5E1",
                }}
                className="px-4 py-2.5 rounded-xl border"
              >
                <Text
                  style={{ color: isSlotSelected ? "#FFFFFF" : "#2A4D75" }}
                  className="text-sm font-bold"
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

function sFallbackDayName(dateObj: Date, apiDay?: string): string {
  if (apiDay) return apiDay;
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[dateObj.getDay()];
}