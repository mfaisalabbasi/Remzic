/**
 * @format
 */
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register background and killed-state handler for Firebase Push Notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    '[FCM] Message handled in background/killed state:',
    remoteMessage,
  );
  // Optional: You can perform background sync tasks or handle data payloads here
});

AppRegistry.registerComponent(appName, () => App);
