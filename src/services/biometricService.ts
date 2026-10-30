import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_ENABLED_KEY = 'biometric_login_enabled';
const rnBiometrics = new ReactNativeBiometrics();

export const biometricService = {
  // Check if hardware supports biometrics
  async checkAvailability() {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      return {
        available,
        biometryType:
          biometryType === BiometryTypes.FaceID
            ? 'Face ID'
            : biometryType === BiometryTypes.TouchID
            ? 'Touch ID'
            : 'Biometrics',
      };
    } catch (error) {
      console.error('[Biometrics] Error checking availability:', error);
      return { available: false, biometryType: null };
    }
  },

  // Prompt user for authentication
  async authenticate(
    promptMessage: string = 'Confirm your identity',
  ): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.error('[Biometrics] Authentication failed:', error);
      return false;
    }
  },

  // Save user preference
  async setEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, JSON.stringify(enabled));
  },

  // Check user preference
  async isEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return value ? JSON.parse(value) : false;
  },
};
