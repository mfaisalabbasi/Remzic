import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface InvestmentAmountInputProps {
  amount: string;
  minimum: number;
  presets: number[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function InvestmentAmountInput({
  amount,
  minimum,
  presets,
  disabled = false,
  onChange,
}: InvestmentAmountInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment Amount</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.currency}>$</Text>

        <TextInput
          value={amount}
          onChangeText={onChange}
          editable={!disabled}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#A1AAA6"
          style={styles.input}
        />

        <View style={styles.usdBadge}>
          <Text style={styles.usdText}>USD</Text>
        </View>
      </View>

      <Text style={styles.minimum}>
        Minimum investment: ${minimum.toLocaleString()}
      </Text>

      {presets.length > 0 && (
        <View style={styles.presets}>
          {presets.map(preset => (
            <Pressable
              key={preset}
              disabled={disabled}
              onPress={() => onChange(String(preset))}
              style={[styles.preset, disabled && styles.disabled]}
            >
              <Text style={styles.presetText}>${preset.toLocaleString()}</Text>
            </Pressable>
          ))}
        </View>
      )}
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
  inputContainer: {
    height: 62,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE2DF',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#102A24',
    marginRight: 7,
  },
  input: {
    flex: 1,
    fontSize: 25,
    fontWeight: '700',
    color: '#102A24',
    padding: 0,
  },
  usdBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#F1F4F2',
  },
  usdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#68736F',
  },
  minimum: {
    fontSize: 11,
    color: '#7B8581',
    marginTop: 7,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  preset: {
    borderWidth: 1,
    borderColor: '#DCE2DF',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#40504A',
  },
});
