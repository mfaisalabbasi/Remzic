// src/screens/portfolio/PortfolioScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import { PortfolioHeader } from '../../components/portfolio/PortfolioHeader';
import { PortfolioSummaryCard } from '../../components/portfolio/PortfolioSummaryCard';
import { PortfolioHoldingsList } from '../../components/portfolio/PortfolioHoldingsList';
import { HoldingDetailsModal } from '../../components/portfolio/HoldingDetailsModal';

const PALETTE = {
  bg: '#080C0A',
  accent: '#34D399',
};

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

export const PortfolioScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const insets = useSafeAreaInsets();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [netAssetValue, setNetAssetValue] = useState<number>(0);

  const [selectedHolding, setSelectedHolding] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [downloadingDeed, setDownloadingDeed] = useState<boolean>(false);

  const fetchMyInvestments = async () => {
    try {
      const token = route?.params?.token || 'USER_JWT_TOKEN_HERE';

      const response = await axios.get(`${API_BASE_URL}/investments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data || [];
      setInvestments(data);

      const totalNav = data.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );
      setNetAssetValue(totalNav);
    } catch (error: any) {
      console.error('Failed to load portfolio investments:', error?.message);
      Alert.alert(
        'Sync Error',
        'Could not fetch your live investments from server.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyInvestments();
  }, []);

  const handleOpenHolding = async (item: any) => {
    try {
      const token = route?.params?.token || 'USER_JWT_TOKEN_HERE';
      if (item.id) {
        const liveStatusRes = await axios.get(
          `${API_BASE_URL}/investments/${item.id}/db-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSelectedHolding({ ...item, ...liveStatusRes.data });
      } else {
        setSelectedHolding(item);
      }
    } catch {
      setSelectedHolding(item);
    } finally {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedHolding(null);
  };

  const handleDownloadDeed = async () => {
    if (!selectedHolding?.deedUrl) {
      Alert.alert(
        'Notice',
        'Cryptographic deed registry record is pending final block confirmation.',
      );
      return;
    }
    setDownloadingDeed(true);
    try {
      setTimeout(async () => {
        setDownloadingDeed(false);
        await Share.share({
          message: `Official Legal Title Deed & Trust Declaration for ${selectedHolding.title}. Verified Vault Registry: ${selectedHolding.deedUrl}`,
          title: 'Institutional Title Deed',
        });
      }, 800);
    } catch {
      setDownloadingDeed(false);
      Alert.alert('Error', 'Unable to fetch secure document from vault.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      <PortfolioHeader
        topInset={insets.top}
        onPressNotifications={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PALETTE.accent}
          />
        }
      >
        <PortfolioSummaryCard
          netAssetValue={netAssetValue}
          onPressDeposit={() => navigation.navigate('Deposit')}
          onPressStatements={() => navigation.navigate('Statements')}
        />

        <PortfolioHoldingsList
          investments={investments}
          loading={loading}
          onOpenHolding={handleOpenHolding}
          onExploreMarketplace={() => navigation.navigate('Marketplace')}
        />
      </ScrollView>

      <HoldingDetailsModal
        visible={modalVisible}
        selectedHolding={selectedHolding}
        bottomInset={insets.bottom}
        downloadingDeed={downloadingDeed}
        onClose={handleCloseModal}
        onDownloadDeed={handleDownloadDeed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
});
