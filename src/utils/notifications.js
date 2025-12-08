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

  // Calculate the next occurrence of the scheduled time
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  // Calculate seconds until the scheduled time
  const secondsUntil = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Time!",
      body: `${habitName} — keep your streak alive!`,
      sound: 'default',
    },
    trigger: {
      seconds: secondsUntil,
      repeats: true,
    },
    identifier,
  });
}

export async function cancelHabitReminder(habitId) {
  const identifier = `habit_${habitId}`;
  await Notifications.cancelScheduledNotificationAsync(identifier);
}