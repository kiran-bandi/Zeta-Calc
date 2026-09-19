export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'SGD' | 'AED' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
  rateVsUSD: number; // For basic conversion estimates
}

export type NumberSystem = 'international' | 'indian'; // million/billion vs lakh/crore
export type UnitSystem = 'metric' | 'imperial';

export interface UserPreferences {
  country: import('./localization').CountryCode;
  currency: CurrencyCode;
  numberSystem: NumberSystem;
  unitSystem: UnitSystem;
  isCountryExplicit?: boolean;
  unitOverrides?: Record<string, string>;
}

