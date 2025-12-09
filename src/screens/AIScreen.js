// src/screens/AIScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { suggestHabits, getMotivation } from "../utils/ai";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AIScreen() {
  const { theme } = useTheme();
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingIndex, setAddingIndex] = useState(null);

  // Enable LayoutAnimation on Android
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const generateSuggestions = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    const result = await suggestHabits(goal);
    setSuggestions(result || []);
    setLoading(false);
  };

  const addSuggestedHabit = async (sugg, index) => {
    try {
      setAddingIndex(index);
      await addDoc(collection(db, "users", auth.currentUser.uid, "habits"), {
        name: sugg.name,
        category: sugg.category || "Other",
        notes: "",
        createdAt: serverTimestamp(),
      });

      // Animate removal and then remove the added suggestion from the list so it disappears from the UI
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSuggestions((prev) => prev.filter((_, i) => i !== index));
      setAddingIndex(null);

      Alert.alert("Added!", `${sugg.name} added to your habits`);
    } catch (err) {
      console.warn("Failed to add suggested habit:", err);
      Alert.alert("Add Failed", "Could not add habit. Please try again.");
      setAddingIndex(null);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={theme.colors.gradient3}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>AI Habit Coach</Text>
            <Text style={styles.headerSubtitle}>
              Get personalized habit suggestions
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text
          style={[styles.inputLabel, { color: theme.colors.textSecondary }]}
        >
          What's your goal?
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="e.g., Get fit, improve productivity..."
          placeholderTextColor={theme.colors.textTertiary}
          value={goal}
          onChangeText={setGoal}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={generateSuggestions}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons
            name={loading ? "hourglass" : "sparkles"}
            size={20}
            color="#fff"
          />
          <Text style={styles.buttonText}>
            {loading ? "Thinking..." : "Get Suggestions"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      <FlatList
        data={suggestions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.suggestionCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.suggestionHeader}>
              <View>
                <Text
                  style={[styles.suggestionTitle, { color: theme.colors.text }]}
                >
                  {item.name}
                </Text>
                {item.category && (
                  <Text
                    style={[
                      styles.suggestionCategory,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {item.category}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.colors.primary },
                addingIndex === index && styles.addingButton,
              ]}
              onPress={() => addSuggestedHabit(item, index)}
              activeOpacity={0.8}
              disabled={addingIndex === index}
            >
              {addingIndex === index ? (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Ionicons name="add-circle" size={18} color="#fff" />
              )}
              <Text style={styles.addButtonText}>
                {addingIndex === index ? "Adding..." : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 16 }}
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
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formSection: {
    padding: 16,
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  suggestionCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  suggestionHeader: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  suggestionCategory: {
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
