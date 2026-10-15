// src/components/investment/InvestmentFormCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

type SettlementMode = 'OFF_CHAIN' | 'ON_CHAIN';

interface InvestmentFormCardProps {
  settlementMode: SettlementMode;
  setSettlementMode: (mode: SettlementMode) => void;
  submitting: boolean;
  amount: string;
  setAmount: (val: string) => void;
  numericAmount: number;
  minInvestment: number;
  presetAmounts: number[];
  estimatedTokens: string;
  estimatedYieldAnnual: string;
  totalUnitsAvailable: string;
  statusMessage: string;
}

export const InvestmentFormCard = ({
  settlementMode,
  setSettlementMode,
  submitting,
  amount,
  setAmount,
  numericAmount,
  minInvestment,
  presetAmounts,
  estimatedTokens,
  estimatedYieldAnnual,
  totalUnitsAvailable,
  statusMessage,
}: InvestmentFormCardProps) => (
  <>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Select Settlement Method</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            settlementMode === 'OFF_CHAIN' && styles.tabButtonActive,
          ]}
          onPress={() => setSettlementMode('OFF_CHAIN')}
          disabled={submitting}
        >
          <Text
            style={[
              styles.tabText,
              settlementMode === 'OFF_CHAIN' && styles.tabTextActive,
            ]}
          >
            Internal Balance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            settlementMode === 'ON_CHAIN' && styles.tabButtonActive,
          ]}
          onPress={() => setSettlementMode('ON_CHAIN')}
          disabled={submitting}
        >
          <Text
            style={[
              styles.tabText,
              settlementMode === 'ON_CHAIN' && styles.tabTextActive,
            ]}
          >
            Web3 On-Chain
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        <Text style={styles.inputLabel}>Enter Allocation Value</Text>
        <Text style={styles.inputLimitLabel}>
          Min: ${minInvestment} (1 Token)
        </Text>
      </View>

      <View style={styles.textInputWrapper}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder={minInvestment.toString()}
          placeholderTextColor="#475569"
          selectionColor="#34D399"
          editable={!submitting}
          accessibilityLabel="Investment amount"
        />
        <View style={styles.currencyBadge}>
          <Text style={styles.currencyBadgeText}>USD</Text>
        </View>
      </View>
    </View>

    <View style={styles.presetsRow}>
      {presetAmounts.map(value => (
        <TouchableOpacity
          key={value}
          style={[
            styles.presetButton,
            numericAmount === value && styles.presetButtonActive,
          ]}
          onPress={() => setAmount(value.toString())}
          disabled={submitting}
        >
          <Text
            style={[
              styles.presetText,
              numericAmount === value && styles.presetTextActive,
            ]}
          >
            ${value.toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.breakdownCard}>
      <Text style={styles.breakdownHeaderTitle}>Allocation Breakdown</Text>

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Estimated Tokens</Text>
        <Text style={styles.breakdownValue}>{estimatedTokens} RWA</Text>
      </View>

      <View style={styles.breakdownDivider} />

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Estimated Annual Yield</Text>
        <Text style={styles.breakdownValueGreen}>+${estimatedYieldAnnual}</Text>
      </View>

      <View style={styles.breakdownDivider} />

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Available Vault Units</Text>
        <Text style={styles.breakdownValue}>{totalUnitsAvailable}</Text>
      </View>
    </View>

    {submitting && (
      <View style={styles.submittingStatus}>
        <ActivityIndicator size="small" color="#34D399" />
        <Text style={styles.submittingText}>
          {statusMessage || 'Preparing your investment...'}
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLimitLabel: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111816',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#1A2E28',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#34D399' },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 16,
    height: 56,
  },
  currencySymbol: {
    color: '#34D399',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    padding: 0,
  },
  currencyBadge: {
    backgroundColor: '#18221F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  currencyBadgeText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  presetsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  presetButton: {
    flex: 1,
    backgroundColor: '#111816',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.12)',
  },
  presetButtonActive: {
    backgroundColor: '#1A2E28',
    borderColor: 'rgba(52,211,153,0.35)',
  },
  presetText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  presetTextActive: { color: '#34D399' },
  breakdownCard: {
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    marginBottom: 24,
  },
  breakdownHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  breakdownLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  breakdownValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  breakdownValueGreen: { color: '#34D399', fontSize: 13, fontWeight: '700' },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#18221F',
    marginVertical: 6,
  },
  submittingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  submittingText: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
});
