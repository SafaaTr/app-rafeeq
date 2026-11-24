import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { colorPalette } from "../../constants/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "AddPet">;

export default function AddPetScreen({ navigation, route }: Props) {
  const [petType, setPetType] = useState("");
  const [age, setAge] = useState("");
  const [petName, setPetName] = useState("");
  const [lastVetVisit, setLastVetVisit] = useState("");
  const [vaccineRecord, setVaccineRecord] = useState<{ name: string; uri: string } | null>(null);
  const [petPhoto, setPetPhoto] = useState<{ name: string; uri: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pickPetPhoto = async () => {
    setErrorMsg("");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setErrorMsg("Pet photo must be 5 MB or smaller.");
      return;
    }

    setPetPhoto({ name: asset.fileName || "pet-photo.jpg", uri: asset.uri });
  };

  const pickVaccineRecord = async () => {
    setErrorMsg("");
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.mimeType && asset.mimeType !== "application/pdf") {
      setErrorMsg("Only PDF vaccine records are allowed.");
      return;
    }
    if (asset.size && asset.size > 20 * 1024 * 1024) {
      setErrorMsg("Vaccine record must be 20 MB or smaller.");
      return;
    }

    setVaccineRecord({ name: asset.name, uri: asset.uri });
  };

  const handleSave = () => {
    setErrorMsg("");
    if (!petType.trim() || !age.trim() || !petName.trim()) {
      setErrorMsg("Please fill in all empty fields.");
      return;
    }
    if (!petPhoto || !vaccineRecord) {
      setErrorMsg("Please add the pet photo and PDF vaccine record.");
      return;
    }

    const { canHost } = route.params || {};
    const petData = {
      petType: petType.trim(),
      age: Number(age),
      petName: petName.trim(),
      lastVetVisitDate: lastVetVisit.trim(),
      vaccinationRecordUrl: vaccineRecord.uri,
      vaccinationRecordName: vaccineRecord.name,
      photoUrl: petPhoto.uri,
      photoName: petPhoto.name,
    };

    if (canHost) {
      navigation.navigate("HostSetup", {
        ...route.params,
        petData,
      });
    } else {
      navigation.navigate("MainApp", {
        ...route.params,
        canHost: false,
        petData,
      });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-xs uppercase font-bold text-[#557FB3]">
        02 / 03 • PET PROFILE
      </Text>
      <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white mt-1">
        Meet your little one.
      </Text>
      <Text className="text-sm text-slate-600 mt-1 mb-6">
        A few details help us tailor their care.
      </Text>

      <View className="gap-4">
        <View className="flex-row gap-3">
          <AppInput
            label="Pet type"
            value={petType}
            onChangeText={setPetType}
            className="flex-1"
            color="bg-white"
          />
          <AppInput
            label="Age (Years)"
            placeholder="e.g. 2"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            className="flex-1"
            color="bg-white"
          />
        </View>

        <TouchableOpacity
          onPress={pickPetPhoto}
          activeOpacity={0.8}
          className="w-full py-6 bg-[#F6D28B]/30 border-2 border-dashed border-[#EAB642] rounded-2xl items-center justify-center gap-2 overflow-hidden"
        >
          {petPhoto ? (
            <Image
              source={{ uri: petPhoto.uri }}
              className="w-24 h-24 rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="camera-outline" size={32} color={colorPalette.navyDark} />
          )}
          <Text className="text-sm font-bold text-[#2A4D75]">
            {petPhoto ? petPhoto.name : "Add a pet photo"}
          </Text>
          <Text className="text-xs text-slate-500">JPG or PNG up to 5 MB</Text>
        </TouchableOpacity>

        <AppInput
          label="Pet name"
          placeholder="e.g. Luna"
          value={petName}
          onChangeText={setPetName}
          color="bg-white"
        />

        <AppInput
          label="Last vet visit"
          value={lastVetVisit}
          onChangeText={setLastVetVisit}
          color="bg-white"
        />

        <TouchableOpacity
          onPress={pickVaccineRecord}
          activeOpacity={0.8}
          className="w-full p-4 bg-white border border-slate-300 rounded-xl flex-row items-center gap-3"
        >
          <Ionicons name="document-text-outline" size={24} color={colorPalette.softBlue} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-[#2A4D75]">
              {vaccineRecord ? vaccineRecord.name : "Upload vaccine record"}
            </Text>
            <Text className="text-xs text-slate-400">PDF only - max 20MB</Text>
          </View>
        </TouchableOpacity>

        {errorMsg ? (
          <Text className="text-xs font-bold text-red-600">{errorMsg}</Text>
        ) : null}

        <AppButton
          title="Save pet & continue  →"
          onPress={handleSave}
          color="bg-[#EAB642]"
          textColor="text-white"
          className="mt-2"
        />
      </View>
    </ScrollView>
  );
}