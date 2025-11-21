// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import HabitCard from '../components/HabitCard';
import { getTodayString } from '../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);
  const userId = auth.currentUser.uid;



useEffect(() => {
  const habitsRef = collection(db, 'users', userId, 'habits');

  // Listen to each habit + its progress subcollection
  const unsubscribers = [];

  const q = query(habitsRef, orderBy('createdAt', 'desc'));
  const mainUnsubscribe = onSnapshot(q, (snapshot) => {
    const habitsList = snapshot.docs.map(habitDoc => {
      const habitData = { id: habitDoc.id, ...habitDoc.data(), progress: {} };

      // For each habit, listen to its progress subcollection
      const progressRef = collection(db, 'users', userId, 'habits', habitDoc.id, 'progress');
      const progressUnsubscribe = onSnapshot(progressRef, (progressSnap) => {
        const progress = {};
        progressSnap.forEach(doc => {
          progress[doc.id] = doc.data();
        });

        setHabits(prev => {
          const exists = prev.find(h => h.id === habitDoc.id);
          if (exists) {
            return prev.map(h => h.id === habitDoc.id ? { ...h, progress } : h);
          } else {
            return [...prev, { ...habitData, progress }];
          }
        });
      });

      unsubscribers.push(progressUnsubscribe);

      return habitData;
    });

    setHabits(habitsList);
  });

  return () => {
    mainUnsubscribe();
    unsubscribers.forEach(unsub => unsub());
  };
}, [userId]);

  const toggleToday = async (habitId, currentProgress) => {
    const today = getTodayString();
    const progressRef = doc(db, 'users', userId, 'habits', habitId, 'progress', today);

    if (currentProgress?.[today]?.status === 'done') {
      await deleteDoc(progressRef); // unmark
    } else {
      await setDoc(progressRef, { status: 'done', timestamp: new Date() }, { merge: true });
    }
  };

  const deleteHabit = (habitId) => {
    Alert.alert('Delete Habit', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Ionicons name="log-out-outline" size={28} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            progress={item.progress}
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
            onToggleToday={() => toggleToday(item.id, item.progress)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No habits yet. Create one! ✨</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateHabit')}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#888' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#6200ee', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 },
});