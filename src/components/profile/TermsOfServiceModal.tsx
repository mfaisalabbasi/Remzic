import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const CloseIcon = ({ size = 20, color = '#94A3B8' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.termsModalContainer}>
          <View style={styles.supportModalHeader}>
            <View>
              <Text style={styles.modalTitle}>Terms of Service & Privacy</Text>
              <Text style={styles.modalSubtitle}>
                Remzik Protocol Legal Framework
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.termsScrollContent}
          >
            <Text style={styles.termsHeading}>
              1. Acceptance of Protocol Terms
            </Text>
            <Text style={styles.termsBody}>
              By accessing or utilizing the Remzik Protocol platform, you agree
              to be bound by these institutional terms of service, security
              protocols, and global asset compliance guidelines.
            </Text>

            <Text style={styles.termsHeading}>
              2. Real-World Asset (RWA) Tokenization
            </Text>
            <Text style={styles.termsBody}>
              All tokenized assets and smart contracts operate under verifiable
              legal frameworks. Yield generation and fractional liquidity are
              governed by automated cryptographic agreements.
            </Text>

            <Text style={styles.termsHeading}>
              3. Privacy & Data Encryption
            </Text>
            <Text style={styles.termsBody}>
              We maintain end-to-end encryption across all client
              communications, transactions, and credential stores. Biometric
              credentials and master keys never leave your secure enclave.
            </Text>

            <Text style={styles.termsHeading}>
              4. Account Security & Liability
            </Text>
            <Text style={styles.termsBody}>
              Users are solely responsible for maintaining the confidentiality
              of their master passwords and secure devices. Remzik Protocol is
              not liable for unauthorized access resulting from compromised
              local hardware.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.supportDoneButton} onPress={onClose}>
            <Text style={styles.supportDoneText}>I Understand & Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 11, 7, 0.85)',
    justifyContent: 'flex-end',
  },
  termsModalContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#051610',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 24,
    paddingBottom: 40,
  },
  supportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  termsScrollContent: {
    paddingVertical: 8,
    paddingRight: 4,
  },
  termsHeading: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  termsBody: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  supportDoneButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  supportDoneText: {
    color: '#020B07',
    fontSize: 14,
    fontWeight: '800',
  },
});
