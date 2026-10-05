// src/hooks/useAssets.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchApprovedAssets, AssetData } from '../api/asset'; // 👈 Fixed import path to match your api.ts location

export const useApprovedAssets = () => {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApprovedAssets();
      setAssets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load approved RWA assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return { assets, loading, error, refreshAssets: loadAssets };
};
