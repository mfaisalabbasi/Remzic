import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { useLoginFlow } from '../../components/auth/useLoginFlow';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupStep1Form } from '../../components/auth/SignupStep1Form';
import { KycStep2Form } from '../../components/auth/KycStep2Form';
import { LoginScreenProps } from '../../components/auth/types';

export const LoginScreen = ({ route }: LoginScreenProps) => {
  const insets = useSafeAreaInsets();
  const initialMode = route?.params?.mode === 'signup';

  const {
    isSignUp,
    setIsSignUp,
    step,
    setStep,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    phone,
    setPhone,
    kycFullName,
    setKycFullName,
    dob,
    setDob,
    showIosDatePicker,
    setShowIosDatePicker,
    idDocument,
    addressProof,
    isSubmitting,
    handleLogin,
    handleNextToKyc,
    handlePickDocument,
    handleFinalSubmit,
  } = useLoginFlow(initialMode);

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dob,
        maximumDate: new Date(),
        mode: 'date',
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setDob(selectedDate);
          }
        },
      });
    } else {
      setShowIosDatePicker(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient Background Glow Layer */}
      <View style={styles.ambientGlowContainer} pointerEvents="none">
        <View style={styles.glowOrbPrimary} />
        <View style={styles.glowOrbSecondary} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <AuthHeader step={step} isSignUp={isSignUp} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            {step === 0 && !isSignUp && (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onLogin={handleLogin}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 1 && (
              <SignupStep1Form
                name={name}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onNext={handleNextToKyc}
              />
            )}

            {step === 2 && (
              <KycStep2Form
                kycFullName={kycFullName}
                setKycFullName={setKycFullName}
                dob={dob}
                setDob={setDob}
                showIosDatePicker={showIosDatePicker}
                setShowIosDatePicker={setShowIosDatePicker}
                openDatePicker={openDatePicker}
                idDocument={idDocument}
                addressProof={addressProof}
                onPickDocument={handlePickDocument}
                onBack={() => setStep(1)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isSignUp || step > 0
              ? 'Already have an account? '
              : "Don't have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (step > 0) {
                setStep(0);
                setIsSignUp(false);
              } else {
                setIsSignUp(!isSignUp);
                setStep(!isSignUp ? 1 : 0);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.footerActionText}>
              {isSignUp || step > 0 ? 'Log In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  ambientGlowContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glowOrbPrimary: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  glowOrbSecondary: {
    position: 'absolute',
    bottom: 40,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  formCard: {
    backgroundColor: '#111816',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerActionText: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
});
