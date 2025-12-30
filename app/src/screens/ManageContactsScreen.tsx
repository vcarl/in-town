import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SwipeCard } from "../components/SwipeCard";
import {
  loadDeviceContacts,
  mergeContactsWithSwipes,
  updateSwipeStatus,
  checkContactsPermission,
  requestContactsPermission,
} from "../services/contacts";
import type { Contact, ContactWithSwipe } from "../types/contact";
import type { RootStackParamList } from "../navigation";

type ManageContactsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PermissionState = "checking" | "needs_permission" | "denied" | "granted";

export const ManageContactsScreen: React.FC = () => {
  const navigation = useNavigation<ManageContactsNavigationProp>();
  const [contacts, setContacts] = useState<ContactWithSwipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>("checking");

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await checkContactsPermission();
    if (status === "granted") {
      setPermissionState("granted");
      loadContacts();
    } else if (status === "denied") {
      setPermissionState("denied");
    } else {
      setPermissionState("needs_permission");
    }
  };

  const handleGrantAccess = async () => {
    const granted = await requestContactsPermission();
    if (granted) {
      setPermissionState("granted");
      loadContacts();
    } else {
      setPermissionState("denied");
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleBack = () => {
    navigation.navigate('Summary');
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const deviceContacts = await loadDeviceContacts();
      const contactsWithSwipes = await mergeContactsWithSwipes(deviceContacts);

      // Filter only pending contacts
      const pendingContacts = contactsWithSwipes.filter((c) => c.swipeStatus === "pending");
      setContacts(pendingContacts);
    } catch (err) {
      setError("Failed to load contacts.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (contact: Contact, direction: "left" | "right") => {
    try {
      await updateSwipeStatus(contact.id, direction);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Error updating swipe status:", err);
      Alert.alert("Error", "Failed to save swipe status");
    }
  };

  const handleSwipeLeft = (contact: Contact) => {
    handleSwipe(contact, "left");
  };

  const handleSwipeRight = (contact: Contact) => {
    handleSwipe(contact, "right");
  };

  // Checking permission
  if (permissionState === "checking") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.logo}>In Town</Text>
      </View>
    );
  }

  // Needs permission - show grant access button
  if (permissionState === "needs_permission") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.logo}>In Town</Text>
        <Text style={styles.permissionTitle}>Ready to get started?</Text>
        <Text style={styles.permissionText}>Tap below to grant access to your contacts</Text>
        <TouchableOpacity style={styles.grantButton} onPress={handleGrantAccess}>
          <Text style={styles.grantButtonText}>Grant Contact Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Permission denied - show settings prompt
  if (permissionState === "denied") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.logo}>In Town</Text>
        <Text style={styles.permissionTitle}>Permission Required</Text>
        <Text style={styles.permissionText}>
          Contact access was denied. Please enable it in Settings to use this app.
        </Text>
        <TouchableOpacity style={styles.grantButton} onPress={handleOpenSettings}>
          <Text style={styles.grantButtonText}>Open Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retryLink} onPress={checkPermission}>
          <Text style={styles.retryLinkText}>Check Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadContacts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (contacts.length === 0 || currentIndex >= contacts.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.completeText}>🎉</Text>
        <Text style={styles.completeTitle}>All Done!</Text>
        <Text style={styles.completeSubtitle}>You've reviewed all your contacts</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadContacts}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentContact = contacts[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
          </TouchableOpacity>
          <Text style={styles.title}>In Town</Text>
          <View style={styles.backButton} />
        </View>
        <Text style={styles.subtitle}>Who would you visit?</Text>
        <Text style={styles.counter}>
          {currentIndex + 1} / {contacts.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <SwipeCard
          key={currentContact.id}
          contact={currentContact}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 30,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4ECDC4",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  grantButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  grantButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  retryLink: {
    marginTop: 20,
    padding: 10,
  },
  retryLinkText: {
    color: "#4ECDC4",
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  counter: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeText: {
    fontSize: 80,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  completeSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
