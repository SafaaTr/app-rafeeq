import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../components/SearchBar";
import AppCard from "../../components/AppCard";
import AppButton from "../../components/AppButton";
import { colorPalette } from "../../constants/colors";

interface StoreProduct {
  id: string;
  storeId: string;
  name: string;
  details: string;
  price: number;
  imageUrl: string;
  status: "available" | "unavailable";
}

interface StoreItem {
  id: string;
  name: string;
  address: string;
  status: "active" | "closed";
  products: StoreProduct[];
}

const MOCK_STORES: StoreItem[] = [
  {
    id: "st_1",
    name: "Paws & Claws Market",
    address: "Al-Malki, Damascus",
    status: "active",
    products: [
      {
        id: "p_1",
        storeId: "st_1",
        name: "Adult Cat Food",
        details: "2kg • Chicken & Rice",
        price: 35000,
        imageUrl:
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
        status: "available",
      },
      {
        id: "p_2",
        storeId: "st_1",
        name: "Salmon Treats",
        details: "100g • Grain-free",
        price: 15000,
        imageUrl:
          "https://images.unsplash.com/photo-1568640347023-a616a30b3bd2?w=400",
        status: "available",
      },
      {
        id: "p_3",
        storeId: "st_1",
        name: "Disabled Collar",
        details: "Unavailable item",
        price: 12000,
        imageUrl:
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
        status: "unavailable",
      },
    ],
  },
  {
    id: "st_2",
    name: "Happy Pet Supplies",
    address: "Mezzeh, Damascus",
    status: "active",
    products: [
      {
        id: "p_4",
        storeId: "st_2",
        name: "Rubber Chew Toy",
        details: "Durable • Non-toxic",
        price: 18000,
        imageUrl:
          "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400",
        status: "available",
      },
    ],
  },
];

export default function StoresScreen() {
  const activeStores = useMemo(
    () => MOCK_STORES.filter((s) => s.status === "active"),
    []
  );

  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    activeStores[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");

  const selectedStore = useMemo(() => {
    return (
      activeStores.find((s) => s.id === selectedStoreId) ||
      activeStores[0] ||
      null
    );
  }, [activeStores, selectedStoreId]);

  const filteredProducts = useMemo(() => {
    if (!selectedStore) return [];
    const availableItems = selectedStore.products.filter(
      (p) => p.status === "available"
    );
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableItems;
    return availableItems.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.details.toLowerCase().includes(q)
    );
  }, [selectedStore, searchQuery]);

  const addToCart = (prod: StoreProduct) => {
    setCheckoutSuccess("");
    setCart((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { id: prod.id, name: prod.name, price: prod.price, quantity: 1 },
      ];
    });
  };

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleConfirmPurchase = () => {
    setCheckoutError("");
    if (!deliveryAddress.trim()) {
      setCheckoutError("Please fill in all fields.");
      return;
    }

    setCheckoutSuccess("Your order has been placed (Cash on Delivery).");
    setCart([]);
    setDeliveryAddress("");
    setIsCartOpen(false);
  };

  return (
    <View className="flex-1 bg-[#E4EAF1] dark:bg-[#121820]">
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 95 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs uppercase font-bold text-[#557FB3]">
              PET SUPPLIES
            </Text>
            <Text className="text-3xl font-extrabold text-[#2A4D75] dark:text-white">
              Stores
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setCheckoutError("");
              setIsCartOpen(true);
            }}
            className="p-3 bg-white rounded-2xl border border-slate-200 relative"
          >
            <Ionicons
              name="cart-outline"
              size={24}
              color={colorPalette.navyDark}
            />
            {cart.length > 0 ? (
              <View className="absolute -top-1 -right-1 bg-[#EAB642] w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-xs font-bold text-white">
                  {cart.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Active stores selector (list remains visible) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {activeStores.map((st) => {
              const isActiveSt = selectedStore?.id === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  onPress={() => setSelectedStoreId(st.id)}
                  className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                    isActiveSt
                      ? "bg-[#2A4D75] border-[#2A4D75]"
                      : "bg-white border-slate-300"
                  }`}
                >
                  <Ionicons
                    name="storefront-outline"
                    size={15}
                    color={isActiveSt ? "#FFFFFF" : colorPalette.navyDark}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      isActiveSt ? "text-white" : "text-[#2A4D75]"
                    }`}
                  >
                    {st.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />

        {checkoutSuccess ? (
          <View className="px-3.5 py-2.5 rounded-xl bg-emerald-100 border border-emerald-300">
            <Text className="text-xs font-bold text-emerald-800">
              {checkoutSuccess}
            </Text>
          </View>
        ) : null}

        <View className="flex-row flex-wrap gap-3">
          {filteredProducts.map((prod) => (
            <AppCard
              key={prod.id}
              color="bg-white dark:bg-[#1E2733]"
              className="w-[48%] gap-2 border border-slate-200 dark:border-slate-700"
            >
              <Image
                source={{ uri: prod.imageUrl }}
                className="w-full h-24 rounded-xl bg-slate-100"
                resizeMode="cover"
              />
              <Text className="text-sm font-extrabold text-[#2A4D75] dark:text-white">
                {prod.name}
              </Text>
              <Text className="text-xs text-slate-500">{prod.details}</Text>
              <Text className="text-sm font-extrabold text-[#557FB3]">
                {prod.price.toLocaleString()} SYP
              </Text>
              <AppButton
                title="Add to cart"
                onPress={() => addToCart(prod)}
                color="bg-[#EAB642]"
                textColor="text-white"
                className="py-2"
              />
            </AppCard>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isCartOpen}
        animationType="slide"
        onRequestClose={() => setIsCartOpen(false)}
      >
        <View className="flex-1 bg-[#E4EAF1] p-6 justify-between">
          <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setIsCartOpen(false)}
              className="self-start"
            >
              <Ionicons name="close" size={28} color={colorPalette.navyDark} />
            </TouchableOpacity>

            <Text className="text-2xl font-extrabold text-[#2A4D75]">
              Your Cart
            </Text>

            {checkoutError ? (
              <View className="px-3.5 py-2.5 rounded-xl bg-red-100 border border-red-300">
                <Text className="text-xs font-bold text-red-800">
                  {checkoutError}
                </Text>
              </View>
            ) : null}

            {cart.length === 0 ? (
              <Text className="text-sm text-slate-600">Your cart is empty.</Text>
            ) : (
              <>
                {cart.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200"
                  >
                    <Text className="font-bold text-[#2A4D75]">
                      {item.name} (x{item.quantity})
                    </Text>
                    <Text className="font-bold text-[#557FB3]">
                      {(item.price * item.quantity).toLocaleString()} SYP
                    </Text>
                  </View>
                ))}

                <Text className="text-lg font-extrabold text-[#2A4D75] mt-2">
                  Total: {totalPrice.toLocaleString()} SYP
                </Text>

                <TextInput
                  value={deliveryAddress}
                  onChangeText={(txt) => {
                    setDeliveryAddress(txt);
                    if (checkoutError) setCheckoutError("");
                  }}
                  placeholder="Delivery address *"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#2A4D75]"
                />

                <Text className="text-xs font-bold text-[#557FB3]">
                  Cash on Delivery
                </Text>
              </>
            )}
          </ScrollView>

          {cart.length > 0 ? (
            <AppButton
              title="Confirm Purchase"
              onPress={handleConfirmPurchase}
              color="bg-[#EAB642]"
              textColor="text-white"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}