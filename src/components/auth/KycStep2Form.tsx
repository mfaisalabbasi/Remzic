import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const KycStep2Form = ({
  kycFullName,
  setKycFullName,
  dob,
  setDob,
  showIosDatePicker,
  setShowIosDatePicker,
  openDatePicker,
  idDocument,
  addressProof,
  onPickDocument,
  onBack,
  onSubmit,
  isSubmitting,
}: any) => {
  const formattedDobString = dob.toISOString().split('T')[0];

  return (
    <>
      <View style={styles.roleBadgeContainer}>
        <View style={styles.liveDot} />
        <Text style={styles.roleBadgeText}>
          Registering as Verified Institutional Investor
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name (As per official ID)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Muhammad Faisal"
          placeholderTextColor="#64748B"
          value={kycFullName}
          onChangeText={setKycFullName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.textInput}
          onPress={openDatePicker}
          activeOpacity={0.8}
        >
          <Text style={styles.datePickerText}>📅 {formattedDobString}</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && showIosDatePicker && (
          <View style={styles.iosPickerContainer}>
            <DateTimePicker
              value={dob}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              themeVariant="dark"
              onChange={(_, date) => date && setDob(date)}
            />
            <TouchableOpacity
              style={styles.iosDoneButton}
              onPress={() => setShowIosDatePicker(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.iosDoneButtonText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Identity Document (Passport / Iqama)
        </Text>
        <TouchableOpacity
          style={[styles.uploadBox, idDocument && styles.uploadBoxSuccess]}
          onPress={() => onPickDocument('id')}
          activeOpacity={0.75}
        >
          <Text
            style={[styles.uploadText, idDocument && styles.uploadTextSuccess]}
          >
            {idDocument
              ? `✓ Verified: ${idDocument.name}`
              : '📁 Tap to browse document (.pdf, .png)'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Proof of Address (Utility Bill / Statement)
        </Text>
        <TouchableOpacity
          style={[styles.uploadBox, addressProof && styles.uploadBoxSuccess]}
          onPress={() => onPickDocument('address')}
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
          onPress={onBack}
          activeOpacity={0.75}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButtonHalf,
            isSubmitting && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonHalfText}>
            {isSubmitting ? 'Submitting...' : 'Finalize & Submit'}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
  },
  datePickerText: { color: '#F0FDF4', fontSize: 14, fontWeight: '500' },
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
  uploadText: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  uploadTextSuccess: { color: '#34D399', fontWeight: '700' },
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
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  roleBadgeText: {
    color: '#34D399',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primaryButtonHalf: {
    flex: 1,
    backgroundColor: '#34D399',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
  secondaryButtonText: { color: '#F0FDF4', fontSize: 14.5, fontWeight: '700' },
  disabledButton: { opacity: 0.5 },
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
  iosDoneButtonText: { color: '#080C0A', fontWeight: '800', fontSize: 13 },
});
