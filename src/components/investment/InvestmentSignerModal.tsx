import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface InvestmentSignerModalProps {
  visible: boolean;
  url: string | null;
  loading: boolean;
  onMessage: (event: WebViewMessageEvent) => void;
  onDismiss: () => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onError: () => void;
  onHttpError: () => void;
  onShouldStartLoadWithRequest: (request: { url: string }) => boolean;
}

export default function InvestmentSignerModal({
  visible,
  url,
  loading,
  onMessage,
  onDismiss,
  onLoadStart,
  onLoadEnd,
  onError,
  onHttpError,
  onShouldStartLoadWithRequest,
}: InvestmentSignerModalProps) {
  if (!url) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Secure Wallet Signing</Text>
            <Text style={styles.subtitle}>
              Confirm this transaction with your wallet
            </Text>
          </View>

          <Pressable
            onPress={onDismiss}
            hitSlop={12}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: url }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['https://*', 'http://*']}
            onMessage={onMessage}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={onError}
            onHttpError={onHttpError}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            style={styles.webView}
          />

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#B38A3D" />
              <Text style={styles.loadingText}>Opening secure signing...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F8',
  },
  header: {
    minHeight: 76,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDE3E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#102A24',
  },
  subtitle: {
    fontSize: 11,
    color: '#737D79',
    marginTop: 3,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 27,
    lineHeight: 30,
    color: '#40504A',
    fontWeight: '300',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#69736F',
  },
});
