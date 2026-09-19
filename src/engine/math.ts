/**
 * Math Engine for OmniEveryday
 * Deterministic calculations for fractions, statistics, averages, triangles, ratios, and random generation.
 */

// Helper: Greatest Common Divisor
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Helper: Least Common Multiple
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export interface FractionInput {
  n1: number;
  d1: number;
  op: '+' | '-' | '*' | '/';
  n2: number;
  d2: number;
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  simplifiedNumerator: number;
  simplifiedDenominator: number;
  isNegative: boolean;
  mixedWhole: number;
  mixedNumerator: number;
  decimal: number;
  steps: string[];
  simplifiedFraction?: string;
  mixedNumber?: string;
}

export function calculateFraction(input: FractionInput): FractionResult {
  const d1 = input.d1 === 0 ? 1 : input.d1;
  const d2 = input.d2 === 0 ? 1 : input.d2;
  const n1 = input.n1;
  const n2 = input.n2;

  let num = 0;
  let den = 1;
  const steps: string[] = [];

  if (input.op === '+' || input.op === '-') {
    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;
    const adjN1 = n1 * m1;
    const adjN2 = n2 * m2;

    steps.push(`Find common denominator of ${d1} and ${d2}: LCM = ${commonDen}`);
    steps.push(`Scale first fraction: (${n1} × ${m1}) / (${d1} × ${m1}) = ${adjN1}/${commonDen}`);
    steps.push(`Scale second fraction: (${n2} × ${m2}) / (${d2} × ${m2}) = ${adjN2}/${commonDen}`);

    if (input.op === '+') {
      num = adjN1 + adjN2;
      steps.push(`Add numerators: ${adjN1} + ${adjN2} = ${num}/${commonDen}`);
    } else {
      num = adjN1 - adjN2;
      steps.push(`Subtract numerators: ${adjN1} - ${adjN2} = ${num}/${commonDen}`);
    }
    den = commonDen;
  } else if (input.op === '*') {
    num = n1 * n2;
    den = d1 * d2;
    steps.push(`Multiply numerators: ${n1} × ${n2} = ${num}`);
    steps.push(`Multiply denominators: ${d1} × ${d2} = ${den}`);
  } else {
    // division
    const safeN2 = n2 === 0 ? 1 : n2;
    num = n1 * d2;
    den = d1 * safeN2;
    steps.push(`Multiply by reciprocal: (${n1}/${d1}) × (${d2}/${safeN2}) = ${num}/${den}`);
  }

  // Handle negatives
  let isNegative = false;
  if ((num < 0 && den > 0) || (num > 0 && den < 0)) {
    isNegative = true;
  }
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);

  const divisor = gcd(absNum, absDen);
  const simNum = absNum / divisor;
  const simDen = absDen / divisor;

  steps.push(`Simplify by GCD (${divisor}): ${absNum}/${absDen} = ${simNum}/${simDen}`);

  const mixedWhole = Math.floor(simNum / simDen);
  const mixedNumerator = simNum % simDen;

  const finalDecimal = (isNegative ? -1 : 1) * (simNum / simDen);

  const simplifiedFraction = `${isNegative ? '-' : ''}${simNum}/${simDen}`;
  const mixedNumber = simNum >= simDen && mixedNumerator > 0
    ? `${isNegative ? '-' : ''}${mixedWhole} ${mixedNumerator}/${simDen}`
    : undefined;

  return {
    numerator: num,
    denominator: den,
    simplifiedNumerator: isNegative ? -simNum : simNum,
    simplifiedDenominator: simDen,
    isNegative,
    mixedWhole: isNegative ? -mixedWhole : mixedWhole,
    mixedNumerator,
    decimal: Math.round(finalDecimal * 1000000) / 1000000,
    steps,
    simplifiedFraction,
    mixedNumber,
  };
}

export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  sampleSD: number;
  populationSD: number;
  sampleVariance: number;
  populationVariance: number;
}

