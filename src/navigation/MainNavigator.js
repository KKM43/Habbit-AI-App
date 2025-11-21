// src/navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import AIScreen from '../screens/AIScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      {/* <HomeStack.Screen name="CreateHabit" component={CreateHabitScreen} /> */}
      <HomeStack.Screen 
  name="CreateHabit" 
  component={CreateHabitScreen} 
  options={{ headerShown: false, presentation: 'modal' }} 
/>
      <HomeStack.Screen name="HabitDetail" component={HabitDetailScreen} />
    </HomeStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Habits') iconName = 'list';
          else if (route.name === 'AI') iconName = 'bulb';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Habits" component={HomeStackNavigator} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}