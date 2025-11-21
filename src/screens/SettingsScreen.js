// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export default function SettingsScreen() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.welcome}>Logged in as:</Text>
      <Text style={styles.email}>{auth.currentUser?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#6200ee' },
  welcome: { fontSize: 18, marginBottom: 5 },
  email: { fontSize: 18, fontWeight: '600', marginBottom: 40, color: '#333' },
  button: { backgroundColor: '#d32f2f', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});