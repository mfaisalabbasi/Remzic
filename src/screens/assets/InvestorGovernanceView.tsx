import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ethers } from 'ethers';
import { WebView } from 'react-native-webview';

interface Proposal {
  id: string;
  proposalId: number;
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'EXECUTED' | 'LIQUIDATED';
  txHash?: string;
}

interface InvestorGovernanceProps {
  asset: any;
  walletProvider?: any;
}

export const InvestorGovernanceView = ({ asset }: InvestorGovernanceProps) => {
  const insets = useSafeAreaInsets();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<number | null>(null);

  // WebView signing portal state
  const [webViewModalVisible, setWebViewModalVisible] =
    useState<boolean>(false);
  const [signUrl, setSignUrl] = useState<string>('');

  const assetId = asset?.id || asset?._id;
  const govAddress =
    asset?.governanceAddress ||
    asset?.governanceContract ||
    asset?.governance_address;

  const API_BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:4000/api'
      : 'http://localhost:4000/api';

  const WEB_APP_BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';

  const fetchProposals = useCallback(async () => {
    if (!assetId) {
      setLoading(false);
      setErrorMsg('Asset ID is missing.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    const apiUrl = `${API_BASE_URL}/governance/${assetId}/proposals`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch proposals: ${res.status} ${text}`);
      }
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : data.proposals || []);
    } catch (err: any) {
      console.error('Governance fetch error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [assetId, API_BASE_URL]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleOpenWebViewVote = async (
    proposalId: number,
    support: boolean,
  ) => {
    if (!govAddress) {
      Alert.alert(
        'Error',
        'Governance contract address is missing for this asset.',
      );
      return;
    }

    try {
      setIsVoting(proposalId);

      const iface = new ethers.Interface([
        'function vote(uint256 _proposalId, bool _support) external',
      ]);
      const callData = iface.encodeFunctionData('vote', [proposalId, support]);

      const txPayload = {
        to: govAddress,
        data: callData,
        value: '0x0',
        chainId: 31337,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify({ txPayload }));
      const targetSignUrl = `${WEB_APP_BASE_URL}/investor/sign?proposalId=${proposalId}&payload=${encodedPayload}&contractAddress=${encodeURIComponent(
        govAddress,
      )}`;

      setSignUrl(targetSignUrl);
      setWebViewModalVisible(true);
    } catch (err: any) {
      Alert.alert(
        'Voting Error',
        err.message || 'Could not prepare vote transaction.',
      );
    } finally {
      setIsVoting(null);
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
        Alert.alert('Success', 'DAO vote recorded successfully on-chain!');
        fetchProposals();
      } else if (data.type === 'CLOSE_MODAL') {
        setWebViewModalVisible(false);
        fetchProposals();
      }
    } catch (err) {
      console.error('WebView message parsing error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Asset DAO Governance</Text>
          <Text style={styles.subtitle}>
            Participate in operational and emergency decisions for this vault.
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {asset?.status || 'ACTIVE'}
          </Text>
        </View>
      </View>

      {!govAddress && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Warning: Governance contract address is not linked to this asset.
          </Text>
        </View>
      )}

      <View style={styles.proposalList}>
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#34D399" />
            <Text style={styles.loadingText}>
              Synchronizing on-chain proposals...
            </Text>
          </View>
        ) : errorMsg ? (
          <Text style={styles.errorText}>
            Error loading proposals: {errorMsg}
          </Text>
        ) : proposals.length > 0 ? (
          proposals.map(p => {
            const targetId = Number(p.proposalId);
            const isPendingOrActive =
              p.status === 'ACTIVE' || p.status === 'PENDING';

            return (
              <View key={p.id || targetId} style={styles.proposalCard}>
                <View style={styles.proposalHeader}>
                  <Text style={styles.proposalId}>Proposal #{targetId}</Text>
                  <View style={styles.proposalBadge}>
                    <Text style={styles.proposalBadgeText}>{p.status}</Text>
                  </View>
                </View>
                <Text style={styles.proposalDesc}>{p.description}</Text>

                {p.txHash && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`https://etherscan.io/tx/${p.txHash}`)
                    }
                  >
                    <Text style={styles.txLink}>View Genesis TX ↗</Text>
                  </TouchableOpacity>
                )}

                {isPendingOrActive && (
                  <View style={styles.votingActions}>
                    <TouchableOpacity
                      style={styles.btnApprove}
                      disabled={isVoting === targetId}
                      onPress={() => handleOpenWebViewVote(targetId, true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnTextDark}>
                        {isVoting === targetId ? 'Signing...' : 'Vote FOR'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnReject}
                      disabled={isVoting === targetId}
                      onPress={() => handleOpenWebViewVote(targetId, false)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnTextLight}>
                        {isVoting === targetId ? 'Signing...' : 'Vote AGAINST'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyState}>
            No active governance proposals found for this asset.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.contractMeta}>Pod Contract Address:</Text>
        <Text style={styles.codeBadge} numberOfLines={1} ellipsizeMode="middle">
          {govAddress || 'Not Linked'}
        </Text>
      </View>

      {/* Active WebView Signing Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={webViewModalVisible}
        onRequestClose={() => setWebViewModalVisible(false)}
      >
        <View style={[styles.webViewContainer, { paddingTop: insets.top }]}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Secure DAO Signer</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setWebViewModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={{ color: '#F0FDF4', fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: signUrl }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            scrollEnabled={true}
            onMessage={handleWebViewMessage}
            style={styles.webView}
            containerStyle={styles.webView}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111816',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: { color: '#F9FAFB', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  subtitle: { color: '#9CA3AF', fontSize: 11, lineHeight: 15 },
  statusBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: { color: '#34D399', fontSize: 10, fontWeight: '700' },
  warningBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  warningText: { color: '#FBBF24', fontSize: 11 },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: { color: '#9CA3AF', fontSize: 12 },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
    padding: 10,
  },
  proposalList: { gap: 12 },
  proposalCard: {
    backgroundColor: '#080C0A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  proposalId: { color: '#F9FAFB', fontSize: 13, fontWeight: '700' },
  proposalBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proposalBadgeText: { color: '#60A5FA', fontSize: 9, fontWeight: '700' },
  proposalDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  txLink: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
  },
  votingActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnApprove: {
    flex: 1,
    backgroundColor: '#34D399',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnReject: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  btnTextDark: { color: '#053121', fontSize: 12, fontWeight: '800' },
  btnTextLight: { color: '#EF4444', fontSize: 12, fontWeight: '800' },
  emptyState: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  contractMeta: { color: '#9CA3AF', fontSize: 11 },
  codeBadge: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: '50%',
  },
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
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  webView: { flex: 1, backgroundColor: '#080C0A' },
});
