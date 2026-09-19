/**
 * Zeta Calculator - Date & Time Mathematical Engine
 * Deterministic date calculations, workdays, timezones, and duration conversions.
 */

export interface DateDifferenceResult {
  totalDays: number;
  calendarYears: number;
  calendarMonths: number;
  calendarDays: number;
  totalWeeks: number;
  remainingDaysAfterWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  workingDays: number;
  weekendDays: number;
}

/**
 * Calculates the exact chronological difference between two dates
 */
export function calculateDateDifference(
  startDateStr: string,
  endDateStr: string,
  includeEndDate = false
): DateDifferenceResult | null {
  if (!startDateStr || !endDateStr) return null;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  // Normalize to UTC midnight to avoid DST skew
  const d1 = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
  const d2 = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

  let diffMs = d2.getTime() - d1.getTime();
  if (diffMs < 0) {
    // Swap if end is before start
    return calculateDateDifference(endDateStr, startDateStr, includeEndDate);
  }

  if (includeEndDate) {
    diffMs += 24 * 60 * 60 * 1000;
  }

  const totalDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysAfterWeeks = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  // Calendar Y/M/D decomposition
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (includeEndDate) {
    days += 1;
  }

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthLastDay = new Date(Date.UTC(end.getFullYear(), end.getMonth(), 0)).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Calculate working days (Mon-Fri) vs weekend days
  let workingDays = 0;
  let weekendDays = 0;
  const cur = new Date(d1);
  const loopEnd = includeEndDate ? new Date(d2.getTime() + 24 * 60 * 60 * 1000) : d2;

  while (cur < loopEnd) {
    const dayOfWeek = cur.getUTCDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return {
    totalDays,
    calendarYears: Math.max(0, years),
    calendarMonths: Math.max(0, months),
    calendarDays: Math.max(0, days),
    totalWeeks,
    remainingDaysAfterWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    workingDays,
    weekendDays,
  };
}

export interface WorkingDaysResult {
  totalCalendarDays: number;
  workingDays: number;
  weekendDays: number;
  totalWorkHours: number;
  grossPay?: number;
}

export function calculateWorkingDays(
  startDateStr: string,
  endDateStr: string,
  dailyHours = 8,
  hourlyWage = 0
): WorkingDaysResult | null {
  const diff = calculateDateDifference(startDateStr, endDateStr, true);
  if (!diff) return null;

  const totalWorkHours = diff.workingDays * Math.max(0, dailyHours);
  const grossPay = hourlyWage > 0 ? Math.round(totalWorkHours * hourlyWage * 100) / 100 : undefined;

  return {
    totalCalendarDays: diff.totalDays,
    workingDays: diff.workingDays,
    weekendDays: diff.weekendDays,
    totalWorkHours,
    grossPay,
  };
}

export interface TimeDurationResult {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  displayFormatted: string;
}

export function calculateTimeDuration(
  hours = 0,
  minutes = 0,
  seconds = 0
): TimeDurationResult {
  const totalSeconds = Math.max(0, hours * 3600 + minutes * 60 + seconds);
  const totalMinutes = Math.round((totalSeconds / 60) * 100) / 100;
  const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;
  const totalDays = Math.round((totalSeconds / 86400) * 1000) / 1000;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return {
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    displayFormatted: parts.join(' '),
  };
}
