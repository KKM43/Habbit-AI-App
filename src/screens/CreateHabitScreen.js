// src/screens/CreateHabitScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { requestPermissions, scheduleHabitReminder } from '../utils/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = ['Health', 'Fitness', 'Mindfulness', 'Learning', 'Productivity', 'Social', 'Other'];

export default function CreateHabitScreen({ navigation }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00'); // 8 PM default
const [showPicker, setShowPicker] = useState(false);
const [selectedTime, setSelectedTime] = useState('');  // e.g., "8:30 PM"
const [pickerDate, setPickerDate] = useState(new Date()); // for the picker

  const handleSave = async () => {
  if (!name.trim()) {
    Alert.alert('Missing name', 'Please enter a habit name');
    return;
  }

  try {
    // STEP 1: First create the habit and GET the document reference
    const docRef = await addDoc(collection(db, 'users', auth.currentUser.uid, 'habits'), {
      name: name.trim(),
      category: category || null,
      notes: notes.trim() || null,
      remindersEnabled,
      reminderTime: remindersEnabled ? reminderTime : null,
      createdAt: serverTimestamp(),
    });

    // STEP 2: NOW we have docRef.id → schedule reminder using the real habit ID
    if (remindersEnabled && reminderTime) {
      const [hour, minute] = reminderTime.split(':').map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        await requestPermissions();
        await scheduleHabitReminder(name.trim(), hour, minute, docRef.id); // ← FIXED: docRef.id exists now!
      }
    }

    navigation.goBack();
  } catch (error) {
    console.error(error);
    Alert.alert('Save failed', error.message);
  }
};

const onTimeChange = (event, selectedDate) => {
  const currentDate = selectedDate || pickerDate;
  setShowPicker(Platform.OS === 'ios'); // On iOS keep picker open until done

  setPickerDate(currentDate);

  // Format nicely with AM/PM
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const formatted = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  setSelectedTime(formatted);

  // Also save 24-hour format for scheduling
  setReminderTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
};

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surfaceAlt, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>New Habit</Text>
        <TouchableOpacity onPress={handleSave} style={[styles.headerBtn, styles.saveBtn, { backgroundColor: theme.colors.primary }]} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Habit Name */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Habit Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="e.g., Drink 2L water daily"
          placeholderTextColor={theme.colors.textTertiary}
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={40}
        />

        {/* Category */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, category === cat && [styles.categoryBtnActive, { backgroundColor: theme.colors.primary }], { backgroundColor: category === cat ? theme.colors.primary : theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
              onPress={() => setCategory(category === cat ? '' : cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive, { color: category === cat ? '#fff' : theme.colors.textSecondary }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Add any notes or instructions..."
          placeholderTextColor={theme.colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />

        {/* Daily Reminder */}
        <View style={styles.reminderSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Daily Reminder</Text>
          <View style={styles.toggleRow}>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={remindersEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text style={[styles.toggleText, { color: theme.colors.text }]}>
              {remindersEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          {remindersEnabled && (
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.timeButtonText, { color: theme.colors.text }]}>
                {selectedTime || 'Set reminder time'}
              </Text>
            </TouchableOpacity>
          )}

          {showPicker && (
            <DateTimePicker
              value={pickerDate}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onTimeChange}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {},
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryBtnActive: {},
  categoryBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryBtnTextActive: {
    color: '#fff',
  },
  reminderSection: {
    marginTop: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  toggleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 48,
  },
  timeButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});