import { Platform } from 'react-native';

// src/config/constants.ts
export const CONFIG = {
  STABLECOIN_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  MARKETPLACE_ADDRESS: '0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0',
  TARGET_CHAIN_ID: 31337,
  FRONTEND_URL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000',
};
