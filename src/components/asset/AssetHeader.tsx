import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
};

const ArrowLeftIcon = ({ size = 20, color = PALETTE.textMain }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);
const ShareIcon = ({ size = 18, color = PALETTE.textMain }) => (
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
    <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);
const BookmarkIcon = ({ size = 18, color = PALETTE.textMain }) => (
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
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </Svg>
);
const MapPinIcon = ({ size = 14, color = PALETTE.accent }) => (
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
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);
const StarIcon = ({ size = 12, color = PALETTE.accentText }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="1"
  >
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

interface AssetHeaderProps {
  property: any;
  currentDisplayImage: string;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  isBookmarked: boolean;
  setIsBookmarked: (val: boolean) => void;
  onBack: () => void;
  onShare: () => void;
  topInset: number;
}

export const AssetHeader = ({
  property,
  currentDisplayImage,
  activeImageIndex,
  setActiveImageIndex,
  isBookmarked,
  setIsBookmarked,
  onBack,
  onShare,
  topInset,
}: AssetHeaderProps) => {
  return (
    <>
      <ImageBackground
        source={{ uri: currentDisplayImage }}
        style={styles.heroImage}
        imageStyle={styles.heroImageStyle}
      >
        <View style={styles.imageOverlayGradient} />

        <View style={[styles.floatingHeader, { marginTop: topInset + 10 }]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon />
          </TouchableOpacity>

          <View style={styles.headerActionsRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onShare}
              activeOpacity={0.7}
            >
              <ShareIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconButton,
                isBookmarked && styles.iconButtonActive,
              ]}
              onPress={() => setIsBookmarked(!isBookmarked)}
              activeOpacity={0.7}
            >
              <BookmarkIcon
                color={isBookmarked ? PALETTE.accent : PALETTE.textMain}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.titleOverlaySection}>
          <View style={styles.tagRow}>
            <View style={styles.tagPill}>
              <StarIcon />
              <Text style={styles.tagText}>Remzik Verified RWA</Text>
            </View>
            <View style={styles.symbolPill}>
              <Text style={styles.symbolText}>{property.symbol}</Text>
            </View>
          </View>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <TouchableOpacity style={styles.locationRow} activeOpacity={0.8}>
            <MapPinIcon />
            <Text style={styles.propertyLocation}>{property.location}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {property.galleryImages.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailScroll}
        >
          {property.galleryImages.map((img: string, index: number) => {
            const isActive = activeImageIndex === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => setActiveImageIndex(index)}
              >
                <ImageBackground
                  source={{ uri: img }}
                  style={[
                    styles.thumbnailPreview,
                    isActive && styles.thumbnailPreviewActive,
                  ]}
                >
                  <View style={styles.thumbnailOverlay} />
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 340,
    justifyContent: 'space-between',
    paddingBottom: 24,
    position: 'relative',
  },
  heroImageStyle: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  imageOverlayGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 12, 10, 0.5)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerActionsRight: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 12, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconButtonActive: {
    borderColor: PALETTE.accent,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
  },
  titleOverlaySection: { paddingHorizontal: 20, zIndex: 2 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  tagText: {
    color: PALETTE.accentText,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  symbolPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  symbolText: {
    color: PALETTE.textMain,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  propertyTitle: {
    color: PALETTE.textMain,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  propertyLocation: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  thumbnailScroll: { paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  thumbnailPreview: {
    width: 64,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  thumbnailPreviewActive: { borderColor: PALETTE.accent, borderWidth: 2 },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
