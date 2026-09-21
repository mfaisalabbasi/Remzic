import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../../theme/colors';

const userInvestments = [
  {
    id: '1',
    title: 'Dubai Creek Residence',
    amount: '$ 8,450.00',
    returnRate: '+8.5%',
    isPositive: true,
  },
  {
    id: '2',
    title: 'Riyadh Business Tower',
    amount: '$ 6,320.00',
    returnRate: '+6.2%',
    isPositive: true,
  },
];

export const PortfolioScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Portfolio Value Summary Card */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
          <Text style={styles.portfolioAmount}>$ 24,680.50</Text>
          <View style={styles.growthBadge}>
            <Text style={styles.growthText}>📈 +12.4% (all time)</Text>
          </View>

          {/* Asset Allocation Breakdown Indicators */}
          <View style={styles.allocationContainer}>
            <View style={styles.allocationRow}>
              <View style={styles.allocationLabelGroup}>
                <View
                  style={[styles.dot, { backgroundColor: Colors.accent }]}
                />
                <Text style={styles.allocationLabel}>Real Estate Assets</Text>
              </View>
              <Text style={styles.allocationValue}>72%</Text>
            </View>

            <View style={styles.allocationRow}>
              <View style={styles.allocationLabelGroup}>
                <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                <Text style={styles.allocationLabel}>Cash Balance</Text>
              </View>
              <Text style={styles.allocationValue}>18%</Text>
            </View>

            <View style={styles.allocationRow}>
              <View style={styles.allocationLabelGroup}>
                <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.allocationLabel}>Other Assets</Text>
              </View>
              <Text style={styles.allocationValue}>10%</Text>
            </View>
          </View>
        </View>

        {/* Section Header: Your Investments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Investments</Text>
        </View>

        {/* Investments List */}
        {userInvestments.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.investmentCard}
            onPress={() => navigation.navigate('AssetDetails')}
          >
            <View style={styles.investmentThumbPlaceholder}>
              <Text style={styles.investmentThumbIcon}>🏢</Text>
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName}>{item.title}</Text>
              <Text style={styles.investmentAmount}>{item.amount}</Text>
            </View>
            <View style={styles.investmentReturnBox}>
              <Text style={styles.investmentReturnText}>{item.returnRate}</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  portfolioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  portfolioTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  portfolioAmount: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 8,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  growthText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '600',
  },
  allocationContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
    gap: 10,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocationLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allocationLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  allocationValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  investmentCard: {
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
  investmentThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  investmentThumbIcon: {
    fontSize: 18,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  investmentAmount: {
    color: '#94A3B8',
    fontSize: 12,
  },
  investmentReturnBox: {
    alignItems: 'flex-end',
  },
  investmentReturnText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '700',
  },
});
