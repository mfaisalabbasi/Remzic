import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const CACHED_WALLET_KEY = 'cached_walletAddress';

const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export interface UserProfile {
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

  /**
   * Restore the mobile Web2 session.
   *
   * IMPORTANT:
   * A missing cached wallet does NOT mean the user is unauthenticated.
   *
   * The wallet cache is only a convenience value. It is never treated
   * as proof of wallet ownership or as the signing authority.
   */
  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        const [token, cachedWallet] = await Promise.all([
          AsyncStorage.getItem(ACCESS_TOKEN_KEY),
          AsyncStorage.getItem(CACHED_WALLET_KEY),
        ]);

        if (cancelled) {
          return;
        }

        if (token && token.trim().length > 0) {
          setIsAuthenticated(true);

          const normalizedWallet = normalizeWalletAddress(cachedWallet);

          setUser(
            normalizedWallet
              ? {
                  walletAddress: normalizedWallet,
                }
              : {},
          );
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

  /**
   * Store the Remzik Web2 authentication session.
   *
   * The wallet is optional because ON_CHAIN signing happens through
   * the actual Privy wallet inside the secure WebView.
   */
  const login = useCallback(
    async (token: string, walletAddress?: string): Promise<void> => {
      const normalizedToken = token?.trim();

      if (!normalizedToken) {
        throw new Error('A valid authentication token is required.');
      }

      const normalizedWallet = normalizeWalletAddress(walletAddress);

      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, normalizedToken);

      if (normalizedWallet) {
        await AsyncStorage.setItem(CACHED_WALLET_KEY, normalizedWallet);
      } else {
        await AsyncStorage.removeItem(CACHED_WALLET_KEY);
      }

      setUser(
        normalizedWallet
          ? {
              walletAddress: normalizedWallet,
            }
          : {},
      );

      setIsAuthenticated(true);
    },
    [],
  );

  /**
   * Update the locally cached wallet address.
   *
   * This is intentionally NOT used as signing authority.
   * It is only application/session context.
   */
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

  /**
   * Completely clear the mobile Web2 session.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(CACHED_WALLET_KEY),
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
