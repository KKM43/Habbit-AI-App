// src/screens/AIScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { suggestHabits, getMotivation } from '../utils/ai';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AIScreen() {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    const result = await suggestHabits(goal);
    // result is an array with optional `_source` property ("ai", "fallback", "client-fallback")
    setSuggestions(result || []);
    setLoading(false);
  };

  const addSuggestedHabit = async (sugg) => {
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'habits'), {
      name: sugg.name,
      category: sugg.category || 'Other',
      notes: '',
      createdAt: serverTimestamp(),
    });
    Alert.alert('Added!', `${sugg.name} added to your habits`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Habit Suggestions ✨</Text>
      <TextInput
        style={styles.input}
        placeholder="Your goal (e.g., get fit, be more productive)"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity style={styles.button} onPress={generateSuggestions} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Thinking...' : 'Suggest Habits'}</Text>
      </TouchableOpacity>

      <FlatList
        data={suggestions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.suggCard}>
            <Text style={styles.suggName}>{item.name}</Text>
            {item.category && <Text style={styles.category}>{item.category}</Text>}
            <TouchableOpacity style={styles.addBtn} onPress={() => addSuggestedHabit(item)}>
              <Text style={styles.addText}>+ Add to My Habits</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, fontSize: 16 },
  button: { backgroundColor: '#6200ee', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 20 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  suggCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  suggName: { fontSize: 18, fontWeight: '600' },
  category: { color: '#6200ee', marginTop: 4 },
  addBtn: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#6200ee', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addText: { color: '#fff', fontWeight: '600' },
  sourceBanner: { marginTop: 12, alignItems: 'center' },
  sourceText: { color: '#666', fontSize: 13 },
});