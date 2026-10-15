// src/components/marketplace/MarketplaceSegmentAndFilter.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
};

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

interface MarketplaceSegmentAndFilterProps {
  marketTab: 'Buy' | 'Sell' | 'Trades';
  setMarketTab: (tab: 'Buy' | 'Sell' | 'Trades') => void;
  orderBookCount: number;
  myListingsCount: number;
  tradesCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export const MarketplaceSegmentAndFilter = ({
  marketTab,
  setMarketTab,
  orderBookCount,
  myListingsCount,
  tradesCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MarketplaceSegmentAndFilterProps) => (
  <>
    <View style={styles.segmentContainer}>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          marketTab === 'Buy' && styles.segmentButtonActive,
        ]}
        onPress={() => setMarketTab('Buy')}
      >
        <Text
          style={[
            styles.segmentText,
            marketTab === 'Buy' && styles.segmentTextActive,
          ]}
        >
          Order Book ({orderBookCount})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          marketTab === 'Sell' && styles.segmentButtonActive,
        ]}
        onPress={() => setMarketTab('Sell')}
      >
        <Text
          style={[
            styles.segmentText,
            marketTab === 'Sell' && styles.segmentTextActive,
          ]}
        >
          My Listings ({myListingsCount})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          marketTab === 'Trades' && styles.segmentButtonActive,
        ]}
        onPress={() => setMarketTab('Trades')}
      >
        <Text
          style={[
            styles.segmentText,
            marketTab === 'Trades' && styles.segmentTextActive,
          ]}
        >
          Trades ({tradesCount})
        </Text>
      </TouchableOpacity>
    </View>

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
      </>
    )}
  </>
);

const styles = StyleSheet.create({
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentButtonActive: { backgroundColor: PALETTE.accent },
  segmentText: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: PALETTE.accentText, fontWeight: '800' },
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
  searchInput: { flex: 1, color: PALETTE.textMain, fontSize: 14, padding: 0 },
  categoryContainer: { marginBottom: 16 },
  categoryScroll: { paddingHorizontal: 20, gap: 8 },
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
  categoryText: { color: PALETTE.textMuted, fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: PALETTE.accentText, fontWeight: '800' },
});
