import { CurrencyCode, CurrencyConfig, NumberSystem } from '../types/globalization';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', rateVsUSD: 83.2 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', rateVsUSD: 1.0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', rateVsUSD: 0.92 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', rateVsUSD: 0.79 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', rateVsUSD: 1.52 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', rateVsUSD: 1.36 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', rateVsUSD: 1.34 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', locale: 'en-AE', rateVsUSD: 3.67 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', rateVsUSD: 154.5 },
};

export function convertCurrencyValue(
  amount: number | '',
  fromCode: CurrencyCode,
  toCode: CurrencyCode
): number | '' {
  if (amount === '' || amount === undefined || amount === null || isNaN(amount)) return '';
  if (fromCode === toCode) return amount;

  const fromRate = CURRENCIES[fromCode]?.rateVsUSD || 1.0;
  const toRate = CURRENCIES[toCode]?.rateVsUSD || 1.0;

  const usdValue = amount / fromRate;
  const converted = usdValue * toRate;

  // Round JPY or large currencies appropriately
  if (toCode === 'JPY') return Math.round(converted);
  return Math.round(converted * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'INR',
  numberSystem: NumberSystem = 'indian',
  includeDecimals: boolean = false
): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${config.symbol}0`;
  }

  const rounded = includeDecimals ? Math.round(amount * 100) / 100 : Math.round(amount);

  if (currencyCode === 'INR' && numberSystem === 'indian') {
    // Custom Indian formatting (e.g. 12,34,567)
    return `${config.symbol}${formatIndianNumber(rounded, includeDecimals)}`;
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(rounded);
}

export function formatIndianNumber(num: number, includeDecimals: boolean = false): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toFixed(includeDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return `${isNegative ? '-' : ''}${integerPart}${decimalPart}`;
}

export function formatNumberWords(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  if (amount <= 0) return '';
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;

  if (currencyCode === 'INR') {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `${config.symbol}${cr.toFixed(2)} Crore`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `${config.symbol}${lakh.toFixed(2)} Lakh`;
    }
    if (amount >= 1000) {
      const k = amount / 1000;
      return `${config.symbol}${k.toFixed(1)} Thousand`;
    }
  } else {
    if (amount >= 1000000000) {
      return `${config.symbol}${(amount / 1000000000).toFixed(2)} Billion`;
    }
    if (amount >= 1000000) {
      return `${config.symbol}${(amount / 1000000).toFixed(2)} Million`;
    }
    if (amount >= 1000) {
      return `${config.symbol}${(amount / 1000).toFixed(1)}k`;
    }
  }
  return '';
}
