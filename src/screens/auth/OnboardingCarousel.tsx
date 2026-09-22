import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Real Assets. Real Ownership.',
    subtitle: 'Shariah-Compliant RWA',
    description:
      'Invest in premium, vetted real estate properties with absolute legal ownership and total transparency.',
    badge: 'SECURE & VERIFIED',
    metric: '100% Asset-Backed',
  },
  {
    id: '2',
    title: 'Earn Consistent Yields',
    subtitle: 'Automated Distributions',
    description:
      'Receive regular rental income and capital appreciation directly into your portfolio dashboard.',
    badge: 'STABLE RETURNS',
    metric: '8.4% - 11.2% APY',
  },
  {
    id: '3',
    title: 'Global Fintech Security',
    subtitle: 'Web2 Speed, Web3 Trust',
    description:
      'Powered by advanced institutional infrastructure, smart contract settlement, and bank-grade session protection.',
    badge: 'INSTITUTIONAL GRADE',
    metric: 'ERC-3643 Standard',
  },
];

export const OnboardingCarousel = ({ navigation }: { navigation: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < slides.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Login', { mode: 'signup' });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient Background Glow Layer */}
      <View style={styles.ambientGlowContainer} pointerEvents="none">
        <View style={styles.glowOrbPrimary} />
        <View style={styles.glowOrbSecondary} />
      </View>

      {/* Top Header / Skip Option */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <View style={styles.logoInnerGlow} />
          <Text style={styles.logoText}>R</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.replace('Login', { mode: 'signup' })}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel Slider */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]} key={item.id}>
            {/* Visual Abstract Card Mockup matching fintech standard */}
            <View style={styles.visualCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardBadgeContainer}>
                  <Text style={styles.cardBadgeText}>{item.badge}</Text>
                </View>
                <View style={styles.liveIndicatorBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveIndicatorText}>Live Feed</Text>
                </View>
              </View>

              <View style={styles.mockupGraphic}>
                <View style={styles.iconContainer}>
                  <Text style={styles.mockupSymbol}>🏛️</Text>
                </View>
                <Text style={styles.mockupTitle}>Remzik Protocol</Text>
                <Text style={styles.mockupSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.cardFooterMetric}>
                <Text style={styles.metricTitleLabel}>Benchmark Indicator</Text>
                <Text style={styles.metricTitleValue}>{item.metric}</Text>
              </View>
            </View>

            {/* Text Copy Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer Controls (Pagination Dots & Next Button) */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <View style={styles.arrowIconCircle}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
    justifyContent: 'space-between',
  },
  ambientGlowContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glowOrbPrimary: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  glowOrbSecondary: {
    position: 'absolute',
    bottom: 60,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  logoText: {
    color: '#34D399',
    fontSize: 20,
    fontWeight: '800',
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualCard: {
    backgroundColor: '#111816',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    height: 310,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBadgeContainer: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  cardBadgeText: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34D399',
  },
  liveIndicatorText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600',
  },
  mockupGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#080C0A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 12,
  },
  mockupSymbol: {
    fontSize: 30,
  },
  mockupTitle: {
    color: '#F0FDF4',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  mockupSubtitle: {
    color: '#34D399',
    fontSize: 12.5,
    fontWeight: '600',
  },
  cardFooterMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#080C0A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
  },
  metricTitleLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  metricTitleValue: {
    color: '#F0FDF4',
    fontSize: 12.5,
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: '#F0FDF4',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  description: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    gap: 18,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    width: 22,
    backgroundColor: '#34D399',
  },
  primaryButton: {
    backgroundColor: '#34D399',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#080C0A',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  arrowIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8, 12, 10, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#080C0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
