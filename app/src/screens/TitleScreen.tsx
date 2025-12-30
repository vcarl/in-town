import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { config } from '../config';
import type { RootStackParamList } from '../navigation';

type TitleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Title'>;

export const TitleScreen: React.FC = () => {
  const navigation = useNavigation<TitleScreenNavigationProp>();

  const handleOpen = () => {
    navigation.navigate('Summary');
  };

  const handleHomepagePress = () => {
    Linking.openURL(config.homepageUrl);
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(config.privacyPolicyUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>In Town</Text>
        <Text style={styles.tagline}>Stay connected with the people who matter</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.openButton} onPress={handleOpen}>
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <TouchableOpacity onPress={handleHomepagePress}>
            <Text style={styles.link}>Homepage</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}>|</Text>
          <TouchableOpacity onPress={handlePrivacyPolicyPress}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ECDC4',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  openButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  openButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: '#4ECDC4',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    marginHorizontal: 12,
    color: '#CCC',
  },
});
