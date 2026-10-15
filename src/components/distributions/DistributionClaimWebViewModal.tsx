// src/components/distributions/DistributionClaimWebViewModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, { Path } from 'react-native-svg';

const CloseIcon = ({ size = 16, color = '#F0FDF4' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

interface DistributionClaimWebViewModalProps {
  visible: boolean;
  claimUrl: string;
  topInset: number;
  onClose: () => void;
  onWebViewMessage: (event: any) => void;
}

export const DistributionClaimWebViewModal = ({
  visible,
  claimUrl,
  topInset,
  onClose,
  onWebViewMessage,
}: DistributionClaimWebViewModalProps) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={[styles.webViewContainer, { paddingTop: topInset }]}>
      <View style={styles.webViewHeader}>
        <Text style={styles.webViewTitle}>Secure Signature & Claim Portal</Text>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <CloseIcon size={16} color="#F0FDF4" />
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: claimUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webViewLoader}>
            <ActivityIndicator size="large" color="#34D399" />
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        scrollEnabled={true}
        bounces={false}
        setSupportMultipleWindows={false}
        originWhitelist={[
          'https://*',
          'http://*',
          'http://localhost:*',
          'http://10.0.2.2:*',
        ]}
        style={styles.webView}
        containerStyle={styles.webView}
        onMessage={onWebViewMessage}
        injectedJavaScript={`
          (function() {
            window.notifyReactNative = function(type, payload) {
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
              }
            };
          })();
          true;
        `}
        onError={event =>
          Alert.alert(
            'Connection Error',
            `Unable to load sign portal: ${
              event.nativeEvent.description || 'Connection refused'
            }`,
          )
        }
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  webViewContainer: { flex: 1, backgroundColor: '#080C0A' },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#080C0A',
  },
  webViewTitle: { color: '#F0FDF4', fontSize: 15, fontWeight: '700' },
  webView: { flex: 1, backgroundColor: '#080C0A' },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080C0A',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#080C0A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
