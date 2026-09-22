import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Institutional Grade Color Palette ---
const PALETTE = {
  bg: '#080C0A', // Deep Obsidian
  cardBg: '#111816', // Slightly lighter dark gray
  cardAlt: '#151D1B',
  textMain: '#F9FAFB', // Almost white
  textMuted: '#9CA3AF', // Gray 400
  accent: '#34D399', // Emerald Green
  accentText: '#053121', // Dark text for high-contrast on emerald buttons
  border: 'rgba(52, 211, 153, 0.15)', // Subtle emerald border
  success: '#34D399',
  danger: '#EF4444',
};

// --- Dedicated Inline SVG Vector Icons ---
const SearchIcon = ({ size = 16, color = PALETTE.textMuted }) => (
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
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const BuildingIcon = ({ size = 20, color = PALETTE.accent }) => (
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
    <Path d="M6 22V2a2 2 0 012-2h8a2 2 0 012 2v20zM6 6h12M6 10h12M6 14h12M6 18h12" />
  </Svg>
);

const MapPinIcon = ({ size = 12, color = PALETTE.textMuted }) => (
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

const ArrowUpRightIcon = ({ size = 14, color = PALETTE.success }) => (
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
    <Path d="M7 17L17 7M7 7h10v10" />
  </Svg>
);

const PlusCircleIcon = ({ size = 18, color = PALETTE.accentText }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 8v8M8 12h8" />
  </Svg>
);

const TagIcon = ({ size = 16, color = PALETTE.accent }) => (
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
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <Circle cx="7" cy="7" r="1.5" fill={color} />
  </Svg>
);

const categories = ['All', 'Residential', 'Commercial', 'Land'];

// Initial active listings on the secondary market
const initialMarketplaceListings = [
  {
    id: '1',
    title: 'Dubai Marina Apartments',
    location: 'Dubai, UAE',
    type: 'Residential',
    yield: '7.5% pa yield',
    price: '$1,200',
    change: '+2.3%',
    seller: 'Market Maker #4',
  },
  {
    id: '2',
    title: 'London Office Building',
    location: 'London, UK',
    type: 'Commercial',
    yield: '6.8% pa yield',
    price: '$980',
    change: '+1.8%',
    seller: 'Institutional Pool',
  },
  {
    id: '3',
    title: 'Riyadh Commercial Space',
    location: 'Riyadh, KSA',
    type: 'Commercial',
    yield: '8.2% pa yield',
    price: '$1,050',
    change: '+2.1%',
    seller: 'P2P Holder',
  },
];

// Mock user's portfolio holdings available to list for sale
const userPortfolioHoldings = [
  {
    id: 'h1',
    title: 'Downtown Jeddah Tower',
    location: 'Jeddah, KSA',
    type: 'Commercial',
    tokensOwned: 10,
    currentVal: '$1,500',
  },
  {
    id: 'h2',
    title: 'Palm Jumeirah Villa',
    location: 'Dubai, UAE',
    type: 'Residential',
    tokensOwned: 5,
    currentVal: '$2,400',
  },
];

export const MarketplaceScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [marketTab, setMarketTab] = useState<'Buy' | 'Sell'>('Buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState(initialMarketplaceListings);

  // Listing Modal State (for when user taps "List New Asset")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAssetToSell, setSelectedAssetToSell] = useState<any>(null);
  const [askPrice, setAskPrice] = useState('');

  // Filtering Logic
  const filteredListings = listings.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' || item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateListing = () => {
    if (!selectedAssetToSell || !askPrice) {
      Alert.alert(
        'Error',
        'Please select an asset from your portfolio and enter your asking price.',
      );
      return;
    }

    const newListing = {
      id: Date.now().toString(),
      title: selectedAssetToSell.title,
      location: selectedAssetToSell.location,
      type: selectedAssetToSell.type,
      yield: '7.9% pa yield',
      price: `$${askPrice}`,
      change: 'New',
      seller: 'You',
    };

    setListings([newListing, ...listings]);
    setIsModalVisible(false);
    setSelectedAssetToSell(null);
    setAskPrice('');
    setMarketTab('Buy'); // Switch back to Buy view to see the freshly listed item
    Alert.alert(
      'Success',
      'Your RWA asset has been successfully listed on the secondary market order book.',
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View>
          <Text style={styles.headerSubtitle}>Secondary Liquidity</Text>
          <Text style={styles.headerTitle}>RWA Marketplace</Text>
        </View>
        {marketTab === 'Sell' && (
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
          >
            <PlusCircleIcon size={16} color={PALETTE.accentText} />
            <Text style={styles.headerActionBtnText}>List Asset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Buy / Sell Segmented Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            marketTab === 'Buy' && styles.segmentButtonActive,
          ]}
          onPress={() => setMarketTab('Buy')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              marketTab === 'Buy' && styles.segmentTextActive,
            ]}
          >
            Buy Assets ({listings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            marketTab === 'Sell' && styles.segmentButtonActive,
          ]}
          onPress={() => setMarketTab('Sell')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              marketTab === 'Sell' && styles.segmentTextActive,
            ]}
          >
            My Active Listings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar (Only shown on Buy view) */}
      {marketTab === 'Buy' && (
        <>
          <View style={styles.searchContainer}>
            <SearchIcon size={16} color={PALETTE.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties, locations..."
              placeholderTextColor={PALETTE.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter Tabs */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* Listings Scrollable Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {marketTab === 'Buy' ? (
          // BUY MARKETPLACE VIEW
          filteredListings.length > 0 ? (
            filteredListings.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.listingCard}
                onPress={() =>
                  navigation.navigate('AssetDetails', { property: item })
                }
                activeOpacity={0.85}
              >
                <View style={styles.listingThumbContainer}>
                  <BuildingIcon size={20} color={PALETTE.accent} />
                </View>
                <View style={styles.listingInfo}>
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPinIcon size={11} color={PALETTE.textMuted} />
                    <Text style={styles.listingLocation}>
                      {item.location} • Seller: {item.seller}
                    </Text>
                  </View>
                  <Text style={styles.listingYield}>{item.yield}</Text>
                </View>
                <View style={styles.listingPriceBox}>
                  <Text style={styles.listingPrice}>{item.price}</Text>
                  <View style={styles.changeBadge}>
                    <ArrowUpRightIcon size={12} color={PALETTE.success} />
                    <Text style={styles.listingChange}>{item.change}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No listings match your search criteria.
              </Text>
            </View>
          )
        ) : (
          // MY ACTIVE SELL LISTINGS VIEW
          <View>
            <View style={styles.bannerCard}>
              <TagIcon size={20} color={PALETTE.accent} />
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>Manage Your Liquidity</Text>
                <Text style={styles.bannerDesc}>
                  List fractional RWA tokens from your personal portfolio onto
                  the secondary order book instantly.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.createListingPromptButton}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
            >
              <PlusCircleIcon size={18} color={PALETTE.accentText} />
              <Text style={styles.createListingPromptText}>
                List New Asset From Portfolio
              </Text>
            </TouchableOpacity>

            {listings.filter(l => l.seller === 'You').length > 0 ? (
              listings
                .filter(l => l.seller === 'You')
                .map(item => (
                  <View key={item.id} style={styles.listingCard}>
                    <View style={styles.listingThumbContainer}>
                      <BuildingIcon size={20} color={PALETTE.accent} />
                    </View>
                    <View style={styles.listingInfo}>
                      <Text style={styles.listingTitle}>{item.title}</Text>
                      <Text style={styles.listingLocation}>
                        Status: Active on Order Book
                      </Text>
                      <Text style={styles.listingYield}>
                        Listed Asking Price
                      </Text>
                    </View>
                    <View style={styles.listingPriceBox}>
                      <Text style={styles.listingPrice}>{item.price}</Text>
                      <TouchableOpacity
                        style={styles.cancelListingBtn}
                        onPress={() => {
                          setListings(listings.filter(l => l.id !== item.id));
                        }}
                      >
                        <Text style={styles.cancelListingText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You have no active listings on the secondary market.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL: List Asset From Portfolio */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>List Asset for Sale</Text>
            <Text style={styles.modalSubtitle}>
              Select an asset from your holdings to list on the P2P secondary
              market.
            </Text>

            <Text style={styles.inputLabel}>Choose Asset</Text>
            {userPortfolioHoldings.map(holding => (
              <TouchableOpacity
                key={holding.id}
                style={[
                  styles.portfolioSelectCard,
                  selectedAssetToSell?.id === holding.id &&
                    styles.portfolioSelectCardActive,
                ]}
                onPress={() => setSelectedAssetToSell(holding)}
              >
                <View>
                  <Text style={styles.holdingTitle}>{holding.title}</Text>
                  <Text style={styles.holdingSub}>
                    {holding.location} • Owned: {holding.tokensOwned} tokens
                  </Text>
                </View>
                <Text style={styles.holdingVal}>{holding.currentVal}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.inputLabel}>Set Asking Price (USD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 1250"
              placeholderTextColor={PALETTE.textMuted}
              keyboardType="numeric"
              value={askPrice}
              onChangeText={setAskPrice}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleCreateListing}
              >
                <Text style={styles.modalSubmitText}>Confirm Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: PALETTE.textMain,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerActionButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtnText: {
    color: PALETTE.accentText,
    fontSize: 12,
    fontWeight: '800',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentButtonActive: {
    backgroundColor: PALETTE.accent,
  },
  segmentText: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: PALETTE.accentText,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: PALETTE.textMain,
    fontSize: 14,
    padding: 0,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  categoryTabActive: {
    backgroundColor: PALETTE.accent,
    borderColor: PALETTE.accent,
  },
  categoryText: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: PALETTE.accentText,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 12,
    gap: 12,
  },
  listingThumbContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  listingLocation: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  listingYield: {
    color: PALETTE.success,
    fontSize: 11,
    fontWeight: '700',
  },
  listingPriceBox: {
    alignItems: 'flex-end',
  },
  listingPrice: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  listingChange: {
    color: PALETTE.success,
    fontSize: 11,
    fontWeight: '700',
  },
  bannerCard: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 16,
    gap: 14,
    alignItems: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerDesc: {
    color: PALETTE.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  createListingPromptButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  createListingPromptText: {
    color: PALETTE.accentText,
    fontSize: 14,
    fontWeight: '800',
  },
  cancelListingBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelListingText: {
    color: PALETTE.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: PALETTE.textMuted,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: PALETTE.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
  },
  modalTitle: {
    color: PALETTE.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputLabel: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  portfolioSelectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.cardAlt,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 8,
  },
  portfolioSelectCardActive: {
    borderColor: PALETTE.accent,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  holdingTitle: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  holdingSub: {
    color: PALETTE.textMuted,
    fontSize: 11,
  },
  holdingVal: {
    color: PALETTE.success,
    fontSize: 13,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: PALETTE.cardAlt,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: PALETTE.textMain,
    fontSize: 14,
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: PALETTE.cardAlt,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalCancelText: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
  },
  modalSubmitButton: {
    flex: 1.5,
    backgroundColor: PALETTE.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: PALETTE.accentText,
    fontSize: 14,
    fontWeight: '800',
  },
});
