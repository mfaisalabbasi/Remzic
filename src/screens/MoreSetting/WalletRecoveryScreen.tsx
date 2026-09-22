import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import { Colors } from '../../theme/colors';

// --- Dedicated Inline SVG Icons for Security Center ---
const ShieldCheckIcon = ({ size = 24, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const WarningIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <Path d="M12 9v4M12 17h.01" />
  </Svg>
);

const DocumentIcon = ({ size = 22, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

const CheckCircleIcon = ({ size = 28, color = '#34D399' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

export const WalletRecoveryScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'overview' | 'modal' | 'kyc' | 'submitted'>(
    'overview',
  );
  const [documentType, setDocumentType] = useState('Passport');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const documentOptions = [
    'Passport',
    'National Identity Card',
    'Driver License',
    'Residence Visa / Iqama',
  ];

  // Updated Native Document Picker Integration using `@react-native-documents/picker`
  const handleFilePick = async () => {
    try {
      const [result] = await pick({
        type: [types.pdf, types.images],
        presentationStyle: 'fullScreen',
      });

      if (result && result.name) {
        setSelectedFileName(result.name);
      }
    } catch (err: unknown) {
      if (isErrorWithCode(err)) {
        if (err.code === errorCodes.IN_PROGRESS) {
          // Single pick in progress, multiple concurrent picks handled gracefully
        } else if (err.code === errorCodes.OPERATION_CANCELED) {
          // User canceled the document selection modal
        } else {
          console.error('Document picker unknown error code:', err.code);
        }
      } else {
        console.error('Unexpected document picker error:', err);
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Recovery Center</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- STEP 1: OVERVIEW CARD --- */}
        {step === 'overview' && (
          <View style={styles.recoveryCard}>
            <View style={styles.cardGlow} />
            <View style={styles.cardHeaderIcon}>
              <ShieldCheckIcon size={22} color={Colors.accent} />
            </View>
            <Text style={styles.cardTitle}>Wallet Recovery Center</Text>
            <Text style={styles.cardDesc}>
              If you have permanently lost access to your embedded custodial key
              or device, initiate a secure, compliance-backed recovery workflow
              to securely reinstate your asset holdings.
            </Text>

            <View style={styles.securityBulletList}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  Multi-factor cryptographic identity matching
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  Institutional compliance oversight team review
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => setStep('modal')}
            >
              <Text style={styles.primaryButtonText}>
                Start Recovery Workflow
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- STEP 2: WARNING MODAL / CONFIRMATION STEP --- */}
        {step === 'modal' && (
          <View style={styles.recoveryCard}>
            <View style={styles.cardGlow} />
            <View style={styles.modalBadge}>
              <WarningIcon size={14} color="#EF4444" />
              <Text style={styles.modalBadgeText}> Action Required</Text>
            </View>
            <Text style={styles.cardTitle}>Initialize Wallet Recovery</Text>
            <Text style={styles.cardDesc}>
              By starting this protocol, you confirm that you no longer have
              active access to your primary signing device. Rigorous identity
              verification is mandatory to prevent unauthorized asset access.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Estimated Review Window</Text>
              <Text style={styles.infoBoxValue}>1–3 business days</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => setStep('overview')}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1, marginTop: 0 }]}
                activeOpacity={0.85}
                onPress={() => setStep('kyc')}
              >
                <Text style={styles.primaryButtonText}>Confirm & Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- STEP 3: KYC UPLOAD FORM --- */}
        {step === 'kyc' && (
          <View style={styles.recoveryCard}>
            <View style={styles.cardGlow} />
            <View style={styles.stepIndicatorRow}>
              <Text style={styles.cardTitle}>Identity Verification</Text>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 1 OF 2</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              Upload a valid, high-resolution government-issued photo ID to
              re-establish ownership of your token portfolio.
            </Text>

            {/* Document Type Dropdown Selector */}
            <Text style={styles.inputLabel}>Document Type</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              activeOpacity={0.8}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Text style={styles.inputText}>{documentType}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {/* Document Upload Box */}
            <Text style={styles.inputLabel}>Document Image / PDF File</Text>
            <TouchableOpacity
              style={[
                styles.fileUploadBox,
                selectedFileName ? styles.fileUploadBoxActive : null,
              ]}
              activeOpacity={0.8}
              onPress={handleFilePick}
            >
              <DocumentIcon
                size={22}
                color={selectedFileName ? '#34D399' : Colors.accent}
              />
              <Text
                style={[
                  styles.fileUploadText,
                  selectedFileName ? styles.fileUploadTextActive : null,
                ]}
              >
                {selectedFileName
                  ? `📎 ${selectedFileName}`
                  : 'Choose Government ID File (PDF, JPG, PNG)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => setStep('overview')}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1, marginTop: 0 }]}
                activeOpacity={0.85}
                onPress={() => setStep('submitted')}
              >
                <Text style={styles.primaryButtonText}>Next: Biometrics →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- STEP 4: SUBMITTED SUCCESS VIEW --- */}
        {step === 'submitted' && (
          <View style={styles.recoveryCard}>
            <View style={styles.cardGlow} />
            <View style={styles.successCheckCircle}>
              <CheckCircleIcon size={26} color="#34D399" />
            </View>
            <Text style={styles.cardTitle}>Recovery Package Submitted</Text>
            <Text style={styles.cardDesc}>
              Your verification bundle has been securely encrypted and
              transmitted to our compliance node network for review.
            </Text>

            <View style={styles.statusTable}>
              <View style={styles.statusRow}>
                <Text style={styles.statusRowLabel}>Current Status</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>UNDER REVIEW</Text>
                </View>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusRow}>
                <Text style={styles.statusRowLabel}>Est. Processing Time</Text>
                <Text style={styles.statusRowVal}>1–3 business days</Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusRow}>
                <Text style={styles.statusRowLabel}>Reference Identifier</Text>
                <Text style={styles.statusRowValAccent}>#REC-287bb0a6</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                setStep('overview');
                setSelectedFileName(null);
                navigation.navigate('MainTabs', { screen: 'Home' });
              }}
            >
              <Text style={styles.primaryButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Document Selection Bottom Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalContentContainer}>
            <View style={styles.modalIndicatorBar} />
            <Text style={styles.modalHeaderTitle}>Select Document Type</Text>
            {documentOptions.map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalOptionItem,
                  documentType === item && styles.modalOptionActive,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setDocumentType(item);
                  setIsDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    documentType === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {documentType === item && (
                  <Text style={{ color: Colors.accent, fontWeight: '800' }}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03100B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  backButtonText: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  recoveryCard: {
    backgroundColor: '#061A12',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    gap: 14,
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  cardHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  cardTitle: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardDesc: {
    color: '#A7F3D0',
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 20,
  },
  securityBulletList: {
    gap: 6,
    marginVertical: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletDot: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
  },
  bulletText: {
    color: '#6EE7B7',
    opacity: 0.8,
    fontSize: 12,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#03100B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: '#082017',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  secondaryButtonText: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalBadgeText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#082017',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  infoBoxLabel: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '500',
  },
  infoBoxValue: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  stepBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  inputLabel: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#082017',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputText: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownArrow: {
    color: '#6EE7B7',
    fontSize: 11,
  },
  fileUploadBox: {
    backgroundColor: '#082017',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderStyle: 'dashed',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fileUploadBoxActive: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  fileUploadText: {
    color: '#6EE7B7',
    opacity: 0.8,
    fontSize: 12,
    fontWeight: '600',
  },
  fileUploadTextActive: {
    color: '#34D399',
    opacity: 1,
  },
  successCheckCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  statusTable: {
    backgroundColor: '#082017',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  statusRowLabel: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '500',
  },
  statusRowVal: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '700',
  },
  statusRowValAccent: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusPillText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 16, 11, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    backgroundColor: '#061A12',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingBottom: 40,
    gap: 12,
  },
  modalIndicatorBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalHeaderTitle: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#082017',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
    marginBottom: 8,
  },
  modalOptionActive: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  modalOptionText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOptionTextActive: {
    color: '#F0FDF4',
    fontWeight: '700',
  },
});
