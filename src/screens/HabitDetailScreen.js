// src/screens/HabitDetailScreen.js 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, onSnapshot, deleteDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getDatesArray, calculateStreaks } from '../utils/dateUtils';
import StreakFreezeButton from '../components/StreakFreezeButton'; 

export default function HabitDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const progressRef = collection(db, 'users', userId, 'habits', habitId, 'progress');

    const unsubHabit = onSnapshot(habitRef, (docSnap) => {
      if (docSnap.exists()) {
        setHabit({ id: docSnap.id, ...docSnap.data() });
      }
    });

    const unsubProgress = onSnapshot(progressRef, (snapshot) => {
      const progress = {};
      snapshot.docs.forEach((d) => {
        progress[d.id] = d.data();
      });
      setHabit((prev) => ({ ...prev, progress }));
    });

    return () => {
      unsubHabit();
      unsubProgress();
    };
  }, [habitId, userId]);

  const deleteHabit = async () => {
    Alert.alert('Delete Habit', 'This cannot be undone!', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const habitDocRef = doc(db, 'users', userId, 'habits', habitId);
            await deleteDoc(habitDocRef);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  if (!habit) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;

  const dates = getDatesArray(30);
  const { current, best } = calculateStreaks(habit.progress || {});

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('EditHabit', { habitId })} style={styles.iconBtn}>
            <Ionicons name="pencil" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteHabit} style={styles.iconBtn}>
            <Ionicons name="trash" size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{habit.name}</Text>
        {habit.category && <Text style={[styles.category, { color: theme.colors.primary }]}>{habit.category}</Text>}
        
        <View style={[styles.heroMeta, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.streak, { color: theme.colors.text }]}>Current: {current}</Text>
          <Text style={[styles.best, { color: theme.colors.textSecondary }]}>Best: {best}</Text>
        </View>

        {/* STREAK FREEZE BUTTON — ADDED HERE */}
        <StreakFreezeButton habitId={habitId} currentStreak={current} />
      </View>

      {habit.notes ? (
        <Text style={[styles.notes, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}>
          {habit.notes}
        </Text>
      ) : null}

      <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>Last 30 Days</Text>
      <View style={styles.calendar}>
        {dates.map((date) => {
          const done = habit.progress?.[date]?.status === 'done';
          return (
            <View key={date} style={styles.day}>
              <Text style={[styles.dayLabel, { color: theme.colors.textSecondary }]}>{date.slice(8)}</Text>
              <View style={[styles.dayBox, done && styles.doneBox, { backgroundColor: done ? theme.colors.success : theme.colors.surfaceAlt }]} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Your existing styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  headerRight: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 8 },
  hero: { margin: 20, padding: 24, borderRadius: 20, borderWidth: 1, paddingBottom: 20 },
  name: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  category: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderRadius: 16, marginTop: 12 },
  streak: { fontSize: 24, fontWeight: '700' },
  best: { fontSize: 18, opacity: 0.8 },
  notes: { margin: 20, padding: 20, borderRadius: 16, borderWidth: 1, fontSize: 16, lineHeight: 24 },
  calendarTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 8 },
  day: { alignItems: 'center', width: '12.5%' },
  dayLabel: { fontSize: 12, marginBottom: 4 },
  dayBox: { width: 36, height: 36, borderRadius: 10 },
  doneBox: { opacity: 1 },
});