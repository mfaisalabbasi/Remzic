import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
} from 'react-native';
import { Colors } from '../../theme/colors';

const categories = ['All', 'Residential', 'Commercial', 'Land'];

const marketplaceListings = [
  {
    id: '1',
    title: 'Dubai Marina Apartments',
    location: 'Dubai, UAE',
    type: 'Residential',
    yield: '7.5% yield',
    price: '$1,200',
    change: '+2.3%',
  },
  {
    id: '2',
    title: 'London Office Building',
    location: 'London, UK',
    type: 'Commercial',
    yield: '6.8% yield',
    price: '$980',
    change: '+1.8%',
  },
  {
    id: '3',
    title: 'Riyadh Commercial Space',
    location: 'Riyadh, KSA',
    type: 'Commercial',
    yield: '8.2% yield',
    price: '$1,050',
    change: '+2.1%',
  },
];

export const MarketplaceScreen = ({ navigation }: { navigation: any }) => {
  const [marketTab, setMarketTab] = useState<'Buy' | 'Sell'>('Buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = marketplaceListings.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' || item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View>

      {/* Buy / Sell Segmented Switcher */}
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
            Buy
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
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search secondary market..."
          placeholderTextColor="#64748B"
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

      {/* Listings Cards Scrollable Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredListings.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.listingCard}
            onPress={() => navigation.navigate('AssetDetails')}
          >
            <View style={styles.listingThumbPlaceholder}>
              <Text style={styles.listingThumbIcon}>🏢</Text>
            </View>
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle}>{item.title}</Text>
              <Text style={styles.listingLocation}>📍 {item.location}</Text>
              <Text style={styles.listingYield}>{item.yield}</Text>
            </View>
            <View style={styles.listingPriceBox}>
              <Text style={styles.listingPrice}>{item.price}</Text>
              <Text style={styles.listingChange}>{item.change}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: Colors.accent,
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    padding: 0,
  },
  categoryContainer: {
    marginBottom: 14,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 12,
  },
  listingThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingThumbIcon: {
    fontSize: 20,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  listingLocation: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
  },
  listingYield: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '600',
  },
  listingPriceBox: {
    alignItems: 'flex-end',
  },
  listingPrice: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  listingChange: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },
});
