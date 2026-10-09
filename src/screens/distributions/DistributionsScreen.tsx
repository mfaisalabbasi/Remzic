import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Modal,
  Clipboard,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Svg, { Path, Rect } from 'react-native-svg';
import { ethers } from 'ethers';

// --- TYPES & DATA CONTRACTS ---
type DistributionStatus = 'Upcoming' | 'Processing' | 'Paid' | 'Ready';

interface DistributionItem {
  id: string;
  batchId?: string;
  title: string;
  location: string;
  date: string;
  rawDate: string;
  amount: number;
  currency: string;
  status: DistributionStatus;
  distributionMode?: 'OFF_CHAIN' | 'ON_CHAIN';
  txHash?: string;
  tokenStandard: string;
  yieldRate: string;
  assetType: string;
  contractAddress?: string;
}

const DISTRIBUTION_TABS: readonly DistributionStatus[] = [
  'Upcoming',
  'Processing',
  'Paid',
];

// --- SVG VECTOR ICONS ---
const ArrowLeftIcon = ({ size = 20, color = '#F0FDF4' }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const BuildingIcon = ({ size = 20, color = '#34D399' }) => (
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

const EmptyVaultIcon = ({ size = 48, color = '#64748B' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#64748B' }) => (
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

const TrendingUpIcon = ({ size = 16, color = '#34D399' }) => (
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
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

const CloseIcon = ({ size = 18, color = '#F0FDF4' }) => (
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

export const DistributionsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [distributions, setDistributions] = useState<DistributionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] =
    useState<DistributionStatus>('Upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DistributionItem | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // WebView Claim Flow State
  const [webViewModalVisible, setWebViewModalVisible] = useState(false);
  const [claimUrl, setClaimUrl] = useState<string>('');
  const [isCheckingClaim, setIsCheckingClaim] = useState<boolean>(false);

  // Preference states
  const [distributionMode, setDistributionMode] = useState<
    'OFF_CHAIN' | 'ON_CHAIN'
  >('OFF_CHAIN');
  const [tempMode, setTempMode] = useState<'OFF_CHAIN' | 'ON_CHAIN'>(
    'OFF_CHAIN',
  );
  const [isSavingPref, setIsSavingPref] = useState(false);

  const API_BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:4000/api'
      : 'http://localhost:4000/api';
  const WEB_APP_BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';

  const fetchDistributionsData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/distributions/my-distributions`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (!res.ok) throw new Error('Failed to fetch distribution feeds');
      const data = await res.json();

      const mappedItems: DistributionItem[] = (data || []).map((item: any) => ({
        id: item.id,
        batchId: item.batchId,
        title: item.asset?.title || 'Tokenized RWA Asset',
        location: item.asset?.location || 'Verified Location',
        date: new Date(item.period || item.createdAt).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          },
        ),
        rawDate: item.period || item.createdAt,
        amount: Number(item.amount || 0),
        currency: 'USD',
        status:
          item.status === 'PAID'
            ? 'Paid'
            : item.status === 'READY'
            ? 'Ready'
            : 'Upcoming',
        distributionMode: item.distributionMode,
        txHash: item.txHash,
        tokenStandard: item.asset?.tokenStandard || 'ERC-3643 (RWA Token)',
        yieldRate: item.asset?.yieldRate || '8.0% APY',
        assetType: item.asset?.assetType || 'Prime Real Estate',
        contractAddress: item.asset?.contractAddress || item.contractAddress,
      }));

      setDistributions(mappedItems);
    } catch (err) {
      console.error(err);
      setDistributions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDistributionsData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDistributionsData();
  }, []);

  const totalDistributed = useMemo(() => {
    return distributions
      .filter(i => i.status === 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [distributions]);

  const counts = useMemo(
    () => ({
      Upcoming: distributions.filter(
        i => i.status === 'Upcoming' || i.status === 'Ready',
      ).length,
      Processing: distributions.filter(i => i.status === 'Processing').length,
      Paid: distributions.filter(i => i.status === 'Paid').length,
    }),
    [distributions],
  );

  const filteredDistributions = useMemo(() => {
    let list = [];
    if (selectedTab === 'Upcoming') {
      list = distributions.filter(
        item => item.status === 'Upcoming' || item.status === 'Ready',
      );
      list.sort((a, b) => (a.status === 'Ready' ? -1 : 1));
    } else {
      list = distributions.filter(item => item.status === selectedTab);
    }
    return list;
  }, [selectedTab, distributions]);

  const handleOpenReceipt = (item: DistributionItem) => {
    setSelectedItem(item);
    setModalVisible(true);
    setCopied(false);
  };

  const handleCopyHash = (hash?: string) => {
    if (!hash) return;
    Clipboard.setString(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDistributionModeChange = async (
    newMode: 'OFF_CHAIN' | 'ON_CHAIN',
  ) => {
    if (isSavingPref) return;
    setIsSavingPref(true);
    try {
      const res = await fetch(`${API_BASE_URL}/investors/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distributionMode: newMode }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to update preference');
      setDistributionMode(newMode);
      Alert.alert(
        'Success',
        'Yield distribution preference updated successfully!',
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update preference. Please try again.');
    } finally {
      setIsSavingPref(false);
    }
  };

  // 🛡️ DYNAMIC "CHECK" PROCESS: Verifies claim status before moving to WebView sign portal
  const handleOpenWebViewClaim = async (item: DistributionItem) => {
    if (!item.batchId) {
      Alert.alert('Error', 'Missing Batch ID for this distribution.');
      return;
    }

    try {
      setIsCheckingClaim(true);

      const backendUrl =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:4000/api'
          : 'http://localhost:4000/api';

      const proofUrl = `${backendUrl}/distributions/proof/${encodeURIComponent(
        item.batchId,
      )}`;
      const res = await fetch(proofUrl);

      if (!res.ok) {
        throw new Error(`Failed to fetch distribution proof from server.`);
      }

      const proofPayload = await res.json();

      const targetContractAddress =
        process.env.EXPO_PUBLIC_YIELD_NOTARY_ADDRESS ||
        '0x9A676e781A523b5d0C0e43731313A708CB607508';

      // Verify on-chain claim status using an RPC provider and contract mapping check
      const providerUrl =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:8545'
          : 'http://localhost:8545';
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const notaryContract = new ethers.Contract(
        targetContractAddress,
        [
          'function isClaimed(bytes32 _batchId, address _account) view returns (bool)',
        ],
        provider,
      );

      const cleanBatchIdStr = String(proofPayload.batchId).trim();
      const encodedBatchId =
        cleanBatchIdStr.startsWith('0x') && cleanBatchIdStr.length === 66
          ? cleanBatchIdStr
          : ethers.id(cleanBatchIdStr);

      const targetAccount = ethers.getAddress(
        String(proofPayload.account).trim(),
      );

      // 🔍 The Check Phase
      let alreadyClaimed = false;
      try {
        alreadyClaimed = await notaryContract.isClaimed(
          encodedBatchId,
          targetAccount,
        );
      } catch (checkErr) {
        console.warn(
          'On-chain isClaimed verification check skipped:',
          checkErr,
        );
      }

      if (alreadyClaimed || proofPayload.status === 'PAID') {
        // If already claimed, instantly update state to Paid and block re-entry
        setDistributions(prev =>
          prev.map(d => (d.id === item.id ? { ...d, status: 'Paid' } : d)),
        );
        setModalVisible(false);
        Alert.alert(
          'Notice',
          'Yield for this distribution has already been claimed.',
        );
        return;
      }

      // Proceed to encode and open sign portal if not claimed
      const iface = new ethers.Interface([
        'function claimYield(bytes32 _batchId, address _account, uint256 _amount, bytes32[] calldata _merkleProof)',
      ]);

      const targetAmountWei = String(proofPayload.amount).trim();
      const targetProof = Array.isArray(proofPayload.proof)
        ? proofPayload.proof
        : [];

      const callData = iface.encodeFunctionData('claimYield', [
        encodedBatchId,
        targetAccount,
        targetAmountWei,
        targetProof,
      ]);

      const txPayload = {
        to: targetContractAddress,
        data: callData,
        value: '0x0',
        chainId: 31337,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify({ txPayload }));

      const targetClaimUrl = `${WEB_APP_BASE_URL}/investor/sign?claimId=${encodeURIComponent(
        item.batchId,
      )}&payload=${encodedPayload}&contractAddress=${encodeURIComponent(
        targetContractAddress,
      )}`;

      setClaimUrl(targetClaimUrl);
      setModalVisible(false);
      setWebViewModalVisible(true);
    } catch (err: any) {
      Alert.alert(
        'Claim Error',
        err.message || 'Could not prepare claim payload.',
      );
    } finally {
      setIsCheckingClaim(false);
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (
        data.type === 'CLAIM_SUCCESS' ||
        data.type === 'TRANSACTION_COMPLETE' ||
        data.type === 'SIGN_SUCCESS'
      ) {
        setWebViewModalVisible(false);

        if (selectedItem) {
          setDistributions(prev =>
            prev.map(d =>
              d.id === selectedItem.id ? { ...d, status: 'Paid' } : d,
            ),
          );
        }

        Alert.alert(
          'Success',
          'On-chain yield claim & signature verified successfully!',
        );
        fetchDistributionsData();
      } else if (data.type === 'CLOSE_MODAL') {
        setWebViewModalVisible(false);
        fetchDistributionsData();
      }
    } catch (err) {
      console.error('Failed to parse WebView message:', err);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* App Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <ArrowLeftIcon size={18} color="#F0FDF4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yield & Distributions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34D399"
            colors={['#34D399']}
          />
        }
      >
        {/* Portfolio Vault Summary Card */}
        <View style={styles.vaultCard}>
          <View style={styles.vaultCardGlowTop} />
          <View style={styles.vaultHeaderRow}>
            <Text style={styles.vaultLabel}>Total Realized Yield Payouts</Text>
            <View style={styles.growthBadge}>
              <TrendingUpIcon size={12} color="#34D399" />
              <Text style={styles.growthText}>Live Sync</Text>
            </View>
          </View>
          <Text style={styles.vaultAmount}>
            $
            {totalDistributed.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.vaultDivider} />
          <View style={styles.vaultMetaGrid}>
            <View>
              <Text style={styles.vaultMetaLabel}>Active Records</Text>
              <Text style={styles.vaultMetaValue}>
                {distributions.length} Total
              </Text>
            </View>
            <View style={styles.vaultMetaAlignRight}>
              <Text style={styles.vaultMetaLabel}>Protocol Sync Status</Text>
              <Text style={[styles.vaultMetaValue, { color: '#34D399' }]}>
                Connected
              </Text>
            </View>
          </View>
        </View>

        {/* Preference Card */}
        <View style={styles.prefCard}>
          <Text style={styles.prefCardTitle}>Yield Payout Preference</Text>
          <Text style={styles.prefCardSubtitle}>
            Choose how you would like to receive your monthly property
            dividends.
          </Text>
          <View style={styles.prefOptionsRow}>
            <TouchableOpacity
              style={[
                styles.prefOptionButton,
                tempMode === 'OFF_CHAIN' && styles.prefOptionButtonSelected,
              ]}
              onPress={() => setTempMode('OFF_CHAIN')}
              activeOpacity={0.8}
            >
              <Text style={styles.prefOptionTitle}>🌐 Off-Chain (Balance)</Text>
              <Text style={styles.prefOptionDesc}>
                Zero gas fees. Instant credit.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.prefOptionButton,
                tempMode === 'ON_CHAIN' && styles.prefOptionButtonSelected,
              ]}
              onPress={() => setTempMode('ON_CHAIN')}
              activeOpacity={0.8}
            >
              <Text style={styles.prefOptionTitle}>⛓️ On-Chain (Web3)</Text>
              <Text style={styles.prefOptionDesc}>
                Trustless claim to wallet.
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.prefSaveButton,
              (isSavingPref || tempMode === distributionMode) &&
                styles.prefSaveButtonDisabled,
            ]}
            disabled={isSavingPref || tempMode === distributionMode}
            onPress={() => handleDistributionModeChange(tempMode)}
            activeOpacity={0.85}
          >
            {isSavingPref ? (
              <ActivityIndicator color="#080C0A" size="small" />
            ) : (
              <Text style={styles.prefSaveButtonText}>Save Preference</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.segmentContainer}>
          {DISTRIBUTION_TABS.map(tab => {
            const isActive = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.segmentButton,
                  isActive && styles.segmentButtonActive,
                ]}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {tab} ({counts[tab]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        {loading && !refreshing ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#34D399" />
          </View>
        ) : filteredDistributions.length > 0 ? (
          <View style={styles.cardListContainer}>
            {filteredDistributions.map(item => {
              const isPaid = item.status === 'Paid';
              const isReady = item.status === 'Ready';
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.distributionCard}
                  activeOpacity={0.78}
                  onPress={() => handleOpenReceipt(item)}
                >
                  <View style={styles.distributionIconBox}>
                    <BuildingIcon size={20} color="#34D399" />
                  </View>
                  <View style={styles.distributionDetails}>
                    <Text
                      style={styles.distributionCardTitle}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.distributionCardDate}>{item.date}</Text>
                    <Text style={styles.distributionSmartTag}>
                      {isPaid
                        ? '✓ Yield Claimed & Paid'
                        : isReady
                        ? '⚡ Ready to Sign & Claim'
                        : 'Automated Platform Credit'}
                    </Text>
                  </View>
                  <View style={styles.distributionActionCol}>
                    <Text style={styles.distributionCardAmount}>
                      ${item.amount.toFixed(2)}
                    </Text>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isPaid
                              ? 'rgba(52, 211, 153, 0.12)'
                              : isReady
                              ? 'rgba(245, 158, 11, 0.12)'
                              : 'rgba(59, 130, 246, 0.12)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {
                              color: isPaid
                                ? '#34D399'
                                : isReady
                                ? '#F59E0B'
                                : '#60A5FA',
                            },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                      <ChevronRightIcon size={14} color="#64748B" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <EmptyVaultIcon size={36} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No Distributions Found</Text>
            <Text style={styles.emptySubtitle}>
              You have no active {selectedTab.toLowerCase()} distributions
              matching your criteria.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Receipt & Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandleBar} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Smart Contract Receipt</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
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
                  <Text style={styles.receiptAssetTitle}>
                    {selectedItem.title}
                  </Text>
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
                    <Text style={styles.ledgerVal}>
                      {selectedItem.assetType}
                    </Text>
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
                          onPress={() => handleCopyHash(selectedItem.txHash)}
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
                      onPress={() => handleOpenWebViewClaim(selectedItem)}
                      disabled={isCheckingClaim}
                      activeOpacity={0.85}
                    >
                      {isCheckingClaim ? (
                        <ActivityIndicator color="#080C0A" size="small" />
                      ) : (
                        <Text
                          style={[
                            styles.modalDoneButtonText,
                            { color: '#080C0A' },
                          ]}
                        >
                          Sign & Claim via Web Portal 🔗
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}

                <TouchableOpacity
                  style={styles.modalDoneButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalDoneButtonText}>Close Receipt</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* WebView Modal */}
      {/* WebView Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={webViewModalVisible}
        onRequestClose={() => setWebViewModalVisible(false)}
      >
        <View style={[styles.webViewContainer, { paddingTop: insets.top }]}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>
              Secure Signature & Claim Portal
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setWebViewModalVisible(false);
                fetchDistributionsData();
              }}
              activeOpacity={0.7}
            >
              <CloseIcon size={16} color="#F0FDF4" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: claimUrl }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoader}>
                <ActivityIndicator size="large" color="#34D399" />
              </View>
            )}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            scrollEnabled={true}
            bounces={false}
            setSupportMultipleWindows={false}
            originWhitelist={[
              'https://*',
              'http://*',
              'http://localhost:*',
              'http://10.0.2.2:*',
            ]}
            style={styles.webView}
            containerStyle={styles.webView}
            onMessage={handleWebViewMessage}
            injectedJavaScript={`
              (function() {
                window.notifyReactNative = function(type, payload) {
                  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
                  }
                };
              })();
              true;
            `}
            onError={event =>
              Alert.alert(
                'Connection Error',
                `Unable to load sign portal: ${
                  event.nativeEvent.description || 'Connection refused'
                }`,
              )
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#080C0A',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  headerTitle: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: { width: 38 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 48 },
  vaultCard: {
    backgroundColor: '#111816',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  vaultCardGlowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#34D399',
    opacity: 0.6,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vaultLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  growthText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  vaultAmount: {
    color: '#F0FDF4',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  vaultDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  vaultMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaultMetaLabel: { color: '#64748B', fontSize: 11, marginBottom: 2 },
  vaultMetaValue: { color: '#F0FDF4', fontSize: 13, fontWeight: '700' },
  vaultMetaAlignRight: { alignItems: 'flex-end' },
  prefCard: {
    backgroundColor: '#111816',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 20,
  },
  prefCardTitle: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  prefCardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  prefOptionsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  prefOptionButton: {
    flex: 1,
    backgroundColor: '#080C0A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  prefOptionButtonSelected: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },
  prefOptionTitle: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  prefOptionDesc: { color: '#64748B', fontSize: 10, lineHeight: 13 },
  prefSaveButton: {
    backgroundColor: '#34D399',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefSaveButtonDisabled: { opacity: 0.5 },
  prefSaveButtonText: { color: '#080C0A', fontSize: 13, fontWeight: '700' },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#111816',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: { backgroundColor: '#34D399' },
  segmentText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: '#080C0A', fontWeight: '700' },
  cardListContainer: { gap: 12 },
  distributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  distributionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  distributionDetails: { flex: 1, marginRight: 10 },
  distributionCardTitle: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  distributionCardDate: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  distributionSmartTag: { color: '#34D399', fontSize: 10, fontWeight: '600' },
  distributionActionCol: { alignItems: 'flex-end' },
  distributionCardAmount: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
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
  webViewContainer: { flex: 1, backgroundColor: '#080C0A' },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#080C0A',
  },
  webViewTitle: { color: '#F0FDF4', fontSize: 15, fontWeight: '700' },
  webView: { flex: 1, backgroundColor: '#080C0A' },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080C0A',
  },
});
