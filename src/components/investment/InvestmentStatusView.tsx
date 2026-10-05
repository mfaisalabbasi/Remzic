import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Status = 'PROCESSING' | 'CONFIRMED' | 'FAILED';

interface InvestmentStatusViewProps {
  status: Status;
  message?: string;
  onRetry?: () => void;
  onDone?: () => void;
}

export default function InvestmentStatusView({
  status,
  message,
  onRetry,
  onDone,
}: InvestmentStatusViewProps) {
  if (status === 'PROCESSING') {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <ActivityIndicator size="large" color="#B38A3D" />
        </View>

        <Text style={styles.title}>Processing Investment</Text>

        <Text style={styles.message}>
          {message ||
            'Your investment is being processed. Please do not close the app.'}
        </Text>
      </View>
    );
  }

  if (status === 'CONFIRMED') {
    return (
      <View style={styles.container}>
        <View style={[styles.iconCircle, styles.successCircle]}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Investment Confirmed</Text>

        <Text style={styles.message}>
          {message || 'Your investment has been successfully confirmed.'}
        </Text>

        {onDone && (
          <Pressable style={styles.primaryButton} onPress={onDone}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, styles.errorCircle]}>
        <Text style={styles.errorIcon}>!</Text>
      </View>

      <Text style={styles.title}>Investment Failed</Text>

      <Text style={styles.message}>
        {message || 'We could not complete your investment.'}
      </Text>

      {onRetry && (
        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F7F9F8',
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EFE6',
    marginBottom: 24,
  },
  successCircle: {
    backgroundColor: '#E5F1EB',
  },
  errorCircle: {
    backgroundColor: '#F7E7E5',
  },
  successIcon: {
    fontSize: 38,
    fontWeight: '700',
    color: '#2D7657',
  },
  errorIcon: {
    fontSize: 34,
    fontWeight: '700',
    color: '#B94A48',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#102A24',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: '#69736F',
    textAlign: 'center',
    maxWidth: 340,
  },
  primaryButton: {
    marginTop: 28,
    minWidth: 180,
    height: 50,
    borderRadius: 13,
    backgroundColor: '#123C32',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
