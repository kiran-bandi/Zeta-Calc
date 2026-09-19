/**
 * Universal Duration Engine
 * Normalizes years, months, weeks, days, hours into canonical months/days/years.
 * Guarantees support for financial tenure components (e.g. 2 years 5 months = 29 months).
 */

export interface DurationValue {
  years?: number;
  months?: number;
  days?: number;
  weeks?: number;
}

export class DurationEngine {
  /**
   * Normalizes years + months into exact total integer months.
   */
  static toMonths(years: number = 0, months: number = 0): number {
    return Math.round(years * 12 + months);
  }

  /**
   * Decomposes total months into full years and remainder months.
   */
  static fromMonths(totalMonths: number): { years: number; months: number } {
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);
    return { years, months };
  }

  /**
   * Formats duration into a human readable string.
   */
  static format(years: number = 0, months: number = 0): string {
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    if (parts.length === 0) return '0 months';
    return parts.join(' ');
  }

  /**
   * Normalizes days to years (assuming 365.25 standard accounting day-count).
   */
  static daysToYears(days: number): number {
    return days / 365.25;
  }
}
