import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { TitleScreen } from '../screens/TitleScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { ManageContactsScreen } from '../screens/ManageContactsScreen';
import { ContactsListScreen } from '../screens/ContactsListScreen';

// Type definitions for navigation
export type RootStackParamList = {
  Title: undefined;
  Summary: undefined;
  MainTabs: undefined;
};

export type MainTabsParamList = {
  ManageContacts: undefined;
  ToVisit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="ManageContacts"
        component={ManageContactsScreen}
        options={{
          tabBarLabel: 'Manage',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="ToVisit"
        component={ContactsListScreen}
        options={{
          tabBarLabel: 'To Visit',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Title" component={TitleScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 10,
    height: 70,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
