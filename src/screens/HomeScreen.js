// src/screens/HomeScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import HabitCard from '../components/HabitCard';
import { useTheme } from '../context/ThemeContext';
import { getTodayString } from '../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [habits, setHabits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = auth.currentUser.uid;
  const fabScale = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fabScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);



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

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut(auth);
      }}
    ]);
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
            <Text style={styles.headerTitle}>AI Habit Tracker</Text>
            <Text style={styles.headerSubtitle}>
              {habits.length} {habits.length === 1 ? 'habit' : 'habits'} to complete
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <View style={styles.headerBtnContent}>
              <Ionicons name="log-out-outline" size={20} color="#0A0E27" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            placeholder="Search habits..."
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Habits List */}
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
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="sparkles" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No habits yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Create your first habit to get started</Text>
          </View>
        }
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* FAB */}
      <AnimatedTouchable
        style={[styles.fab, { transform: [{ scale: fabScale }], backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateHabit')}
        activeOpacity={0.9}
        onPressIn={() => Animated.spring(fabScale, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start()}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </AnimatedTouchable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  headerContent: {
    flex: 1,
  },
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
  headerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnContent: {},
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  emptyStateContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});