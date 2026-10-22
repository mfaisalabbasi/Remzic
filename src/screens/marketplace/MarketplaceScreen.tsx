// src/screens/marketplace/MarketplaceScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

import { CONFIG } from '../../config/constant';
import { secondaryMarketApi } from '../../services/api/secondaryMarketApi';
import { useAuth } from '../../navigation/AuthContext';

import { MarketplaceHeader } from '../../components/marketplace/MarketplaceHeader';
import { MarketplaceSegmentAndFilter } from '../../components/marketplace/MarketplaceSegmentAndFilter';
import { MarketplaceListingsContent } from '../../components/marketplace/MarketplaceListingsContent';
import { MarketplaceModals } from '../../components/marketplace/MarketplaceModals';
import { MarketplaceWebViewModal } from '../../components/marketplace/MarketplaceWebViewModal';

const PALETTE = {
  bg: '#080C0A',
};

const categories = ['All', 'Residential', 'Commercial', 'Land'];

const isValidEvmAddress = (address?: string | null): boolean =>
  Boolean(address && /^0x[a-fA-F0-9]{40}$/.test(address.trim()));

export const MarketplaceScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [marketTab, setMarketTab] = useState<'Buy' | 'Sell' | 'Trades'>('Buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAssetToSell, setSelectedAssetToSell] = useState<any>(null);
  const [unitsToSell, setUnitsToSell] = useState('');
  const [askPricePerUnit, setAskPricePerUnit] = useState('');
  const [submittingListing, setSubmittingListing] = useState(false);

  const [orderToExecute, setOrderToExecute] = useState<any | null>(null);

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

  const getWalletParam = async (): Promise<string> => {
    let rawWallet = user?.walletAddress || user?.user?.walletAddress || '';

    if (!isValidEvmAddress(rawWallet)) {
      try {
        const cached = await AsyncStorage.getItem('cached_walletAddress');
        if (cached && isValidEvmAddress(cached)) {
          rawWallet = cached;
        }
      } catch (e) {
        console.warn('[Marketplace] Storage wallet lookup failed:', e);
      }
    }

    if (!isValidEvmAddress(rawWallet)) {
      try {
        const me = await secondaryMarketApi.getMe();
        const apiWallet = me?.walletAddress || me?.user?.walletAddress;
        if (isValidEvmAddress(apiWallet)) {
          rawWallet = apiWallet;
          await AsyncStorage.setItem(
            'cached_walletAddress',
            rawWallet.trim().toLowerCase(),
          );
        }
      } catch (e) {
        console.warn('[Marketplace] Remote profile wallet lookup failed:', e);
      }
    }

    if (!isValidEvmAddress(rawWallet)) {
      console.error(
        '⚠️ [Marketplace] No valid wallet address found for session auto-auth.',
      );
      return '';
    }

    return `&walletAddress=${encodeURIComponent(
      rawWallet.trim().toLowerCase(),
    )}`;
  };

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
      const assetTokenAddress =
        selectedAssetToSell.tokenAddress ||
        selectedAssetToSell.asset?.tokenAddress;

      if (!isValidEvmAddress(assetTokenAddress)) {
        throw new Error('Invalid asset token contract address.');
      }

      const unitsToSellBigInt = BigInt(unitsToSell);

      const erc20Interface = new ethers.Interface([
        'function approve(address spender, uint256 amount) external returns (bool)',
      ]);
      const approvalData = erc20Interface.encodeFunctionData('approve', [
        marketplaceAddress,
        unitsToSellBigInt,
      ]);

      const marketInterface = new ethers.Interface([
        'function createListing(string calldata listingId, address token, address paymentToken, uint256 amount, uint256 pricePerUnit) external',
      ]);

      const txData = marketInterface.encodeFunctionData('createListing', [
        listingId,
        assetTokenAddress,
        CONFIG.STABLECOIN_ADDRESS,
        unitsToSellBigInt,
        ethers.parseUnits(askPricePerUnit, 6),
      ]);

      const payload = {
        approvalPayload: {
          to: assetTokenAddress,
          data: approvalData,
        },
        txPayload: {
          to: marketplaceAddress,
          data: txData,
          chainId: Number(CONFIG.TARGET_CHAIN_ID || 31337),
        },
        expectedStablecoinAddress: assetTokenAddress,
        expectedStablecoinAmount: unitsToSellBigInt.toString(),
        expectedVaultAddress: marketplaceAddress,
      };

      const encoded = encodeURIComponent(JSON.stringify(payload));
      const walletParam = await getWalletParam();

      // 🚀 FIXED ENCLAVE SIGN ROUTE TO /auth/sign
      const signUrl =
        `${CONFIG.FRONTEND_URL}/auth/sign` +
        `?listingId=${encodeURIComponent(listingId)}` +
        `&payload=${encoded}` +
        walletParam +
        `&autoAuth=true`;

      if (__DEV__) {
        console.log('🚀 [Marketplace] Launching Sign URL:', signUrl);
      }

      setIsModalVisible(false);
      setWebViewUrl(signUrl);
    } catch (err: any) {
      Alert.alert('Listing Error', err.message);
    } finally {
      setSubmittingListing(false);
    }
  };

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
      const walletParam = await getWalletParam();

      // 🚀 FIXED ENCLAVE SIGN ROUTE TO /auth/sign
      const signUrl =
        `${CONFIG.FRONTEND_URL}/auth/sign` +
        `?tradeId=${encodeURIComponent(intentData.tradeId)}` +
        `&payload=${encoded}` +
        walletParam +
        `&autoAuth=true`;

      if (__DEV__) {
        console.log('🚀 [Marketplace] Launching Trade Sign URL:', signUrl);
      }

      setWebViewUrl(signUrl);
    } catch (err: any) {
      Alert.alert('Execution Error', err.message);
    } finally {
      setLoading(false);
    }
  };

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
            const walletParam = await getWalletParam();

            // 🚀 FIXED ENCLAVE SIGN ROUTE TO /auth/sign
            const signUrl =
              `${CONFIG.FRONTEND_URL}/auth/sign` +
              `?listingId=${encodeURIComponent(listingId)}` +
              `&cancel=true` +
              `&payload=${encoded}` +
              walletParam +
              `&autoAuth=true`;

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
          await secondaryMarketApi.confirmListing({
            listingId: activeListingId,
            txHash: data.txHash,
          });
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

      <MarketplaceHeader
        topInset={insets.top}
        onOpenListModal={() => setIsModalVisible(true)}
      />

      <MarketplaceSegmentAndFilter
        marketTab={marketTab}
        setMarketTab={setMarketTab}
        orderBookCount={orderBookListings.length}
        myListingsCount={myListings.length}
        tradesCount={visibleActiveTrades.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MarketplaceListingsContent
          loading={loading}
          marketTab={marketTab}
          orderBookListings={orderBookListings}
          myListings={myListings}
          visibleActiveTrades={visibleActiveTrades}
          currentUserId={currentUserId}
          loadingIds={loadingIds}
          onExecuteOrder={item => setOrderToExecute(item)}
          onCancelListing={handleCancelListing}
          onSettleTrade={handleSettleTrade}
          onOpenDispute={handleOpenDispute}
        />
      </ScrollView>

      <MarketplaceModals
        orderToExecute={orderToExecute}
        onCloseRoutingModal={() => setOrderToExecute(null)}
        onConfirmOnChain={confirmOnChainExecution}
        onConfirmOffChain={confirmOffChainExecution}
        isModalVisible={isModalVisible}
        onCloseListModal={() => setIsModalVisible(false)}
        positions={positions}
        selectedAssetToSell={selectedAssetToSell}
        setSelectedAssetToSell={setSelectedAssetToSell}
        unitsToSell={unitsToSell}
        setUnitsToSell={setUnitsToSell}
        askPricePerUnit={askPricePerUnit}
        setAskPricePerUnit={setAskPricePerUnit}
        submittingListing={submittingListing}
        onCreateListing={handleCreateListing}
      />

      <MarketplaceWebViewModal
        webViewUrl={webViewUrl}
        topInset={insets.top}
        onClose={() => setWebViewUrl(null)}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
});
