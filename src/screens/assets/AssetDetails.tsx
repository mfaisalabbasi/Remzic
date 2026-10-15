// src/screens/AssetDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { fetchAssetById } from '../../services/api/asset';
import { InvestorGovernanceView } from './InvestorGovernanceView';

import { AssetHeader } from '../../components/asset/AssetHeader';
import { AssetMetrics } from '../../components/asset/AssetMetrics';
import { AssetFundingCard } from '../../components/asset/AssetFundingCard';
import { AssetCalculator } from '../../components/asset/AssetCalculator';
import { AssetContractsDocs } from '../../components/asset/AssetContractsDocs';

const PALETTE = {
  bg: '#080C0A',
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
};

const ArrowRightIcon = () => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#34D399"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

export const AssetDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const insets = useSafeAreaInsets();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tokenCount, setTokenCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const initialParamProperty = route?.params?.property || {};
  const assetId = initialParamProperty.id || route?.params?.assetId;

  const [assetData, setAssetData] = useState<any>(initialParamProperty);

  useEffect(() => {
    let isMounted = true;
    if (assetId && (!assetData.totalValue || !assetData.funding)) {
      setLoading(true);
      fetchAssetById(assetId)
        .then(response => {
          if (isMounted && response) {
            setAssetData(response);
          }
        })
        .catch(err => {
          console.log('Failed to fetch asset details by ID:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [assetId]);

  const unitPrice = Number(assetData.unitPrice ?? 10);
  const tokenSupply = Number(assetData.tokenSupply ?? 1000);

  const fundingTarget = Number(
    assetData.totalValue ||
      assetData.target ||
      assetData.funding?.target ||
      tokenSupply * unitPrice ||
      10000,
  );

  const fundingRaised = Number(
    assetData.funded ?? assetData.funding?.raised ?? assetData.raised ?? 0,
  );
  const investorsCount = Number(
    assetData.funding?.investors ?? assetData.investorsCount ?? 0,
  );
  const expectedYieldNum = Number(
    assetData.expectedYield ?? assetData.yieldRate ?? 8.5,
  );
  const rentalIncome = Number(assetData.rentalIncome ?? 85000);

  const property = {
    id: assetData.id || assetId || 'asset-default-id',
    title: assetData.title || 'Institutional RWA Asset',
    symbol: assetData.symbol || 'REMZ',
    location: assetData.location || 'Global Financial Hub',
    yield: `${expectedYieldNum}% expected yield`,
    expectedYieldNum,
    investmentPeriod: assetData.investmentPeriod || '3 Years',
    imageUri:
      assetData.imageUri ||
      (assetData.galleryImages && assetData.galleryImages[0]) ||
      'https://images.unsplash.com/photo-1582468013943-5e9256002277?q=80&w=800&auto=format&fit=crop',
    overview:
      assetData.overview ||
      assetData.description ||
      'Institutional-grade fully audited tokenized real-world asset backed by verified physical cash flows and distributed ledger ownership protocols.',
    tokenSupply: `${tokenSupply.toLocaleString()} Tokens`,
    unitPrice,
    totalValue: fundingTarget,
    funded: fundingRaised,
    investorsCount,
    rentalIncome,
    tokenAddress: assetData.tokenAddress || 'Pending On-Chain Deployment',
    treasuryAddress: assetData.treasuryAddress || 'Pending On-Chain Deployment',
    governanceAddress:
      assetData.governanceAddress || 'Pending On-Chain Deployment',
    metadataHash: assetData.metadataHash || 'ipfs://default-metadata',
    galleryImages:
      Array.isArray(assetData.galleryImages) &&
      assetData.galleryImages.length > 0
        ? assetData.galleryImages
        : [
            assetData.imageUri ||
              'https://images.unsplash.com/photo-1582468013943-5e9256002277?q=80&w=800&auto=format&fit=crop',
          ],
    legalDocuments: assetData.legalDocuments || [
      'Offering_Memorandum_2026.pdf',
      'Title_Deed_Verified.pdf',
    ],
    financialDocuments: assetData.financialDocuments || ['Q1_Audit_Report.pdf'],
  };

  const currentDisplayImage =
    property.galleryImages[activeImageIndex] || property.imageUri;

  const rawPercentage =
    property.totalValue > 0 ? (property.funded / property.totalValue) * 100 : 0;
  const fundingPercentage = Math.min(
    Math.max(Math.round(rawPercentage), 0),
    100,
  );

  const safeTokenCount = Math.max(1, isNaN(tokenCount) ? 1 : tokenCount);
  const calculatedInvestmentCost = safeTokenCount * property.unitPrice;
  const estimatedAnnualReturn =
    calculatedInvestmentCost * (property.expectedYieldNum / 100);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this tokenized RWA asset on Remzik: ${property.title} (${property.symbol}) located in ${property.location}. Projected yield: ${property.yield}.`,
      });
    } catch (error) {
      console.log('Error sharing asset:', error);
    }
  };

  if (loading && !assetData.title) {
    return (
      <View
        style={[
          styles.container,
          styles.centerLoader,
          { backgroundColor: PALETTE.bg },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={PALETTE.accent} />
        <Text style={styles.loadingText}>Loading asset vault...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <AssetHeader
          property={property}
          currentDisplayImage={currentDisplayImage}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          isBookmarked={isBookmarked}
          setIsBookmarked={setIsBookmarked}
          onBack={() => navigation.goBack()}
          onShare={handleShare}
          topInset={insets.top}
        />

        <View style={styles.bodyContainer}>
          <AssetMetrics property={property} />

          <AssetFundingCard
            fundingPercentage={fundingPercentage}
            property={property}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Asset Profile & Underwriting
            </Text>
            <Text style={styles.sectionBody}>{property.overview}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Token Supply</Text>
                <Text style={styles.infoData}>{property.tokenSupply}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Annual Rental Income</Text>
                <Text style={styles.infoData}>
                  ${property.rentalIncome.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <AssetCalculator
            safeTokenCount={safeTokenCount}
            setTokenCount={setTokenCount}
            calculatedInvestmentCost={calculatedInvestmentCost}
            estimatedAnnualReturn={estimatedAnnualReturn}
          />

          <AssetContractsDocs property={property} />

          <View style={{ height: 30 }} />
        </View>
        <InvestorGovernanceView asset={property} />
      </ScrollView>

      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.footerPriceMeta}>
          <Text style={styles.footerSubLabel}>Price per Token</Text>
          <Text style={styles.footerPriceVal}>
            ${property.unitPrice}{' '}
            <Text style={styles.footerSymbolText}>({property.symbol})</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.investNowButton}
          onPress={() =>
            navigation.navigate('InvestmentFlow', {
              property,
              tokenCount: safeTokenCount,
            })
          }
          activeOpacity={0.9}
        >
          <Text style={styles.investNowButtonText}>Allocate Capital</Text>
          <View style={styles.arrowCircle}>
            <ArrowRightIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerLoader: { justifyContent: 'center', alignItems: 'center' },
  loadingText: {
    color: PALETTE.textMuted,
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: { flexGrow: 1, paddingBottom: 120 },
  bodyContainer: {
    padding: 20,
    marginTop: -10,
    backgroundColor: PALETTE.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: {
    color: PALETTE.textMain,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  sectionBody: {
    color: PALETTE.textMuted,
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    gap: 12,
  },
  infoItem: { flex: 1 },
  infoLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoData: { color: PALETTE.textMain, fontSize: 13, fontWeight: '700' },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8, 12, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    zIndex: 100,
  },
  footerPriceMeta: { justifyContent: 'center' },
  footerSubLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  footerPriceVal: { color: PALETTE.textMain, fontSize: 18, fontWeight: '800' },
  footerSymbolText: { color: PALETTE.accent, fontSize: 13, fontWeight: '700' },
  investNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  investNowButtonText: {
    color: PALETTE.accentText,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PALETTE.accentText,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
