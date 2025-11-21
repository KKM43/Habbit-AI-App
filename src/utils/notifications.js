// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Enable notifications in Settings!');
    return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
    });
  }
  return true;
}

export async function scheduleHabitReminder(habitName, hour, minute, habitId) {
  const identifier = `habit_${habitId}`;
  await Notifications.cancelScheduledNotificationAsync(identifier);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Time!",
      body: `${habitName} — keep your streak alive!`,
      sound: 'default',
    },
    trigger: { hour, minute, repeats: true },
    identifier,
  });
}