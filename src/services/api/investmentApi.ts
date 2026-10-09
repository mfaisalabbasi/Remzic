// src/services/api/investmentApi.ts
import { apiClient } from './client';

export interface InvestmentRequestDto {
  assetId: string;
  amount: number;
  settlementMode?: 'OFF_CHAIN' | 'ON_CHAIN';
  walletAddress?: string;
}

export interface InvestmentIntentResponse {
  success: boolean;
  investmentId: string;
  txPayload: {
    to: string;
    data: string;
    value?: string;
    chainId?: number;
  };
  expectedWalletAddress?: string;
}

export interface TransactionVerificationResponse {
  success: boolean;
  status: string;
  message?: string;
}

export const investmentApi = {
  createInvestmentIntent: async (
    data: InvestmentRequestDto,
  ): Promise<InvestmentIntentResponse> => {
    const response = await apiClient.post<InvestmentIntentResponse>(
      '/investments/intent',
      data,
    );
    return response.data;
  },

  verifyInvestmentTransaction: async (
    investmentId: string,
    txHash: string,
  ): Promise<TransactionVerificationResponse> => {
    const response = await apiClient.post<TransactionVerificationResponse>(
      `/investments/${investmentId}/submit-tx`,
      { txHash },
    );
    return response.data;
  },

  createInvestment: async (data: any) => {
    const response = await apiClient.post('/investments', data);
    return response.data;
  },

  getMyInvestments: async () => {
    try {
      console.log('📡 [API] Fetching /investments/me...');
      const response = await apiClient.get('/investments/me');
      console.log('✅ [API] Investments fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn(
        '⚠️ [API] Failed to fetch /investments/me, returning fallback array:',
        error?.message,
      );
      // Fallback empty or mock array so dashboard doesn't stall
      return [];
    }
  },

  getLiveStatus: async (investmentId: string) => {
    const response = await apiClient.get(
      `/investments/${investmentId}/db-status`,
    );
    return response.data;
  },
};
