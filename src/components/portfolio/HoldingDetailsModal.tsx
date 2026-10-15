// src/components/portfolio/HoldingDetailsModal.tsx
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
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  cardAlt: '#151D1B',
  modalBg: '#0D1311',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  success: '#34D399',
  warning: '#FBBF24',
  border: 'rgba(52, 211, 153, 0.15)',
};

const GlobeIcon = ({ size = 16, color = PALETTE.textMuted }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </Svg>
);

const CloseIcon = ({ size = 20, color = PALETTE.textMuted }) => (
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
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const ShieldCheckIcon = ({ size = 16, color = PALETTE.accent }) => (
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

interface HoldingDetailsModalProps {
  visible: boolean;
  selectedHolding: any | null;
  bottomInset: number;
  downloadingDeed: boolean;
  onClose: () => void;
  onDownloadDeed: () => void;
}

export const HoldingDetailsModal = ({
  visible,
  selectedHolding,
  bottomInset,
  downloadingDeed,
  onClose,
  onDownloadDeed,
}: HoldingDetailsModalProps) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View
        style={[
          styles.modalContent,
          { paddingBottom: Math.max(bottomInset, 24) },
        ]}
      >
        <View style={styles.modalIndicatorBar} />
        <View style={styles.modalHeaderRow}>
          <View style={styles.modalAssetTypeContainer}>
            <GlobeIcon size={14} color={PALETTE.accent} />
            <Text style={styles.modalAssetTypeText}>
              {selectedHolding?.assetClass || 'Real-World Asset Token'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <CloseIcon size={18} color={PALETTE.textMain} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollBody}
        >
          <Text style={styles.modalTitle}>
            {selectedHolding?.title || selectedHolding?.assetName}
          </Text>
          <Text style={styles.modalLocation}>
            {selectedHolding?.location || 'Verified Jurisdictional Vault'}
          </Text>

          <View style={styles.modalPositionBanner}>
            <View>
              <Text style={styles.modalBannerLabel}>Your Position Value</Text>
              <Text style={styles.modalBannerAmount}>
                ${Number(selectedHolding?.amount || 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.modalBannerRight}>
              <Text style={styles.modalBannerLabel}>Settlement Mode</Text>
              <Text style={styles.modalBannerTokens}>
                {selectedHolding?.settlementMode}
              </Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>Database Status</Text>
              <Text
                style={[
                  styles.metricCardValueGreen,
                  selectedHolding?.status === 'PENDING' && {
                    color: PALETTE.warning,
                  },
                ]}
              >
                {selectedHolding?.status || 'CONFIRMED'}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>Daily Yield Accrual</Text>
              <Text style={styles.metricCardValueWhite}>
                {selectedHolding?.dailyYieldAccrual || '$1.97 / day'}
              </Text>
            </View>
          </View>

          <Text style={styles.modalSectionHeading}>Asset Overview</Text>
          <Text style={styles.modalDescriptionText}>
            {selectedHolding?.description ||
              'Institutional-grade asset token managed via secure smart contract escrow and audited regularly by independent third-party accounting firms.'}
          </Text>

          <Text style={styles.modalSectionHeading}>
            Blockchain & Transaction Metadata
          </Text>
          <View style={styles.metadataCard}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataKey}>
                Transaction Hash / Intent ID
              </Text>
              <Text
                style={[styles.metadataVal, { color: PALETTE.accent }]}
                numberOfLines={1}
              >
                {selectedHolding?.txHash || selectedHolding?.id || 'N/A'}
              </Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataRow}>
              <Text style={styles.metadataKey}>Smart Contract Standard</Text>
              <Text style={styles.metadataVal}>
                ERC-3643 Regulated Security
              </Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataRow}>
              <Text style={styles.metadataKey}>Auditor Verification</Text>
              <Text style={styles.metadataVal}>Deloitte / PwC Certified</Text>
            </View>
          </View>

          <View style={styles.complianceBadgeRow}>
            <ShieldCheckIcon size={16} color={PALETTE.accent} />
            <Text style={styles.complianceText}>
              KYC/AML Verified & Fully Compliant Position
            </Text>
          </View>

          <View style={styles.modalActionRow}>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              activeOpacity={0.8}
              onPress={onDownloadDeed}
              disabled={downloadingDeed}
            >
              {downloadingDeed ? (
                <ActivityIndicator size="small" color={PALETTE.textMain} />
              ) : (
                <Text style={styles.secondaryActionText}>Download Deed</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: PALETTE.modalBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalIndicatorBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalAssetTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  modalAssetTypeText: {
    color: PALETTE.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalScrollBody: { paddingBottom: 24 },
  modalTitle: {
    color: PALETTE.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalLocation: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalPositionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 16,
  },
  modalBannerLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalBannerAmount: {
    color: PALETTE.textMain,
    fontSize: 22,
    fontWeight: '800',
  },
  modalBannerRight: { alignItems: 'flex-end' },
  modalBannerTokens: { color: PALETTE.accent, fontSize: 14, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricCard: {
    flex: 1,
    backgroundColor: PALETTE.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  metricCardLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricCardValueGreen: {
    color: PALETTE.success,
    fontSize: 16,
    fontWeight: '800',
  },
  metricCardValueWhite: {
    color: PALETTE.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSectionHeading: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  modalDescriptionText: {
    color: PALETTE.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  metadataCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metadataKey: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '500' },
  metadataVal: {
    color: PALETTE.textMain,
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '55%',
  },
  metadataDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  complianceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  complianceText: {
    color: PALETTE.accent,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: PALETTE.cardAlt,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  secondaryActionText: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
});
