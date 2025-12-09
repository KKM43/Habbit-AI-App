import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { ActivityIndicator, View } from 'react-native';
import { requestPermissions } from './src/utils/notifications';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LightTheme } from './src/theme';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, isLoading } = useTheme();
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    requestPermissions();
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading || authLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}