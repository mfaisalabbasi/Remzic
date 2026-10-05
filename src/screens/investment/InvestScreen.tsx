// src/screens/InvestScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useApprovedAssets } from '../../services/hooks/useAssets';
import { AssetData } from '../../services/api/asset';

const { width } = Dimensions.get('window');

// Extended dynamic categories matching institutional real estate sectors
const categories = [
  'All',
  'Residential',
  'Commercial',
  'Offices',
  'Industrial',
  'Hospitality',
];
type SortOption = 'yield' | 'price' | 'newest';

export const InvestScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('yield');

  // Fetching live data from your NestJS backend hook
  const { assets, loading, error, refreshAssets } = useApprovedAssets();

  // Safety check: ensure assets is always treated as an array
  const assetList: AssetData[] = Array.isArray(assets)
    ? assets
    : (assets as any)?.data || [];

  // Compute dynamic portfolio metrics
  const portfolioStats = useMemo(() => {
    if (!assetList.length) return { totalValuation: '$0', avgYield: '0%' };
    const totalValuation = assetList.reduce(
      (acc, item) => acc + (item.totalValue || 0),
      0,
    );
    const avgYieldNum =
      assetList.reduce((acc, item) => acc + (item.expectedYield || 8.5), 0) /
      assetList.length;

    return {
      totalValuation: `$${(totalValuation / 1000000).toFixed(1)}M+`,
      avgYield: `${avgYieldNum.toFixed(1)}%`,
    };
  }, [assetList]);

  // Filter & Sort properties dynamically
  const filteredProperties = useMemo(() => {
    return assetList
      .filter(item => {
        // Dynamic matching across title, location, or status tags
        const categoryMatch =
          selectedCategory === 'All' ||
          item.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          item.status?.toLowerCase() === selectedCategory.toLowerCase();

        const searchMatch =
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.location &&
            item.location.toLowerCase().includes(searchQuery.toLowerCase()));

        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'yield') {
          return (b.expectedYield || 0) - (a.expectedYield || 0);
        } else if (sortBy === 'price') {
          return (a.unitPrice || 0) - (b.unitPrice || 0);
        }
        return 0; // Default ordering
      });
  }, [assetList, selectedCategory, searchQuery, sortBy]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Title & Quick Metrics Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Invest RWA</Text>
          <Text style={styles.headerSubtitle}>
            Institutional-grade fractionalized pools
          </Text>
        </View>
        <View style={styles.metricsPill}>
          <Text style={styles.metricsPillLabel}>Pool TVL</Text>
          <Text style={styles.metricsPillValue}>
            {portfolioStats.totalValuation}
          </Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations, towers, assets..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Horizontal Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              activeOpacity={0.8}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sorting Bar Controls */}
      <View style={styles.sortContainer}>
        <Text style={styles.resultCountText}>
          {filteredProperties.length} Assets Available
        </Text>
        <View style={styles.sortToggleRow}>
          <TouchableOpacity
            style={[
              styles.sortChip,
              sortBy === 'yield' && styles.sortChipActive,
            ]}
            onPress={() => setSortBy('yield')}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === 'yield' && styles.sortChipTextActive,
              ]}
            >
              ⚡ Highest Yield
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortChip,
              sortBy === 'price' && styles.sortChipActive,
            ]}
            onPress={() => setSortBy('price')}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === 'price' && styles.sortChipTextActive,
              ]}
            >
              🏷️ Min Entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Cards List / States */}
      {loading && assetList.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>
            Syncing tokenized real estate...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Failed to sync with Remzik backend server.
          </Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshAssets}>
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshAssets}
              tintColor="#10B981"
            />
          }
        >
          {filteredProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🏢</Text>
              <Text style={styles.emptyText}>
                No matching RWA assets found.
              </Text>
              <TouchableOpacity
                style={styles.resetFilterButton}
                onPress={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.resetFilterText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredProperties.map(item => {
              // Fallback to high quality architectural mock photos if gallery is empty
              const imageUri =
                item.galleryImages?.[0] ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';

              const yieldVal = item.expectedYield
                ? `${item.expectedYield}% expected yield`
                : '8.5% expected yield';

              const minInv = item.unitPrice ? `$${item.unitPrice}` : `$100`;
              const assetType = item.status || 'Commercial Real Estate';

              // Dynamic mock funding progression bar calculation based on string hash / token supply
              const fundedPercentage = Math.min(
                Math.max(((item.tokenSupply || 10000) % 75) + 25, 35),
                94,
              );

              const propertyPayload = {
                id: item.id,
                title: item.title,
                location: item.location || 'Global Institutional District',
                type: assetType,
                yield: yieldVal,
                minInvestment: `Min. ${minInv}`,
                funded: `${fundedPercentage}% Funded`,
                imageUri,
                overview:
                  item.overview ||
                  'Institutional-grade fully audited tokenized real-world asset backed by verified underlying physical cash flows.',
                tokenSupply: `${
                  item.tokenSupply?.toLocaleString() || '10,000'
                } Tokens`,
                valuation: `$${
                  item.totalValue?.toLocaleString() || '1,500,000'
                } USD`,
                tokenAddress: item.tokenAddress || '0x71C...39a2',
                treasuryAddress: item.treasuryAddress || '0x49B...12f8',
                galleryImages: item.galleryImages || [imageUri],
              };

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.propertyCard}
                  activeOpacity={0.92}
                  onPress={() =>
                    navigation.navigate('AssetDetails', {
                      property: propertyPayload,
                    })
                  }
                >
                  {/* Property Image Header with Status Overlays */}
                  <View style={styles.propertyImagePlaceholder}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.propertyImage}
                    />
                    <View style={styles.imageOverlayGradient} />

                    <View style={styles.topBadgeRow}>
                      <View style={styles.fundedBadge}>
                        <View style={styles.pulsingDot} />
                        <Text style={styles.fundedText}>
                          {fundedPercentage}% Funded
                        </Text>
                      </View>
                      <Text style={styles.propertyTypeTag}>{assetType}</Text>
                    </View>

                    {/* Quick Valuation Overlay Pill */}
                    <View style={styles.valuationPill}>
                      <Text style={styles.valuationPillText}>
                        Pool Cap: $
                        {item.totalValue
                          ? (item.totalValue / 1000).toFixed(0) + 'K'
                          : '1.2M'}
                      </Text>
                    </View>
                  </View>

                  {/* Body Content Details */}
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.propertyLocation} numberOfLines={1}>
                      📍 {item.location || 'Global Financial Hub'}
                    </Text>

                    {/* Progress Bar Showing Subscription Level */}
                    <View style={styles.progressContainer}>
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

                    {/* Key Metrics Row */}
                    <View style={styles.propertyYieldRow}>
                      <View>
                        <Text style={styles.yieldLabel}>Projected Yield</Text>
                        <Text style={styles.yieldHighlight}>{yieldVal}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.yieldLabel}>Entry Threshold</Text>
                        <Text style={styles.minInvestment}>Min. {minInv}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 10,
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  metricsPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  metricsPillLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricsPillValue: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.18)',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    padding: 0,
  },
  clearSearchText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111816',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#080C0A',
    fontWeight: '800',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  resultCountText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  sortToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    backgroundColor: '#111816',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sortChipActive: {
    borderColor: 'rgba(52, 211, 153, 0.4)',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  sortChipText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#34D399',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  propertyCard: {
    backgroundColor: '#111816',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  propertyImagePlaceholder: {
    height: 170,
    backgroundColor: '#16221E',
    position: 'relative',
    justifyContent: 'space-between',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 12, 10, 0.3)',
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    zIndex: 2,
  },
  fundedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 12, 10, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  fundedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  propertyTypeTag: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  valuationPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(8, 12, 10, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  valuationPillText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  propertyLocation: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 2,
  },
  propertyDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  propertyYieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldLabel: {
    color: '#64748B',
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
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },
  errorSubText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    fontSize: 12,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#080C0A',
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 16,
  },
  resetFilterButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetFilterText: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 12,
  },
});
