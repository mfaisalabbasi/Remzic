// src/screens/distributions/DistributionsScreen.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  Clipboard,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

import { DistributionsHeader } from '../../components/distributions/DistributionsHeader';
import { DistributionsVaultSummary } from '../../components/distributions/DistributionsVaultSummary';
import { DistributionsPreferenceCard } from '../../components/distributions/DistributionsPreferenceCard';
import { DistributionsList } from '../../components/distributions/DistributionsList';
import { DistributionReceiptModal } from '../../components/distributions/DistributionReceiptModal';
import { DistributionClaimWebViewModal } from '../../components/distributions/DistributionClaimWebViewModal';
import { useAuth } from '../../navigation/AuthContext';

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

const isValidEvmAddress = (address?: string | null): boolean =>
  Boolean(address && /^0x[a-fA-F0-9]{40}$/.test(address.trim()));

export const DistributionsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

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

  const [webViewModalVisible, setWebViewModalVisible] = useState(false);
  const [claimUrl, setClaimUrl] = useState<string>('');
  const [isCheckingClaim, setIsCheckingClaim] = useState<boolean>(false);

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

  const getWalletParam = async (): Promise<string> => {
    let rawWallet = user?.walletAddress || user?.user?.walletAddress || '';

    if (!isValidEvmAddress(rawWallet)) {
      try {
        const cached = await AsyncStorage.getItem('cached_walletAddress');
        if (cached && isValidEvmAddress(cached)) {
          rawWallet = cached;
        }
      } catch (e) {
        console.warn('[Distributions] Storage wallet lookup failed:', e);
      }
    }

    if (!isValidEvmAddress(rawWallet)) {
      return '';
    }

    return `&walletAddress=${encodeURIComponent(
      rawWallet.trim().toLowerCase(),
    )}`;
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

  const handleOpenWebViewClaim = async (item: DistributionItem) => {
    if (!item.batchId) {
      Alert.alert('Error', 'Missing Batch ID for this distribution.');
      return;
    }

    try {
      setIsCheckingClaim(true);

      const proofUrl = `${API_BASE_URL}/distributions/proof/${encodeURIComponent(
        item.batchId,
      )}`;
      const res = await fetch(proofUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.error(
          `[Proof Fetch Failed] Status: ${res.status}, Body:`,
          errorText,
        );
        throw new Error(
          `Server returned status ${res.status}: ${
            errorText || 'Proof not found'
          }`,
        );
      }

      const proofPayload = await res.json();

      const targetContractAddress =
        process.env.EXPO_PUBLIC_YIELD_NOTARY_ADDRESS ||
        '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1';

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
      const walletParam = await getWalletParam();

      const targetClaimUrl =
        `${WEB_APP_BASE_URL}/auth/sign` +
        `?batchId=${encodeURIComponent(item.batchId)}` +
        `&payload=${encodedPayload}` +
        `&contractAddress=${encodeURIComponent(targetContractAddress)}` +
        walletParam +
        `&autoAuth=true`;

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
      if (data.type === 'CLAIM_SUCCESS') {
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
      } else if (data.type === 'CLAIM_FAILED') {
        setWebViewModalVisible(false);
        Alert.alert(
          'Transaction Failed',
          data.error || 'User cancelled or transaction reverted.',
        );
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

      <DistributionsHeader onBack={() => navigation.goBack()} />

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
        <DistributionsVaultSummary
          totalDistributed={totalDistributed}
          totalRecords={distributions.length}
        />

        <DistributionsPreferenceCard
          tempMode={tempMode}
          setTempMode={setTempMode}
          distributionMode={distributionMode}
          isSavingPref={isSavingPref}
          onSavePreference={handleDistributionModeChange}
        />

        <DistributionsList
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          counts={counts}
          loading={loading}
          refreshing={refreshing}
          filteredDistributions={filteredDistributions}
          onOpenReceipt={handleOpenReceipt}
        />
      </ScrollView>

      <DistributionReceiptModal
        visible={modalVisible}
        selectedItem={selectedItem}
        copied={copied}
        isCheckingClaim={isCheckingClaim}
        onClose={() => setModalVisible(false)}
        onCopyHash={handleCopyHash}
        onOpenWebViewClaim={handleOpenWebViewClaim}
      />

      <DistributionClaimWebViewModal
        visible={webViewModalVisible}
        claimUrl={claimUrl}
        topInset={insets.top}
        onClose={() => {
          setWebViewModalVisible(false);
          fetchDistributionsData();
        }}
        onWebViewMessage={handleWebViewMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C0A' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 48 },
});
