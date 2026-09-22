import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert as RNAlert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

type Role = 'INVESTOR';

export const LoginScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) => {
  const insets = useSafeAreaInsets();
  const initialMode = route?.params?.mode === 'signup';

  const [isSignUp, setIsSignUp] = useState(initialMode);
  const [step, setStep] = useState<number>(initialMode ? 1 : 0);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const selectedRole: Role = 'INVESTOR';

  // KYC States
  const [kycFullName, setKycFullName] = useState('');
  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1));
  const [showIosDatePicker, setShowIosDatePicker] = useState(false);

  // File objects for FormData
  const [idDocument, setIdDocument] = useState<any>(null);
  const [addressProof, setAddressProof] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Login submission
  const handleLogin = () => {
    if (!email || !password) {
      RNAlert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    RNAlert.alert('Success', 'Logged in successfully!');
  };

  const handleNextToKyc = () => {
    if (!name || !email || !phone || !password) {
      RNAlert.alert('Missing Fields', 'Please complete all fields to proceed.');
      return;
    }
    if (password !== confirmPassword) {
      RNAlert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setKycFullName(name);
    setStep(2);
  };

  // Native Document Picker Integration
  const handlePickDocument = async (type: 'id' | 'address') => {
    try {
      const pickerResult = await pick({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf, types.images],
      });

      const file = pickerResult[0];
      const formattedFile = {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document',
      };

      if (type === 'id') {
        setIdDocument(formattedFile);
      } else {
        setAddressProof(formattedFile);
      }
    } catch (err) {
      if (isErrorWithCode(err)) {
        if (err.code === errorCodes.OPERATION_CANCELED) {
          return;
        }
      }
      RNAlert.alert('Error', 'Failed to select document.');
    }
  };

  // Cross-Platform Date Picker Trigger
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

  const formattedDobString = dob.toISOString().split('T')[0];

  // Final Step: Atomic Registration + KYC Submission
  const handleFinalSubmit = async () => {
    if (!kycFullName || !idDocument || !addressProof) {
      RNAlert.alert(
        'KYC Incomplete',
        'Please fill out all fields and upload both verification documents.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('role', selectedRole);
      formData.append('fullName', kycFullName);
      formData.append('dob', formattedDobString);

      formData.append('idDocument', idDocument);
      formData.append('addressProof', addressProof);

      setTimeout(() => {
        setIsSubmitting(false);
        RNAlert.alert(
          'Verification Pending',
          'Account and KYC documents submitted successfully for review!',
          [
            {
              text: 'Sign In',
              onPress: () => {
                setStep(0);
                setIsSignUp(false);
              },
            },
          ],
        );
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      RNAlert.alert(
        'Submission Failed',
        'Please check your connection and try again.',
      );
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
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <View style={styles.logoInnerGlow} />
            <Text style={styles.logoText}>R</Text>
          </View>

          <Text style={styles.title}>
            {step === 0 && (isSignUp ? 'Create Account' : 'Welcome Back')}
            {step === 1 && 'Personal Information'}
            {step === 2 && 'KYC Verification'}
          </Text>

          <Text style={styles.subtitle}>
            {step === 0 &&
              (isSignUp
                ? 'Secure institutional access to Remzik'
                : 'Sign in to your secure investor dashboard')}
            {step === 1 && 'Step 1 of 2: Enter your verified credentials'}
            {step === 2 && 'Step 2 of 2: Regulatory identity verification'}
          </Text>

          {step > 0 && (
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressBar, { width: `${(step / 2) * 100}%` }]}
              />
            </View>
          )}
        </View>

        {/* Form Container */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            {/* --- LOGIN VIEW --- */}
            {step === 0 && !isSignUp && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email or Phone</Text>
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
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleLogin}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Log In</Text>
                  <View style={styles.arrowIconCircle}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* --- SIGNUP STEP 1 --- */}
            {step === 1 && (
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
                  onPress={handleNextToKyc}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    Next: Identity Verification
                  </Text>
                  <View style={styles.arrowIconCircle}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* --- SIGNUP STEP 2: KYC VERIFICATION --- */}
            {step === 2 && (
              <>
                <View style={styles.roleBadgeContainer}>
                  <View style={styles.liveDot} />
                  <Text style={styles.roleBadgeText}>
                    Registering as Verified Institutional Investor
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Full Name (As per official ID)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Muhammad Faisal"
                    placeholderTextColor="#64748B"
                    value={kycFullName}
                    onChangeText={setKycFullName}
                  />
                </View>

                {/* Date of Birth Picker Trigger */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.textInput}
                    onPress={openDatePicker}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.datePickerText}>
                      📅 {formattedDobString}
                    </Text>
                  </TouchableOpacity>

                  {/* iOS Inline / Modal Spinner Picker */}
                  {Platform.OS === 'ios' && showIosDatePicker && (
                    <View style={styles.iosPickerContainer}>
                      <DateTimePicker
                        value={dob}
                        mode="date"
                        display="spinner"
                        maximumDate={new Date()}
                        themeVariant="dark"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) setDob(selectedDate);
                        }}
                      />
                      <TouchableOpacity
                        style={styles.iosDoneButton}
                        onPress={() => setShowIosDatePicker(false)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.iosDoneButtonText}>
                          Confirm Date
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* ID Document Upload Picker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Identity Document (Passport / Iqama)
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.uploadBox,
                      idDocument && styles.uploadBoxSuccess,
                    ]}
                    onPress={() => handlePickDocument('id')}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.uploadText,
                        idDocument && styles.uploadTextSuccess,
                      ]}
                    >
                      {idDocument
                        ? `✓ Verified: ${idDocument.name}`
                        : '📁 Tap to browse document (.pdf, .png)'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Address Proof Upload Picker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Proof of Address (Utility Bill / Statement)
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.uploadBox,
                      addressProof && styles.uploadBoxSuccess,
                    ]}
                    onPress={() => handlePickDocument('address')}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.uploadText,
                        addressProof && styles.uploadTextSuccess,
                      ]}
                    >
                      {addressProof
                        ? `✓ Verified: ${addressProof.name}`
                        : '📁 Tap to browse address proof'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButtonHalf}
                    onPress={() => setStep(1)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.secondaryButtonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.primaryButtonHalf,
                      isSubmitting && styles.disabledButton,
                    ]}
                    onPress={handleFinalSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryButtonHalfText}>
                      {isSubmitting ? 'Submitting...' : 'Finalize & Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {/* Switch Mode Footer */}
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
  headerContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  logoText: {
    color: '#34D399',
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    color: '#F0FDF4',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34D399',
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
  inputGroup: {
    marginBottom: 14,
  },
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
    justifyContent: 'center',
  },
  datePickerText: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadBox: {
    backgroundColor: '#080C0A',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxSuccess: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
    borderStyle: 'solid',
  },
  uploadText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  uploadTextSuccess: {
    color: '#34D399',
    fontWeight: '700',
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  roleBadgeText: {
    color: '#34D399',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
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
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
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
  arrowText: {
    color: '#080C0A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  primaryButtonHalf: {
    flex: 1,
    backgroundColor: '#34D399',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonHalfText: {
    color: '#080C0A',
    fontSize: 14.5,
    fontWeight: '800',
  },
  secondaryButtonHalf: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#F0FDF4',
    fontSize: 14.5,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
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
  iosPickerContainer: {
    marginTop: 12,
    backgroundColor: '#080C0A',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
  },
  iosDoneButton: {
    backgroundColor: '#34D399',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  iosDoneButtonText: {
    color: '#080C0A',
    fontWeight: '800',
    fontSize: 13,
  },
});
