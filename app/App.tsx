import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootNavigator } from "./src/navigation";
import { PrivacyScreen } from "./src/screens/PrivacyScreen";

const PRIVACY_ACCEPTED_KEY = "@privacy_accepted";

export default function App() {
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
      <RootNavigator />
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
});
