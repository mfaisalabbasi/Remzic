// src/screens/investment/InvestmentFlowScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert as RNAlert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../theme/colors';
import { investmentApi } from '../../services/api/investmentApi';
import { walletApi } from '../../services/api/walletApi';

import { InvestmentStatusView } from '../../components/investment/InvestmentStatusView';
import { InvestmentHeader } from '../../components/investment/InvestmentHeader';
import { InvestmentPropertyCard } from '../../components/investment/InvestmentPropertyCard';
import { InvestmentFormCard } from '../../components/investment/InvestmentFormCard';
import { InvestmentSigningModal } from '../../components/investment/InvestmentSigningModal';

type FlowState = 'IDLE' | 'SUBMITTING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
type SettlementMode = 'OFF_CHAIN' | 'ON_CHAIN';

interface InvestmentProperty {
  id?: string;
  assetId?: string;
  title?: string;
  unitPrice?: number | string;
  tokenPrice?: number | string;
  expectedYield?: number | string;
  yield?: number | string;
  yieldRate?: number | string;
  availableShares?: number | string;
  tokenSupply?: number | string;
}

interface InvestmentRouteParams {
  property?: InvestmentProperty;
  tokenCount?: number;
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
  if (configured) return configured;

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
  if (value === undefined || value === null || value === '') return null;
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const typed = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = typed?.response?.data?.message;

  if (Array.isArray(message) && message.length) return message.join(', ');
  if (typeof message === 'string' && message.trim()) return message.trim();
  if (typeof typed?.message === 'string' && typed.message.trim())
    return typed.message.trim();

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
        ['localhost', '10.0.2.2', '192.168.1.239', '127.0.0.1'].includes(
          target.hostname,
        )
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
  route: { params?: InvestmentRouteParams };
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
  const [privyAccessToken, setPrivyAccessToken] = useState<string | null>(null);

  const [settlementMode, setSettlementMode] =
    useState<SettlementMode>('OFF_CHAIN');
  const [flowState, setFlowState] = useState<FlowState>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  const rawProperty = route?.params?.property || {};
  const assetId = rawProperty.id || rawProperty.assetId;
  const tokenCount = route?.params?.tokenCount;

  const unitPriceRaw = rawProperty.unitPrice ?? rawProperty.tokenPrice ?? 10;
  const parsedUnitPrice = Number(unitPriceRaw);
  const validUnitPrice =
    Number.isFinite(parsedUnitPrice) && parsedUnitPrice > 0
      ? parsedUnitPrice
      : 10;

  const yieldRaw =
    rawProperty.expectedYield ??
    rawProperty.yield ??
    rawProperty.yieldRate ??
    1.0;
  const parsedYield = Number(yieldRaw);
  const validYieldRate =
    Number.isFinite(parsedYield) && parsedYield >= 0
      ? parsedYield > 1
        ? parsedYield / 100
        : parsedYield
      : 0.085;

  const property = {
    title: rawProperty.title || 'Jeddah Tower',
    unitPrice: validUnitPrice,
    minInvestment: validUnitPrice,
    yieldRate: validYieldRate,
  };

  const initialAmount =
    tokenCount && Number.isFinite(Number(tokenCount)) && Number(tokenCount) > 0
      ? (Number(tokenCount) * property.unitPrice).toString()
      : property.minInvestment.toString();

  const [amount, setAmount] = useState(initialAmount);

  const parsedNumericAmount = Number.parseFloat(amount);
  const numericAmount =
    Number.isFinite(parsedNumericAmount) && parsedNumericAmount > 0
      ? parsedNumericAmount
      : property.minInvestment;

  const estimatedTokens =
    property.unitPrice > 0
      ? (numericAmount / property.unitPrice).toFixed(2)
      : '0.00';
  const estimatedYieldAnnual = (numericAmount * property.yieldRate).toFixed(2);

  const rawAvailable =
    rawProperty.availableShares ?? rawProperty.tokenSupply ?? 1000;
  const parsedAvailable = Number(rawAvailable);
  const totalUnitsAvailable = Number.isFinite(parsedAvailable)
    ? parsedAvailable.toLocaleString()
    : '1,000';

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
    const computedInitial =
      nextTokenCount &&
      Number.isFinite(Number(nextTokenCount)) &&
      Number(nextTokenCount) > 0
        ? (Number(nextTokenCount) * property.unitPrice).toString()
        : property.minInvestment.toString();

