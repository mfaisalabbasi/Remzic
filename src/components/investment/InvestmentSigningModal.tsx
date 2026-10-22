// src/components/investment/InvestmentSigningModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface InvestmentSigningModalProps {
  isVisible: boolean;
  webViewUrl: string;
  webViewLoading: boolean;
  configuredWebHost: string;
  privyAccessToken?: string | null;
  onDismiss: () => void;
  onMessage: (event: any) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onFail: (message: string) => void;
  isAllowedWebViewUrl: (url: string, host: string) => boolean;
}

export const InvestmentSigningModal = ({
  isVisible,
  webViewUrl,
  webViewLoading,
  configuredWebHost,
  onDismiss,
  onMessage,
  onLoadStart,
  onLoadEnd,
  onFail,
  isAllowedWebViewUrl,
}: InvestmentSigningModalProps) => {
  const targetUrl = webViewUrl || '';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.webViewModalContainer}>
        <View style={styles.modalGrabberContainer}>
          <View style={styles.modalGrabberHandle} />
        </View>

        <View style={styles.webViewHeader}>
          <View style={styles.web3BadgeWrapper}>
            <View style={styles.liveIndicatorDot} />
            <Text style={styles.web3BadgeText}>SECURE ENCLAVE</Text>
          </View>

          <Text style={styles.webViewHeaderTitle}>Web3 Transaction Signer</Text>

          <TouchableOpacity
            onPress={onDismiss}
            style={styles.webViewCloseButton}
            activeOpacity={0.7}
          >
            <Text style={styles.webViewCloseText}>Dismiss</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.webViewWrapper}>
          {targetUrl ? (
            <WebView
              source={{ uri: targetUrl }}
              onMessage={onMessage}
              javaScriptEnabled={true}
              domStorageEnabled={false}
              sharedCookiesEnabled={false}
              thirdPartyCookiesEnabled={false}
              cacheEnabled={false}
              incognito={true}
              scrollEnabled={true}
              bounces={false}
              setSupportMultipleWindows={false}
              originWhitelist={[
                'https://*',
                'http://*',
                'http://localhost:*',
                'http://10.0.2.2:*',
                'http://192.168.1.239:*',
                'http://127.0.0.1:*',
              ]}
              style={styles.webView}
              containerStyle={styles.webView}
              onLoadStart={onLoadStart}
              onLoad={onLoadEnd}
              onLoadEnd={onLoadEnd}
              onError={event =>
                onFail(
                  `Unable to load signing service: ${
                    event.nativeEvent.description || 'Connection refused'
                  }`,
                )
              }
              onHttpError={event =>
                onFail(
                  `Secure signing service returned HTTP ${event.nativeEvent.statusCode}.`,
                )
              }
              onShouldStartLoadWithRequest={request => {
                const url = request?.url || '';
                if (url.startsWith('about:blank') || url.startsWith('data:')) {
                  return true;
                }
                return isAllowedWebViewUrl(url, configuredWebHost);
              }}
            />
          ) : null}

          {webViewLoading && (
            <View pointerEvents="none" style={styles.webViewLoadingOverlay}>
              <ActivityIndicator size="large" color="#34D399" />
              <Text style={styles.webViewLoadingText}>
                Establishing secure signing session...
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  webViewModalContainer: { flex: 1, backgroundColor: '#080C0A' },
  modalGrabberContainer: { alignItems: 'center', paddingVertical: 10 },
  modalGrabberHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2A3B35',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#111816',
  },
  web3BadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  web3BadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  webViewHeaderTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  webViewCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  webViewCloseText: { color: '#94A3B8', fontWeight: '700', fontSize: 12 },
  webViewWrapper: { flex: 1, backgroundColor: '#080C0A', position: 'relative' },
  webView: { flex: 1, backgroundColor: '#080C0A' },
  webViewLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080C0A',
    zIndex: 20,
  },
  webViewLoadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
});
