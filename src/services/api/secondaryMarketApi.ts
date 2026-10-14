// src/services/api/secondaryMarketApi.ts
import { apiClient } from './client';

export interface SecondaryListing {
  id: string;
  assetId: string;
  unitsForSale: number;
  pricePerUnit: number;
  sellerId: string;
  asset?: {
    id: string;
    title: string;
    location?: string;
    type?: string;
    tokenAddress?: string;
  };
}

export interface PrepareListingDto {
  assetId: string;
  unitsForSale: number;
  pricePerUnit: number;
}

export interface TradeIntentDto {
  listingId: string;
  settlementMode: 'ON_CHAIN' | 'OFF_CHAIN';
}

export const secondaryMarketApi = {
  // 1. Fetch All Secondary Listings
  getAllListings: async (): Promise<SecondaryListing[]> => {
    try {
      const response = await apiClient.get('/secondary-market/listings/all');
      const data = response.data;
      return Array.isArray(data) ? data : data?.listings || data?.data || [];
    } catch (error: any) {
      console.warn(
        '⚠️ [API] Failed to fetch secondary listings:',
        error?.message,
      );
      return [];
    }
  },

  // 2. Fetch User Positions/Holdings
  getMyPositions: async () => {
    try {
      const response = await apiClient.get('/investors/my-positions');
      const data = response.data;
      return Array.isArray(data) ? data : data?.positions || data?.data || [];
    } catch (error: any) {
      console.warn(
        '⚠️ [API] Failed to fetch investor positions:',
        error?.message,
      );
      return [];
    }
  },

  // 3. Fetch Active Escrow Trades
  getActiveTrades: async () => {
    try {
      const response = await apiClient.get('/secondary-market/trade/active');
      const data = response.data;
      return Array.isArray(data) ? data : data?.trades || data?.data || [];
    } catch (error: any) {
      console.warn('⚠️ [API] Failed to fetch active trades:', error?.message);
      return [];
    }
  },

  // 4. Fetch Current Authenticated User Profile
  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      console.warn('⚠️ [API] Failed to fetch user profile:', error?.message);
      return null;
    }
  },

  // 5. Listing Actions (Prepare, Confirm, Delete)
  prepareListing: async (data: PrepareListingDto) => {
    const response = await apiClient.post(
      '/secondary-market/listings/prepare',
      data,
    );
    return response.data;
  },

  confirmListing: async (listingId: string) => {
    const response = await apiClient.post(
      '/secondary-market/listings/confirm',
      { listingId },
    );
    return response.data;
  },

  deleteListing: async (listingId: string) => {
    const response = await apiClient.delete(
      `/secondary-market/listings/${listingId}`,
    );
    return response.data;
  },

  // 6. Trade Execution Actions (Intent, Execute, Submit Tx, Settle)
  createTradeIntent: async (data: TradeIntentDto) => {
    const response = await apiClient.post(
      '/secondary-market/trade/intent',
      data,
    );
    return response.data;
  },

  executeOffChainTrade: async (listingId: string) => {
    const response = await apiClient.post(
      `/secondary-market/trade/execute/${listingId}`,
      {
        settlementMode: 'OFF_CHAIN',
      },
    );
    return response.data;
  },

  submitTxHash: async (tradeId: string, txHash: string) => {
    const response = await apiClient.post(
      `/secondary-market/trade/${tradeId}/submit-tx`,
      { txHash },
    );
    return response.data;
  },

  settleTrade: async (tradeId: string) => {
    const response = await apiClient.post(
      `/secondary-market/trade/settle/${tradeId}`,
    );
    return response.data;
  },

  raiseDispute: async (tradeId: string, reason: string) => {
    const response = await apiClient.post('/disputes', {
      referenceId: tradeId,
      type: 'SECONDARY_TRADE',
      reason,
    });
    return response.data;
  },
};
