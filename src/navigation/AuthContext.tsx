// src/navigation/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secondaryMarketApi } from '../services/api/secondaryMarketApi';

const ACCESS_TOKEN_KEY = 'accessToken';
const CACHED_WALLET_KEY = 'cached_walletAddress';
const USER_DATA_KEY = 'userData'; // 👈 Key for caching user profile

const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  walletAddress?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (token: string, walletAddress?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateWalletAddress: (walletAddress: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeWalletAddress = (
  walletAddress?: string | null,
): string | undefined => {
  if (!walletAddress) {
    return undefined;
  }
  const normalized = walletAddress.trim();
  if (!EVM_ADDRESS_REGEX.test(normalized)) {
    return undefined;
  }
  return normalized.toLowerCase();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        const [token, cachedWallet, cachedUser] = await Promise.all([
          AsyncStorage.getItem(ACCESS_TOKEN_KEY),
          AsyncStorage.getItem(CACHED_WALLET_KEY),
          AsyncStorage.getItem(USER_DATA_KEY),
        ]);

        if (cancelled) {
          return;
        }

        if (token && token.trim().length > 0) {
          setIsAuthenticated(true);

          let userProfile: UserProfile = cachedUser
            ? JSON.parse(cachedUser)
            : {};

          try {
            const remoteUser = await secondaryMarketApi.getMe();
            if (remoteUser) {
              userProfile = remoteUser.user || remoteUser;
              await AsyncStorage.setItem(
                USER_DATA_KEY,
                JSON.stringify(userProfile),
              );
            }
          } catch (apiErr) {
            console.warn(
              '[AuthContext] Could not fetch remote profile, using cached profile:',
              apiErr,
            );
          }

          const normalizedWallet = normalizeWalletAddress(
            cachedWallet || userProfile.walletAddress,
          );

          setUser({
            ...userProfile,
            walletAddress: normalizedWallet,
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            '[AuthContext] Failed to restore mobile session:',
            error,
          );
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (token: string, walletAddress?: string): Promise<void> => {
      const normalizedToken = token?.trim();

      if (!normalizedToken) {
        throw new Error('A valid authentication token is required.');
      }

      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, normalizedToken);

      let userProfile: UserProfile = {};
      try {
        const remoteUser = await secondaryMarketApi.getMe();
        if (remoteUser) {
          userProfile = remoteUser.user || remoteUser;
          await AsyncStorage.setItem(
            USER_DATA_KEY,
            JSON.stringify(userProfile),
          );
        }
      } catch (err) {
        console.warn(
          '[AuthContext] Failed fetching user profile on login:',
          err,
        );
      }

      const normalizedWallet = normalizeWalletAddress(
        walletAddress || userProfile.walletAddress,
      );

      if (normalizedWallet) {
        await AsyncStorage.setItem(CACHED_WALLET_KEY, normalizedWallet);
      } else {
        await AsyncStorage.removeItem(CACHED_WALLET_KEY);
      }

      setUser({
        ...userProfile,
        walletAddress: normalizedWallet,
      });

      setIsAuthenticated(true);
    },
    [],
  );

  const updateWalletAddress = useCallback(
    async (walletAddress: string): Promise<void> => {
      const normalizedWallet = normalizeWalletAddress(walletAddress);

      if (!normalizedWallet) {
        throw new Error('Invalid investor wallet address.');
      }

      await AsyncStorage.setItem(CACHED_WALLET_KEY, normalizedWallet);

      setUser(prev => ({
        ...(prev || {}),
        walletAddress: normalizedWallet,
      }));
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(CACHED_WALLET_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
    } catch (error) {
      console.error('[AuthContext] Failed to clear session:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateWalletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
