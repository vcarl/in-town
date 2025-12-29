import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Contact, SwipeData, ContactWithSwipe, ContactCompleteness } from '../types/contact';

const SWIPE_DATA_KEY = '@swipe_data';

// Check contacts permission without requesting
export const checkContactsPermission = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
  const { status } = await Contacts.getPermissionsAsync();
  return status as 'granted' | 'denied' | 'undetermined';
};

// Request contacts permission
export const requestContactsPermission = async (): Promise<boolean> => {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
};

// Load all device contacts
export const loadDeviceContacts = async (): Promise<Contact[]> => {
  const { status } = await Contacts.requestPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Permission to access contacts is required to use this feature. Please enable it in your device settings.');
  }
  
  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails,
      Contacts.Fields.Addresses,
      Contacts.Fields.Birthday,
      Contacts.Fields.Image,
    ],
  });
  
  // Filter out contacts without IDs and map to our Contact type
  return data
    .filter(contact => contact.id !== undefined)
    .map(contact => ({
      ...contact,
      id: contact.id as string,
    }));
};

// Load swipe data from local storage
export const loadSwipeData = async (): Promise<Record<string, SwipeData>> => {
  try {
    const data = await AsyncStorage.getItem(SWIPE_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading swipe data:', error);
    return {};
  }
};

// Save swipe data to local storage
export const saveSwipeData = async (swipeData: Record<string, SwipeData>): Promise<void> => {
  try {
    await AsyncStorage.setItem(SWIPE_DATA_KEY, JSON.stringify(swipeData));
  } catch (error) {
    console.error('Error saving swipe data:', error);
    throw error;
  }
};

// Update swipe status for a contact
export const updateSwipeStatus = async (
  contactId: string,
  status: 'left' | 'right'
): Promise<void> => {
  const swipeData = await loadSwipeData();
  swipeData[contactId] = {
    contactId,
    status,
    timestamp: new Date().toISOString(),
  };
  await saveSwipeData(swipeData);
};

// Merge contacts with swipe data
export const mergeContactsWithSwipes = async (
  contacts: Contact[]
): Promise<ContactWithSwipe[]> => {
  const swipeData = await loadSwipeData();
  
  return contacts.map(contact => ({
    ...contact,
    swipeStatus: swipeData[contact.id]?.status || 'pending',
  }));
};

// Calculate contact completeness
export const calculateCompleteness = (contact: Contact): ContactCompleteness => {
  const hasBirthday = !!(contact.birthday?.month && contact.birthday?.day);
  const hasAddress = !!(contact.addresses && contact.addresses.length > 0);
  const hasPhone = !!(contact.phoneNumbers && contact.phoneNumbers.length > 0);
  const hasEmail = !!(contact.emails && contact.emails.length > 0);
  
  const fields = [hasBirthday, hasAddress, hasPhone, hasEmail];
  const completedFields = fields.filter(Boolean).length;
  const completenessPercentage = (completedFields / fields.length) * 100;
  
  const missingFields: string[] = [];
  if (!hasBirthday) missingFields.push('birthday');
  if (!hasAddress) missingFields.push('address');
  if (!hasPhone) missingFields.push('phone');
  if (!hasEmail) missingFields.push('email');
  
  return {
    id: contact.id,
    name: contact.name,
    hasBirthday,
    hasAddress,
    hasPhone,
    hasEmail,
    completenessPercentage,
    missingFields,
  };
};

// Get contacts with right swipe and their completeness
export const getRightSwipedContacts = async (): Promise<ContactCompleteness[]> => {
  const contacts = await loadDeviceContacts();
  const swipeData = await loadSwipeData();
  
  const rightSwiped = contacts.filter(
    contact => swipeData[contact.id]?.status === 'right'
  );
  
  return rightSwiped.map(calculateCompleteness);
};
