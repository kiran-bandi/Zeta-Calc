import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export interface RecentToolItem {
  slug: string;
  visitedAt: number;
}

interface HistoryContextType {
  recentTools: RecentToolItem[];
  recordToolUsage: (slug: string) => void;
  clearHistory: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const RECENT_STORAGE_KEY = 'omni_calc_recent_tools_v1';
const FAVORITES_STORAGE_KEY = 'omni_calc_favorite_tools_v1';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { slug: 'emi-calculator', visitedAt: Date.now() - 3600000 },
      { slug: 'sip-calculator', visitedAt: Date.now() - 7200000 },
      { slug: 'percentage-calculator', visitedAt: Date.now() - 14400000 },
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return ['emi-calculator', 'sip-calculator'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentTools));
    } catch {
      // ignore
    }
  }, [recentTools]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const recordToolUsage = useCallback((slug: string) => {
    setRecentTools((prev) => {
      if (prev.length > 0 && prev[0].slug === slug && Date.now() - prev[0].visitedAt < 5000) {
        return prev;
      }
      const filtered = prev.filter((item) => item.slug !== slug);
      return [{ slug, visitedAt: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentTools([]);
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const contextValue = useMemo(
    () => ({
      recentTools,
      recordToolUsage,
      clearHistory,
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [recentTools, recordToolUsage, clearHistory, favorites, toggleFavorite, isFavorite]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
