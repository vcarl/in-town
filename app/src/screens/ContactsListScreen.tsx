import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getRightSwipedContacts } from '../services/contacts';
import type { ContactCompleteness } from '../types/contact';

export const ContactsListScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ContactCompleteness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRightSwipedContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContactItem = ({ item }: { item: ContactCompleteness }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.completenessContainer}>
          <Text style={styles.completenessText}>{Math.round(item.completenessPercentage)}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.completenessPercentage}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <StatusIcon completed={item.hasBirthday} label="Birthday" />
        <StatusIcon completed={item.hasAddress} label="Address" />
        <StatusIcon completed={item.hasPhone} label="Phone" />
        <StatusIcon completed={item.hasEmail} label="Email" />
      </View>

      {item.missingFields.length > 0 && (
        <View style={styles.missingContainer}>
          <Text style={styles.missingLabel}>Missing:</Text>
          <Text style={styles.missingText}>{item.missingFields.join(', ')}</Text>
        </View>
      )}
    </View>
  );

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People to Visit</Text>
        <Text style={styles.subtitle}>
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>👋</Text>
          <Text style={styles.emptyTitle}>No contacts yet</Text>
          <Text style={styles.emptyText}>Swipe right on contacts you'd like to visit</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const StatusIcon: React.FC<{ completed: boolean; label: string }> = ({ completed, label }) => (
  <View style={styles.statusItem}>
    <Text style={styles.statusIcon}>{completed ? '✅' : '⭕'}</Text>
    <Text style={[styles.statusLabel, !completed && styles.incompleteLabel]}>{label}</Text>
  </View>
);

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  completenessContainer: {
    alignItems: 'flex-end',
  },
  completenessText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  progressBar: {
    width: 80,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  incompleteLabel: {
    color: '#999',
  },
  missingContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  missingLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 4,
  },
  missingText: {
    fontSize: 12,
    color: '#F57C00',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
