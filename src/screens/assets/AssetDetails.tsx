// src/screens/AssetDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { fetchAssetById } from '../../services/api/asset';
import { InvestorGovernanceView } from './InvestorGovernanceView';

const { width } = Dimensions.get('window');

// --- Institutional Grade Color Palette ---
const PALETTE = {
  bg: '#080C0A', // Deep Obsidian
  cardBg: '#111816', // Slightly lighter dark gray
  cardSubBg: '#18221F', // Secondary card background
  textMain: '#F9FAFB', // Almost white
  textMuted: '#9CA3AF', // Gray 400
  accent: '#34D399', // Emerald Green
  accentText: '#053121', // Very dark green for high contrast on buttons
  border: 'rgba(52, 211, 153, 0.15)', // Subtle emerald border
  borderActive: 'rgba(52, 211, 153, 0.4)',
  danger: '#EF4444',
  infoBlue: '#38BDF8',
};

// --- Custom SVG Icons ---
const ArrowLeftIcon = ({ size = 20, color = PALETTE.textMain }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);
const ShareIcon = ({ size = 18, color = PALETTE.textMain }) => (
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
    <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);
const BookmarkIcon = ({ size = 18, color = PALETTE.textMain }) => (
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
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </Svg>
);
const MapPinIcon = ({ size = 14, color = PALETTE.accent }) => (
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
const ActivityIcon = ({ size = 18, color = PALETTE.accent }) => (
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
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);
const ClockIcon = ({ size = 18, color = PALETTE.accent }) => (
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
    <Path d="M12 6v6l4 2" />
  </Svg>
);
const ShieldIcon = ({ size = 18, color = PALETTE.accent }) => (
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
  </Svg>
);
const FileTextIcon = ({ size = 16, color = PALETTE.textMain }) => (
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
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);
const ChevronRightIcon = ({ size = 16, color = PALETTE.textMuted }) => (
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
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);
const ArrowRightIcon = ({ size = 18, color = PALETTE.accentText }) => (
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
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);
const StarIcon = ({ size = 12, color = PALETTE.accentText }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="1"
  >
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
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

  // Extract initial parameters passed via route
  const initialParamProperty = route?.params?.property || {};
  const assetId = initialParamProperty.id || route?.params?.assetId;

  const [assetData, setAssetData] = useState<any>(initialParamProperty);

  // Fetch complete asset details from backend if only ID is provided or data is partial
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

  // Debug payload to check incoming database values in your Metro console
  console.log('--- ASSET DATA DEBUG ---', {
    rawFunded: assetData.funded,
    rawTotalValue: assetData.totalValue,
    rawTokenSupply: assetData.tokenSupply,
    rawUnitPrice: assetData.unitPrice,
  });

  // Safely map metrics from backend responses with robust fallback support
  const unitPrice = Number(assetData.unitPrice ?? 10);
  const tokenSupply = Number(assetData.tokenSupply ?? 1000);

  // Fallback chain for Total Valuation / Target Capital
  const fundingTarget = Number(
    assetData.totalValue ||
      assetData.target ||
      assetData.funding?.target ||
      tokenSupply * unitPrice ||
      10000,
  );

  // Fallback chain for Raised Capital (maps to TablePlus 'funded' column)
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

  // Robust percentage calculation clamped strictly between 0 and 100
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

  const MetricCard = ({
    iconType,
    label,
    value,
  }: {
    iconType: string;
    label: string;
    value: string;
  }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricIconContainer}>
        {iconType === 'activity' && <ActivityIcon />}
        {iconType === 'clock' && <ClockIcon />}
        {iconType === 'shield' && <ShieldIcon />}
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

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
        {/* Hero Banner Image with Carousel Support */}
        <ImageBackground
          source={{ uri: currentDisplayImage }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.imageOverlayGradient} />

          <View style={[styles.floatingHeader, { marginTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeftIcon />
            </TouchableOpacity>

            <View style={styles.headerActionsRight}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <ShareIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  isBookmarked && styles.iconButtonActive,
                ]}
                onPress={() => setIsBookmarked(!isBookmarked)}
                activeOpacity={0.7}
              >
                <BookmarkIcon
                  color={isBookmarked ? PALETTE.accent : PALETTE.textMain}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.titleOverlaySection}>
            <View style={styles.tagRow}>
              <View style={styles.tagPill}>
                <StarIcon />
                <Text style={styles.tagText}>Remzik Verified RWA</Text>
              </View>
              <View style={styles.symbolPill}>
                <Text style={styles.symbolText}>{property.symbol}</Text>
              </View>
            </View>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <TouchableOpacity style={styles.locationRow} activeOpacity={0.8}>
              <MapPinIcon />
              <Text style={styles.propertyLocation}>{property.location}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Gallery Thumbnails */}
        {property.galleryImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScroll}
          >
            {property.galleryImages.map((img: string, index: number) => {
              const isActive = activeImageIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => setActiveImageIndex(index)}
                >
                  <ImageBackground
                    source={{ uri: img }}
                    style={[
                      styles.thumbnailPreview,
                      isActive && styles.thumbnailPreviewActive,
                    ]}
                  >
                    <View style={styles.thumbnailOverlay} />
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.bodyContainer}>
          {/* Key Metrics Grid */}
          <View style={styles.metricsRow}>
            <MetricCard
              iconType="activity"
              label="Projected Yield"
              value={property.yield}
            />
            <MetricCard
              iconType="clock"
              label="Lock-up Period"
              value={property.investmentPeriod}
            />
            <MetricCard
              iconType="shield"
              label="Unit Price"
              value={`$${property.unitPrice}`}
            />
          </View>

          {/* Capital Funding Progress Bar Card (Synced from Database) */}
          <View style={styles.fundingCard}>
            <View style={styles.fundingHeaderRow}>
              <Text style={styles.fundingCardTitle}>
                Capital Allocation Progress
              </Text>
              <Text style={styles.fundingPercentageText}>
                {fundingPercentage}% Funded
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${fundingPercentage}%` },
                ]}
              />
            </View>
            <View style={styles.fundingStatsRow}>
              <Text style={styles.fundingStatSub}>
                Raised:{' '}
                <Text style={styles.fundingStatHighlight}>
                  ${property.funded.toLocaleString()}
                </Text>
              </Text>
              <Text style={styles.fundingStatSub}>
                Target:{' '}
                <Text style={styles.fundingStatHighlight}>
                  ${property.totalValue.toLocaleString()}
                </Text>
              </Text>
              <Text style={styles.fundingStatSub}>
                Investors:{' '}
                <Text style={styles.fundingStatHighlight}>
                  {property.investorsCount}
                </Text>
              </Text>
            </View>
          </View>

          {/* Asset Overview Section */}
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

          {/* Interactive Token Return Calculator */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Yield & Return Calculator</Text>
            <View style={styles.calculatorCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Select Token Quantity</Text>
                <View style={styles.calcControlRow}>
                  <TouchableOpacity
                    style={styles.calcBtn}
                    onPress={() =>
                      setTokenCount(Math.max(1, safeTokenCount - 1))
                    }
                  >
                    <Text style={styles.calcBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.calcValueText}>
                    {safeTokenCount} Tokens
                  </Text>
                  <TouchableOpacity
                    style={styles.calcBtn}
                    onPress={() => setTokenCount(safeTokenCount + 1)}
                  >
                    <Text style={styles.calcBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.contractDivider} />

              <View style={styles.calcResultBox}>
                <View>
                  <Text style={styles.calcResultLabel}>Total Investment</Text>
                  <Text style={styles.calcResultVal}>
                    ${calculatedInvestmentCost.toLocaleString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.calcResultLabel}>Est. Yearly Return</Text>
                  <Text
                    style={[styles.calcResultVal, { color: PALETTE.accent }]}
                  >
                    +${estimatedAnnualReturn.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* On-Chain Smart Contract Details Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Blockchain Transparency & Governance
            </Text>
            <View style={styles.contractCard}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Token Contract</Text>
                <Text
                  style={styles.contractValue}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {property.tokenAddress}
                </Text>
              </View>
              <View style={styles.contractDivider} />
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Escrow Treasury</Text>
                <Text
                  style={styles.contractValue}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {property.treasuryAddress}
                </Text>
              </View>
              <View style={styles.contractDivider} />
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Governance DAO</Text>
                <Text
                  style={styles.contractValue}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {property.governanceAddress}
                </Text>
              </View>
              <View style={styles.contractDivider} />
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>IPFS Metadata Hash</Text>
                <Text
                  style={styles.contractValue}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {property.metadataHash}
                </Text>
              </View>
            </View>
          </View>

          {/* Legal Documents & Offering Memorandum Links */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Compliance & Legal Vault</Text>
            {property.legalDocuments.map((doc: any, index: number) => {
              const docTitle =
                typeof doc === 'string'
                  ? doc
                  : doc.title || `Legal Doc ${index + 1}`;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.documentsButton}
                  onPress={() =>
                    Alert.alert(
                      'Secure Vault',
                      `Accessing compliance document: ${docTitle}`,
                    )
                  }
                  activeOpacity={0.8}
                >
                  <FileTextIcon />
                  <Text style={styles.documentsButtonText}>{docTitle}</Text>
                  <ChevronRightIcon />
                </TouchableOpacity>
              );
            })}
            {property.financialDocuments.map((doc: any, index: number) => {
              const docTitle =
                typeof doc === 'string'
                  ? doc
                  : doc.title || `Financial Report ${index + 1}`;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.documentsButton}
                  onPress={() =>
                    Alert.alert(
                      'Financial Vault',
                      `Accessing financial report: ${docTitle}`,
                    )
                  }
                  activeOpacity={0.8}
                >
                  <FileTextIcon color={PALETTE.infoBlue} />
                  <Text style={styles.documentsButtonText}>{docTitle}</Text>
                  <ChevronRightIcon />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 30 }} />
        </View>
        <InvestorGovernanceView asset={property} />
      </ScrollView>

      {/* Sticky Bottom Capital Allocation CTA Bar */}
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
  heroImage: {
    width: '100%',
    height: 340,
    justifyContent: 'space-between',
    paddingBottom: 24,
    position: 'relative',
  },
  heroImageStyle: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  imageOverlayGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 12, 10, 0.5)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerActionsRight: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 12, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconButtonActive: {
    borderColor: PALETTE.accent,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
  },
  titleOverlaySection: { paddingHorizontal: 20, zIndex: 2 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  tagText: {
    color: PALETTE.accentText,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  symbolPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  symbolText: {
    color: PALETTE.textMain,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  propertyTitle: {
    color: PALETTE.textMain,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  propertyLocation: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  thumbnailScroll: { paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  thumbnailPreview: {
    width: 64,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  thumbnailPreviewActive: { borderColor: PALETTE.accent, borderWidth: 2 },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bodyContainer: {
    padding: 20,
    marginTop: -10,
    backgroundColor: PALETTE.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
    marginTop: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    color: PALETTE.textMuted,
    fontSize: 9.5,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: PALETTE.textMain,
    fontSize: 13.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  fundingCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 24,
  },
  fundingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundingCardTitle: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  fundingPercentageText: {
    color: PALETTE.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: PALETTE.cardSubBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PALETTE.accent,
    borderRadius: 4,
  },
  fundingStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fundingStatSub: { color: PALETTE.textMuted, fontSize: 11, fontWeight: '500' },
  fundingStatHighlight: { color: PALETTE.textMain, fontWeight: '700' },
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
  calculatorCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '600' },
  calcControlRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calcBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PALETTE.cardSubBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.borderActive,
  },
  calcBtnText: { color: PALETTE.accent, fontSize: 16, fontWeight: '800' },
  calcValueText: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 70,
    textAlign: 'center',
  },
  calcResultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcResultLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  calcResultVal: { color: PALETTE.textMain, fontSize: 15, fontWeight: '800' },
  contractCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  contractRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractLabel: { color: PALETTE.textMuted, fontSize: 11, fontWeight: '600' },
  contractValue: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '55%',
  },
  contractDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 10,
  },
  documentsButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  documentsButtonText: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginLeft: 12,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: PALETTE.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  footerPriceMeta: { justifyContent: 'center' },
  footerSubLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  footerPriceVal: { color: PALETTE.textMain, fontSize: 16, fontWeight: '800' },
  footerSymbolText: { color: PALETTE.accent, fontSize: 12 },
  investNowButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
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
    backgroundColor: 'rgba(5, 49, 33, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
