// src/components/distributions/DistributionsPreferenceCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface DistributionsPreferenceCardProps {
  tempMode: 'OFF_CHAIN' | 'ON_CHAIN';
  setTempMode: (mode: 'OFF_CHAIN' | 'ON_CHAIN') => void;
  distributionMode: 'OFF_CHAIN' | 'ON_CHAIN';
  isSavingPref: boolean;
  onSavePreference: (mode: 'OFF_CHAIN' | 'ON_CHAIN') => void;
}

export const DistributionsPreferenceCard = ({
  tempMode,
  setTempMode,
  distributionMode,
  isSavingPref,
  onSavePreference,
}: DistributionsPreferenceCardProps) => (
  <View style={styles.prefCard}>
    <Text style={styles.prefCardTitle}>Yield Payout Preference</Text>
    <Text style={styles.prefCardSubtitle}>
      Choose how you would like to receive your monthly property dividends.
    </Text>
    <View style={styles.prefOptionsRow}>
      <TouchableOpacity
        style={[
          styles.prefOptionButton,
          tempMode === 'OFF_CHAIN' && styles.prefOptionButtonSelected,
        ]}
        onPress={() => setTempMode('OFF_CHAIN')}
        activeOpacity={0.8}
      >
        <Text style={styles.prefOptionTitle}>🌐 Off-Chain (Balance)</Text>
        <Text style={styles.prefOptionDesc}>
          Zero gas fees. Instant credit.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.prefOptionButton,
          tempMode === 'ON_CHAIN' && styles.prefOptionButtonSelected,
        ]}
        onPress={() => setTempMode('ON_CHAIN')}
        activeOpacity={0.8}
      >
        <Text style={styles.prefOptionTitle}>⛓️ On-Chain (Web3)</Text>
        <Text style={styles.prefOptionDesc}>Trustless claim to wallet.</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={[
        styles.prefSaveButton,
        (isSavingPref || tempMode === distributionMode) &&
          styles.prefSaveButtonDisabled,
      ]}
      disabled={isSavingPref || tempMode === distributionMode}
      onPress={() => onSavePreference(tempMode)}
      activeOpacity={0.85}
    >
      {isSavingPref ? (
        <ActivityIndicator color="#080C0A" size="small" />
      ) : (
        <Text style={styles.prefSaveButtonText}>Save Preference</Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  prefCard: {
    backgroundColor: '#111816',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 20,
  },
  prefCardTitle: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  prefCardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  prefOptionsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  prefOptionButton: {
    flex: 1,
    backgroundColor: '#080C0A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  prefOptionButtonSelected: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },
  prefOptionTitle: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  prefOptionDesc: { color: '#64748B', fontSize: 10, lineHeight: 13 },
  prefSaveButton: {
    backgroundColor: '#34D399',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefSaveButtonDisabled: { opacity: 0.5 },
  prefSaveButtonText: { color: '#080C0A', fontSize: 13, fontWeight: '700' },
});
