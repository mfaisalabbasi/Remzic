import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert as RNAlert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { Colors } from '../../theme/colors';
import { investmentApi } from '../../services/api/investmentApi';

type FlowState = 'IDLE' | 'SUBMITTING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';

type SettlementMode = 'OFF_CHAIN' | 'ON_CHAIN';

interface InvestmentProperty {
  id?: string;
  assetId?: string;
  title?: string;
  tokenPrice?: number | string;
  unitPrice?: number | string;
  minInvestmentValue?: number | string;
  yield?: number | string;
  yieldRate?: number | string;
  availableShares?: number | string;
}

interface InvestmentRouteParams {
  property?: InvestmentProperty;
  tokenCount?: number;
}

interface Web3TransactionPayload {
  to: string;
  data?: string;
  value?: string;
  chainId?: number | string;
}

interface InvestmentIntentResponse {
  success?: boolean;
  investmentId: string;
  txPayload: Web3TransactionPayload;
  expectedWalletAddress?: string;
}

interface InvestmentCreateResponse {
  id?: string;
  investmentId?: string;
  status?: string;
  message?: string;
}

interface InvestmentStatusResponse {
  status?: string;
  message?: string;
}

interface WebViewBridgeMessage {
  type?: string;
  txHash?: string;
  error?: string;
  investmentId?: string;
}

const getConfiguredWebUrl = (): string | undefined => {
  try {
    const value = (globalThis as any)?.process?.env?.EXPO_PUBLIC_WEB_URL;

    if (typeof value === 'string' && value.trim()) {
      return value.trim().replace(/\/+$/, '');
    }
  } catch {}

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';
  }

  return undefined;
};

const getNextJsHost = (): string => {
  const configured = getConfiguredWebUrl();

  if (configured) {
    return configured;
  }

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';
  }

  throw new Error('Remzik Web signing URL is not configured for production.');
};

const isValidWalletAddress = (value?: string | null): value is string =>
  /^0x[a-fA-F0-9]{40}$/.test(value?.trim() || '');

const normalizeWalletAddress = (value?: string | null): string =>
  isValidWalletAddress(value) ? value.trim().toLowerCase() : '';

const isValidInvestmentId = (value?: string | null): value is string =>
  Boolean(value?.trim());

const isValidTxHash = (value?: string | null): boolean =>
  /^0x[a-fA-F0-9]{64}$/.test(value?.trim() || '');

const isValidHexData = (value?: string | null): boolean =>
  typeof value === 'string' && /^0x[0-9a-fA-F]*$/.test(value);

const isValidContractAddress = (value?: string | null): boolean =>
  isValidWalletAddress(value);

const normalizeChainId = (value?: number | string | null): number | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numberValue = typeof value === 'number' ? value : Number(value);

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const typed = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  const message = typed?.response?.data?.message;

  if (Array.isArray(message) && message.length) {
    return message.join(', ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  if (typeof typed?.message === 'string' && typed.message.trim()) {
    return typed.message.trim();
  }

  return fallback;
};

const isAllowedWebViewUrl = (url: string, configuredHost: string): boolean => {
  try {
    const target = new URL(url);
    const configured = new URL(configuredHost);

    if (
      target.protocol === configured.protocol &&
      target.hostname === configured.hostname &&
      (target.port || (target.protocol === 'https:' ? '443' : '80')) ===
        (configured.port || (configured.protocol === 'https:' ? '443' : '80'))
    ) {
      return true;
    }

    if (target.protocol !== 'https:') {
      if (
        typeof __DEV__ !== 'undefined' &&
        __DEV__ &&
        target.protocol === 'http:' &&
        ['localhost', '10.0.2.2', '192.168.1.239'].includes(target.hostname)
      ) {
        return true;
      }

      return false;
    }

    return (
      target.hostname === 'privy.io' ||
      target.hostname.endsWith('.privy.io') ||
      target.hostname === 'privy.tech' ||
      target.hostname.endsWith('.privy.tech')
    );
  } catch {
    return false;
  }
};

