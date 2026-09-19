/**
 * Universal Interest Rate Normalizer
 * Normalizes different rate representations (% p.a., % p.m., ₹/₹100/mo) into canonical annual decimal rates.
 */

export type RateType = 'percentage_per_year' | 'percentage_per_month' | 'per_hundred_per_month';

export interface RateInput {
  rate: number;
  type: RateType;
}

export interface NormalizedRate {
  annualPercentage: number;       // e.g. 24 for 24% p.a.
  monthlyPercentage: number;      // e.g. 2 for 2% p.m.
  annualDecimal: number;         // e.g. 0.24
  monthlyDecimal: number;        // e.g. 0.02
  formattedAnnual: string;       // e.g. "24% per year"
  formattedMonthly: string;      // e.g. "2% per month"
}

export class InterestRateNormalizer {
  static normalize(input: RateInput): NormalizedRate {
    const raw = input.rate;
    let annualPct = 0;

    switch (input.type) {
      case 'percentage_per_year':
        annualPct = raw;
        break;
      case 'percentage_per_month':
        annualPct = raw * 12;
        break;
      case 'per_hundred_per_month':
        // ₹X per ₹100 per month = X% per month => X * 12 % per year
        annualPct = raw * 12;
        break;
      default:
        annualPct = raw;
    }

    const monthlyPct = annualPct / 12;
    const annualDecimal = annualPct / 100;
    const monthlyDecimal = monthlyPct / 100;

    return {
      annualPercentage: annualPct,
      monthlyPercentage: monthlyPct,
      annualDecimal,
      monthlyDecimal,
      formattedAnnual: `${annualPct}% per year`,
      formattedMonthly: `${monthlyPct}% per month`,
    };
  }
}
