import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const MailIcon = ({ size = 20, color = Colors.accent }) => (
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
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
);

const PhoneIcon = ({ size = 20, color = Colors.accent }) => (
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
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#6EE7B7' }) => (
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
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

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

interface SupportChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
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
        <View style={styles.supportModalContainer}>
          <View style={styles.supportModalHeader}>
            <View>
              <Text style={styles.modalTitle}>VIP Concierge Support</Text>
              <Text style={styles.modalSubtitle}>
                Direct institutional assistance channels
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.supportContactCard}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('mailto:support@remzik.com')}
          >
            <View style={styles.iconBoxLarge}>
              <MailIcon size={20} color={Colors.accent} />
            </View>
            <View style={styles.supportContactInfo}>
              <Text style={styles.supportContactTitle}>
                Official Support Email
              </Text>
              <Text style={styles.supportContactValue}>support@remzik.com</Text>
            </View>
            <ChevronRightIcon size={16} color="#6EE7B7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportContactCard}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('tel:+966500000000')}
          >
            <View style={styles.iconBoxLarge}>
              <PhoneIcon size={20} color={Colors.accent} />
            </View>
            <View style={styles.supportContactInfo}>
              <Text style={styles.supportContactTitle}>
                Institutional Hotline
              </Text>
              <Text style={styles.supportContactValue}>+966 50 000 0000</Text>
            </View>
            <ChevronRightIcon size={16} color="#6EE7B7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportDoneButton} onPress={onClose}>
            <Text style={styles.supportDoneText}>Close Channel</Text>
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
  supportModalContainer: {
    width: '100%',
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
  supportContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#082017',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 12,
    gap: 14,
  },
  iconBoxLarge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  supportContactInfo: {
    flex: 1,
  },
  supportContactTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  supportContactValue: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
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
