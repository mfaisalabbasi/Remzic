import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Institutional Grade Color Palette ---
const PALETTE = {
  bg: '#080C0A', // Deep Obsidian
  cardBg: '#111816', // Slightly lighter dark gray
  textMain: '#F9FAFB', // Almost white
  textMuted: '#9CA3AF', // Gray 400
  accent: '#34D399', // Emerald Green
  accentText: '#053121', // Very dark green for high contrast on buttons
  border: 'rgba(52, 211, 153, 0.15)', // Subtle emerald border
  danger: '#EF4444',
};

// --- Custom SVG Icons to Bypass Library/Font Linking Issues ---
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

  // Fallback property data with safe types
  const rawProperty = route?.params?.property || {};

  const property = {
    title: rawProperty.title || 'Dubai Creek Harbour Residences',
    location: rawProperty.location || 'Dubai, UAE',
    yield: rawProperty.yield !== undefined ? rawProperty.yield : 8.5,
    minInvestment: rawProperty.minInvestment || 500,
    investmentPeriod: rawProperty.investmentPeriod || '3 Years',
    imageUri:
      rawProperty.imageUri ||
      'https://images.unsplash.com/photo-1582468013943-5e9256002277?q=80&w=800&auto=format&fit=crop',
    overview:
      rawProperty.overview ||
      'Premium waterfront residential project located in the heart of Dubai Creek Harbour with strong rental demand and long-term capital growth potential. Fully digitized title ownership on distributed ledger.',
    tokenSupply: rawProperty.tokenSupply || '12,500 RWA Tokens',
    valuation: rawProperty.valuation || '$12.5M USD',
  };

  const formatMinInvestment = (val: number | string) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val.toString().startsWith('$') ? val.toString() : `$${val}`;
  };

  const MetricCard = ({ iconType, label, value }: any) => (
    <View style={styles.metricCard}>
      <View style={styles.metricIconContainer}>
        {iconType === 'activity' && <ActivityIcon />}
        {iconType === 'clock' && <ClockIcon />}
        {iconType === 'shield' && <ShieldIcon />}
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ImageBackground
          source={{ uri: property.imageUri }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={[styles.floatingHeader, { marginTop: insets.top + 16 }]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeftIcon />
            </TouchableOpacity>

            <View style={styles.headerActionsRight}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <ShareIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <BookmarkIcon />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.titleOverlaySection}>
            <View style={styles.tagPill}>
              <StarIcon />
              <Text style={styles.tagText}>RWA Real Estate</Text>
            </View>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <TouchableOpacity style={styles.locationRow} activeOpacity={0.8}>
              <MapPinIcon />
              <Text style={styles.propertyLocation}>{property.location}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.bodyContainer}>
          <View style={styles.metricsRow}>
            <MetricCard
              iconType="activity"
              label="Projected Yield"
              value={
                typeof property.yield === 'number'
                  ? `${property.yield}% pa`
                  : property.yield
              }
            />
            <MetricCard
              iconType="clock"
              label="Lock-up Period"
              value={property.investmentPeriod}
            />
            <MetricCard
              iconType="shield"
              label="Min. Investment"
              value={formatMinInvestment(property.minInvestment)}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Asset Profile</Text>
            <Text style={styles.sectionBody}>{property.overview}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Token Supply</Text>
                <Text style={styles.infoData}>{property.tokenSupply}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Asset Valuation</Text>
                <Text style={styles.infoData}>{property.valuation}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.documentsButton}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <FileTextIcon />
            <Text style={styles.documentsButtonText}>
              View Legal Offering Memorandum
            </Text>
            <ChevronRightIcon />
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity
          style={styles.investNowButton}
          onPress={() => navigation.navigate('InvestmentFlow', { property })}
          activeOpacity={0.9}
        >
          <Text style={styles.investNowButtonText}>Allocate Capital</Text>
          <View style={{ marginLeft: 8 }}>
            <ArrowRightIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  heroImage: {
    width: '100%',
    height: 320,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  heroImageStyle: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerActionsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleOverlaySection: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  tagText: {
    color: PALETTE.accentText,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  propertyTitle: {
    color: PALETTE.textMain,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 34,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  propertyLocation: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bodyContainer: {
    padding: 20,
    marginTop: -16,
    backgroundColor: PALETTE.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: PALETTE.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    color: PALETTE.textMain,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: PALETTE.textMain,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  sectionBody: {
    color: PALETTE.textMuted,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoData: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '600',
  },
  documentsButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  documentsButtonText: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: PALETTE.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  investNowButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  investNowButtonText: {
    color: PALETTE.accentText,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
