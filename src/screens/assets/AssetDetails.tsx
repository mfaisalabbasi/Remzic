import React from 'react';
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

export const AssetDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const insets = useSafeAreaInsets();

  // Fallback property data if navigated without direct route params
  const property = route?.params?.property || {
    title: 'Dubai Creek Residence',
    location: 'Dubai, UAE',
    yield: '8.5% expected yield',
    minInvestment: '$500',
    investmentPeriod: '3 Years',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.headerActionIcon}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.headerActionIcon}>🔖</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Box / Carousel Placeholder */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            Dubai Creek Residence Hero View
          </Text>
        </View>

        {/* Title & Location Section */}
        <View style={styles.titleSection}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyLocation}>📍 {property.location}</Text>
        </View>

        {/* Financial Highlights Bar */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📈</Text>
            <Text style={styles.metricLabel}>Expected Yield</Text>
            <Text style={styles.metricValue}>8.5%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⏳</Text>
            <Text style={styles.metricLabel}>Investment Period</Text>
            <Text style={styles.metricValue}>3 Years</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>💵</Text>
            <Text style={styles.metricLabel}>Min. Investment</Text>
            <Text style={styles.metricValue}>$500</Text>
          </View>
        </View>

        {/* Property Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <Text style={styles.sectionBody}>
            Premium residential project located in the heart of Dubai Creek with
            strong rental demand and long-term growth potential. Fully tokenized
            and Shariah-compliant.
          </Text>
        </View>

        {/* Document Viewer Button Link */}
        <TouchableOpacity
          style={styles.documentsButton}
          onPress={() => {
            // Handle viewing legal documents / whitepapers
          }}
        >
          <Text style={styles.documentsButtonText}>
            📄 View Documents & Legal Info
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Bottom Actions Container */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.investNowButton}
          onPress={() => navigation.navigate('InvestmentFlow', { property })}
        >
          <Text style={styles.investNowButtonText}>Invest Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerActionIcon: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  imagePlaceholderText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  titleSection: {
    marginBottom: 16,
  },
  propertyTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  propertyLocation: {
    color: '#94A3B8',
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
  },
  documentsButton: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  documentsButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  footerContainer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  investNowButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  investNowButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
