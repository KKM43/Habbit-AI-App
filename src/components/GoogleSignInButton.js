// // src/components/GoogleSignInButton.js — FINAL WORKING (NO SYNTAX ERROR)
// import React, { useEffect } from 'react';
// import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { signInWithGoogle } from '../utils/googleAuth';

// WebBrowser.maybeCompleteAuthSession();

// export default function GoogleSignInButton({ onSuccess }) {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     webClientId: '370504343578-5ee43njgqj1ii0s8onfc8fvlngegc313.apps.googleusercontent.com',
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;
//       if (id_token) {
//         signInWithGoogle(id_token)
//           .then(() => onSuccess?.())
//           .catch(() => Alert.alert('Failed', 'Could not sign in with Google'));
//       }
//     }
//   }, [response, onSuccess]);

//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => promptAsync({ useProxy: true })}
//       disabled={!request}
//     >
//       <Ionicons name="logo-google" size={22} color="#fff" />
//       <Text style={styles.text}>Continue with Google</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4285f4',
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     borderRadius: 12,
//     marginVertical: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '600',
//     marginLeft: 12,
//   },
// });