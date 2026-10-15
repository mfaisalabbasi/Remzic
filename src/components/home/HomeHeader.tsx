import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const BellIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);

const MenuIcon = ({ size = 20, color = Colors.accent }) => (
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
    <Path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const HomeHeader = ({
  userName,
  navigation,
}: {
  userName: string;
  navigation: any;
}) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.userInfo}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SideMenu')}
    >
      <View style={styles.avatarContainer}>
        <MenuIcon size={20} color={Colors.accent} />
        <View style={styles.onlineIndicator} />
      </View>
      <View>
        <Text style={styles.welcomeSubtext}>Hello,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.notificationButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Notifications')}
    >
      <BellIcon size={18} color={Colors.accent} />
      <View style={styles.notificationBadge} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.06)',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#03100B',
  },
  welcomeSubtext: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  userName: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
});
