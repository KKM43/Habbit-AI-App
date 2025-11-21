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
import { requestPermissions, scheduleHabitReminder } from '../utils/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = ['Health', 'Fitness', 'Mindfulness', 'Learning', 'Productivity', 'Social', 'Other'];

export default function CreateHabitScreen({ navigation }) {
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>New Habit</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Habit Name */}
      <TextInput
        style={styles.input}
        placeholder="Habit name (e.g., Drink 2L water)"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      {/* Category */}
      <Text style={styles.label}>Category (optional)</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catButton, category === cat && styles.catSelected]}
            onPress={() => setCategory(category === cat ? '' : cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catTextSelected]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
      />

      {/* Daily Reminder */}
<View style={styles.reminderSection}>
  <Text style={styles.label}>Daily Reminder</Text>
  <View style={styles.row}>
    <Switch value={remindersEnabled} onValueChange={setRemindersEnabled} />
    <Text style={styles.toggleText}>Notify me daily</Text>
  </View>

  {remindersEnabled && (
    <View style={{ marginTop: 15 }}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="time-outline" size={24} color="#6200ee" />
        <Text style={styles.timeText}>
          {selectedTime ? selectedTime : 'Tap to set time'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          is24Hour={false}   // Shows AM/PM
          display="spinner"  // Nice spinner on Android, clock on iOS
          onChange={onTimeChange}
        />
      )}
    </View>
  )}
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  save: { fontSize: 18, color: '#6200ee', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  label: { marginLeft: 20, marginTop: 20, fontSize: 16, color: '#555' },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingTop: 10,
  },
  catButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
  },
  catSelected: { backgroundColor: '#6200ee' },
  catText: { color: '#666' },
  catTextSelected: { color: '#fff', fontWeight: '600' },
  textArea: { height: 120 },
  reminderSection: { marginHorizontal: 20, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  toggleText: { marginLeft: 10, fontSize: 16 },

  timeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#6200ee',
  borderRadius: 12,
  padding: 16,
  marginHorizontal: 20,
},
timeText: {
  marginLeft: 12,
  fontSize: 18,
  color: '#333',
  fontWeight: '500',
},
});