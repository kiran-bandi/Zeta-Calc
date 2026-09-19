import React, { createContext, useContext, useEffect, useState } from 'react';
import { CurrencyCode, NumberSystem, UnitSystem, UserPreferences } from '../types/globalization';
import { CountryCode, CountryProfile, RegionalUnitDefaults } from '../types/localization';
import { COUNTRY_PROFILES, CURRENCY_DEFAULT_COUNTRY } from '../data/countries';
import { CURRENCIES, formatCurrency, formatIndianNumber, formatNumberWords } from '../data/currencies';

export interface CurrencySuggestion {
  suggestedCountry: CountryCode;
  currency: CurrencyCode;
}

interface SettingsContextType {
  preferences: UserPreferences;
  countryProfile: CountryProfile;
  setCountry: (code: CountryCode, explicit?: boolean) => void;
  setCurrency: (code: CurrencyCode) => void;
  setNumberSystem: (system: NumberSystem) => void;
  setUnitSystem: (system: UnitSystem) => void;
  getPreferredUnit: (key: keyof RegionalUnitDefaults) => string;
  setUnitOverride: (key: string, unit: string) => void;
  resetUnitsToCountryDefaults: () => void;
  hasCustomUnitOverrides: boolean;
  currencySuggestion: CurrencySuggestion | null;
  acceptCurrencySuggestion: () => void;
  dismissCurrencySuggestion: () => void;
  formatMoney: (amount: number, includeDecimals?: boolean) => string;
  formatNumber: (amount: number, includeDecimals?: boolean) => string;
  formatWords: (amount: number) => string;
  currencySymbol: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  country: 'IN',
  currency: 'INR',
  numberSystem: 'indian',
  unitSystem: 'metric',
  isCountryExplicit: false,
  unitOverrides: {},
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'omni_calc_user_prefs_v2';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          country: parsed.country || (parsed.currency === 'USD' ? 'US' : 'IN'),
          unitOverrides: parsed.unitOverrides || {},
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  const [currencySuggestion, setCurrencySuggestion] = useState<CurrencySuggestion | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  const countryProfile = COUNTRY_PROFILES[preferences.country] || COUNTRY_PROFILES.IN;

  const setCountry = (code: CountryCode, explicit: boolean = true) => {
    const profile = COUNTRY_PROFILES[code] || COUNTRY_PROFILES.IN;
    setPreferences((prev) => ({
      ...prev,
      country: code,
      isCountryExplicit: explicit,
      currency: profile.defaultCurrency,
      numberSystem: profile.numberFormatting,
      unitSystem: profile.measurementSystem === 'us-customary' ? 'imperial' : 'metric',
      unitOverrides: {}, // Reset overrides so country defaults take effect
    }));
    setCurrencySuggestion(null);
  };

  const setCurrency = (currency: CurrencyCode) => {
    // If country was not explicitly chosen and this currency strongly suggests a different country
    const suggestedCountry = CURRENCY_DEFAULT_COUNTRY[currency];
    if (
      !preferences.isCountryExplicit &&
      suggestedCountry &&
      suggestedCountry !== preferences.country
    ) {
      setCurrencySuggestion({
        suggestedCountry,
        currency,
      });
    }

    const autoNumberSystem = currency === 'INR' ? 'indian' : 'international';
    setPreferences((prev) => ({
      ...prev,
      currency,
      numberSystem: autoNumberSystem,
    }));
  };

  const acceptCurrencySuggestion = () => {
    if (!currencySuggestion) return;
    setCountry(currencySuggestion.suggestedCountry, true);
    setCurrencySuggestion(null);
  };

  const dismissCurrencySuggestion = () => {
    setPreferences((prev) => ({
      ...prev,
      isCountryExplicit: true,
    }));
    setCurrencySuggestion(null);
  };

  const setNumberSystem = (numberSystem: NumberSystem) => {
    setPreferences((prev) => ({ ...prev, numberSystem }));
  };

  const setUnitSystem = (unitSystem: UnitSystem) => {
    setPreferences((prev) => ({ ...prev, unitSystem }));
  };

  const getPreferredUnit = (key: keyof RegionalUnitDefaults): string => {
    if (preferences.unitOverrides && preferences.unitOverrides[key]) {
      return preferences.unitOverrides[key]!;
    }
    return countryProfile.defaults[key] as string;
  };

  const setUnitOverride = (key: string, unit: string) => {
    setPreferences((prev) => ({
      ...prev,
      unitOverrides: {
        ...(prev.unitOverrides || {}),
        [key]: unit,
      },
    }));
  };

  const resetUnitsToCountryDefaults = () => {
    setPreferences((prev) => ({
      ...prev,
      unitOverrides: {},
    }));
  };

  const hasCustomUnitOverrides =
    Boolean(preferences.unitOverrides && Object.keys(preferences.unitOverrides).length > 0);

  const formatMoney = (amount: number, includeDecimals: boolean = false) => {
    return formatCurrency(amount, preferences.currency, preferences.numberSystem, includeDecimals);
  };

  const formatNumber = (amount: number, includeDecimals: boolean = false): string => {
    if (isNaN(amount) || amount == null) return '0';
    if (preferences.numberSystem === 'indian') {
      return formatIndianNumber(amount, includeDecimals);
    }
    return new Intl.NumberFormat(countryProfile.locale || 'en-US', {
      maximumFractionDigits: includeDecimals ? 2 : 0,
      minimumFractionDigits: includeDecimals ? 2 : 0,
    }).format(amount);
  };

  const formatWords = (amount: number) => {
    return formatNumberWords(amount, preferences.currency);
  };

  const currencySymbol = CURRENCIES[preferences.currency]?.symbol || '₹';

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        countryProfile,
        setCountry,
        setCurrency,
        setNumberSystem,
        setUnitSystem,
        getPreferredUnit,
        setUnitOverride,
        resetUnitsToCountryDefaults,
        hasCustomUnitOverrides,
        currencySuggestion,
        acceptCurrencySuggestion,
        dismissCurrencySuggestion,
        formatMoney,
        formatNumber,
        formatWords,
        currencySymbol,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
