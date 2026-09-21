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
import { Colors } from '../../theme/colors';

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

  // 📂 Native Document Picker Integration (Updated to modern API error handling)
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
          // User cancelled the picker selection - safely ignore
          return;
        }
      }
      RNAlert.alert('Error', 'Failed to select document.');
    }
  };

  // 📅 Cross-Platform Date Picker Trigger
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

  // Format Date to YYYY-MM-DD string for backend
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

      // Simulated network request
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
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
                ? 'Secure access to Remzik Protocol'
                : 'Sign in to your Remzik account')}
            {step === 1 && 'Step 1 of 2: Enter your basic investor credentials'}
            {step === 2 && 'Step 2 of 2: Complete identity verification'}
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

                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.primaryButtonText}>Log In</Text>
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
                >
                  <Text style={styles.primaryButtonText}>
                    Next: Identity Verification
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* --- SIGNUP STEP 2: KYC VERIFICATION --- */}
            {step === 2 && (
              <>
                <View style={styles.roleBadgeContainer}>
                  <Text style={styles.roleBadgeText}>
                    💼 Registering as Verified Investor
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
                  >
                    <Text
                      style={{
                        color: Colors.textPrimary,
                        fontSize: 14,
                        paddingTop: 2,
                      }}
                    >
                      📅 {formattedDobString}
                    </Text>
                  </TouchableOpacity>

                  {/* iOS Inline / Modal Spinner Picker */}
                  {Platform.OS === 'ios' && showIosDatePicker && (
                    <View style={{ marginTop: 10, alignItems: 'center' }}>
                      <DateTimePicker
                        value={dob}
                        mode="date"
                        display="spinner"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) setDob(selectedDate);
                        }}
                      />
                      <TouchableOpacity
                        style={styles.iosDoneButton}
                        onPress={() => setShowIosDatePicker(false)}
                      >
                        <Text style={styles.iosDoneButtonText}>Done</Text>
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
                    style={styles.uploadBox}
                    onPress={() => handlePickDocument('id')}
                  >
                    <Text style={styles.uploadText}>
                      {idDocument
                        ? `✅ ${idDocument.name}`
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
                    style={styles.uploadBox}
                    onPress={() => handlePickDocument('address')}
                  >
                    <Text style={styles.uploadText}>
                      {addressProof
                        ? `✅ ${addressProof.name}`
                        : '📁 Tap to browse address proof'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButtonHalf}
                    onPress={() => setStep(1)}
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
                  >
                    <Text style={styles.primaryButtonText}>
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
    backgroundColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 8,
  },
  logoText: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    justifyContent: 'center',
  },
  uploadBox: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  roleBadgeContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  roleBadgeText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  primaryButtonHalf: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonHalf: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
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
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  iosDoneButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  iosDoneButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
