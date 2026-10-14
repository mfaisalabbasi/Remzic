import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { ethers } from 'ethers';
import WebView from 'react-native-webview';

import { CONFIG } from '../../config/constant';
import { secondaryMarketApi } from '../../services/api/secondaryMarketApi';

const PALETTE = {
  bg: '#080C0A',
  cardBg: '#111816',
  cardAlt: '#151D1B',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
  success: '#34D399',
  danger: '#EF4444',
  gold: '#D4AF37',
};

const SearchIcon = ({ size = 16, color = PALETTE.textMuted }) => (
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
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

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

const PlusCircleIcon = ({ size = 18, color = PALETTE.accentText }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 8v8M8 12h8" />
  </Svg>
);

const categories = ['All', 'Residential', 'Commercial', 'Land'];

export const MarketplaceScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [marketTab, setMarketTab] = useState<'Buy' | 'Sell' | 'Trades'>('Buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  // Listing Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAssetToSell, setSelectedAssetToSell] = useState<any>(null);
  const [unitsToSell, setUnitsToSell] = useState('');
  const [askPricePerUnit, setAskPricePerUnit] = useState('');
  const [submittingListing, setSubmittingListing] = useState(false);

  // Settlement Selection Modal State
  const [orderToExecute, setOrderToExecute] = useState<any | null>(null);

  // WebView Signing Bridge State
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [activeTradeId, setActiveTradeId] = useState<string | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      const [listingsData, posData, tradesData, userData] = await Promise.all([
        secondaryMarketApi.getAllListings(),
        secondaryMarketApi.getMyPositions(),
        secondaryMarketApi.getActiveTrades(),
        secondaryMarketApi.getMe(),
      ]);

      setListings(listingsData);
      setPositions(posData);
      setActiveTrades(tradesData);
      if (userData) {
        setCurrentUserId(userData.id || userData.user?.id || null);
      }
    } catch (error) {
      console.error('Failed to sync marketplace:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const filteredListings = listings.filter(item => {
    const title = item.asset?.title || item.assetTitle || item.title || '';
    const location = item.asset?.location || item.location || '';
    const matchesCategory =
      selectedCategory === 'All' || item.asset?.type === selectedCategory;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleActiveTrades = activeTrades.filter(
    t =>
      t.status === 'LOCKED' ||
      t.status === 'DISPUTED' ||
      t.status === 'PENDING',
  );

  const handleSettleTrade = async (tradeId: string) => {
    if (loadingIds[tradeId]) return;
    Alert.alert(
      'Confirm Settlement',
      'Release funds to seller? This settles the trade on-chain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Release',
          onPress: async () => {
            setLoadingIds(prev => ({ ...prev, [tradeId]: true }));
            try {
              await secondaryMarketApi.settleTrade(tradeId);
              Alert.alert('Success', 'Trade finalized and funds released.');
              await fetchMarketData();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Settlement failed.');
            } finally {
              setLoadingIds(prev => ({ ...prev, [tradeId]: false }));
            }
          },
        },
      ],
    );
  };

  const handleOpenDispute = async (tradeId: string) => {
    Alert.alert(
      'Dispute Initiated',
      'Sending dispute ticket to administration...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Dispute',
          onPress: async () => {
            setLoadingIds(prev => ({ ...prev, [tradeId]: true }));
            try {
              await secondaryMarketApi.raiseDispute(
                tradeId,
                'Mobile User Dispute',
              );
              Alert.alert('Success', 'Dispute opened.');
              await fetchMarketData();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Dispute submission failed.');
            } finally {
              setLoadingIds(prev => ({ ...prev, [tradeId]: false }));
            }
          },
        },
      ],
    );
  };

  // 1. Prepare & Confirm Listing Intent
  const handleCreateListing = async () => {
    if (!selectedAssetToSell || !unitsToSell || !askPricePerUnit) {
      Alert.alert(
        'Error',
        'Please select a holding, specify units, and enter asking price.',
      );
      return;
    }

    const availableUnits =
      (selectedAssetToSell.quantity || selectedAssetToSell.units || 0) -
      (selectedAssetToSell.reservedUnits || 0);
    if (Number(unitsToSell) <= 0 || Number(unitsToSell) > availableUnits) {
      Alert.alert(
        'Error',
        `Invalid quantity. You have ${availableUnits} units available.`,
      );
      return;
    }

    setSubmittingListing(true);
    try {
      const prepData = await secondaryMarketApi.prepareListing({
        assetId: selectedAssetToSell.assetId || selectedAssetToSell.id,
        unitsForSale: Number(unitsToSell),
        pricePerUnit: Number(askPricePerUnit),
      });

      const listingId = prepData.listingId;
      setActiveListingId(listingId);

      const marketplaceAddress = CONFIG.MARKETPLACE_ADDRESS;
      const marketInterface = new ethers.Interface([
        'function createListing(string calldata listingId, address token, address paymentToken, uint256 amount, uint256 pricePerUnit) external',
      ]);

      const txData = marketInterface.encodeFunctionData('createListing', [
        listingId,
        selectedAssetToSell.tokenAddress ||
          selectedAssetToSell.asset?.tokenAddress,
        CONFIG.STABLECOIN_ADDRESS,
        BigInt(unitsToSell),
        ethers.parseUnits(askPricePerUnit, 6),
      ]);

      const payload = {
        txPayload: {
          to: marketplaceAddress,
          data: txData,
          chainId: Number(CONFIG.TARGET_CHAIN_ID || 31337),
        },
      };

      const encoded = encodeURIComponent(JSON.stringify(payload));
      const signUrl =
        `${CONFIG.FRONTEND_URL}/investor/sign` +
        `?listingId=${encodeURIComponent(listingId)}` +
        `&payload=${encoded}`;

      setIsModalVisible(false);
      setWebViewUrl(signUrl);
    } catch (err: any) {
      Alert.alert('Listing Error', err.message);
    } finally {
      setSubmittingListing(false);
    }
  };

  // 2. On-Chain Execution Routing
  const confirmOnChainExecution = async () => {
    if (!orderToExecute) return;
    const listing = orderToExecute;
    setOrderToExecute(null);

    try {
      setLoading(true);
      const intentData = await secondaryMarketApi.createTradeIntent({
        listingId: listing.id,
        settlementMode: 'ON_CHAIN',
      });

      setActiveTradeId(intentData.tradeId);

      const totalPrice =
        Number(listing.unitsForSale || listing.quantity) *
        Number(listing.pricePerUnit || listing.price);
      const stablecoinAddress = CONFIG.STABLECOIN_ADDRESS;
      const marketplaceAddress = CONFIG.MARKETPLACE_ADDRESS;
      const totalPriceWei = ethers
        .parseUnits(totalPrice.toString(), 6)
        .toString();

      const marketInterface = new ethers.Interface([
        'function executeOnChainTrade(string calldata listingId, uint256 purchaseAmount) external',
      ]);
      const txData = marketInterface.encodeFunctionData('executeOnChainTrade', [
        listing.id,
        Number(listing.unitsForSale || listing.quantity),
      ]);

      const payload = {
        approvalPayload: {
          to: stablecoinAddress,
          data: new ethers.Interface([
            'function approve(address spender, uint256 amount) external returns (bool)',
          ]).encodeFunctionData('approve', [marketplaceAddress, totalPriceWei]),
        },
        txPayload: {
          to: marketplaceAddress,
          data: txData,
          chainId: Number(CONFIG.TARGET_CHAIN_ID || 31337),
        },
        expectedStablecoinAddress: stablecoinAddress,
        expectedStablecoinAmount: totalPriceWei,
        expectedVaultAddress: marketplaceAddress,
      };

      const encoded = encodeURIComponent(JSON.stringify(payload));
      const signUrl =
        `${CONFIG.FRONTEND_URL}/investor/sign` +
        `?tradeId=${encodeURIComponent(intentData.tradeId)}` +
        `&payload=${encoded}`;

      setWebViewUrl(signUrl);
    } catch (err: any) {
      Alert.alert('Execution Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Off-Chain Escrow Execution Routing
  const confirmOffChainExecution = async () => {
    if (!orderToExecute) return;
    const listingId = orderToExecute.id;
    setOrderToExecute(null);

    try {
      setLoading(true);
      await secondaryMarketApi.executeOffChainTrade(listingId);

      Alert.alert('Success', 'Intent created! Funds locked in Remzik Escrow.');
      setMarketTab('Trades');
      await fetchMarketData();
    } catch (err: any) {
      Alert.alert(
        'Escrow Error',
        err.message || 'Failed to execute escrow trade',
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. Cancel Listing Flow (On-Chain + DB sync via WebView bridge)
  const handleCancelListing = async (listingId: string) => {
    Alert.alert('Confirm', 'Retract this listing from the blockchain?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setLoading(true);
            setActiveListingId(listingId);

            const marketplaceAddress = CONFIG.MARKETPLACE_ADDRESS;
            const marketInterface = new ethers.Interface([
              'function cancelListing(string calldata listingId) external',
            ]);

            const txData = marketInterface.encodeFunctionData('cancelListing', [
              listingId,
            ]);

            const payload = {
              txPayload: {
                to: marketplaceAddress,
                data: txData,
                chainId: Number(CONFIG.TARGET_CHAIN_ID || 31337),
              },
            };

            const encoded = encodeURIComponent(JSON.stringify(payload));
            const signUrl =
              `${CONFIG.FRONTEND_URL}/investor/sign` +
              `?listingId=${encodeURIComponent(listingId)}` +
              `&cancel=true` +
              `&payload=${encoded}`;

            setWebViewUrl(signUrl);
          } catch (err: any) {
            Alert.alert('Error', err.message);
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'TRADE_SUCCESS' && activeTradeId) {
        setWebViewUrl(null);
        setLoading(true);

        await secondaryMarketApi.submitTxHash(activeTradeId, data.txHash);

        Alert.alert('Success', 'On-chain trade settled and recorded in DB!');
        setActiveTradeId(null);
        await fetchMarketData();
      } else if (data.type === 'TX_SUCCESS' && activeListingId) {
        setWebViewUrl(null);
        setLoading(true);

        if (data.isCancellation) {
          await secondaryMarketApi.deleteListing(activeListingId);
          Alert.alert(
            'Success',
            'Listing successfully retracted from blockchain and database.',
          );
        } else {
          await secondaryMarketApi.confirmListing(activeListingId);
          Alert.alert(
            'Success',
            'Listing successfully activated on order book!',
          );
        }

        setActiveListingId(null);
        await fetchMarketData();
      } else if (data.type?.includes('FAILED')) {
        setWebViewUrl(null);
        Alert.alert(
          'Transaction Failed',
          data.error || 'User cancelled or transaction reverted.',
        );
      }
    } catch (err: any) {
      setWebViewUrl(null);
      Alert.alert('Sync Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const myListings = listings.filter(l => l.sellerId === currentUserId);
  const orderBookListings = filteredListings.filter(
    l => l.sellerId !== currentUserId,
  );

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View>
          <Text style={styles.headerSubtitle}>Secondary Liquidity</Text>
          <Text style={styles.headerTitle}>RWA Marketplace</Text>
        </View>
        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <PlusCircleIcon size={16} color={PALETTE.accentText} />
          <Text style={styles.headerActionBtnText}>List Asset</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            marketTab === 'Buy' && styles.segmentButtonActive,
          ]}
          onPress={() => setMarketTab('Buy')}
        >
          <Text
            style={[
              styles.segmentText,
              marketTab === 'Buy' && styles.segmentTextActive,
            ]}
          >
            Order Book ({orderBookListings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            marketTab === 'Sell' && styles.segmentButtonActive,
          ]}
          onPress={() => setMarketTab('Sell')}
        >
          <Text
            style={[
              styles.segmentText,
              marketTab === 'Sell' && styles.segmentTextActive,
            ]}
          >
            My Listings ({myListings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            marketTab === 'Trades' && styles.segmentButtonActive,
          ]}
          onPress={() => setMarketTab('Trades')}
        >
          <Text
            style={[
              styles.segmentText,
              marketTab === 'Trades' && styles.segmentTextActive,
            ]}
          >
            Trades ({visibleActiveTrades.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search & Category Filter */}
      {marketTab === 'Buy' && (
        <>
          <View style={styles.searchContainer}>
            <SearchIcon size={16} color={PALETTE.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties, locations..."
              placeholderTextColor={PALETTE.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={PALETTE.accent} style={{ marginTop: 40 }} />
        ) : marketTab === 'Buy' ? (
          orderBookListings.length > 0 ? (
            orderBookListings.map(item => (
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
                    SAR{' '}
                    {Number(item.pricePerUnit || item.price).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.buyNowBtn}
                    onPress={() => setOrderToExecute(item)}
                  >
                    <Text style={styles.buyNowText}>Execute</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No external market orders available.
              </Text>
            </View>
          )
        ) : marketTab === 'Sell' ? (
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
                      onPress={() => handleCancelListing(item.id)}
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
        ) : (
          /* TRADES TAB */
          <View>
            {visibleActiveTrades.length > 0 ? (
              visibleActiveTrades.map(t => {
                const isBuyer =
                  currentUserId === t.buyer?.user?.id ||
                  currentUserId === t.buyerId;
                const isDisputed = t.status === 'DISPUTED';
                const assetTitle =
                  t.asset?.title || t.assetTitle || 'Real Estate Unit';
                const totalPrice = Number(t.totalPrice || t.amount || 0);

                return (
                  <View
                    key={t.id}
                    style={[
                      styles.tradeCard,
                      isDisputed && styles.disputedCard,
                    ]}
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
                            {
                              color: isDisputed
                                ? PALETTE.danger
                                : PALETTE.accent,
                            },
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
                              onPress={() => handleSettleTrade(t.id)}
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
                            onPress={() => handleOpenDispute(t.id)}
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
                <Text style={styles.emptyText}>
                  No active trades in escrow.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

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
                onPress={confirmOnChainExecution}
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
                onPress={confirmOffChainExecution}
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
                onPress={() => setOrderToExecute(null)}
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
                  const title =
                    pos.assetTitle || pos.asset?.title || 'RWA Asset';
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
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleCreateListing}
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

      {/* Secure Sign WebView Modal with Responsive Header */}
      <Modal
        visible={Boolean(webViewUrl)}
        animationType="slide"
        transparent={false}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: PALETTE.bg,
            paddingTop: Math.max(insets.top, 16),
          }}
        >
          {/* Native Header Bar with Back/Close Button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: PALETTE.border,
              backgroundColor: PALETTE.cardBg,
            }}
          >
            <TouchableOpacity
              onPress={() => setWebViewUrl(null)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: PALETTE.cardAlt,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: PALETTE.border,
              }}
            >
              <Text
                style={{
                  color: PALETTE.textMain,
                  fontSize: 13,
                  fontWeight: '700',
                }}
              >
                ← Back
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: PALETTE.textMain,
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              Secure Enclave Signing
            </Text>

            <View style={{ width: 50 }} />
          </View>

          {/* WebView Content */}
          {webViewUrl && (
            <WebView
              source={{ uri: webViewUrl }}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: { color: PALETTE.textMain, fontSize: 22, fontWeight: '700' },
  headerActionButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtnText: {
    color: PALETTE.accentText,
    fontSize: 12,
    fontWeight: '800',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentButtonActive: { backgroundColor: PALETTE.accent },
  segmentText: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: PALETTE.accentText, fontWeight: '800' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: { flex: 1, color: PALETTE.textMain, fontSize: 14, padding: 0 },
  categoryContainer: { marginBottom: 16 },
  categoryScroll: { paddingHorizontal: 20, gap: 8 },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  categoryTabActive: {
    backgroundColor: PALETTE.accent,
    borderColor: PALETTE.accent,
  },
  categoryText: { color: PALETTE.textMuted, fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: PALETTE.accentText, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
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
