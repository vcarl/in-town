import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeScreen } from "./src/screens/SwipeScreen";
import { ContactsListScreen } from "./src/screens/ContactsListScreen";
import { PrivacyScreen } from "./src/screens/PrivacyScreen";

const PRIVACY_ACCEPTED_KEY = "@privacy_accepted";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<"swipe" | "list">("swipe");
  const [showPrivacy, setShowPrivacy] = useState<boolean | null>(null);

  const checkPrivacyAccepted = async () => {
    try {
      const accepted = await AsyncStorage.getItem(PRIVACY_ACCEPTED_KEY);
      setShowPrivacy(accepted !== "true");
    } catch {
      setShowPrivacy(true);
    }
  };

  useEffect(() => {
    checkPrivacyAccepted();
  }, []);

  const handlePrivacyAccept = async () => {
    try {
      await AsyncStorage.setItem(PRIVACY_ACCEPTED_KEY, "true");
      setShowPrivacy(false);
    } catch (error) {
      console.error("Error saving privacy acceptance:", error);
    }
  };

  // Loading state
  if (showPrivacy === null) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>In Town</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  // Privacy screen
  if (showPrivacy) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="auto" />
        <PrivacyScreen onAccept={handlePrivacyAccept} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />

      {activeScreen === "swipe" ? <SwipeScreen /> : <ContactsListScreen />}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeScreen === "swipe" && styles.activeTab]}
          onPress={() => setActiveScreen("swipe")}
        >
          <Text style={[styles.tabText, activeScreen === "swipe" && styles.activeTabText]}>
            Swipe
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeScreen === "list" && styles.activeTab]}
          onPress={() => setActiveScreen("list")}
        >
          <Text style={[styles.tabText, activeScreen === "list" && styles.activeTabText]}>
            To Visit
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingLogo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: "#4ECDC4",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4ECDC4",
    fontWeight: "bold",
  },
});
