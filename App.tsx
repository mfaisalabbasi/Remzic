import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { Colors } from './src/theme/colors';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.primary,
  },
});
