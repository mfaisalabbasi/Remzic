import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const SignupStep1Form = ({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onNext,
}: any) => (
  <>
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="John Doe"
        placeholderTextColor="#64748B"
        value={name}
        onChangeText={setName}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={styles.textInput}
        placeholder="+966 50 000 0000"
        placeholderTextColor="#64748B"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.textInput}
        placeholder="john@email.com"
        placeholderTextColor="#64748B"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Create secure password"
        placeholderTextColor="#64748B"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Confirm password"
        placeholderTextColor="#64748B"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>

    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onNext}
      activeOpacity={0.85}
    >
      <Text style={styles.primaryButtonText}>Next: Identity Verification</Text>
      <View style={styles.arrowIconCircle}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  textInput: {
    backgroundColor: '#080C0A',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#F0FDF4',
  },
  primaryButton: {
    backgroundColor: '#34D399',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#080C0A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  arrowIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(8, 12, 10, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: { color: '#080C0A', fontSize: 15, fontWeight: 'bold' },
});
