import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

const distributionTabs = ['Upcoming', 'Processing', 'Paid'];

const distributionsList = [
  {
    id: '1',
    title: 'Dubai Creek Residence',
    date: 'Q2 2025 • Apr 30, 2025',
    amount: '$85.00',
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Riyadh Business Tower',
    date: 'Q1 2025 • Mar 15, 2025',
    amount: '$120.00',
    status: 'Paid',
  },
  {
    id: '3',
    title: 'London City Apartments',
    date: 'Q1 2025 • Mar 10, 2025',
    amount: '$65.00',
    status: 'Paid',
  },
];

export const DistributionsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<
    'Upcoming' | 'Processing' | 'Paid'
  >('Upcoming');

  const filteredDistributions = distributionsList.filter(item => {
    if (selectedTab === 'Upcoming') return item.status === 'Upcoming';
    if (selectedTab === 'Processing') return item.status === 'Processing';
    return item.status === 'Paid';
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Distributions</Text>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={styles.segmentContainer}>
        {distributionTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.segmentButton,
              selectedTab === tab && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedTab(tab as any)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedTab === tab && styles.segmentTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Distributions Cards List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredDistributions.length > 0 ? (
          filteredDistributions.map(item => (
            <View key={item.id} style={styles.distributionCard}>
              <View style={styles.distributionThumbPlaceholder}>
                <Text style={styles.distributionThumbIcon}>🏢</Text>
              </View>
              <View style={styles.distributionInfo}>
                <Text style={styles.distributionTitle}>{item.title}</Text>
                <Text style={styles.distributionDate}>{item.date}</Text>
                <Text style={styles.distributionNet}>Net Distribution</Text>
              </View>
              <View style={styles.distributionRightBox}>
                <Text style={styles.distributionAmount}>{item.amount}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === 'Paid'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(234, 179, 8, 0.15)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: item.status === 'Paid' ? '#22C55E' : '#EAB308',
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No distributions found in this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  distributionCard: {
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
  distributionThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distributionThumbIcon: {
    fontSize: 20,
  },
  distributionInfo: {
    flex: 1,
  },
  distributionTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  distributionDate: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
  },
  distributionNet: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  distributionRightBox: {
    alignItems: 'flex-end',
  },
  distributionAmount: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
