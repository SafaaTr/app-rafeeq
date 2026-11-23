import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "./AppButton";
import { colorPalette } from "../constants/colors";

interface RatingModalProps {
  visible: boolean;
  targetName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function RatingModal({
  visible,
  targetName,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleConfirmSubmit = async () => {
    setErrorMsg("");
    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
      setRating(0);
      setComment("");
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="w-full bg-[#E4EAF1] dark:bg-[#1E2733] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4">
          <Text className="text-xl font-extrabold text-[#2A4D75] dark:text-white">
            Rate {targetName}
          </Text>

          {/* نجوم 1 إلى 5 */}
          <View className="flex-row justify-center gap-3 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <TouchableOpacity
                  key={star}
                  onPress={() => {
                    setRating(star);
                    setErrorMsg("");
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={active ? "star" : "star-outline"}
                    size={36}
                    color={active ? colorPalette.accentGold : "#94A3B8"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View>
            <TextInput
              placeholder="Comment (optional, max 300 chars)"
              placeholderTextColor="#94A3B8"
              value={comment}
              onChangeText={(txt) => setComment(txt.slice(0, 300))}
              multiline
              numberOfLines={3}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#2A4D75] dark:text-white text-sm"
            />
            <Text className="text-xs text-slate-500 text-right mt-1">
              {comment.length}/300
            </Text>
          </View>

          {errorMsg ? (
            <Text className="text-xs font-semibold text-red-600">{errorMsg}</Text>
          ) : null}

          <View className="flex-row gap-3 mt-1">
            <AppButton
              title="Cancel"
              onPress={onClose}
              color="bg-slate-200"
              textColor="text-[#2A4D75]"
              className="flex-1"
            />
            <AppButton
              title="Submit"
              onPress={handleConfirmSubmit}
              loading={submitting}
              color="bg-[#EAB642]"
              textColor="text-white"
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}