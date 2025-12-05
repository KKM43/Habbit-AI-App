// src/navigation/AuthNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
// import { signInWithGoogle } from "../utils/googleAuth";
// import GoogleSignInButton from '../components/GoogleSignInButton';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const logoFade = React.useRef(new Animated.Value(1)).current;
  const formFade = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animate logo & form when theme changes for a smooth crossfade
  React.useEffect(() => {
    logoFade.setValue(0);
    formFade.setValue(0);
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode]);

  // const handleLogin = async () => {
  //   if (!email.trim() || !password) {
  //     Alert.alert("Missing Fields", "Please enter both email and password");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await signInWithEmailAndPassword(auth, email.trim(), password);
  //   } catch (err) {
  //     Alert.alert("Login Failed", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const handleGoogleSignIn = async () => {
//   try {
//     const userCredential = await signInWithGoogle();
    
//     if (userCredential?.user) {
//       const name = userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Friend';
//       Alert.alert(
//         "Welcome!",
//         `Hey ${name}! You're signed in`,
//         [{ text: "Let's go!", style: "default" }]
//       );
//     }
//   } catch (error) {
//     if (error.code === 'ERR_CANCELED') {
//       // User cancelled
//       return;
//     }
//     Alert.alert(
//       "Google Sign-In Failed",
//       "Please try again or use email/password",
//       [{ text: "OK" }]
//     );
//   }
// };

const handleLogin = async () => {
  if (!email.trim() || !password) {
    Alert.alert("Missing Fields", "Please enter both email and password", [
      { text: "OK" }
    ]);
    return;
  }

  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    // Success → navigation happens automatically via auth state
  } catch (err) {
    let title = "Login Failed";
    let message = "Something went wrong. Please try again.";

    switch (err.code) {
      case 'auth/invalid-email':
        message = "Invalid email address format.";
        break;
      case 'auth/user-not-found':
        message = "No account found with this email.";
        break;
      case 'auth/wrong-password':
        message = "Incorrect password. Try again or reset it.";
        break;
      case 'auth/invalid-credential-already-in-use':
        message = "This email is already linked to another account.";
        break;
      case 'auth/too-many-requests':
        message = "Too many failed attempts. Try again later or reset your password.";
        break;
      case 'auth/user-disabled':
        message = "This account has been disabled.";
        break;
      case 'auth/network-request-failed':
        message = "No internet connection. Check your network and try again.";
        break;
      default:
        message = err.message || "Invalid email or password.";
    }

    Alert.alert(title, message, [
      { text: "OK" },
      // Optional: Add "Forgot Password?" button for wrong-password
      err.code === 'auth/wrong-password' && {
        text: "Forgot Password?",
        onPress: () => navigation.navigate('ForgotPassword') // create this later if you want
      }
    ].filter(Boolean));
  } finally {
    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={styles.darkModeToggle}
        onPress={() => toggleDarkMode()}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.logoContainer, { opacity: logoFade }]}>
          <LinearGradient
            colors={theme.colors.gradient2 || theme.colors.gradient1}
            style={styles.logoGradient}
          >
            <Ionicons name="checkmark-done" size={48} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            HabitFlow
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Build better habits, one day at a time
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.formContainer,
            { backgroundColor: theme.colors.surface, opacity: formFade },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Sign in to continue your journey
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>


          {/* NEW WORKING GOOGLE SIGN-IN BUTTON */}
          {/* <View style={{ marginTop: 16, alignItems: 'center' }}>
            <GoogleSignInButton 
              onSuccess={() => {
                Alert.alert(
                  "Welcome back!",
                  "Great to see you again. Let's keep building those habits!",
                  [{ text: "Let's go!" }]
                );
              }}
            />
          </View> */}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function SignUpScreen({ navigation }) {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const logoFade = React.useRef(new Animated.Value(1)).current;
  const formFade = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    logoFade.setValue(0);
    formFade.setValue(0);
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode]);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        email: email.trim(),
        createdAt: new Date(),
      });
    } catch (err) {
      Alert.alert("Sign Up Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const userCredential = await signInWithGoogle();
  //     if (userCredential && userCredential.user) {
  //       const name =
  //         userCredential.user.displayName ||
  //         userCredential.user.email ||
  //         "User";
  //       Alert.alert("Signed up", `Welcome, ${name}!`, [
  //         { text: "OK", onPress: () => navigation.navigate("Home") },
  //       ]);
  //     } else {
  //       Alert.alert("Signed up", "Successfully signed up with Google");
  //     }
  //   } catch (err) {
  //     Alert.alert(
  //       "Google Sign-In",
  //       "Google sign-in failed or is not configured. Would you like me to add the implementation?",
  //       [
  //         { text: "No", style: "cancel" },
  //         {
  //           text: "Yes",
  //           onPress: () =>
  //             Alert.alert(
  //               "Next step",
  //               "I can scaffold Expo AuthSession + Firebase Google flow if you want."
  //             ),
  //         },
  //       ]
  //     );
  //     console.warn("Google sign-up handler error:", err);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={styles.darkModeToggle}
        onPress={() => toggleDarkMode()}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.logoContainer, { opacity: logoFade }]}>
          <LinearGradient
            colors={theme.colors.gradient2 || theme.colors.gradient1}
            style={styles.logoGradient}
          >
            <Ionicons name="checkmark-done" size={48} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            HabitFlow
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Start your habit journey
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.formContainer,
            { backgroundColor: theme.colors.surface, opacity: formFade },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Account
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Start your habit journey today
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Password (6+ characters)"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

                    <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Creating account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* NEW WORKING GOOGLE SIGN-IN */}
          {/* <View style={{ marginTop: 16, alignItems: 'center' }}>
            <GoogleSignInButton 
              onSuccess={() => {
                Alert.alert("Welcome!", "Your habit journey starts now", [
                  { text: "Let's go!", onPress: () => navigation.navigate("Home") }
                ]);
              }}
            />
          </View> */}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkModeToggle: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 32 },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: { fontSize: 32, fontWeight: "800", marginBottom: 8 },
  tagline: { fontSize: 15, textAlign: "center" },
  formContainer: { borderRadius: 24, padding: 24, elevation: 3 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 32 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16 },
  eyeIcon: { padding: 4 },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 2,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15 },
  link: { fontSize: 15, fontWeight: "700" },
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  // googleButton: {
  //   marginTop: 16,
  //   width: "100%",
  //   paddingVertical: 12,
  //   paddingHorizontal: 14,
  //   borderRadius: 12,
  //   borderWidth: 1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // googleIcon: {
  //   width: 24,
  //   height: 24,
  //   resizeMode: "contain",
  //   marginRight: 12,
  // },
  // googleText: {
  //   fontSize: 16,
  //   fontWeight: "600",
  // },
});
