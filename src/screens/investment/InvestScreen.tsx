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

const categories = ['All', 'Residential', 'Commercial', 'Offices'];

const properties = [
  {
    id: '1',
    title: 'Dubai Creek Residence',
    location: 'Dubai, UAE',
    type: 'Residential',
    yield: '8.5% expected yield',
    minInvestment: 'Min. $500',
    funded: '74% left',
  },
  {
    id: '2',
    title: 'Riyadh Business Tower',
    location: 'Riyadh, KSA',
    type: 'Offices',
    yield: '7.8% expected yield',
    minInvestment: 'Min. $1,000',
    funded: '32% left',
  },
  {
    id: '3',
    title: 'London City Apartments',
    location: 'London, UK',
    type: 'Residential',
    yield: '6.9% expected yield',
    minInvestment: 'Min. $500',
    funded: '15% left',
  },
];

export const InvestScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter(item => {
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

      {/* Header Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invest RWA</Text>
        <Text style={styles.headerSubtitle}>
          Institutional-grade asset pool
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations, towers..."
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

      {/* Property Cards List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.propertyCard}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('AssetDetails', { property: item })
            }
          >
            <View style={styles.propertyImagePlaceholder}>
              <View style={styles.fundedBadge}>
                <Text style={styles.fundedText}>🔥 {item.funded}</Text>
              </View>
              <Text style={styles.propertyTypeTag}>{item.type} Asset</Text>
            </View>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{item.title}</Text>
              <Text style={styles.propertyLocation}>📍 {item.location}</Text>

              <View style={styles.propertyDivider} />

              <View style={styles.propertyYieldRow}>
                <View>
                  <Text style={styles.yieldLabel}>Projected Yield</Text>
                  <Text style={styles.yieldHighlight}>{item.yield}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.yieldLabel}>Entry Threshold</Text>
                  <Text style={styles.minInvestment}>{item.minInvestment}</Text>
                </View>
              </View>
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
    backgroundColor: '#080C0A', // Deep obsidian dark base with minimal green undertone
  },
  header: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
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
  categoryContainer: {
    marginBottom: 16,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  propertyCard: {
    backgroundColor: '#111816',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  propertyImagePlaceholder: {
    height: 150,
    backgroundColor: '#16221E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fundedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(8, 12, 10, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  fundedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  propertyTypeTag: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  propertyLocation: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
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
});