export const InvestmentFlowScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params?: InvestmentRouteParams;
  };
}) => {
  const insets = useSafeAreaInsets();

  const mountedRef = useRef(true);
  const investmentIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const pollingGenerationRef = useRef(0);
  const webViewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [webViewLoading, setWebViewLoading] = useState(false);

  const [settlementMode, setSettlementMode] =
    useState<SettlementMode>('OFF_CHAIN');

  const [flowState, setFlowState] = useState<FlowState>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  const rawProperty = route?.params?.property || {};
  const assetId = rawProperty.id || rawProperty.assetId;
  const tokenCount = route?.params?.tokenCount;

  const tokenPriceRaw = rawProperty.tokenPrice ?? rawProperty.unitPrice ?? 10;
  const tokenPrice = Number(tokenPriceRaw);

  const minimumRaw = rawProperty.minInvestmentValue ?? tokenPrice;
  const minimumInvestment = Number(minimumRaw);

  const yieldRaw = rawProperty.yield ?? rawProperty.yieldRate ?? 8.5;

  const yieldRate =
    typeof yieldRaw === 'string'
      ? parseFloat(yieldRaw.replace('%', '')) / 100
      : Number(yieldRaw) > 1
      ? Number(yieldRaw) / 100
      : Number(yieldRaw);

  const property = {
    title: rawProperty.title || 'Dubai Creek Harbour Residences',
    tokenPrice: Number.isFinite(tokenPrice) && tokenPrice > 0 ? tokenPrice : 10,
    minInvestment:
      Number.isFinite(minimumInvestment) && minimumInvestment > 0
        ? minimumInvestment
        : Number.isFinite(tokenPrice) && tokenPrice > 0
        ? tokenPrice
        : 10,
    yieldRate: Number.isFinite(yieldRate) && yieldRate >= 0 ? yieldRate : 0.085,
  };

  const initialAmount =
    tokenCount && Number.isFinite(Number(tokenCount)) && Number(tokenCount) > 0
      ? (Number(tokenCount) * property.tokenPrice).toString()
      : property.minInvestment.toString();

  const [amount, setAmount] = useState(initialAmount);

  const numericAmount = Number.parseFloat(amount) || 0;

  const estimatedTokens =
    property.tokenPrice > 0
      ? (numericAmount / property.tokenPrice).toFixed(2)
      : '0.00';

  const estimatedYieldAnnual = (numericAmount * property.yieldRate).toFixed(2);

  const totalUnitsAvailable = rawProperty.availableShares ?? '12,500';

  const presetAmounts = [
    property.minInvestment,
    property.minInvestment * 5,
    property.minInvestment * 10,
    property.minInvestment * 50,
  ];

  const configuredWebHost = getNextJsHost();

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      pollingGenerationRef.current += 1;

      if (webViewTimeoutRef.current) {
        clearTimeout(webViewTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const nextTokenCount = route?.params?.tokenCount;

    setAmount(
      nextTokenCount &&
        Number.isFinite(Number(nextTokenCount)) &&
        Number(nextTokenCount) > 0
        ? (Number(nextTokenCount) * property.tokenPrice).toString()
        : property.minInvestment.toString(),
    );
  }, [route?.params?.tokenCount, property.minInvestment, property.tokenPrice]);

  const setSafeFlowState = useCallback((state: FlowState) => {
    if (mountedRef.current) {
      setFlowState(state);
    }
  }, []);

  const setSafeStatus = useCallback((message: string) => {
    if (mountedRef.current) {
      setStatusMessage(message);
    }
  }, []);

  const cancelPolling = useCallback(() => {
    pollingGenerationRef.current += 1;
  }, []);

  const clearWebViewTimeout = useCallback(() => {
    if (webViewTimeoutRef.current) {
      clearTimeout(webViewTimeoutRef.current);
      webViewTimeoutRef.current = null;
    }
  }, []);

  const failWebView = useCallback(
    (message: string) => {
      clearWebViewTimeout();
      setWebViewLoading(false);
      setIsWebViewVisible(false);
      setSafeFlowState('FAILED');
      setSafeStatus(message);
    },
    [clearWebViewTimeout, setSafeFlowState, setSafeStatus],
  );

  const startWebViewTimeout = useCallback(() => {
    clearWebViewTimeout();

    webViewTimeoutRef.current = setTimeout(() => {
      failWebView(
        'The secure signing service took too long to load. Please try again.',
      );
    }, 30000);
  }, [clearWebViewTimeout, failWebView]);

  const handleLoadEnd = useCallback(() => {
    clearWebViewTimeout();
    setWebViewLoading(false);
  }, [clearWebViewTimeout]);

  const pollInvestmentStatus = useCallback(
    async (investmentId: string) => {
      if (!isValidInvestmentId(investmentId)) {
        setSafeFlowState('FAILED');
        setSafeStatus(
          'Missing investment identifier. The transaction cannot be finalized safely.',
        );
        return;
      }

      const generation = ++pollingGenerationRef.current;

      for (let attempt = 0; attempt < 30; attempt += 1) {
        if (
          !mountedRef.current ||
          pollingGenerationRef.current !== generation
        ) {
          return;
        }

        try {
          const response = (await investmentApi.getLiveStatus(
            investmentId,
          )) as InvestmentStatusResponse;

          if (
            !mountedRef.current ||
            pollingGenerationRef.current !== generation
          ) {
            return;
          }

          // Extract status safely from any response variation
          const rawStatus =
            response?.status ||
            (response as any)?.data?.status ||
            (response as any)?.investment?.status;

          const status =
            typeof rawStatus === 'string' ? rawStatus.toUpperCase().trim() : '';

          console.log(`Polling attempt ${attempt + 1}: Status = ${status}`);

          if (['CONFIRMED', 'SUCCESS', 'COMPLETED'].includes(status)) {
            setSafeFlowState('CONFIRMED');
            setSafeStatus('Your investment has been confirmed by Remzik.');
            return;
          }

          if (status === 'FAILED') {
            setSafeFlowState('FAILED');
            setSafeStatus(
              response.message ||
                'Investment processing failed during backend verification.',
            );
            return;
          }

          setSafeFlowState('PROCESSING');
          setSafeStatus('Investment is being verified on the blockchain...');
        } catch (err) {
          console.log('Polling error:', err);
          setSafeFlowState('PROCESSING');
          setSafeStatus(
            'Investment is still being verified. Remzik will continue checking the blockchain...',
          );
        }

        if (attempt < 29) {
          await new Promise<void>(resolve => setTimeout(resolve, 3000));
        }
      }

      if (mountedRef.current && pollingGenerationRef.current === generation) {
        setSafeFlowState('PROCESSING');
        setSafeStatus(
          'Verification is taking longer than expected. Your investment remains under processing.',
        );
      }
    },
    [setSafeFlowState, setSafeStatus],
  );
  const startOnChainInvestment = useCallback(async () => {
    setSafeStatus('Generating secure transaction intent from Remzik...');

    const request = {
      assetId: assetId || '',
      amount: numericAmount,
      settlementMode: 'ON_CHAIN' as const,
    };

    const intent = (await Promise.race([
      investmentApi.createInvestmentIntent(request),
      new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'Investment intent request timed out. Please try again.',
              ),
            ),
          15000,
        ),
      ),
    ])) as any;

    if (!intent || !isValidInvestmentId(intent.investmentId)) {
      throw new Error(
        'The backend did not return a valid investment identifier.',
      );
    }

    if (!intent.txPayload || typeof intent.txPayload !== 'object') {
      throw new Error(
        'The backend did not return a valid transaction payload.',
      );
    }

    if (!isValidContractAddress(intent.txPayload.to)) {
      throw new Error('The backend returned an invalid transaction target.');
    }

    if (
      intent.txPayload.data !== undefined &&
      !isValidHexData(intent.txPayload.data)
    ) {
      throw new Error('The backend returned invalid transaction calldata.');
    }

    if (
      intent.txPayload.value !== undefined &&
      typeof intent.txPayload.value !== 'string'
    ) {
      throw new Error('The backend returned an invalid transaction value.');
    }

    if (intent.txPayload.chainId !== undefined) {
      if (!normalizeChainId(intent.txPayload.chainId)) {
        throw new Error('The backend returned an invalid blockchain chain ID.');
      }
    }

    investmentIdRef.current = intent.investmentId;

    // Bundle both the approval payload and deposit transaction payload for the Next.js sign page
    const payloadData = {
      approvalPayload: intent.approvalPayload || null,
      txPayload: intent.txPayload,
      expectedStablecoinAddress: intent.expectedStablecoinAddress,
      expectedStablecoinAmount: intent.expectedStablecoinAmount,
      expectedVaultAddress: intent.txPayload.to,
    };

    const payload = encodeURIComponent(JSON.stringify(payloadData));

    const expectedWallet = normalizeWalletAddress(intent.expectedWalletAddress);

    const walletParam = expectedWallet
      ? `&walletAddress=${encodeURIComponent(expectedWallet)}`
      : '';

    // Added autoAuth=true to bypass the login modal inside the WebView
    const targetUrl =
      `${getNextJsHost()}/investor/sign` +
      `?payload=${payload}` +
      `&investmentId=${encodeURIComponent(intent.investmentId)}` +
      walletParam +
      `&autoAuth=true`;

    if (!mountedRef.current) {
      return;
    }

    setWebViewUrl(targetUrl);
    setWebViewLoading(true);
    setIsWebViewVisible(true);
    setSafeFlowState('IDLE');
    setSafeStatus(
      'Review the transaction and authorize it with your Privy wallet.',
    );

    startWebViewTimeout();
  }, [
    assetId,
    numericAmount,
    setSafeFlowState,
    setSafeStatus,
    startWebViewTimeout,
  ]);
  const startOffChainInvestment = useCallback(async () => {
    setSafeStatus('Validating and submitting internal balance allocation...');

    const result = (await investmentApi.createInvestment({
      assetId: assetId || '',
      amount: numericAmount,
      settlementMode: 'OFF_CHAIN' as const,
    })) as InvestmentCreateResponse;

    if (result?.status?.toUpperCase() === 'CONFIRMED') {
      setSafeFlowState('CONFIRMED');
      setSafeStatus('Your investment has been confirmed.');
      return;
    }

    const investmentId = result?.id || result?.investmentId;

    if (!isValidInvestmentId(investmentId)) {
      throw new Error(
        'The backend did not return a valid investment identifier.',
      );
    }

    investmentIdRef.current = investmentId;

    setSafeFlowState('PROCESSING');
    setSafeStatus(
      'Your investment is being secured and processed through the Remzik ledger...',
    );

    await pollInvestmentStatus(investmentId);
  }, [
    assetId,
    numericAmount,
    pollInvestmentStatus,
    setSafeFlowState,
    setSafeStatus,
  ]);

  const handleConfirmInvestment = useCallback(async () => {
    if (submittingRef.current) {
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      RNAlert.alert(
        'Invalid Allocation',
        'Please enter a valid investment amount.',
      );
      return;
    }

    if (numericAmount < property.minInvestment) {
      RNAlert.alert(
        'Invalid Allocation',
        `The minimum investment threshold for this asset is $${property.minInvestment}.`,
      );
      return;
    }

    if (!assetId) {
      RNAlert.alert('Error', 'Missing target asset identifier.');
      return;
    }

    submittingRef.current = true;
    cancelPolling();

    try {
      setSafeFlowState('SUBMITTING');

      if (settlementMode === 'ON_CHAIN') {
        await startOnChainInvestment();
      } else {
        await startOffChainInvestment();
      }
    } catch (error) {
      setSafeFlowState('FAILED');
      setSafeStatus(
        getErrorMessage(error, 'Failed to create investment request.'),
      );
    } finally {
      submittingRef.current = false;
    }
  }, [
    assetId,
    cancelPolling,
    numericAmount,
    property.minInvestment,
    settlementMode,
    setSafeFlowState,
    setSafeStatus,
    startOffChainInvestment,
    startOnChainInvestment,
  ]);

  const handleWebViewMessage = useCallback(
    async (event: {
      nativeEvent?: {
        data?: string;
      };
    }) => {
      try {
        const raw = event.nativeEvent?.data;

        if (!raw?.trim()) {
          return;
        }

        let data: WebViewBridgeMessage;

        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        const investmentId = investmentIdRef.current;

        if (!isValidInvestmentId(investmentId)) {
          return;
        }

        if (data.type === 'TX_SUCCESS' || data.type === 'TX_FAILED') {
          if (data.investmentId !== investmentId) {
            failWebView(
              'The signing session returned an invalid investment identifier.',
            );
            return;
          }
        }

        if (data.type === 'TX_SUCCESS') {
          if (typeof data.txHash !== 'string') {
            failWebView(
              'The signing service returned an invalid transaction hash.',
            );
            return;
          }

          const txHash = data.txHash.trim();

          if (!isValidTxHash(txHash)) {
            failWebView(
              'The signing service returned an invalid transaction hash.',
            );
            return;
          }

          clearWebViewTimeout();
          setWebViewLoading(false);
          setIsWebViewVisible(false);
          setSafeFlowState('PROCESSING');
          setSafeStatus(
            'Transaction broadcasted. Remzik is verifying the blockchain transaction...',
          );

          try {
            // 🚀 Explicitly register the txHash with the backend record first
            await investmentApi.verifyInvestmentTransaction(
              investmentId,
              txHash,
            );
          } catch (err) {
            console.log('Initial transaction submission notice:', err);
          }

          // Then kick off polling for confirmation status update
          await pollInvestmentStatus(investmentId);
          return;
        }

        if (data.type === 'TX_FAILED') {
          failWebView(
            data.error ||
              'The transaction was rejected or could not be submitted.',
          );
        }
      } catch {
        failWebView(
          'Invalid response received from the secure signing session.',
        );
      }
    },
    [
      clearWebViewTimeout,
      failWebView,
      pollInvestmentStatus,
      setSafeFlowState,
      setSafeStatus,
    ],
  );

  const handleDismissWebView = useCallback(() => {
    clearWebViewTimeout();
    setWebViewLoading(false);
    setIsWebViewVisible(false);

    if (isValidInvestmentId(investmentIdRef.current)) {
      setSafeStatus(
        'Signing session dismissed. The investment has not been confirmed.',
      );
    } else {
      setSafeStatus('');
    }

    setSafeFlowState('IDLE');
  }, [clearWebViewTimeout, setSafeFlowState, setSafeStatus]);

  const handleRetry = useCallback(() => {
    clearWebViewTimeout();
    cancelPolling();

    investmentIdRef.current = null;

    setWebViewLoading(false);
    setIsWebViewVisible(false);
    setWebViewUrl('');
    setStatusMessage('');
    setSafeFlowState('IDLE');
  }, [cancelPolling, clearWebViewTimeout, setSafeFlowState]);

  if (flowState === 'PROCESSING') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insets.top },
        ]}
      >
        <StatusBar barStyle="light-content" />

        <ActivityIndicator
          size="large"
          color="#34D399"
          style={styles.stateLoader}
        />

        <Text style={styles.stateTitle}>Processing Allocation</Text>

        <Text style={styles.stateSubtitle}>
          {statusMessage ||
            'Please wait while Remzik verifies your investment.'}
        </Text>
      </View>
    );
  }

  if (flowState === 'CONFIRMED') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insets.top },
        ]}
      >
        <StatusBar barStyle="light-content" />

        <Text style={styles.successIcon}>🎉</Text>

        <Text style={styles.stateTitle}>Allocation Secured</Text>

        <Text style={styles.stateSubtitle}>
          You have successfully allocated ${numericAmount.toLocaleString()} into{' '}
          {property.title}.
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Portfolio')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>View Portfolio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (flowState === 'FAILED') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insets.top },
        ]}
      >
        <StatusBar barStyle="light-content" />

        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.stateTitle}>Allocation Requires Attention</Text>

        <Text style={styles.stateSubtitle}>
          {statusMessage || 'The investment could not be completed.'}
        </Text>

        <TouchableOpacity
          style={[styles.continueButton, styles.retryButton]}
          onPress={handleRetry}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const submitting = flowState === 'SUBMITTING';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          disabled={submitting}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Asset Allocation</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.propertyMiniCard}>
          <View style={styles.propertyThumbPlaceholder}>
            <Text style={styles.propertyThumbTag}>🏢</Text>
          </View>

          <View style={styles.propertyInfo}>
            <Text style={styles.propertyName}>{property.title}</Text>

            <View style={styles.yieldBadgeRow}>
              <View style={styles.liveIndicatorDot} />

              <Text style={styles.propertyYield}>
                {(property.yieldRate * 100).toFixed(1)}% APY • $
                {property.tokenPrice}/token
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select Settlement Method</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                settlementMode === 'OFF_CHAIN' && styles.tabButtonActive,
              ]}
              onPress={() => setSettlementMode('OFF_CHAIN')}
              disabled={submitting}
            >
              <Text
                style={[
                  styles.tabText,
                  settlementMode === 'OFF_CHAIN' && styles.tabTextActive,
                ]}
              >
                Internal Balance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                settlementMode === 'ON_CHAIN' && styles.tabButtonActive,
              ]}
              onPress={() => setSettlementMode('ON_CHAIN')}
              disabled={submitting}
            >
              <Text
                style={[
                  styles.tabText,
                  settlementMode === 'ON_CHAIN' && styles.tabTextActive,
                ]}
              >
                Web3 On-Chain
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Enter Allocation Value</Text>

            <Text style={styles.inputLimitLabel}>
              Min: ${property.minInvestment}
            </Text>
          </View>

          <View style={styles.textInputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>

            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder={property.minInvestment.toString()}
              placeholderTextColor="#475569"
              selectionColor="#34D399"
              editable={!submitting}
              accessibilityLabel="Investment amount"
            />

            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>USD</Text>
            </View>
          </View>
        </View>

        <View style={styles.presetsRow}>
          {presetAmounts.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.presetButton,
                numericAmount === value && styles.presetButtonActive,
              ]}
              onPress={() => setAmount(value.toString())}
              disabled={submitting}
            >
              <Text
                style={[
                  styles.presetText,
                  numericAmount === value && styles.presetTextActive,
                ]}
              >
                ${value.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownHeaderTitle}>Allocation Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Tokens</Text>

            <Text style={styles.breakdownValue}>{estimatedTokens} RWA</Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Estimated Annual Yield</Text>

            <Text style={styles.breakdownValueGreen}>
              +${estimatedYieldAnnual}
            </Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Available Vault Units</Text>

            <Text style={styles.breakdownValue}>{totalUnitsAvailable}</Text>
          </View>
        </View>

        {submitting && (
          <View style={styles.submittingStatus}>
            <ActivityIndicator size="small" color="#34D399" />

            <Text style={styles.submittingText}>
              {statusMessage || 'Preparing your investment...'}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            submitting && styles.continueButtonDisabled,
          ]}
          onPress={handleConfirmInvestment}
          activeOpacity={0.85}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#080C0A" />
          ) : (
            <Text style={styles.continueButtonText}>
              Confirm & Deploy Capital
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={isWebViewVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleDismissWebView}
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

            <Text style={styles.webViewHeaderTitle}>
              Web3 Transaction Signer
            </Text>

            <TouchableOpacity
              onPress={handleDismissWebView}
              style={styles.webViewCloseButton}
              activeOpacity={0.7}
            >
              <Text style={styles.webViewCloseText}>Dismiss</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.webViewWrapper}>
            {webViewUrl && (
              <WebView
                source={{ uri: webViewUrl }}
                onMessage={handleWebViewMessage}
                javaScriptEnabled
                domStorageEnabled
                sharedCookiesEnabled
                thirdPartyCookiesEnabled
                scrollEnabled
                bounces={false}
                setSupportMultipleWindows={false}
                originWhitelist={[
                  'https://*',
                  'http://*',
                  'http://localhost:*',
                  'http://10.0.2.2:*',
                  'http://192.168.1.239:*',
                ]}
                style={styles.webView}
                containerStyle={styles.webView}
                onLoadStart={() => {
                  setWebViewLoading(true);
                  startWebViewTimeout();
                }}
                onLoad={handleLoadEnd}
                onLoadEnd={handleLoadEnd}
                onError={event =>
                  failWebView(
                    `Unable to load signing service: ${
                      event.nativeEvent.description || 'Connection refused'
                    }`,
                  )
                }
                onHttpError={event =>
                  failWebView(
                    `Secure signing service returned HTTP ${event.nativeEvent.statusCode}.`,
                  )
                }
                onShouldStartLoadWithRequest={request => {
                  if (typeof __DEV__ !== 'undefined' && __DEV__) {
                    return true;
                  }
                  return isAllowedWebViewUrl(
                    request?.url || '',
                    configuredWebHost,
                  );
                }}
              />
            )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  stateLoader: {
    marginBottom: 20,
  },
  stateTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  stateSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
  },
  errorIcon: {
    fontSize: 48,
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
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  backIcon: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  propertyMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.18)',
    marginBottom: 24,
    gap: 14,
  },
  propertyThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#18221F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyThumbTag: {
    fontSize: 22,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  yieldBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  propertyYield: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLimitLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111816',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#1A2E28',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  tabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#34D399',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 16,
    height: 56,
  },
  currencySymbol: {
    color: '#34D399',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    padding: 0,
  },
  currencyBadge: {
    backgroundColor: '#18221F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  currencyBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#111816',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.12)',
  },
  presetButtonActive: {
    backgroundColor: '#1A2E28',
    borderColor: 'rgba(52,211,153,0.35)',
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#34D399',
  },
  breakdownCard: {
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    marginBottom: 24,
  },
  breakdownHeaderTitle: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  breakdownLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  breakdownValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownValueGreen: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#18221F',
    marginVertical: 6,
  },
  submittingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  submittingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#080C0A',
    borderTopWidth: 1,
    borderTopColor: '#111816',
  },
  continueButton: {
    backgroundColor: '#34D399',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#080C0A',
    fontSize: 15,
    fontWeight: '700',
  },
  retryButton: {
    backgroundColor: '#34D399',
    width: '100%',
  },
  webViewModalContainer: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  modalGrabberContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
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
  web3BadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  webViewHeaderTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  webViewCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  webViewCloseText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 12,
  },
  webViewWrapper: {
    flex: 1,
    backgroundColor: '#080C0A',
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
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
