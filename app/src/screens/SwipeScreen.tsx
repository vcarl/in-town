import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SwipeCard } from '../components/SwipeCard';
import { contactsApi } from '../services/api';
import type { Contact } from '../types/contact';

export const SwipeScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactsApi.getAllContacts();
      // Filter only pending contacts
      const pendingContacts = data.filter(c => c.swipe_status === 'pending');
      setContacts(pendingContacts);
    } catch (err) {
      setError('Failed to load contacts. Make sure the server is running.');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSwipe = async (contact: Contact, direction: 'left' | 'right') => {
    try {
      await contactsApi.updateSwipeStatus(contact.id, direction);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error updating swipe status:', err);
      Alert.alert('Error', 'Failed to update swipe status');
    }
  };
  
  const handleSwipeLeft = (contact: Contact) => {
    handleSwipe(contact, 'left');
  };
  
  const handleSwipeRight = (contact: Contact) => {
    handleSwipe(contact, 'right');
  };
  
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
        <Text style={styles.errorText}>⚠️ {error}</Text>
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
        <Text style={styles.completeSubtitle}>
          You've reviewed all your contacts
        </Text>
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
        <Text style={styles.title}>In Town</Text>
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
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  counter: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeText: {
    fontSize: 80,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
