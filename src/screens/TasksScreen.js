// src/screens/TasksScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { auth, db } from '../../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function TasksScreen() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const tasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(list); 
    });

    return unsubscribe;
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    if (tasks.filter(t => !t.completed).length >= 5) {
      Alert.alert("Daily Limit", "You can only have 5 active tasks per day!");
      return;
    }
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'tasks'), {
      text: newTask.trim(),
      completed: false,
      createdAt: serverTimestamp()
    });
    setNewTask('');
  };

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id), {
      completed: !current
    });
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Remove this task permanently?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id)) }
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
            <Text style={styles.headerTitle}>Today's Focus</Text>
            <Text style={styles.headerSubtitle}>
              {tasks.filter(t => !t.completed).length}/5 active • {tasks.filter(t => t.completed).length} done
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={[styles.inputRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="What needs to get done?"
            placeholderTextColor={theme.colors.textTertiary}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.colors.primary }]} onPress={addTask}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, item.completed && styles.completedItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)} style={styles.checkboxBtn}>
              <Ionicons
                name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                size={28}
                color={item.completed ? theme.colors.success : theme.colors.primary}
              />
            </TouchableOpacity>
            <Text style={[styles.taskText, item.completed && styles.completedText, { color: item.completed ? theme.colors.textSecondary : theme.colors.text }]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="checkmark-done-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No tasks yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Add up to 5 tasks and crush today!</Text>
          </View>
        }
      />
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
    paddingHorizontal: 16,
  },
  headerContent: {},
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
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
  },
  completedItem: {
    opacity: 0.65,
  },
  checkboxBtn: {
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
  emptyStateContainer: {
    marginTop: 48,
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
    marginTop: 8,
  },
});