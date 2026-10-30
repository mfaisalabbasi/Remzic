import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const BellIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);

export const PushNotificationSettingsRow = () => {
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('push_notifications_enabled').then(val => {
      if (val !== null) {
        setPushNotifications(val === 'true');
      }
    });
  }, []);

  const handleToggle = async (value: boolean) => {
    setPushNotifications(value);
    await AsyncStorage.setItem('push_notifications_enabled', String(value));
  };

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabelGroup}>
        <View style={styles.iconBox}>
          <BellIcon size={16} color={Colors.accent} />
        </View>
        <View>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Text style={styles.settingSubtext}>
            Real-time transaction alerts
          </Text>
        </View>
      </View>
      <Switch
        value={pushNotifications}
        onValueChange={handleToggle}
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
