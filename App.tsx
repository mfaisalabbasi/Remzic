import 'react-native-get-random-values';
import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/auth/SplashScreen';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {!isAppReady ? (
          <SplashScreen onFinish={() => setIsAppReady(true)} />
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
