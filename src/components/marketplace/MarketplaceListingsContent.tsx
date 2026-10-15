// src/components/marketplace/MarketplaceListingsContent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
  success: '#34D399',
  danger: '#EF4444',
};

const BuildingIcon = ({ size = 20, color = PALETTE.accent }) => (
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
    <Path d="M6 22V2a2 2 0 012-2h8a2 2 0 012 2v20zM6 6h12M6 10h12M6 14h12M6 18h12" />
  </Svg>
);

const MapPinIcon = ({ size = 12, color = PALETTE.textMuted }) => (
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
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

interface MarketplaceListingsContentProps {
  loading: boolean;
  marketTab: 'Buy' | 'Sell' | 'Trades';
  orderBookListings: any[];
  myListings: any[];
  visibleActiveTrades: any[];
  currentUserId: string | null;
  loadingIds: Record<string, boolean>;
  onExecuteOrder: (item: any) => void;
  onCancelListing: (id: string) => void;
  onSettleTrade: (id: string) => void;
  onOpenDispute: (id: string) => void;
}

export const MarketplaceListingsContent = ({
  loading,
  marketTab,
  orderBookListings,
  myListings,
  visibleActiveTrades,
  currentUserId,
  loadingIds,
  onExecuteOrder,
  onCancelListing,
  onSettleTrade,
  onOpenDispute,
}: MarketplaceListingsContentProps) => {
  if (loading) {
    return (
      <ActivityIndicator color={PALETTE.accent} style={{ marginTop: 40 }} />
    );
  }

  if (marketTab === 'Buy') {
    return orderBookListings.length > 0 ? (
      <>
        {orderBookListings.map(item => (
          <View key={item.id} style={styles.listingCard}>
            <View style={styles.listingThumbContainer}>
              <BuildingIcon size={20} color={PALETTE.accent} />
            </View>
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={1}>
                {item.asset?.title || item.assetTitle || 'Real Estate Unit'}
              </Text>
              <View style={styles.locationRow}>
                <MapPinIcon size={11} color={PALETTE.textMuted} />
                <Text style={styles.listingLocation}>
                  {item.asset?.location || 'Global'}
                </Text>
              </View>
              <Text style={styles.listingYield}>
                {item.unitsForSale || item.quantity} Units Available
              </Text>
            </View>
            <View style={styles.listingPriceBox}>
              <Text style={styles.listingPrice}>
                SAR {Number(item.pricePerUnit || item.price).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.buyNowBtn}
                onPress={() => onExecuteOrder(item)}
              >
                <Text style={styles.buyNowText}>Execute</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No external market orders available.
        </Text>
      </View>
    );
  }

  if (marketTab === 'Sell') {
    return (
      <View>
        {myListings.length > 0 ? (
          myListings.map(item => (
            <View key={item.id} style={styles.listingCard}>
              <View style={styles.listingThumbContainer}>
                <BuildingIcon size={20} color={PALETTE.accent} />
              </View>
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>
                  {item.asset?.title || item.assetTitle || 'Your Listing'}
                </Text>
                <Text style={styles.listingLocation}>
                  Units: {item.unitsForSale || item.quantity}
                </Text>
              </View>
              <View style={styles.listingPriceBox}>
                <Text style={styles.listingPrice}>
                  SAR {item.pricePerUnit || item.price}
                </Text>
                <TouchableOpacity
                  style={styles.cancelListingBtn}
                  onPress={() => onCancelListing(item.id)}
                >
                  <Text style={styles.cancelListingText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You have no active sell listings.
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      {visibleActiveTrades.length > 0 ? (
        visibleActiveTrades.map(t => {
          const isBuyer =
            currentUserId === t.buyer?.user?.id || currentUserId === t.buyerId;
          const isDisputed = t.status === 'DISPUTED';
          const assetTitle =
            t.asset?.title || t.assetTitle || 'Real Estate Unit';
          const totalPrice = Number(t.totalPrice || t.amount || 0);

          return (
            <View
              key={t.id}
              style={[styles.tradeCard, isDisputed && styles.disputedCard]}
            >
              <View style={styles.tradeHeaderRow}>
                <Text style={styles.tradeAssetTitle}>{assetTitle}</Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isDisputed
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(52,211,153,0.15)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isDisputed ? PALETTE.danger : PALETTE.accent },
                    ]}
                  >
                    {t.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.tradeAmountText}>
                SAR {totalPrice.toLocaleString()}
              </Text>

              <View style={styles.tradeActionRow}>
                {isDisputed ? (
                  <Text style={styles.disputeWarningText}>
                    ⚠️ Under Admin Review
                  </Text>
                ) : (
                  <>
                    {isBuyer ? (
                      <TouchableOpacity
                        style={styles.releaseButton}
                        onPress={() => onSettleTrade(t.id)}
                        disabled={loadingIds[t.id]}
                      >
                        <Text style={styles.releaseButtonText}>
                          {loadingIds[t.id]
                            ? 'Processing...'
                            : '✓ Confirm & Release'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.waitingText}>
                        Waiting for Buyer Release
                      </Text>
                    )}
                    <TouchableOpacity
                      style={styles.disputeButton}
                      onPress={() => onOpenDispute(t.id)}
                      disabled={loadingIds[t.id]}
                    >
                      <Text style={styles.disputeButtonText}>
                        Raise Dispute
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active trades in escrow.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 12,
    gap: 12,
  },
  listingThumbContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  listingInfo: { flex: 1 },
  listingTitle: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  listingLocation: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  listingYield: { color: PALETTE.success, fontSize: 11, fontWeight: '700' },
  listingPriceBox: { alignItems: 'flex-end' },
  listingPrice: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  buyNowBtn: {
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  buyNowText: { color: PALETTE.accentText, fontSize: 11, fontWeight: '800' },
  cancelListingBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelListingText: { color: PALETTE.danger, fontSize: 11, fontWeight: '700' },
  tradeCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 12,
  },
  disputedCard: { borderColor: PALETTE.danger },
  tradeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tradeAssetTitle: { color: PALETTE.textMain, fontSize: 15, fontWeight: '700' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  tradeAmountText: {
    color: PALETTE.accent,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  tradeActionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  releaseButton: {
    flex: 1,
    backgroundColor: PALETTE.accent,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  releaseButtonText: {
    color: PALETTE.accentText,
    fontSize: 12,
    fontWeight: '800',
  },
  waitingText: {
    flex: 1,
    color: PALETTE.textMuted,
    fontSize: 11,
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  disputeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  disputeButtonText: { color: PALETTE.danger, fontSize: 12, fontWeight: '700' },
  disputeWarningText: {
    color: PALETTE.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: PALETTE.textMuted, fontSize: 13 },
});
