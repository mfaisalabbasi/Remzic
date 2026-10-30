import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';
interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const API_HOST =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:4000'
      : 'http://127.0.0.1:4000';

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both current and new passwords.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmittingPassword(true);
      const token = await AsyncStorage.getItem('accessToken');

      const endpoint = `${API_HOST}/api/users/change-password`;
      console.log('🔑 [ChangePassword] Sending request to:', endpoint);

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      console.log('🔑 [ChangePassword] Response status:', response.status);
      console.log('🔑 [ChangePassword] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update master password.');
      }

      Alert.alert('Success', 'Master password updated securely.');
      onClose();
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('❌ [ChangePassword] Error caught:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Master Password</Text>
          <Text style={styles.modalSubtitle}>
            Enter your current password and choose a secure new master key.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.inputField}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#4B5563"
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password (Min 6 chars)</Text>
            <TextInput
              style={styles.inputField}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#4B5563"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                onClose();
                setOldPassword('');
                setNewPassword('');
              }}
              disabled={isSubmittingPassword}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleUpdatePassword}
              disabled={isSubmittingPassword}
            >
              {isSubmittingPassword ? (
                <ActivityIndicator size="small" color="#020B07" />
              ) : (
                <Text style={styles.modalSubmitText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#082017',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F0FDF4',
    fontSize: 14,
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
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: '#020B07',
    fontSize: 13,
    fontWeight: '800',
  },
});
