import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { config } from '../config';

interface PrivacyScreenProps {
  onAccept: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onAccept }) => {
  const handlePrivacyPolicyPress = () => {
    Linking.openURL(config.privacyPolicyUrl);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>In Town</Text>
        <Text style={styles.tagline}>Stay connected with the people who matter</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How Your Contacts Are Used</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>1</Text>
            <View style={styles.bulletContent}>
              <Text style={styles.bulletTitle}>Stored on your device only</Text>
              <Text style={styles.bulletText}>
                Your contacts never leave your phone. All data stays in local storage.
              </Text>
            </View>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>2</Text>
            <View style={styles.bulletContent}>
              <Text style={styles.bulletTitle}>No server uploads</Text>
              <Text style={styles.bulletText}>
                We don't have servers. Your swipe choices are saved locally on this device.
              </Text>
            </View>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>3</Text>
            <View style={styles.bulletContent}>
              <Text style={styles.bulletTitle}>Read-only access</Text>
              <Text style={styles.bulletText}>
                We only read contact names and details. We never modify your contacts.
              </Text>
            </View>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>4</Text>
            <View style={styles.bulletContent}>
              <Text style={styles.bulletTitle}>Delete anytime</Text>
              <Text style={styles.bulletText}>
                Uninstall the app to remove all stored preferences. Your contacts remain untouched.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handlePrivacyPolicyPress}>
          <Text style={styles.privacyLink}>Read our full Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={onAccept}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          By continuing, you agree to grant contact access
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4ECDC4',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  bulletContent: {
    flex: 1,
  },
  bulletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  privacyLink: {
    fontSize: 16,
    color: '#4ECDC4',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
