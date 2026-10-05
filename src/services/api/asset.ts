// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 'http://10.0.2.2:4000/api' for Android Emulator or 'http://localhost:4000/api' for iOS Simulator
const API_BASE_URL = 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token for authenticated requests
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log(
      '🔍 [API Interceptor] Token retrieved from AsyncStorage:',
      token ? `${token.substring(0, 15)}...` : 'NULL',
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        '⚠️ [API Interceptor] Request going out without Authorization header (Token is null)!',
      );
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// --- Asset API Endpoints matching NestJS AssetController ---

export interface AssetData {
  id: string;
  title: string;
  location: string;
  expectedYield?: number;
  totalValue: number;
  tokenSupply: number;
  unitPrice: number;
  status: string;
  galleryImages: string[];
  legalDocuments?: any[];
  financialDocuments?: any[];
  otherDocuments?: any[];
  overview?: string;
  tokenAddress?: string;
  governanceAddress?: string;
  treasuryAddress?: string;
}

// Corresponds to GET /assets
export const fetchApprovedAssets = async (): Promise<AssetData[]> => {
  const response = await apiClient.get('/assets');
  return response.data;
};

// Corresponds to GET /assets/:id (handles permission checks for secured documents)
export const fetchAssetById = async (id: string): Promise<AssetData> => {
  const response = await apiClient.get(`/assets/${id}`);
  return response.data;
};

// Corresponds to GET /assets/partner/assets (Partner dashboard listing)
export const fetchPartnerAssets = async () => {
  const response = await apiClient.get('/assets/partner/assets');
  return response.data;
};
