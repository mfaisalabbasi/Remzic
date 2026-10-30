import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onLogin: () => void;
  isSubmitting: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  isSubmitting,
}) => {
  // Modal State Management
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const API_HOST =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:4000/api'
      : 'http://127.0.0.1:4000/api';

  // Open Modal with pre-filled login email if present
  const handleOpenForgotPassword = () => {
    if (email) {
      setResetEmail(email);
    }
    setStep('REQUEST');
    setOtpCode('');
    setNewPassword('');
    setIsForgotPasswordVisible(true);
  };

  // Step 1: Request OTP / Reset Link
  const handleRequestOtp = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setIsResetLoading(true);
      console.log('🔑 [ForgotPassword] Requesting OTP for:', resetEmail);

      const response = await fetch(`${API_HOST}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase() }),
      });

      const data = await response.json();
      console.log('🔑 [ForgotPassword] Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset code.');
      }

      Alert.alert(
        'Code Sent',
        'If an account exists with this email, a verification code has been sent.',
      );
      setStep('RESET');
    } catch (error: any) {
      console.error('❌ [ForgotPassword] Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsResetLoading(false);
    }
  };

  // Step 2: Confirm OTP & Set New Password
  const handleResetPassword = async () => {
    if (!otpCode || otpCode.length < 4) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid verification code.',
      );
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert(
        'Validation Error',
        'New password must be at least 6 characters long.',
      );
      return;
    }

    try {
      setIsResetLoading(true);
      console.log('🔑 [ForgotPassword] Submitting reset for:', resetEmail);

      const response = await fetch(`${API_HOST}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
          token: otpCode.trim(),
          newPassword,
        }),
      });

      const data = await response.json();
      console.log('🔑 [ForgotPassword] Reset response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      Alert.alert('Success', 'Your password has been reset successfully.');
      setIsForgotPasswordVisible(false);
      // Auto fill new credentials into login input
      setEmail(resetEmail.trim().toLowerCase());
      setPassword(newPassword);
    } catch (error: any) {
      console.error('❌ [ForgotPassword] Reset Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.textInput}
          placeholder="name@example.com"
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
          placeholder="••••••••"
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        activeOpacity={0.7}
        onPress={handleOpenForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onLogin}
        activeOpacity={0.85}
        disabled={isSubmitting}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </Text>
        <View style={styles.arrowIconCircle}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>

      {/* --- Forgot Password Modal --- */}
      <Modal
        visible={isForgotPasswordVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsForgotPasswordVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {step === 'REQUEST'
                ? 'Reset Password'
                : 'Enter Verification Code'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {step === 'REQUEST'
                ? 'Enter your registered email address to receive a password reset verification code.'
                : `Enter the code sent to ${resetEmail} along with your new password.`}
            </Text>

            {step === 'REQUEST' ? (
              <View style={styles.modalInputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor="#64748B"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            ) : (
              <>
                <View style={styles.modalInputGroup}>
                  <Text style={styles.inputLabel}>
                    Verification Code / Token
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123456"
                    placeholderTextColor="#64748B"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#64748B"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsForgotPasswordVisible(false)}
                disabled={isResetLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={
                  step === 'REQUEST' ? handleRequestOtp : handleResetPassword
                }
                disabled={isResetLoading}
              >
                {isResetLoading ? (
                  <ActivityIndicator size="small" color="#080C0A" />
                ) : (
                  <Text style={styles.modalSubmitText}>
                    {step === 'REQUEST' ? 'Send Code' : 'Reset Password'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
  forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: 16 },
  forgotPasswordText: { color: '#34D399', fontSize: 12, fontWeight: '600' },
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

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 11, 7, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#051610',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 24,
  },
  modalTitle: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#082017',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  modalCancelText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#34D399',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: '#080C0A',
    fontSize: 13,
    fontWeight: '800',
  },
});
