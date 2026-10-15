import { useState } from 'react';
import { Platform, Alert as RNAlert } from 'react-native';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../navigation/AuthContext';
import { walletApi } from '../../services/api/walletApi';
import { apiClient } from '../../services/api/client';
import { Role, DocumentFile } from './types';

export const useLoginFlow = (initialMode: boolean) => {
  const { login } = useAuth();

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
  const [idDocument, setIdDocument] = useState<DocumentFile | null>(null);
  const [addressProof, setAddressProof] = useState<DocumentFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPhone = (val: string) => /^\+?[0-9\s\-()]{8,15}$/.test(val);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      RNAlert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      RNAlert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email: trimmedEmail,
        password,
      });

      const data = response.data;
      const token = data.accessToken || data.token || data.access_token;

      if (!token) {
        throw new Error('Authentication token missing from server response.');
      }

      await AsyncStorage.setItem('accessToken', token);

      try {
        console.log(
          '🔄 [Web3 Bridge] Triggering server-side Privy wallet sync...',
        );
        const syncResult = await walletApi.syncWallet();
        console.log(
          '✅ [Web3 Bridge] Privy wallet synchronized successfully:',
          syncResult.walletAddress,
        );
      } catch (walletErr) {
        console.warn(
          '⚠️ [Web3 Bridge] Wallet sync warning (non-blocking):',
          walletErr,
        );
      }

      await login(token);
    } catch (err: any) {
      RNAlert.alert(
        'Login Failed',
        err.response?.data?.message ||
          err.message ||
          'Please check your connection.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextToKyc = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !password ||
      !confirmPassword
    ) {
      RNAlert.alert('Missing Fields', 'Please complete all fields to proceed.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      RNAlert.alert('Invalid Email', 'Please enter a valid email format.');
      return;
    }
    if (!isValidPhone(trimmedPhone)) {
      RNAlert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }
    if (password.length < 6) {
      RNAlert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.',
      );
      return;
    }
    if (password !== confirmPassword) {
      RNAlert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setKycFullName(trimmedName);
    setStep(2);
  };

  const handlePickDocument = async (type: 'id' | 'address') => {
    try {
      const pickerResult = await pick({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf, types.images],
      });

      const file = pickerResult[0];
      let processedUri = file.uri;
      if (Platform.OS === 'ios') {
        processedUri = decodeURI(file.uri);
        if (!processedUri.startsWith('file://')) {
          processedUri = `file://${processedUri}`;
        }
      }

      const rawName =
        file.name || processedUri.split('/').pop() || 'document.pdf';
      const cleanName = rawName.replace(/(\.[a-zA-Z0-9]+)\1+$/i, '$1');

      const formattedFile = {
        uri: processedUri,
        type: file.type || 'application/octet-stream',
        name: cleanName,
      };

      if (type === 'id') {
        setIdDocument(formattedFile);
      } else {
        setAddressProof(formattedFile);
      }
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      RNAlert.alert('Error', 'Failed to select document.');
    }
  };

  const handleFinalSubmit = async () => {
    const trimmedKycName = kycFullName.trim();
    if (!trimmedKycName) {
      RNAlert.alert(
        'KYC Incomplete',
        'Please enter your full name as per your official ID.',
      );
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (age < 18 || (age === 18 && m < 0)) {
      RNAlert.alert(
        'Age Restriction',
        'You must be at least 18 years old to register as an investor.',
      );
      return;
    }

    if (!idDocument || !addressProof) {
      RNAlert.alert(
        'Documents Missing',
        'Please upload both your identity document and proof of address.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      formData.append('password', password);
      formData.append('role', selectedRole);
      formData.append('fullName', trimmedKycName);
      formData.append('dob', dob.toISOString().split('T')[0]);

      formData.append('idDocument', idDocument as any);
      formData.append('addressProof', addressProof as any);

      await apiClient.post('/users/register-with-kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      try {
        const loginResponse = await apiClient.post('/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });
        const token =
          loginResponse.data.accessToken ||
          loginResponse.data.token ||
          loginResponse.data.access_token;
        if (token) {
          await AsyncStorage.setItem('accessToken', token);
          console.log(
            '🔄 [Web3 Bridge] Provisioning post-signup Privy wallet...',
          );
          await walletApi.syncWallet();
          console.log(
            '✅ [Web3 Bridge] Post-signup Privy wallet generated successfully.',
          );
          await login(token);
          return;
        }
      } catch (syncErr) {
        console.warn(
          '⚠️ [Web3 Bridge] Post-signup wallet sync warning:',
          syncErr,
        );
      }

      setIsSubmitting(false);
      RNAlert.alert(
        'Verification Pending',
        'Account and KYC documents submitted successfully!',
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
    } catch (err: any) {
      setIsSubmitting(false);
      RNAlert.alert(
        'Submission Failed',
        err.response?.data?.message ||
          err.message ||
          'Please check your connection and try again.',
      );
    }
  };

  return {
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
  };
};
