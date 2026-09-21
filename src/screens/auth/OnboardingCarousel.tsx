import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Real Assets. Real Ownership.',
    subtitle: 'Shariah-Compliant RWA',
    description:
      'Invest in premium, vetted real estate properties with absolute legal ownership and total transparency.',
    badge: 'SECURE & VERIFIED',
  },
  {
    id: '2',
    title: 'Earn Consistent Yields',
    subtitle: 'Automated Distributions',
    description:
      'Receive regular rental income and capital appreciation directly into your portfolio dashboard.',
    badge: 'STABLE RETURNS',
  },
  {
    id: '3',
    title: 'Global Fintech Security',
    subtitle: 'Web2 Speed, Web3 Trust',
    description:
      'Powered by advanced institutional infrastructure, smart contract settlement, and bank-grade session protection.',
    badge: 'INSTITUTIONAL GRADE',
  },
];

export const OnboardingCarousel = ({ navigation }: { navigation: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to Login/Signup screen in signup mode
      navigation.replace('Login', { mode: 'signup' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed: Removed unsupported backgroundColor prop for cross-platform safety */}
      <StatusBar barStyle="light-content" />

      {/* Top Header / Skip Option */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.replace('Login', { mode: 'signup' })}
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
        onScroll={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]} key={item.id}>
            {/* Visual Abstract Card Mockup matching the UI design */}
            <View style={styles.visualCard}>
              <View style={styles.cardBadgeContainer}>
                <Text style={styles.cardBadgeText}>{item.badge}</Text>
              </View>
              <View style={styles.mockupGraphic}>
                <Text style={styles.mockupSymbol}>🏢</Text>
                <Text style={styles.mockupTitle}>Remzik RWA Protocol</Text>
                <Text style={styles.mockupSubtitle}>{item.subtitle}</Text>
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

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  logoText: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  visualCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    padding: 24,
    height: 320,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  cardBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  mockupGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupSymbol: {
    fontSize: 48,
    marginBottom: 12,
  },
  mockupTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  mockupSubtitle: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#94A3B8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.accent,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
