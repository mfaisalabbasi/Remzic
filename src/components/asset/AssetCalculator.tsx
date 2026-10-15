// src/components/investment/AssetCalculator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PALETTE = {
  cardBg: '#111816',
  cardSubBg: '#18221F',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
  borderActive: 'rgba(52, 211, 153, 0.4)',
};

interface AssetCalculatorProps {
  safeTokenCount: number;
  setTokenCount: (val: number) => void;
  calculatedInvestmentCost: number;
  estimatedAnnualReturn: number;
}

export const AssetCalculator = ({
  safeTokenCount,
  setTokenCount,
  calculatedInvestmentCost,
  estimatedAnnualReturn,
}: AssetCalculatorProps) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Yield & Return Calculator</Text>
    <View style={styles.calculatorCard}>
      <View style={styles.calcRow}>
        <Text style={styles.calcLabel}>Select Token Quantity</Text>
        <View style={styles.calcControlRow}>
          <TouchableOpacity
            style={styles.calcBtn}
            onPress={() => setTokenCount(Math.max(1, safeTokenCount - 1))}
          >
            <Text style={styles.calcBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.calcValueText}>{safeTokenCount} Tokens</Text>
          <TouchableOpacity
            style={styles.calcBtn}
            onPress={() => setTokenCount(safeTokenCount + 1)}
          >
            <Text style={styles.calcBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contractDivider} />

      <View style={styles.calcResultBox}>
        <View>
          <Text style={styles.calcResultLabel}>Total Investment</Text>
          <Text style={styles.calcResultVal}>
            ${calculatedInvestmentCost.toLocaleString()}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.calcResultLabel}>Est. Yearly Return</Text>
          <Text style={[styles.calcResultVal, { color: PALETTE.accent }]}>
            +${estimatedAnnualReturn.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 24 },
  sectionTitle: {
    color: PALETTE.textMain,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  calculatorCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '600' },
  calcControlRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calcBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PALETTE.cardSubBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.borderActive,
  },
  calcBtnText: { color: PALETTE.accent, fontSize: 16, fontWeight: '800' },
  calcValueText: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 70,
    textAlign: 'center',
  },
  calcResultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcResultLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  calcResultVal: { color: PALETTE.textMain, fontSize: 15, fontWeight: '800' },
  contractDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 10,
  },
});