export function calculateStatistics(numbers: number[]): StatsResult | null {
  if (!numbers || numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const counts: Record<number, number> = {};
  let maxCount = 0;
  for (const n of sorted) {
    counts[n] = (counts[n] || 0) + 1;
    if (counts[n] > maxCount) maxCount = counts[n];
  }
  const mode = Object.keys(counts)
    .filter((k) => counts[Number(k)] === maxCount && maxCount > 1)
    .map(Number);

  // Variance & Standard Deviation
  const sumOfSquares = sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const populationVariance = sumOfSquares / count;
  const sampleVariance = count > 1 ? sumOfSquares / (count - 1) : 0;
  const populationSD = Math.sqrt(populationVariance);
  const sampleSD = Math.sqrt(sampleVariance);

  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  return {
    count,
    sum: Math.round(sum * 10000) / 10000,
    mean: Math.round(mean * 10000) / 10000,
    median: Math.round(median * 10000) / 10000,
    mode,
    range: Math.round(range * 10000) / 10000,
    min,
    max,
    sampleSD: Math.round(sampleSD * 10000) / 10000,
    populationSD: Math.round(populationSD * 10000) / 10000,
    sampleVariance: Math.round(sampleVariance * 10000) / 10000,
    populationVariance: Math.round(populationVariance * 10000) / 10000,
  };
}

export interface TriangleInput {
  mode?: 'right' | 'sss' | 'base-height' | 'sas';
  sideA?: number;
  sideB?: number;
  sideC?: number;
  angleC?: number; // degrees (for SAS mode)
  base?: number;
  height?: number;
}

export interface TriangleResult {
  sideA: number;
  sideB: number;
  sideC: number;
  angleA: number; // degrees
  angleB: number; // degrees
  angleC: number; // degrees
  area: number;
  perimeter: number;
}

export function calculateTriangle(input: TriangleInput): TriangleResult | null {
  const mode = input.mode || (input.angleC !== undefined ? 'sas' : 'sss');

  if (mode === 'sas') {
    const a = Math.max(0.1, input.sideA || 5);
    const b = Math.max(0.1, input.sideB || 5);
    const cAngleDeg = Math.min(179, Math.max(1, input.angleC || 60));
    const cRad = (cAngleDeg * Math.PI) / 180;

    // Law of cosines: c^2 = a^2 + b^2 - 2ab cos(C)
    const cSq = a * a + b * b - 2 * a * b * Math.cos(cRad);
    const c = Math.sqrt(Math.max(0.01, cSq));

    // Area = 0.5 * a * b * sin(C)
    const area = 0.5 * a * b * Math.sin(cRad);
    const perimeter = a + b + c;

    // Law of sines for angles
    const aAngleRad = Math.asin(Math.min(1, Math.max(-1, (a * Math.sin(cRad)) / c)));
    let aAngleDeg = (aAngleRad * 180) / Math.PI;
    let bAngleDeg = 180 - cAngleDeg - aAngleDeg;

    return {
      sideA: Math.round(a * 100) / 100,
      sideB: Math.round(b * 100) / 100,
      sideC: Math.round(c * 100) / 100,
      angleA: Math.round(aAngleDeg * 10) / 10,
      angleB: Math.round(bAngleDeg * 10) / 10,
      angleC: Math.round(cAngleDeg * 10) / 10,
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter * 100) / 100,
    };
  }

  if (mode === 'base-height') {
    const b = Math.max(0.1, input.base || 10);
    const h = Math.max(0.1, input.height || 8);
    const area = 0.5 * b * h;
    // Assume isosceles for side estimation
    const halfB = b / 2;
    const hyp = Math.sqrt(halfB * halfB + h * h);
    return {
      sideA: Math.round(hyp * 100) / 100,
      sideB: Math.round(hyp * 100) / 100,
      sideC: b,
      angleA: Math.round((Math.atan(h / halfB) * (180 / Math.PI)) * 10) / 10,
      angleB: Math.round((Math.atan(h / halfB) * (180 / Math.PI)) * 10) / 10,
      angleC: Math.round((180 - 2 * (Math.atan(h / halfB) * (180 / Math.PI))) * 10) / 10,
      area: Math.round(area * 100) / 100,
      perimeter: Math.round((b + 2 * hyp) * 100) / 100,
    };
  }

  if (input.mode === 'right') {
    const a = Math.max(0.1, input.sideA || 3);
    const b = Math.max(0.1, input.sideB || 4);
    const c = Math.sqrt(a * a + b * b);
    const area = 0.5 * a * b;
    const angleA = Math.atan(a / b) * (180 / Math.PI);
    const angleB = 90 - angleA;
    return {
      sideA: a,
      sideB: b,
      sideC: Math.round(c * 100) / 100,
      angleA: Math.round(angleA * 10) / 10,
      angleB: Math.round(angleB * 10) / 10,
      angleC: 90,
      area: Math.round(area * 100) / 100,
      perimeter: Math.round((a + b + c) * 100) / 100,
    };
  }

  // SSS general
  const a = Math.max(0.1, input.sideA || 5);
  const b = Math.max(0.1, input.sideB || 6);
  const c = Math.max(0.1, input.sideC || 7);

  // Triangle inequality check
  if (a + b <= c || a + c <= b || b + c <= a) {
    return null;
  }

  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  const cosA = (b * b + c * c - a * a) / (2 * b * c);
  const cosB = (a * a + c * c - b * b) / (2 * a * c);
  const angleA = Math.acos(Math.max(-1, Math.min(1, cosA))) * (180 / Math.PI);
  const angleB = Math.acos(Math.max(-1, Math.min(1, cosB))) * (180 / Math.PI);
  const angleC = 180 - angleA - angleB;

  return {
    sideA: a,
    sideB: b,
    sideC: c,
    angleA: Math.round(angleA * 10) / 10,
    angleB: Math.round(angleB * 10) / 10,
    angleC: Math.round(angleC * 10) / 10,
    area: Math.round(area * 100) / 100,
    perimeter: Math.round((a + b + c) * 100) / 100,
  };
}

export interface RatioResult {
  simplifiedA: number;
  simplifiedB: number;
  decimalValue: number;
  solvedValue?: number;
}

export function calculateRatio(a: number, b: number, c?: number): RatioResult {
  const safeA = Math.abs(a) || 1;
  const safeB = Math.abs(b) || 1;
  const div = gcd(safeA, safeB);
  const simA = safeA / div;
  const simB = safeB / div;

  let solved: number | undefined;
  if (c !== undefined && c !== null && c > 0) {
    // If a / b = c / x => x = (b * c) / a
    solved = Math.round(((safeB * c) / safeA) * 1000) / 1000;
  }

  return {
    simplifiedA: simA,
    simplifiedB: simB,
    decimalValue: Math.round((safeA / safeB) * 10000) / 10000,
    solvedValue: solved,
  };
}

export function generateRandomNumbers(
  min: number,
  max: number,
  count = 1,
  unique = false
): number[] {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const results: number[] = [];

  if (unique && count > high - low + 1) {
    count = high - low + 1;
  }

  const pool = new Set<number>();
  while (results.length < count) {
    const val = Math.floor(Math.random() * (high - low + 1)) + low;
    if (unique) {
      if (!pool.has(val)) {
        pool.add(val);
        results.push(val);
      }
    } else {
      results.push(val);
    }
  }

  return results;
}
