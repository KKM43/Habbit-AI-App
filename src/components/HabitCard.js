// src/components/HabitCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateStreaks } from '../utils/dateUtils';

export default function HabitCard({ habit, progress, onPress, onToggleToday }) {
  const today = new Date().toISOString().split('T')[0];
  const todayDone = progress?.[today]?.status === 'done';
  const { current, best } = calculateStreaks(progress);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name}>{habit.name}</Text>
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); onToggleToday(); }}>
          <Ionicons
            name={todayDone ? 'checkbox' : 'square-outline'}
            size={36}
            color={todayDone ? '#4caf50' : '#999'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.category}>{habit.category || 'Uncategorized'}</Text>

      <View style={styles.streakRow}>
        <Text style={styles.streak}>🔥 {current} day{current !== 1 ? 's' : ''}</Text>
        <Text style={styles.best}>Best: {best}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '600', maxWidth: '75%' },
  category: { color: '#666', marginTop: 4 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  streak: { fontSize: 16, fontWeight: 'bold', color: '#ff5722' },
  best: { fontSize: 14, color: '#888' },
});