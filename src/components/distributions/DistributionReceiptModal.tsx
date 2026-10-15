// src/components/distributions/DistributionReceiptModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const BuildingIcon = ({ size = 26, color = '#34D399' }) => (
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
    <Rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <Path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </Svg>
);

const CloseIcon = ({ size = 16, color = '#F0FDF4' }) => (
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

const CopyIcon = ({ size = 15, color = '#34D399' }) => (
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
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Svg>
);

const CheckCircleIcon = ({ size = 15, color = '#34D399' }) => (
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

interface DistributionReceiptModalProps {
  visible: boolean;
  selectedItem: any;
  copied: boolean;
  isCheckingClaim: boolean;
  onClose: () => void;
  onCopyHash: (hash?: string) => void;
  onOpenWebViewClaim: (item: any) => void;
}

export const DistributionReceiptModal = ({
  visible,
  selectedItem,
  copied,
  isCheckingClaim,
  onClose,
  onCopyHash,
  onOpenWebViewClaim,
}: DistributionReceiptModalProps) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHandleBar} />
        <View style={styles.modalHeaderRow}>
          <Text style={styles.modalTitle}>Smart Contract Receipt</Text>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <CloseIcon size={16} color="#F0FDF4" />
          </TouchableOpacity>
        </View>

        {selectedItem && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollBody}
          >
            <View style={styles.receiptHeroCard}>
              <View style={styles.receiptHeroIconCircle}>
                <BuildingIcon size={26} color="#34D399" />
              </View>
              <Text style={styles.receiptAssetTitle}>{selectedItem.title}</Text>
              <Text style={styles.receiptLocation}>
                {selectedItem.location}
              </Text>
              <Text style={styles.receiptAmountDisplay}>
                ${selectedItem.amount.toFixed(2)}
              </Text>
              <View style={styles.receiptStatusPill}>
                <Text style={styles.receiptStatusPillText}>
                  Verified Execution
                </Text>
              </View>
            </View>

            <View style={styles.ledgerInfoCard}>
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerKey}>Asset Class</Text>
                <Text style={styles.ledgerVal}>{selectedItem.assetType}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerKey}>Distribution Cycle</Text>
                <Text style={styles.ledgerVal}>{selectedItem.date}</Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerKey}>Token Standard</Text>
                <Text style={styles.ledgerVal}>
                  {selectedItem.tokenStandard}
                </Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerKey}>Yield Rate</Text>
                <Text style={[styles.ledgerVal, { color: '#34D399' }]}>
                  {selectedItem.yieldRate}
                </Text>
              </View>
              {selectedItem.contractAddress && (
                <>
                  <View style={styles.ledgerDivider} />
                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerKey}>Contract Address</Text>
                    <Text
                      style={[styles.ledgerVal, { fontSize: 10.5 }]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {selectedItem.contractAddress}
                    </Text>
                  </View>
                </>
              )}
              {selectedItem.txHash && (
                <>
                  <View style={styles.ledgerDivider} />
                  <View style={styles.ledgerColumn}>
                    <Text style={styles.ledgerKey}>
                      On-Chain Transaction Hash
                    </Text>
                    <TouchableOpacity
                      style={styles.hashContainer}
                      onPress={() => onCopyHash(selectedItem.txHash)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={styles.hashText}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {selectedItem.txHash}
                      </Text>
                      {copied ? (
                        <CheckCircleIcon size={14} color="#34D399" />
                      ) : (
                        <CopyIcon size={14} color="#34D399" />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            {selectedItem.distributionMode === 'ON_CHAIN' &&
              selectedItem.status !== 'Paid' && (
                <TouchableOpacity
                  style={[
                    styles.modalDoneButton,
                    {
                      backgroundColor: '#34D399',
                      marginBottom: 12,
                      borderColor: '#34D399',
                    },
                  ]}
                  onPress={() => onOpenWebViewClaim(selectedItem)}
                  disabled={isCheckingClaim}
                  activeOpacity={0.85}
                >
                  {isCheckingClaim ? (
                    <ActivityIndicator color="#080C0A" size="small" />
                  ) : (
                    <Text
                      style={[styles.modalDoneButtonText, { color: '#080C0A' }]}
                    >
                      Sign & Claim via Web Portal 🔗
                    </Text>
                  )}
                </TouchableOpacity>
              )}

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneButtonText}>Close Receipt</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#111816',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  modalHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: '#F0FDF4', fontSize: 16, fontWeight: '700' },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#080C0A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalScrollBody: { paddingBottom: 20 },
  receiptHeroCard: {
    backgroundColor: '#080C0A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  receiptHeroIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptAssetTitle: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  receiptLocation: { color: '#94A3B8', fontSize: 11, marginBottom: 12 },
  receiptAmountDisplay: {
    color: '#34D399',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  receiptStatusPill: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  receiptStatusPillText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  ledgerInfoCard: {
    backgroundColor: '#080C0A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ledgerColumn: { paddingVertical: 6 },
  ledgerKey: { color: '#94A3B8', fontSize: 12 },
  ledgerVal: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  ledgerDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.04)' },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  hashText: { color: '#34D399', fontSize: 11, flex: 1, marginRight: 8 },
  modalDoneButton: {
    backgroundColor: '#111816',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalDoneButtonText: { color: '#F0FDF4', fontSize: 13, fontWeight: '700' },
});
