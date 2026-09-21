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
  const property = route?.params?.property || {
    title: 'Dubai Creek Residence',
    yieldRate: 0.085, // 8.5%
    tokenPrice: 1.0,
  };

  const [amount, setAmount] = useState('1000');

  const numericAmount = parseFloat(amount) || 0;
  const estimatedTokens = (numericAmount / 1.0).toFixed(2);
  const estimatedYieldAnnual = (numericAmount * 0.085).toFixed(2);
  const totalUnitsAvailable = '12,500';

  const handleConfirmInvestment = () => {
    if (numericAmount < 500) {
      RNAlert.alert(
        'Invalid Amount',
        'The minimum investment for this asset is $500.',
      );
      return;
    }

    RNAlert.alert(
      'Investment Successful!',
      `You have successfully allocated $${numericAmount} into ${property.title}.`,
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
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investment Amount</Text>
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
            <Text style={styles.propertyYield}>5.5% expected yield</Text>
          </View>
        </View>

        {/* Investment Amount Input Box */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Investment Amount</Text>
          <View style={styles.textInputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="1000"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        {/* Preset Amount Badges */}
        <View style={styles.presetsRow}>
          {presetAmounts.map(val => (
            <TouchableOpacity
              key={val}
              style={[
                styles.presetButton,
                numericAmount === val && styles.presetButtonActive,
              ]}
              onPress={() => setAmount(val.toString())}
            >
              <Text
                style={[
                  styles.presetText,
                  numericAmount === val && styles.presetTextActive,
                ]}
              >
                ${val.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calculation Metrics Breakdown Card */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Tokens</Text>
            <Text style={styles.breakdownValue}>{estimatedTokens}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Yield (Annual)</Text>
            <Text style={styles.breakdownValueGreen}>
              ${estimatedYieldAnnual}
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Units Available</Text>
            <Text style={styles.breakdownValue}>{totalUnitsAvailable}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Checkout CTA */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleConfirmInvestment}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  propertyMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 12,
  },
  propertyThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyThumbTag: {
    fontSize: 20,
  },
  propertyName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  propertyYield: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  presetButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  presetText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  presetTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  breakdownCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
