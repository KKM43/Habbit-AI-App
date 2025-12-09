// src/screens/WeeklyReviewScreen.js — THE SMARTEST WEEKLY REVIEW IN THE WORLD
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { getWeeklySummary } from '../utils/ai';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function WeeklyReviewScreen({ navigation }) {
  const { theme } = useTheme();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSmartReview = async () => {
      try {
        if (!auth.currentUser) throw new Error('User not authenticated');

        const habitsRef = collection(db, 'users', auth.currentUser.uid, 'habits');
        const snapshot = await getDocs(habitsRef);

        if (snapshot.empty) {
          setReview({
            summary: "You haven't added any habits yet.",
            recommendation: "Start by creating your first habit – small steps lead to big transformations!",
          });
          setLoading(false);
          return;
        }

        const habits = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Unnamed Habit',
          progress: doc.data().progress || {},
        }));

        
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          last7Days.push(date.toISOString().split('T')[0]); 
        }

        let totalChecks = 0;
        let completedChecks = 0;
        const habitStats = [];

        habits.forEach((habit) => {
          let currentStreak = 0;
          let maxStreak = 0;
          let doneInWeek = 0;

          
          [...last7Days].reverse().forEach((date) => {
            const dayData = habit.progress[date];
            if (dayData?.status === 'done') {
              doneInWeek++;
              completedChecks++;
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else if (dayData?.status === 'missed' || dayData?.status === 'skipped') {
              currentStreak = 0;
            }
            
          });

          totalChecks += 7; 

          habitStats.push({
            name: habit.name,
            done: doneInWeek,
            streak: currentStreak,
            maxStreak,
          });
        });

        const completionRate = Math.round((completedChecks / totalChecks) * 100);
        const longestCurrentStreak = Math.max(...habitStats.map((h) => h.streak), 0);

        
        const bestHabit = habitStats.reduce((prev, curr) =>
          curr.done > prev.done ? curr : prev
        );
        const worstHabit = habitStats.reduce((prev, curr) =>
          curr.done < prev.done ? curr : prev
        );

        const aiReview = await getWeeklySummary({
          completionRate,
          totalHabits: habits.length,
          longestStreak: longestCurrentStreak,
          bestHabit: bestHabit.name,
          worstHabit: worstHabit.name,
          totalChecks,
          completedChecks,
          weekStart: last7Days[0],
          weekEnd: last7Days[6],
        });

        setReview(aiReview);
      } catch (error) {
        console.error('Weekly review error:', error);
        setReview({
          summary:
            "Even when tech fails, your effort doesn't. You're still showing up — and that's what matters.",
          recommendation: 'Keep going. The streaks will come.',
        });
      } finally {
        setLoading(false);
      }
    };

    generateSmartReview();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          AI is writing your personal review...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.colors.text }]}>Your Week in Review</Text>
      <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.summary, { color: theme.colors.text }]}>{review.summary}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.recTitle, { color: theme.colors.primary }]}>AI's Advice:</Text>
        <Text style={[styles.recommendation, { color: theme.colors.text }]}>
          {review.recommendation}
        </Text>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  date: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 30,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 28,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  summary: {
    fontSize: 22,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '600',
  },
  recTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendation: {
    fontSize: 19,
    lineHeight: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontStyle: 'italic',
  },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
});