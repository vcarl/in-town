import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeScreen } from './src/screens/SwipeScreen';
import { ContactsListScreen } from './src/screens/ContactsListScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'swipe' | 'list'>('swipe');
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />
      
      {activeScreen === 'swipe' ? <SwipeScreen /> : <ContactsListScreen />}
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'swipe' && styles.activeTab]}
          onPress={() => setActiveScreen('swipe')}
        >
          <Text style={[styles.tabText, activeScreen === 'swipe' && styles.activeTabText]}>
            👆 Swipe
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'list' && styles.activeTab]}
          onPress={() => setActiveScreen('list')}
        >
          <Text style={[styles.tabText, activeScreen === 'list' && styles.activeTabText]}>
            📋 To Visit
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
});
