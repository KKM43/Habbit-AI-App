// src/components/HabitCard.js
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { calculateStreaks } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';

export default function HabitCard({ habit, progress, onPress, onToggleToday }) {
  const { theme } = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const todayDone = progress?.[today]?.status === 'done';
  const { current, best } = calculateStreaks(progress);
  const initial = habit.name ? habit.name.charAt(0).toUpperCase() : '?';
  const percent = best > 0 ? Math.min(1, current / best) : (current > 0 ? 1 : 0);
  const scale = useRef(new Animated.Value(1)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  const getStreakColor = () => {
    if (current >= best && best > 0) return '#26D07C';
    if (current > 0) return '#FDB022';
    return '#A0AEC0';
  };

  return (
    <AnimatedTouchable
      style={[styles.cardWrapper, { transform: [{ scale }] }]}
      onPress={onPress}
      activeOpacity={0.95}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Header with Avatar and Title */}
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={theme.colors.gradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>

          <View style={styles.titleSection}>
            <Text style={[styles.habitName, { color: theme.colors.text }]} numberOfLines={1}>{habit.name}</Text>
            {habit.category && <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{habit.category}</Text>}
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onToggleToday();
            }}
            style={styles.checkButton}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: theme.colors.border }, todayDone && { backgroundColor: theme.colors.success, borderColor: theme.colors.success }]}>
              {todayDone && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Streak Stats */}
        <View style={[styles.statsRow, { backgroundColor: theme.colors.surfaceAlt }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Current</Text>
            <Text style={[styles.statValue, { color: getStreakColor() }]}>
              🔥 {current}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Best</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{best}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceAlt }]}>
            <LinearGradient
              colors={todayDone ? [theme.colors.success, '#059669'] : theme.colors.gradient1}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${Math.round(percent * 100)}%` }]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>{Math.round(percent * 100)}%</Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  titleSection: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    marginTop: 2,
  },
  checkButton: {
    padding: 8,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {},
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
  },
  progressSection: {
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
});