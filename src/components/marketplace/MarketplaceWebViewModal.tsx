// src/components/marketplace/MarketplaceWebViewModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import WebView from 'react-native-webview';

const PALETTE = {
  bg: '#080C0A',
  cardBg: '#111816',
  cardAlt: '#151D1B',
  textMain: '#F9FAFB',
  border: 'rgba(52, 211, 153, 0.15)',
};

interface MarketplaceWebViewModalProps {
  webViewUrl: string | null;
  topInset: number;
  onClose: () => void;
  onMessage: (event: any) => void;
}

export const MarketplaceWebViewModal = ({
  webViewUrl,
  topInset,
  onClose,
  onMessage,
}: MarketplaceWebViewModalProps) => (
  <Modal
    visible={Boolean(webViewUrl)}
    animationType="slide"
    transparent={false}
  >
    <View
      style={{
        flex: 1,
        backgroundColor: PALETTE.bg,
        paddingTop: Math.max(topInset, 16),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: PALETTE.border,
          backgroundColor: PALETTE.cardBg,
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: PALETTE.cardAlt,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: PALETTE.border,
          }}
        >
          <Text
            style={{
              color: PALETTE.textMain,
              fontSize: 13,
              fontWeight: '700',
            }}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: PALETTE.textMain,
            fontSize: 15,
            fontWeight: '700',
          }}
        >
          Secure Enclave Signing
        </Text>

        <View style={{ width: 50 }} />
      </View>

      {webViewUrl && (
        <WebView
          source={{ uri: webViewUrl }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </View>
  </Modal>
);