    setAmount(computedInitial);
  }, [route?.params?.tokenCount, property.minInvestment, property.unitPrice]);

  const setSafeFlowState = useCallback((state: FlowState) => {
    if (mountedRef.current) setFlowState(state);
  }, []);

  const setSafeStatus = useCallback((message: string) => {
    if (mountedRef.current) setStatusMessage(message);
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
        if (!mountedRef.current || pollingGenerationRef.current !== generation)
          return;

        try {
          const response = (await investmentApi.getLiveStatus(
            investmentId,
          )) as any;
          if (
            !mountedRef.current ||
            pollingGenerationRef.current !== generation
          )
            return;

          const rawStatus =
            response?.status ||
            response?.data?.status ||
            response?.investment?.status;
          const status =
            typeof rawStatus === 'string' ? rawStatus.toUpperCase().trim() : '';

          if (
            ['CONFIRMED', 'SUCCESS', 'COMPLETED', 'APPROVED'].includes(status)
          ) {
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
    if (
      intent.txPayload.chainId !== undefined &&
      !normalizeChainId(intent.txPayload.chainId)
    ) {
      throw new Error('The backend returned an invalid blockchain chain ID.');
    }

    investmentIdRef.current = intent.investmentId;

    // 🚀 Fetch FRESH RS256 Privy Custom Token and synced fallback wallet on EVERY invocation
    setSafeStatus('Authenticating secure enclave session...');
    let customToken: string | null = null;
    let fallbackWallet: string | null = null;
    try {
      const tokenRes = await walletApi.getPrivyToken();
      customToken = tokenRes?.privyCustomToken || null;
      fallbackWallet = tokenRes?.walletAddress || null;
      setPrivyAccessToken(customToken);
    } catch (err) {
      console.warn('⚠️ Failed to fetch fresh Privy custom token:', err);
    }

    const payloadData = {
      approvalPayload: intent.approvalPayload || null,
      txPayload: intent.txPayload,
      expectedStablecoinAddress: intent.expectedStablecoinAddress,
      expectedStablecoinAmount: intent.expectedStablecoinAmount,
      expectedVaultAddress: intent.txPayload.to,
    };

    const payload = encodeURIComponent(JSON.stringify(payloadData));
    const expectedWallet = normalizeWalletAddress(
      intent.expectedWalletAddress || fallbackWallet,
    );

    let targetUrl = `${getNextJsHost()}/auth/sign?payload=${payload}&investmentId=${encodeURIComponent(
      intent.investmentId,
    )}&autoAuth=true`;

    if (expectedWallet) {
      targetUrl += `&walletAddress=${encodeURIComponent(expectedWallet)}`;
    }

    if (customToken) {
      targetUrl += `&token=${encodeURIComponent(customToken)}`;
    }

    console.log(
      '🌐 Fully Assembled Secure WebView URL length:',
      targetUrl.length,
    );

    if (!mountedRef.current) return;

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
    })) as any;

    if (
      result?.status?.toUpperCase() === 'CONFIRMED' ||
      result?.status?.toUpperCase() === 'APPROVED'
    ) {
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
    if (submittingRef.current) return;

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      RNAlert.alert(
        'Invalid Allocation',
        'Please enter a valid investment amount.',
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
    settlementMode,
    setSafeFlowState,
    setSafeStatus,
    startOffChainInvestment,
    startOnChainInvestment,
  ]);

  const handleWebViewMessage = useCallback(
    async (event: { nativeEvent?: { data?: string } }) => {
      try {
        const raw = event.nativeEvent?.data;
        if (!raw?.trim()) return;

        let data: WebViewBridgeMessage;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }

        console.log('📱 WebView Bridge Message Received:', data);

        const investmentId = investmentIdRef.current;
        if (!isValidInvestmentId(investmentId)) return;

        if (data.type === 'TX_SUCCESS' || data.type === 'TX_FAILED') {
          if (data.investmentId && data.investmentId !== investmentId) {
            failWebView(
              'The signing session returned an invalid investment identifier.',
            );
            return;
          }
        }

        if (data.type === 'TX_SUCCESS') {
          if (
            typeof data.txHash !== 'string' ||
            !isValidTxHash(data.txHash.trim())
          ) {
            failWebView(
              'The signing service returned an invalid transaction hash.',
            );
            return;
          }

          const txHash = data.txHash.trim();
          clearWebViewTimeout();
          setWebViewLoading(false);
          setIsWebViewVisible(false);
          setSafeFlowState('PROCESSING');
          setSafeStatus(
            'Transaction broadcasted. Remzik is verifying the blockchain transaction...',
          );

          try {
            await investmentApi.verifyInvestmentTransaction(
              investmentId,
              txHash,
            );
          } catch (err) {
            console.log('Initial transaction submission notice:', err);
          }

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
    setPrivyAccessToken(null);
    setStatusMessage('');
    setSafeFlowState('IDLE');
  }, [cancelPolling, clearWebViewTimeout, setSafeFlowState]);

  if (
    flowState === 'PROCESSING' ||
    flowState === 'CONFIRMED' ||
    flowState === 'FAILED'
  ) {
    return (
      <InvestmentStatusView
        flowState={flowState}
        statusMessage={statusMessage}
        numericAmount={numericAmount}
        propertyTitle={property.title}
        insetsTop={insets.top}
        onNavigateHome={() => navigation.navigate('MainTabs')}
        onRetry={handleRetry}
      />
    );
  }

  const submitting = flowState === 'SUBMITTING';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <InvestmentHeader
        onBack={() => navigation.goBack()}
        submitting={submitting}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <InvestmentPropertyCard property={property} />

        <InvestmentFormCard
          settlementMode={settlementMode}
          setSettlementMode={setSettlementMode}
          submitting={submitting}
          amount={amount}
          setAmount={setAmount}
          numericAmount={numericAmount}
          minInvestment={property.minInvestment}
          presetAmounts={presetAmounts}
          estimatedTokens={estimatedTokens}
          estimatedYieldAnnual={estimatedYieldAnnual}
          totalUnitsAvailable={totalUnitsAvailable}
          statusMessage={statusMessage}
        />
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

      <InvestmentSigningModal
        isVisible={isWebViewVisible}
        webViewUrl={webViewUrl}
        webViewLoading={webViewLoading}
        configuredWebHost={configuredWebHost}
        privyAccessToken={privyAccessToken}
        onDismiss={handleDismissWebView}
        onMessage={handleWebViewMessage}
        onLoadStart={() => {
          setWebViewLoading(true);
          startWebViewTimeout();
        }}
        onLoadEnd={handleLoadEnd}
        onFail={failWebView}
        isAllowedWebViewUrl={isAllowedWebViewUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
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
});
