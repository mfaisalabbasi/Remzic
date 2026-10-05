// src/services/api/walletApi.ts
import { apiClient } from './client';

export interface WalletData {
  availableBalance: number;
  lockedBalance: number;
  pendingPayout: number;
  totalEarned: number;
  balance: number;
}

export interface LedgerEntry {
  id: string;
  amount: number;
  source: string;
  type: string;
  createdAt: string;
  note?: string;
}

export interface SyncWalletResponse {
  success: boolean;
  walletAddress?: string;
  message?: string;
}

export const walletApi = {
  getWalletData: async (): Promise<WalletData> => {
    const response = await apiClient.get('/wallet/me');
    return response.data;
  },

  getWalletTransactions: async (): Promise<LedgerEntry[]> => {
    const response = await apiClient.get('/wallet/transactions');
    return response.data;
  },

  dummyTopUp: async (amount: number = 5000) => {
    const response = await apiClient.post('/wallet/dummy-topup', {
      amount,
    });
    return response.data;
  },

  /**
   * Triggers the backend to provision/sync the user's Privy embedded wallet
   * and link it to their PostgreSQL record immediately post-login or signup.
   */
  syncWallet: async (): Promise<SyncWalletResponse> => {
    const response = await apiClient.post('/auth/sync-wallet', {});
    return response.data;
  },
};
