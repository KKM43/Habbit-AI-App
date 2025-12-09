// src/screens/EditHabitScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import {
  scheduleHabitReminder,
  cancelHabitReminder,
} from "../utils/notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import { Platform } from "react-native";

const categories = [
  "Health",
  "Fitness",
  "Mindfulness",
  "Learning",
  "Productivity",
  "Social",
  "Other",
];

export default function EditHabitScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  useEffect(() => {
    const habitRef = doc(db, "users", auth.currentUser.uid, "habits", habitId);
    const unsub = onSnapshot(habitRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setHabit({ id: doc.id, ...data });
        setName(data.name || "");
        setCategory(data.category || "");
        setNotes(data.notes || "");
        setRemindersEnabled(data.remindersEnabled || false);
        setReminderTime(data.reminderTime || "20:00");
      }
    });
    return unsub;
  }, [habitId]);

  const saveChanges = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a habit name");
      return;
    }

    try {
      const habitRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "habits",
        habitId
      );

      // cancel old (safe)
      await cancelHabitReminder(habitId);

      // schedule new
      if (remindersEnabled && reminderTime) {
        const [hour, minute] = reminderTime.split(":").map(Number);
        await scheduleHabitReminder(name.trim(), hour, minute, habitId);
      }

      await updateDoc(habitRef, {
        name: name.trim(),
        category: category || null,
        notes: notes.trim() || null,
        remindersEnabled,
        reminderTime: remindersEnabled ? reminderTime : null,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const deleteHabit = () => {
    Alert.alert("Delete Habit?", "This cannot be undone", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await cancelHabitReminder(habitId);

          await deleteDoc(
            doc(db, "users", auth.currentUser.uid, "habits", habitId)
          );
          navigation.goBack();
        },
      },
    ]);
  };

  if (!habit)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>
    );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Edit Habit
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Habit name"
        placeholderTextColor={theme.colors.textTertiary}
      />

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Category
      </Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catBtn,
              category === cat && [
                styles.catSelected,
                { backgroundColor: theme.colors.primary },
              ],
              {
                backgroundColor:
                  category !== cat ? theme.colors.surfaceAlt : undefined,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setCategory(category === cat ? "" : cat)}
          >
            <Text
              style={[
                styles.catText,
                category === cat && styles.catTextSelected,
                {
                  color: category === cat ? "#fff" : theme.colors.textSecondary,
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes (optional)"
        placeholderTextColor={theme.colors.textTertiary}
        multiline
      />

      <View style={styles.reminderSection}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Daily Reminder
        </Text>
        <View style={styles.row}>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={
              remindersEnabled
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text style={[styles.toggleText, { color: theme.colors.text }]}>
            Notify me daily
          </Text>
        </View>
        {remindersEnabled && (
          <TouchableOpacity
            style={[
              styles.timeBtn,
              {
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.timeText, { color: theme.colors.text }]}>
              {reminderTime}
            </Text>
          </TouchableOpacity>
        )}
        {showPicker && (
          <DateTimePicker
            value={pickerDate}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(e, date) => {
              setShowPicker(Platform.OS === "ios");
              if (date) {
                const h = date.getHours();
                const m = date.getMinutes();
                setReminderTime(
                  `${h.toString().padStart(2, "0")}:${m
                    .toString()
                    .padStart(2, "0")}`
                );
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
        onPress={saveChanges}
      >
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: "bold", flex: 1, textAlign: "center" },
  input: {
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
  },
  label: { marginLeft: 20, marginTop: 20, fontSize: 16, fontWeight: "600" },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    paddingTop: 10,
  },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  catSelected: {},
  catText: { fontSize: 14, fontWeight: "500" },
  catTextSelected: { color: "#fff", fontWeight: "600" },
  textArea: { height: 120, textAlignVertical: "top" },
  reminderSection: { marginHorizontal: 20, marginTop: 10 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  toggleText: { marginLeft: 10, fontSize: 16, fontWeight: "500" },
  timeBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  timeText: { marginLeft: 12, fontSize: 18, fontWeight: "500" },
  saveBtn: { margin: 20, padding: 18, borderRadius: 12, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
