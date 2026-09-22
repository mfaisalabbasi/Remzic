import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer simulation for initial setup (Token check, DB init, etc.)
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient Background Glow Layer */}
      <View style={styles.ambientGlowContainer} pointerEvents="none">
        <View style={styles.glowOrbPrimary} />
      </View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Logo Box */}
        <View style={styles.logoBox}>
          <View style={styles.logoInnerGlow} />
          <Text style={styles.logoText}>R</Text>
        </View>

        <Text style={styles.brandTitle}>REMZIK</Text>
        <Text style={styles.brandSubtitle}>Real-World Asset Protocol</Text>
      </Animated.View>

      <View style={styles.footerContainer}>
        <View style={styles.securityBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.securityText}>Secured & Encrypted</Text>
        </View>
        <Text style={styles.versionText}>v1.0.0-institutional</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  ambientGlowContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOrbPrimary: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(16, 185, 129, 0.07)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
  logoText: {
    color: '#34D399',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandTitle: {
    color: '#F0FDF4',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 6,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  securityText: {
    color: '#34D399',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  versionText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
});
