import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { AssetData } from '../../services/api/asset';

interface FeaturedAssetCardProps {
  loading: boolean;
  featuredAsset: AssetData | null;
  fundedPercentage: number;
  unitPrice: number;
  tokenSupply: number;
  fundingTarget: number;
  fundingRaised: number;
  navigation: any;
}

export const FeaturedAssetCard = ({
  loading,
  featuredAsset,
  fundedPercentage,
  unitPrice,
  tokenSupply,
  fundingTarget,
  fundingRaised,
  navigation,
}: FeaturedAssetCardProps) => {
  if (loading && !featuredAsset) {
    return (
      <View
        style={[styles.propertyCard, { padding: 40, alignItems: 'center' }]}
      >
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  }

  if (!featuredAsset) {
    return (
      <View
        style={[styles.propertyCard, { padding: 24, alignItems: 'center' }]}
      >
        <Text style={{ color: '#6EE7B7', fontSize: 13 }}>
          No active featured assets found.
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.propertyCard}
      activeOpacity={0.92}
      onPress={() => {
        const imageUri =
          featuredAsset.galleryImages?.[0] ||
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';

        const yieldVal = featuredAsset.expectedYield
          ? `${featuredAsset.expectedYield}% expected yield`
          : '8.5% expected yield';

        const minInv = featuredAsset.unitPrice
          ? `$${featuredAsset.unitPrice}`
          : `$100`;
        const assetType = featuredAsset.status || 'Commercial Real Estate';

        const propertyPayload = {
          id: featuredAsset.id,
          title: featuredAsset.title,
          location: featuredAsset.location || 'Global Institutional District',
          type: assetType,
          yield: yieldVal,
          minInvestment: `Min. ${minInv}`,
          funded: `${fundedPercentage}% Funded`,
          imageUri,
          overview:
            featuredAsset.overview ||
            'Institutional-grade fully audited tokenized real-world asset backed by verified underlying physical cash flows.',
          tokenSupply: `${tokenSupply.toLocaleString()} Tokens`,
          unitPrice,
          totalValue: fundingTarget,
          fundedAmount: fundingRaised,
          tokenAddress: featuredAsset.tokenAddress || '0x71C...39a2',
          treasuryAddress: featuredAsset.treasuryAddress || '0x49B...12f8',
          galleryImages: featuredAsset.galleryImages || [imageUri],
        };

        navigation.navigate('AssetDetails', {
          property: propertyPayload,
        });
      }}
    >
      <ImageBackground
        source={{
          uri:
            featuredAsset.galleryImages?.[0] ||
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
        }}
        style={styles.propertyImageBackground}
        imageStyle={styles.propertyImageStyle}
      >
        {/* Full coverage dark gradient overlay */}
        <View style={styles.imageDarkGradientOverlay} />

        <View style={styles.topBadgeRow}>
          <View style={styles.fundedBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.fundedText}>{fundedPercentage}% Funded</Text>
          </View>
          <Text style={styles.propertyTypeTag}>
            {featuredAsset.status || 'Commercial'}
          </Text>
        </View>

        <View style={styles.valuationPill}>
          <Text style={styles.valuationPillText}>
            Pool Cap: $
            {fundingTarget ? (fundingTarget / 1000).toFixed(0) + 'K' : '1.2M'}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.propertyInfo}>
        <View style={styles.propertyHeaderRow}>
          <Text style={styles.propertyName} numberOfLines={1}>
            {featuredAsset.title}
          </Text>
          <Text style={styles.propertyTokenSymbol}>
            [RWA-{featuredAsset.id.substring(0, 4).toUpperCase()}]
          </Text>
        </View>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          📍 {featuredAsset.location || 'Global Financial Hub'}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabelText}>Subscription Progress</Text>
            <Text style={styles.progressPercentText}>{fundedPercentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${fundedPercentage}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.propertyDivider} />

        <View style={styles.propertyYieldRow}>
          <View>
            <Text style={styles.yieldLabel}>Projected Yield</Text>
            <Text style={styles.yieldHighlight}>
              {featuredAsset.expectedYield
                ? `${featuredAsset.expectedYield}% expected yield`
                : '8.5% expected yield'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.yieldLabel}>Entry Threshold</Text>
            <Text style={styles.minInvestment}>Min. ${unitPrice}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    backgroundColor: '#061A12',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  propertyImageBackground: {
    height: 180,
    width: '100%',
    justifyContent: 'space-between',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  propertyImageStyle: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    width: '115%',
    height: '115%',
    resizeMode: 'cover',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageDarkGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 16, 11, 0.38)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  fundedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 16, 11, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  fundedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  propertyTypeTag: {
    color: '#F0FDF4',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  valuationPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(3, 16, 11, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    zIndex: 2,
  },
  valuationPillText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  propertyName: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  propertyTokenSymbol: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 11,
    fontWeight: '700',
  },
  propertyLocation: {
    color: '#A7F3D0',
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabelText: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressPercentText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#09291D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  propertyDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginBottom: 12,
  },
  propertyYieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldLabel: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  yieldHighlight: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '800',
  },
  minInvestment: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
  },
});
