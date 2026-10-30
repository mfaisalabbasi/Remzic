import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { Colors } from './src/theme/colors';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/auth/SplashScreen';
import { biometricService } from './src/services/biometricService'; // 👈 Import biometric service

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function requestUserPermission() {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ requires explicit runtime permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Android notification permission granted.');
          } else {
            console.log('Android notification permission denied.');
          }
        }
      } else {
        // For iOS devices/simulators when you test them later
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('iOS authorization status:', authStatus);
        }
      }
    }

    requestUserPermission();
  }, []);

  // 👇 Biometric Launch Check
  const handleSplashFinish = async () => {
    try {
      const biometricActive = await biometricService.isEnabled();
      if (biometricActive) {
        const success = await biometricService.authenticate(
          'Unlock your Remzic session',
        );
        if (!success) {
          console.warn('User failed biometric launch check');
          // You can choose to handle cancellation/failure here if needed
        }
      }
    } catch (error) {
      console.error('Biometric launch check error:', error);
    } finally {
      setIsAppReady(true);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {!isAppReady ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <AppNavigator />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
});
