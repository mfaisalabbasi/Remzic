import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { biometricService } from '../../services/biometricService';

const FingerprintIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4" />
    <Path d="M14.53 15.5c-.36-1.51-.53-3.21-.53-4.5a3 3 0 00-6 0c0 1.15.11 2.3.32 3.4" />
    <Path d="M17 12a5 5 0 00-10 0c0 1.5.3 3 1 4.5" />
    <Path d="M19.5 10.5C20 12 20 13.5 20 15" />
    <Path d="M4.5 14.5C4 13 4 11.5 4 10a8 8 0 0115.5-2.5" />
  </Svg>
);

export const BiometricSettingsRow = () => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    biometricService.isEnabled().then(setBiometricsEnabled);
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const { available, biometryType } =
        await biometricService.checkAvailability();
      if (!available) {
        Alert.alert(
          'Unavailable',
          'Biometric authentication is not supported on this device.',
        );
        return;
      }
      const success = await biometricService.authenticate(
        `Enable ${biometryType} for secure access`,
      );
      if (success) {
        await biometricService.setEnabled(true);
        setBiometricsEnabled(true);
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      await biometricService.setEnabled(false);
      setBiometricsEnabled(false);
    }
  };

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabelGroup}>
        <View style={styles.iconBox}>
          <FingerprintIcon size={18} color={Colors.accent} />
        </View>
        <View>
          <Text style={styles.settingText}>Biometric Login</Text>
          <Text style={styles.settingSubtext}>
            Require FaceID / TouchID on launch
          </Text>
        </View>
      </View>
      <Switch
        value={biometricsEnabled}
        onValueChange={handleBiometricToggle}
        trackColor={{ false: '#081D14', true: Colors.accent }}
        thumbColor={Colors.white}
        ios_backgroundColor="#081D14"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  settingText: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '600',
  },
  settingSubtext: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
});
