import AsyncStorage from '@react-native-async-storage/async-storage';

export const shouldDisplayNotification = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem('push_notifications_enabled');
    // If explicitly set to 'false', block the notification. Default to true otherwise.
    if (val === 'false') {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking notification preference:', error);
    return true;
  }
};
