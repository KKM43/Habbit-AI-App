// src/screens/HabitDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, onSnapshot, deleteDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import { getDatesArray, calculateStreaks } from '../utils/dateUtils';

export default function HabitDetailScreen({ route, navigation }) {
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
            // Correct way: create the exact same doc reference
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteHabit}>
          <Ionicons name="trash" size={28} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{habit.name}</Text>
      {habit.category && <Text style={styles.category}>{habit.category}</Text>}
      <Text style={styles.streak}>Current Streak: {current}  |  Best: {best}</Text>

      {habit.notes ? <Text style={styles.notes}>{habit.notes}</Text> : null}

      <Text style={styles.calendarTitle}>Last 30 Days</Text>
      <View style={styles.calendar}>
        {dates.map((date) => {
          const done = habit.progress?.[date]?.status === 'done';
          return (
            <View key={date} style={styles.day}>
              <Text style={styles.dayLabel}>{date.slice(8)}</Text>
              <View style={[styles.dayBox, done && styles.doneBox]} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Styles unchanged (copy from your file)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  name: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20 },
  category: { fontSize: 18, color: '#6200ee', paddingHorizontal: 20, marginTop: 5 },
  streak: { fontSize: 18, paddingHorizontal: 20, marginTop: 20, fontWeight: '600' },
  notes: { padding: 20, backgroundColor: '#f9f9f9', margin: 20, borderRadius: 12 },
  calendarTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 30 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', padding: 20 },
  day: { alignItems: 'center', width: '14%', marginBottom: 10 },
  dayLabel: { fontSize: 12, color: '#666' },
  dayBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#eee', marginTop: 5 },
  doneBox: { backgroundColor: '#4caf50' },
});