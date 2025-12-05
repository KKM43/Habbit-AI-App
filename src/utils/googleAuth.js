// // src/utils/googleAuth.js — HELPER ONLY (no hooks here)
// import * as WebBrowser from 'expo-web-browser';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { auth } from '../../firebase';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { Alert } from 'react-native';

// WebBrowser.maybeCompleteAuthSession();

// export async function signInWithGoogle(idToken) {
//   console.log('🔑 Signing into Firebase with idToken...');
//   try {
//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCredential = await signInWithCredential(auth, credential);

//     console.log('✅ Firebase sign-in success:', userCredential.user.email);

//     // Create user profile if new
//     const userRef = doc(db, 'users', userCredential.user.uid);
//     const snap = await getDoc(userRef);
//     if (!snap.exists()) {
//       await setDoc(userRef, {
//         displayName: userCredential.user.displayName || 'User',
//         email: userCredential.user.email,
//         photoURL: userCredential.user.photoURL,
//         createdAt: new Date().toISOString(),
//         provider: 'google'
//       });
//       console.log('👤 New user profile created');
//     }

//     return userCredential;
//   } catch (error) {
//     console.error('💥 Firebase sign-in failed:', error);
//     throw error;
//   }
// }