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
        <Text style={styles.headerTitle}>Invest</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search assets..."
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

      {/* Property Cards List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.propertyCard}
            onPress={() =>
              navigation.navigate('AssetDetails', { property: item })
            }
          >
            <View style={styles.propertyImagePlaceholder}>
              <View style={styles.fundedBadge}>
                <Text style={styles.fundedText}>{item.funded}</Text>
              </View>
              <Text style={styles.propertyTypeTag}>{item.type} Asset</Text>
            </View>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{item.title}</Text>
              <Text style={styles.propertyLocation}>📍 {item.location}</Text>
              <View style={styles.propertyYieldRow}>
                <Text style={styles.yieldHighlight}>{item.yield}</Text>
                <Text style={styles.minInvestment}>{item.minInvestment}</Text>
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
  propertyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  propertyImagePlaceholder: {
    height: 140,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fundedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  fundedText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyTypeTag: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  propertyInfo: {
    padding: 14,
  },
  propertyName: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  propertyLocation: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  propertyYieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldHighlight: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },
  minInvestment: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
