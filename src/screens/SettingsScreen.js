// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { auth } from '../../firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';


export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const logout = () => {
    Alert.alert("Log out?", "See you soon!", [
      { text: "Cancel" },
      { text: "Log out", onPress: () => signOut(auth) }
    ]);
  };

  const clearAllData = async () => {
    Alert.alert(
      "Delete ALL Data?",
      "This will permanently delete:\n• All your habits\n• All progress & streaks\n• All tasks\n• Account preferences\n\nThis cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            Alert.alert(
              "Final Confirmation",
              "Type DELETE to confirm",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "DELETE",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const userId = auth.currentUser.uid;

                      
                      const habitsRef = collection(db, 'users', userId, 'habits');
                      const habitsSnap = await getDocs(habitsRef);
                      for (const habitDoc of habitsSnap.docs) {
                        const progressRef = collection(db, 'users', userId, 'habits', habitDoc.id, 'progress');
                        const progressSnap = await getDocs(progressRef);
                        for (const prog of progressSnap.docs) {
                          await deleteDoc(prog.ref);
                        }
                        await deleteDoc(habitDoc.ref);
                      }

                      
                      const tasksRef = collection(db, 'users', userId, 'tasks');
                      const tasksSnap = await getDocs(tasksRef);
                      for (const task of tasksSnap.docs) {
                        await deleteDoc(task.ref);
                      }

                      
                      await Notifications.cancelAllScheduledNotificationsAsync();

                      Alert.alert(
                        "All Data Deleted",
                        "Your slate is clean. Ready for a fresh start?",
                        [{ text: "OK", onPress: () => signOut(auth) }]
                      );
                    } catch (error) {
                      Alert.alert("Error", "Something went wrong. Try again.");
                      console.error(error);
                    }
                  }
                }
              ],
              { cancelable: true }
            );
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={theme.colors.gradient2}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your app preferences</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Preferences Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Preferences</Text>
        
        <View style={[styles.item, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.itemLabel}>
            <Ionicons name="notifications" size={20} color={theme.colors.primary} />
            <View style={styles.itemLabelText}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]}>Daily Reminders</Text>
              <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}>Get notified for your habits</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.successLight }}
            thumbColor={notifications ? theme.colors.success : theme.colors.textTertiary}
          />
        </View>

        <View style={[styles.item, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.itemLabel}>
            <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={theme.colors.primary} />
            <View style={styles.itemLabelText}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]}>Dark Mode</Text>
              <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}>{isDarkMode ? 'Enabled' : 'Disabled'}</Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.colors.border, true: theme.colors.successLight }}
            thumbColor={isDarkMode ? theme.colors.success : theme.colors.textTertiary}
          />
        </View>

        <TouchableOpacity
  style={[styles.item, styles.aiReview]}
  onPress={() => navigation.navigate('WeeklyReview')}
>
  <View style={styles.itemLabel}>
    <Ionicons name="sparkles" size={24} color="#ffd700" />
    <View style={styles.itemLabelText}>
      <Text style={[styles.itemTitle, { color: theme.colors.text }]}>Weekly AI Review</Text>
      <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}>
        Get a personal message about your progress
      </Text>
    </View>
  </View>
  <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
</TouchableOpacity>
      </View>

      {/* Data & Privacy Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Data & Privacy</Text>
        <TouchableOpacity style={[styles.item, { borderBottomColor: theme.colors.border }]} onPress={clearAllData}>
          <View style={styles.itemLabel}>
            <Ionicons name="trash" size={20} color={theme.colors.error} />
            <Text style={[styles.itemTitle, { color: theme.colors.error, marginLeft: 12 }]}>Delete All Data</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.item} onPress={logout}>
          <View style={styles.itemLabel}>
            <Ionicons name="log-out" size={20} color={theme.colors.error} />
            <Text style={[styles.itemTitle, { color: theme.colors.error, marginLeft: 12 }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.colors.textTertiary }]}>Habit Tracker v1.0 • Built with love</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  headerContent: {},
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemLabelText: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  version: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 13,
    fontWeight: '500',
  },
  aiReview: {
  backgroundColor: '#6200ee10',
  borderWidth: 2,
  borderColor: '#6200ee30',
  borderRadius: 16,
  marginHorizontal: 16,
  marginTop: 24,
  padding: 20
},
});
