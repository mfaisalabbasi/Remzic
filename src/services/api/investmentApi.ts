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
  // 1. INTENT PHASE: Generates transaction payload and expected routing context from backend
  createInvestmentIntent: async (
    data: InvestmentRequestDto,
  ): Promise<InvestmentIntentResponse> => {
    const response = await apiClient.post<InvestmentIntentResponse>(
      '/investments/intent',
      data,
    );
    return response.data;
  },

  // 2. SUBMIT TX PHASE: Submits broadcasted txHash to backend for reconciliation and verification
  verifyInvestmentTransaction: async (
    investmentId: string,
    txHash: string,
  ): Promise<TransactionVerificationResponse> => {
    const response = await apiClient.post<TransactionVerificationResponse>(
      `/investments/${investmentId}/submit-tx`,
      {
        txHash,
      },
    );
    return response.data;
  },

  // Fallback / legacy support for off-chain settlements
  createInvestment: async (data: any) => {
    const response = await apiClient.post('/investments', data);
    return response.data;
  },

  getMyInvestments: async () => {
    const response = await apiClient.get('/investments/me');
    return response.data;
  },

  getLiveStatus: async (investmentId: string) => {
    const response = await apiClient.get(
      `/investments/${investmentId}/db-status`,
    );
    return response.data;
  },
};
