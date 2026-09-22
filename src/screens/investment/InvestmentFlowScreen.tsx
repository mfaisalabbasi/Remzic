import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert as RNAlert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

const presetAmounts = [500, 1000, 2500, 5000];

export const InvestmentFlowScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const insets = useSafeAreaInsets();

  // Robust normalization of incoming route params to prevent NaN or undefined bugs
  const rawProperty = route?.params?.property || {};

  // Safely parse yield (handling both percentage numbers like 8.5 or decimals like 0.085)
  const rawYield =
    rawProperty.yield !== undefined
      ? rawProperty.yield
      : rawProperty.yieldRate
      ? rawProperty.yieldRate * 100
      : 8.5;
  const numericYieldRate =
    typeof rawYield === 'string'
      ? parseFloat(rawYield.replace('%', '')) / 100
      : rawYield > 1
      ? rawYield / 100
      : rawYield;

  const property = {
    title: rawProperty.title || 'Dubai Creek Harbour Residences',
    yieldRate: isNaN(numericYieldRate) ? 0.085 : numericYieldRate,
    tokenPrice: rawProperty.tokenPrice || 1.0,
  };

  const [amount, setAmount] = useState('1000');

  const numericAmount = parseFloat(amount) || 0;
  const estimatedTokens = (numericAmount / property.tokenPrice).toFixed(2);
  const estimatedYieldAnnual = (numericAmount * property.yieldRate).toFixed(2);
  const totalUnitsAvailable = '12,500';

  const handleConfirmInvestment = () => {
    if (numericAmount < 500) {
      RNAlert.alert(
        'Invalid Allocation',
        'The minimum investment threshold for this institutional asset is $500.',
      );
      return;
    }

    RNAlert.alert(
      'Allocation Secured',
      `You have successfully allocated $${numericAmount.toLocaleString()} into ${
        property.title
      }.`,
      [
        {
          text: 'View Portfolio',
          onPress: () => navigation.navigate('Portfolio'),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asset Allocation</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Property Quick Card */}
        <View style={styles.propertyMiniCard}>
          <View style={styles.propertyThumbPlaceholder}>
            <Text style={styles.propertyThumbTag}>🏢</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.propertyName}>{property.title}</Text>
            <View style={styles.yieldBadgeRow}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.propertyYield}>
                {(property.yieldRate * 100).toFixed(1)}% Projected APY
              </Text>
            </View>
          </View>
        </View>

        {/* Investment Amount Input Box */}
        <View style={styles.inputContainer}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Enter Allocation Value</Text>
            <Text style={styles.inputLimitLabel}>Min: $500</Text>
          </View>
          <View style={styles.textInputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="1000"
              placeholderTextColor="#475569"
              selectionColor="#34D399"
            />
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>USD</Text>
            </View>
          </View>
        </View>

        {/* Preset Amount Badges */}
        <View style={styles.presetsRow}>
          {presetAmounts.map(val => {
            const isActive = numericAmount === val;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.presetButton,
                  isActive && styles.presetButtonActive,
                ]}
                onPress={() => setAmount(val.toString())}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.presetText,
                    isActive && styles.presetTextActive,
                  ]}
                >
                  ${val.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Calculation Metrics Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownHeaderTitle}>Allocation Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Tokens</Text>
            <Text style={styles.breakdownValue}>{estimatedTokens} RWA</Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Annual Yield</Text>
            <Text style={styles.breakdownValueGreen}>
              +${estimatedYieldAnnual}
            </Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Available Vault Units</Text>
            <Text style={styles.breakdownValue}>{totalUnitsAvailable}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Checkout CTA */}
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleConfirmInvestment}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            Confirm & Deploy Capital
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  backIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  propertyMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.18)',
    marginBottom: 24,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#18221F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  propertyThumbTag: {
    fontSize: 22,
  },
  propertyName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  yieldBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  propertyYield: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputLimitLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    color: '#34D399',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 26,
    fontWeight: '700',
    paddingVertical: 14,
  },
  currencyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  currencyBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#111816',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#34D399',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#34D399',
    fontWeight: '700',
  },
  breakdownCard: {
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.18)',
  },
  breakdownHeaderTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  breakdownLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  breakdownValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownValueGreen: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#080C0A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.12)',
  },
  continueButton: {
    backgroundColor: '#34D399',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
    color: '#080C0A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
