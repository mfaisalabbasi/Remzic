import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const InvestIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </Svg>
);

const DepositIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M12 3v12m0 0l4-4m-4 4l-4-4M2 17l.621 2.485A2 2 0 004.56 21h14.88a2 2 0 001.939-1.515L22 17" />
  </Svg>
);

const WithdrawIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 004.56 21h14.88a2 2 0 001.939-1.515L22 17" />
  </Svg>
);

const MarketIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M3 3v18h18" />
    <Path d="M18 17V9" />
    <Path d="M13 17V5" />
    <Path d="M8 17v-3" />
  </Svg>
);

export const QuickActionsGrid = ({ navigation }: { navigation: any }) => (
  <View style={styles.actionsGrid}>
    <TouchableOpacity
      style={styles.actionButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Invest')}
    >
      <View style={styles.actionIconBox}>
        <InvestIcon size={22} color={Colors.accent} />
      </View>
      <Text style={styles.actionText}>Invest</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.actionButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Wallet')}
    >
      <View style={styles.actionIconBox}>
        <DepositIcon size={22} color={Colors.accent} />
      </View>
      <Text style={styles.actionText}>Deposit</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.actionButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Wallet')}
    >
      <View style={styles.actionIconBox}>
        <WithdrawIcon size={22} color={Colors.accent} />
      </View>
      <Text style={styles.actionText}>Withdraw</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.actionButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Marketplace')}
    >
      <View style={styles.actionIconBox}>
        <MarketIcon size={22} color={Colors.accent} />
      </View>
      <Text style={styles.actionText}>Market</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  actionButton: { alignItems: 'center', flex: 1 },
  actionIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#061A12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
