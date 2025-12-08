// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler - only show if app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('Notification received:', notification);
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
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
  
  try {
    // Cancel any existing notification first
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (e) {
      console.log('No existing notification to cancel');
    }

    console.log(`Scheduling reminder for ${habitName} at ${hour}:${minute.toString().padStart(2, '0')}`);

    // Android requires a specific format for daily notifications
    // Use object with hour and minute for daily recurring notifications
    const trigger = {
      hour: hour,
      minute: minute,
      repeats: true, // This makes it daily
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Habit Reminder",
        body: `Time to do: ${habitName}!`,
        sound: true,
        data: { 
          habitId,
          habitName,
        },
      },
      trigger: trigger,
      identifier,
    });

    console.log('Notification scheduled successfully:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

export async function cancelHabitReminder(habitId) {
  const identifier = `habit_${habitId}`;
  await Notifications.cancelScheduledNotificationAsync(identifier);
}