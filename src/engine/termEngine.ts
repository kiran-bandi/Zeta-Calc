export interface TermValue {
  years: number | '';
  months: number | '';
  days?: number | '';
}

export interface TermValidationResult {
  isValid: boolean;
  error?: string;
  totalMonths: number;
  totalYears: number;
  totalDays: number;
}

/**
 * Centralized term normalization engine.
 * Converts years, months & days inputs into totalMonths, totalDays, and exact unrounded totalYears.
 */
export function normalizeTerm(term: TermValue): TermValidationResult {
  const yearsEmpty =
    term.years === '' || term.years === undefined || term.years === null || isNaN(term.years as number);
  const monthsEmpty =
    term.months === '' || term.months === undefined || term.months === null || isNaN(term.months as number);
  const daysEmpty =
    term.days === '' || term.days === undefined || term.days === null || isNaN(term.days as number);

  if (yearsEmpty && monthsEmpty && daysEmpty) {
    return {
      isValid: false,
      error: 'Enter a term.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  const y = yearsEmpty ? 0 : Number(term.years);
  const m = monthsEmpty ? 0 : Number(term.months);
  const d = daysEmpty ? 0 : Number(term.days);

  if (y < 0) {
    return {
      isValid: false,
      error: 'Years cannot be negative.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  if (m < 0) {
    return {
      isValid: false,
      error: 'Months cannot be negative.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  if (d < 0) {
    return {
      isValid: false,
      error: 'Days cannot be negative.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  if (!Number.isInteger(m) || m > 11) {
    return {
      isValid: false,
      error: 'Months must be between 0 and 11.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  if (!Number.isInteger(d) || d > 30) {
    return {
      isValid: false,
      error: 'Days must be between 0 and 30.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  const totalMonths = y * 12 + m + d / 30.4375;
  const totalDays = y * 365.25 + m * 30.4375 + d;
  if (totalMonths <= 0 && totalDays <= 0) {
    return {
      isValid: false,
      error: 'Term duration must be greater than zero.',
      totalMonths: 0,
      totalYears: 0,
      totalDays: 0,
    };
  }

  const totalYears = totalMonths / 12;

  return {
    isValid: true,
    totalMonths,
    totalYears,
    totalDays,
  };
}

/**
 * Converts total months to years and months representation.
 */
export function monthsToTerm(totalMonths: number | ''): TermValue {
  if (
    totalMonths === '' ||
    totalMonths === undefined ||
    totalMonths === null ||
    isNaN(totalMonths) ||
    totalMonths <= 0
  ) {
    return { years: '', months: '' };
  }
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return {
    years: y > 0 ? y : 0,
    months: m,
  };
}
