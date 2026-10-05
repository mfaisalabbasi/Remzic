import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type SettlementMode = 'OFF_CHAIN' | 'ON_CHAIN';

interface SettlementMethodSelectorProps {
  value: SettlementMode;
  onChange: (value: SettlementMode) => void;
  disabled?: boolean;
}

export default function SettlementMethodSelector({
  value,
  onChange,
  disabled = false,
}: SettlementMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settlement Method</Text>

      <View style={styles.selector}>
        <Pressable
          disabled={disabled}
          onPress={() => onChange('OFF_CHAIN')}
          style={[
            styles.option,
            value === 'OFF_CHAIN' && styles.activeOption,
            disabled && styles.disabled,
          ]}
        >
          <Text
            style={[
              styles.optionTitle,
              value === 'OFF_CHAIN' && styles.activeText,
            ]}
          >
            Internal Balance
          </Text>

          <Text
            style={[
              styles.optionDescription,
              value === 'OFF_CHAIN' && styles.activeDescription,
            ]}
          >
            Use your Remzik balance
          </Text>
        </Pressable>

        <Pressable
          disabled={disabled}
          onPress={() => onChange('ON_CHAIN')}
          style={[
            styles.option,
            value === 'ON_CHAIN' && styles.activeOption,
            disabled && styles.disabled,
          ]}
        >
          <Text
            style={[
              styles.optionTitle,
              value === 'ON_CHAIN' && styles.activeText,
            ]}
          >
            Web3 On-Chain
          </Text>

          <Text
            style={[
              styles.optionDescription,
              value === 'ON_CHAIN' && styles.activeDescription,
            ]}
          >
            Sign with your wallet
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A24',
    marginBottom: 10,
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: '#F3F5F4',
    borderRadius: 14,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 11,
  },
  activeOption: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#68736F',
    marginBottom: 3,
  },
  activeText: {
    color: '#102A24',
  },
  optionDescription: {
    fontSize: 10,
    color: '#8B9490',
  },
  activeDescription: {
    color: '#68736F',
  },
});
