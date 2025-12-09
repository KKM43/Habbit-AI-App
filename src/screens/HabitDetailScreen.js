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
            <Ionicons name="create" size={22} color={theme.colors.primary} />
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

      {/* MILESTONE CELEBRATION MESSAGE */}
      {(current === 7 || current === 14 || current === 21 || current === 30) && (
        <View style={[styles.milestoneCard, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
          <Ionicons name="star" size={28} color={theme.colors.primary} style={{ marginBottom: 8 }} />
          <Text style={[styles.milestoneTitle, { color: theme.colors.primary }]}>Amazing Milestone!</Text>
          <Text style={[styles.milestoneText, { color: theme.colors.text }]}>
            {current === 7 && "🔥 You've reached a week! Keep the momentum going!"}
            {current === 14 && "💪 Two weeks of consistency! You're on fire!"}
            {current === 21 && "🌟 Three weeks! This is now becoming a habit!"}
            {current === 30 && "👑 30 days of excellence! You're unstoppable!"}
          </Text>
        </View>
      )}

      <View style={[styles.calendarSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>Last 30 Days</Text>
        <View style={styles.calendar}>
          {dates.map((date) => {
            const progress = habit.progress?.[date];
            const done = progress?.status === 'done';
            const isFrozen = progress?.frozen;
            const isMissed = progress?.status === 'missed' || (!done && progress);
            
            return (
              <View key={date} style={styles.day}>
                <Text style={[styles.dayLabel, { color: theme.colors.textSecondary }]}>{date.slice(8)}</Text>
                <View style={[styles.dayBox, { 
                  backgroundColor: isFrozen ? '#E0F4FF' : (done ? theme.colors.success : (isMissed ? '#FFE0E0' : theme.colors.surfaceAlt)) 
                }]}>
                  {isFrozen && <Ionicons name="snow" size={18} color="#00B4D8" />}
                  {done && !isFrozen && <Ionicons name="checkmark" size={20} color="white" style={{ fontWeight: 'bold' }} />}
                  {isMissed && !isFrozen && <Ionicons name="close" size={20} color="#FF6B6B" style={{ fontWeight: 'bold' }} />}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

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
  milestoneCard: { margin: 20, padding: 20, borderRadius: 16, borderWidth: 2, alignItems: 'center' },
  milestoneTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  milestoneText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  calendarSection: { margin: 20, padding: 24, borderRadius: 20, borderWidth: 1 },
  calendarTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  day: { alignItems: 'center', width: '22%', marginBottom: 8 },
  dayLabel: { fontSize: 11, marginBottom: 6, fontWeight: '600', letterSpacing: 0.3 },
  dayBox: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  doneBox: { opacity: 1 },
});