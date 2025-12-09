import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';

export default function StreakFreezeButton({ habitId, currentStreak }) {
  const [freezesLeft, setFreezesLeft] = useState(2);
  const [usedToday, setUsedToday] = useState(false);

  useEffect(() => {
    const loadFreezeStatus = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data() || {};
      
      const today = new Date().toDateString();
      const lastFreezeDate = data.lastStreakFreezeDate?.toDate?.()?.toDateString();

      
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
      const lastMonthKey = data.lastFreezeMonth || '';

      if (monthKey !== lastMonthKey) {
        await updateDoc(userRef, {
          streakFreezesUsed: 0,
          lastFreezeMonth: monthKey
        });
        setFreezesLeft(2);
      } else {
        setFreezesLeft(2 - (data.streakFreezesUsed || 0));
      }

      
      const habitRef = doc(db, 'users', auth.currentUser.uid, 'habits', habitId);
      const habitSnap = await getDoc(habitRef);
      setUsedToday(habitSnap.data()?.streakFrozenToday === true);
    };

    loadFreezeStatus();
  }, [habitId]);

  const useFreeze = async () => {
    if (freezesLeft <= 0) {
      Alert.alert("No Freezes Left", "You get 2 per month — next reset on the 1st!");
      return;
    }
    if (usedToday) {
      Alert.alert("Already Used", "You already froze this habit today");
      return;
    }
    Alert.alert(
      "Use Streak Freeze?",
      `Protect your ${currentStreak}-day streak today?\n(${freezesLeft} left this month)`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Save My Streak!",
          onPress: async () => {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const habitRef = doc(db, 'users', auth.currentUser.uid, 'habits', habitId);

            await updateDoc(habitRef, { streakFrozenToday: true });
            await updateDoc(userRef, {
              streakFreezesUsed: increment(1),
              lastStreakFreezeDate: serverTimestamp()
            });

            setFreezesLeft(prev => prev - 1);
            setUsedToday(true);
            Alert.alert("Streak Saved!", "Your streak is protected today");
          }
        }
      ]
    );
  };

  if (usedToday) {
    return (
      <View style={styles.usedContainer}>
        <Ionicons name="shield-checkmark" size={20} color="#4caf50" />
        <Text style={styles.usedText}>Streak frozen today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, freezesLeft === 0 && styles.disabled]}
      onPress={useFreeze}
      disabled={freezesLeft === 0}
    >
      <Ionicons name="snow" size={20} color="#fff" />
      <Text style={styles.text}>
        Streak Freeze ({freezesLeft} left)
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#00B4D8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  disabled: { backgroundColor: '#ccc' },
  text: { color: '#fff', fontWeight: '600', marginLeft: 8 },
  usedContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, opacity: 0.7 },
  usedText: { marginLeft: 8, fontStyle: 'italic', color: '#4caf50' }
});