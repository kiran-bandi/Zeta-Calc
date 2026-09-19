/**
 * Universal Currency Registry and Currency Normalizer
 * Separates currency symbol/code formatting from exchange rate conversions.
 */

export interface CurrencyMetadata {
  code: string;
  symbol: string;
  name: string;
  decimalDigits: number;
  symbolPosition: 'before' | 'after';
  spaceSeparated?: boolean;
}

class CurrencyRegistryImpl {
  private currencies: Map<string, CurrencyMetadata> = new Map();

  constructor() {
    this.registerDefaults();
  }

  register(curr: CurrencyMetadata) {
    this.currencies.set(curr.code.toUpperCase(), curr);
  }

  get(code: string): CurrencyMetadata {
    return (
      this.currencies.get(code.toUpperCase()) || {
        code: code.toUpperCase(),
        symbol: code.toUpperCase(),
        name: code.toUpperCase(),
        decimalDigits: 2,
        symbolPosition: 'before',
      }
    );
  }

  getAll(): CurrencyMetadata[] {
    return Array.from(this.currencies.values());
  }

  format(amount: number, currencyCode: string = 'USD', options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }): string {
    const meta = this.get(currencyCode);
    const minDecimals = options?.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 0;
    const maxDecimals = options?.maximumFractionDigits !== undefined ? options.maximumFractionDigits : meta.decimalDigits;

    const formattedNum = amount.toLocaleString(undefined, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    });

    if (meta.symbolPosition === 'after') {
      return `${formattedNum}${meta.spaceSeparated ? ' ' : ''}${meta.symbol}`;
    }
    return `${meta.symbol}${meta.spaceSeparated ? ' ' : ''}${formattedNum}`;
  }

  private registerDefaults() {
    this.register({ code: 'USD', symbol: '$', name: 'US Dollar', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'EUR', symbol: '€', name: 'Euro', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'GBP', symbol: '£', name: 'British Pound', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalDigits: 0, symbolPosition: 'before' });
    this.register({ code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimalDigits: 2, symbolPosition: 'before' });
    this.register({ code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimalDigits: 2, symbolPosition: 'before', spaceSeparated: true });
  }
}

export const CurrencyRegistry = new CurrencyRegistryImpl();
