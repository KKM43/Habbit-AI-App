// // src/utils/notifications.js

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// show even if app in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export async function requestPermissions() {
  const perms = await Notifications.requestPermissionsAsync();
  if (perms.status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  return true;
}

// ---------------------------------------------------------
// INTERNAL: check future time (no immediate trigger bug)
// ---------------------------------------------------------
function getNextTriggerDate(hour, minute) {
  const now = new Date();
  const target = new Date();

  target.setHours(hour);
  target.setMinutes(minute);
  target.setSeconds(0);

  // if time already passed -> schedule tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

// ---------------------------------------------------------
// SAVE/LOAD PER-HABIT NOTIFICATION ID
// ---------------------------------------------------------
async function saveNotifId(habitId, id) {
  await AsyncStorage.setItem(`notif_${habitId}`, id);
}

async function loadNotifId(habitId) {
  return AsyncStorage.getItem(`notif_${habitId}`);
}

async function clearNotifId(habitId) {
  await AsyncStorage.removeItem(`notif_${habitId}`);
}

// ---------------------------------------------------------
// PUBLIC — schedule for a habitId
// ---------------------------------------------------------
export async function scheduleHabitReminder(habitName, hour, minute, habitId) {
  if (!habitId) {
    console.warn('scheduleHabitReminder: missing habitId!');
    return null;
  }

  // cancel previous if exists
  const existing = await loadNotifId(habitId);
  if (existing) {
    await Notifications.cancelScheduledNotificationAsync(existing);
    await clearNotifId(habitId);
  }

  const triggerDate = getNextTriggerDate(hour, minute);
  const now = new Date();
  const secondsUntil = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);

  console.log(`Scheduling reminder for ${habitName} at ${hour}:${minute.toString().padStart(2, '0')}`);
  console.log(`Next trigger in ${secondsUntil} seconds (${Math.floor(secondsUntil / 60)} minutes)`);
  console.log(`Next trigger time: ${triggerDate.toLocaleString()}`);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Habit Reminder',
      body: `Time to do: ${habitName}!`,
      sound: true,
      data: { habitId },
    },
    trigger: {
      channelId: Platform.OS === 'android' ? 'habit-reminders' : undefined,
      seconds: Math.max(secondsUntil, 10),  // ⭐ Use seconds for initial delay, minimum 10 seconds
      repeats: true                          // ⭐ Repeats daily after first trigger
    }
  });

  await saveNotifId(habitId, id);
  console.log('Notification scheduled successfully with ID:', id);
  return id;
}

// ---------------------------------------------------------
// cancel for habitId (safe)
// ---------------------------------------------------------
export async function cancelHabitReminder(habitId) {
  if (!habitId) return;

  const existing = await loadNotifId(habitId);
  if (!existing) return;

  await Notifications.cancelScheduledNotificationAsync(existing);
  await clearNotifId(habitId);
}
