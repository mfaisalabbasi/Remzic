// src/components/marketplace/MarketplaceModals.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

const PALETTE = {
  cardBg: '#111816',
  cardAlt: '#151D1B',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
  gold: '#D4AF37',
};

interface MarketplaceModalsProps {
  orderToExecute: any | null;
  onCloseRoutingModal: () => void;
  onConfirmOnChain: () => void;
  onConfirmOffChain: () => void;

  isModalVisible: boolean;
  onCloseListModal: () => void;
  positions: any[];
  selectedAssetToSell: any;
  setSelectedAssetToSell: (pos: any) => void;
  unitsToSell: string;
  setUnitsToSell: (units: string) => void;
  askPricePerUnit: string;
  setAskPricePerUnit: (price: string) => void;
  submittingListing: boolean;
  onCreateListing: () => void;
}

export const MarketplaceModals = ({
  orderToExecute,
  onCloseRoutingModal,
  onConfirmOnChain,
  onConfirmOffChain,

  isModalVisible,
  onCloseListModal,
  positions,
  selectedAssetToSell,
  setSelectedAssetToSell,
  unitsToSell,
  setUnitsToSell,
  askPricePerUnit,
  setAskPricePerUnit,
  submittingListing,
  onCreateListing,
}: MarketplaceModalsProps) => (
  <>
    {/* SETTLEMENT ROUTING MODAL */}
    <Modal
      visible={Boolean(orderToExecute)}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.routingOverlay}>
        <View style={styles.routingPanel}>
          <Text style={styles.routingTitle}>Select Settlement Routing</Text>
          <Text style={styles.routingSubtitle}>
            Choose execution layer for acquiring shares of{' '}
            <Text style={{ color: PALETTE.textMain, fontWeight: '700' }}>
              {orderToExecute?.asset?.title ||
                orderToExecute?.assetTitle ||
                'Real Estate Unit'}
            </Text>
            .
          </Text>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={styles.onChainRoutingButton}
              onPress={onConfirmOnChain}
              activeOpacity={0.85}
            >
              <View>
                <Text style={styles.onChainRoutingText}>
                  ⚡ On-Chain Atomic Settlement
                </Text>
              </View>
              <Text style={styles.pillTag}>Trustless</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.offChainRoutingButton}
              onPress={onConfirmOffChain}
              activeOpacity={0.85}
            >
              <View>
                <Text style={styles.offChainRoutingText}>
                  🛡️ Off-Chain Escrow Vault
                </Text>
              </View>
              <Text style={styles.pillTagMuted}>Managed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.routingCancelBtn}
              onPress={onCloseRoutingModal}
            >
              <Text style={styles.routingCancelText}>
                Cancel / Return to Order Book
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* MODAL: List Asset From Portfolio Holdings */}
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>List Asset for Sale</Text>
          <Text style={styles.modalSubtitle}>
            Select an asset from your holdings to list on the P2P market.
          </Text>

          <Text style={styles.inputLabel}>Choose Holding</Text>
          <ScrollView style={{ maxHeight: 180, marginBottom: 12 }}>
            {positions.length > 0 ? (
              positions.map(pos => {
                const qty = pos.quantity || pos.units || 0;
                const reserved = pos.reservedUnits || 0;
                const available = qty - reserved;
                const title = pos.assetTitle || pos.asset?.title || 'RWA Asset';
                const isSelected = selectedAssetToSell?.id === pos.id;

                return (
                  <TouchableOpacity
                    key={pos.id}
                    style={[
                      styles.portfolioSelectCard,
                      isSelected && styles.portfolioSelectCardActive,
                    ]}
                    onPress={() => setSelectedAssetToSell(pos)}
                  >
                    <View>
                      <Text style={styles.holdingTitle}>{title}</Text>
                      <Text style={styles.holdingSub}>
                        Available: {available} (Owned: {qty})
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text
                style={{
                  color: PALETTE.textMuted,
                  fontSize: 12,
                  paddingVertical: 10,
                }}
              >
                No portfolio holdings available.
              </Text>
            )}
          </ScrollView>

          <Text style={styles.inputLabel}>Units for Sale</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. 1"
            placeholderTextColor={PALETTE.textMuted}
            keyboardType="numeric"
            value={unitsToSell}
            onChangeText={setUnitsToSell}
          />

          <Text style={styles.inputLabel}>Asking Price per Unit (SAR)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. 1000"
            placeholderTextColor={PALETTE.textMuted}
            keyboardType="numeric"
            value={askPricePerUnit}
            onChangeText={setAskPricePerUnit}
          />

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onCloseListModal}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={onCreateListing}
              disabled={submittingListing}
            >
              {submittingListing ? (
                <ActivityIndicator color={PALETTE.accentText} />
              ) : (
                <Text style={styles.modalSubmitText}>Confirm Listing</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </>
);

const styles = StyleSheet.create({
  routingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 8, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  routingPanel: {
    backgroundColor: '#12131a',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 420,
  },
  routingTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  routingSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 20,
  },
  onChainRoutingButton: {
    backgroundColor: PALETTE.gold,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onChainRoutingText: { color: '#0a0a0f', fontWeight: '600', fontSize: 14 },
  pillTag: {
    fontSize: 10,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(0,0,0,0.15)',
    color: '#0a0a0f',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontWeight: '700',
  },
  offChainRoutingButton: {
    backgroundColor: '#1e2029',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  offChainRoutingText: { color: '#f8fafc', fontWeight: '500', fontSize: 14 },
  pillTagMuted: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '700',
  },
  routingCancelBtn: {
    backgroundColor: 'transparent',
    padding: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  routingCancelText: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: PALETTE.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
  },
  modalTitle: {
    color: PALETTE.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 18,
  },
  inputLabel: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  portfolioSelectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.cardAlt,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 8,
  },
  portfolioSelectCardActive: {
    borderColor: PALETTE.accent,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  holdingTitle: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  holdingSub: { color: PALETTE.textMuted, fontSize: 11 },
  modalInput: {
    backgroundColor: PALETTE.cardAlt,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: PALETTE.textMain,
    fontSize: 14,
    marginBottom: 12,
  },
  modalButtonRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelButton: {
    flex: 1,
    backgroundColor: PALETTE.cardAlt,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalCancelText: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
  },
  modalSubmitButton: {
    flex: 1.5,
    backgroundColor: PALETTE.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: PALETTE.accentText,
    fontSize: 14,
    fontWeight: '800',
  },
});
