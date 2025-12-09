// src/navigation/MainNavigator.js — FINAL WORKING VERSION
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import TasksScreen from '../screens/TasksScreen';
import AIScreen from '../screens/AIScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WeeklyReviewScreen from '../screens/WeeklyReviewScreen'; 

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RootStack = createStackNavigator(); 

// Home + Habit flows
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen 
        name="CreateHabit" 
        component={CreateHabitScreen} 
        options={{ presentation: 'modal' }} 
      />
      <HomeStack.Screen name="HabitDetail" component={HabitDetailScreen} />
      <HomeStack.Screen name="EditHabit" component={EditHabitScreen} />
    </HomeStack.Navigator>
  );
}

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Habits') iconName = 'flame';
          else if (route.name === 'Tasks') iconName = 'checkmark-done';
          else if (route.name === 'AI') iconName = 'bulb';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Habits" component={HomeStackNavigator} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root Stack — handles full-screen modals like Weekly Review
export default function MainNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={TabNavigator} />
      <RootStack.Screen 
        name="WeeklyReview" 
        component={WeeklyReviewScreen} 
        options={{
          presentation: 'modal',
          cardStyle: { backgroundColor: '#000' },
          cardOverlayEnabled: true,
        }}
      />
    </RootStack.Navigator>
  );
}