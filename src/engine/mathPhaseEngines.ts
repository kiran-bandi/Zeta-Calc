/**
 * Phase 1: Math Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */

// 1. Percentage Increase / Decrease
export interface PercentageChangeResult {
  absoluteChange: number;
  percentageChange: number;
  type: 'increase' | 'decrease' | 'no_change';
  isZeroOriginal: boolean;
  formattedPercentage: string;
  summary: string;
  multiplier: number;
}

export function calculatePercentageChange(
  originalVal: number | '',
  newVal: number | ''
): PercentageChangeResult | null {
  if (typeof originalVal !== 'number' || typeof newVal !== 'number' || isNaN(originalVal) || isNaN(newVal)) {
    return null;
  }

  const absoluteChange = newVal - originalVal;

  if (originalVal === 0) {
    return {
      absoluteChange,
      percentageChange: 0,
      type: newVal > 0 ? 'increase' : newVal < 0 ? 'decrease' : 'no_change',
      isZeroOriginal: true,
      formattedPercentage: 'Undefined (division by zero)',
      summary: `Change from 0 to ${newVal} represents an absolute change of ${absoluteChange}. Percentage change is mathematically undefined.`,
      multiplier: 0,
    };
  }

  const percentageChange = (absoluteChange / Math.abs(originalVal)) * 100;
  const rawPct = (absoluteChange / originalVal) * 100;
  const type = absoluteChange > 0 ? 'increase' : absoluteChange < 0 ? 'decrease' : 'no_change';
  const multiplier = newVal / originalVal;

  return {
    absoluteChange: Math.round(absoluteChange * 1e6) / 1e6,
    percentageChange: Math.round(percentageChange * 1e4) / 1e4,
    type,
    isZeroOriginal: false,
    formattedPercentage: `${rawPct >= 0 ? '+' : ''}${rawPct.toFixed(2)}%`,
    summary: `${type === 'increase' ? 'An increase' : type === 'decrease' ? 'A decrease' : 'No change'} of ${Math.abs(percentageChange).toFixed(2)}% (${absoluteChange >= 0 ? '+' : ''}${absoluteChange}).`,
    multiplier: Math.round(multiplier * 1e4) / 1e4,
  };
}

// 2. Percent of Number
export interface PercentOfNumberResult {
  result: number;
  percentage: number;
  baseNumber: number;
  decimalEquivalent: number;
  fractionEquivalent: string;
  remainderFromTotal: number;
}

export function calculatePercentOfNumber(
  percentage: number | '',
  baseNumber: number | ''
): PercentOfNumberResult | null {
  if (typeof percentage !== 'number' || typeof baseNumber !== 'number' || isNaN(percentage) || isNaN(baseNumber)) {
    return null;
  }

  const decimalEquivalent = percentage / 100;
  const result = baseNumber * decimalEquivalent;
  const remainderFromTotal = baseNumber - result;

  return {
    result: Math.round(result * 1e6) / 1e6,
    percentage,
    baseNumber,
    decimalEquivalent: Math.round(decimalEquivalent * 1e6) / 1e6,
    fractionEquivalent: `${percentage}/100`,
    remainderFromTotal: Math.round(remainderFromTotal * 1e6) / 1e6,
  };
}

// 3. Weighted Average
export interface WeightedItem {
  id: string;
  value: number | '';
  weight: number | '';
  label?: string;
}

export interface WeightedAverageResult {
  weightedAverage: number;
  totalWeight: number;
  sumProduct: number;
  validRowCount: number;
  rows: {
    label: string;
    value: number;
    weight: number;
    contribution: number;
    percentWeight: number;
  }[];
}

export function calculateWeightedAverage(items: WeightedItem[]): WeightedAverageResult | null {
  const valid = items.filter(
    (item) => typeof item.value === 'number' && typeof item.weight === 'number' && !isNaN(item.value) && !isNaN(item.weight)
  ) as { id: string; value: number; weight: number; label?: string }[];

  if (valid.length === 0) return null;

  const totalWeight = valid.reduce((acc, curr) => acc + curr.weight, 0);
  if (totalWeight === 0) return null;

  const sumProduct = valid.reduce((acc, curr) => acc + curr.value * curr.weight, 0);
  const weightedAverage = sumProduct / totalWeight;

  const rows = valid.map((item, idx) => {
    const contribution = (item.value * item.weight) / totalWeight;
    const percentWeight = (item.weight / totalWeight) * 100;
    return {
      label: item.label || `Item ${idx + 1}`,
      value: item.value,
      weight: item.weight,
      contribution: Math.round(contribution * 1e4) / 1e4,
      percentWeight: Math.round(percentWeight * 1e2) / 1e2,
    };
  });

  return {
    weightedAverage: Math.round(weightedAverage * 1e6) / 1e6,
    totalWeight: Math.round(totalWeight * 1e6) / 1e6,
    sumProduct: Math.round(sumProduct * 1e6) / 1e6,
    validRowCount: valid.length,
    rows,
  };
}

// 4. Permutation (nPr)
export interface PermutationResult {
  n: number;
  r: number;
  nPr: string;
  numericValue: number;
  isLarge: boolean;
  formulaSteps: string[];
}

export function calculatePermutation(n: number | '', r: number | ''): PermutationResult | null {
  if (typeof n !== 'number' || typeof r !== 'number' || isNaN(n) || isNaN(r)) return null;
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return null;

  let result = BigInt(1);
  for (let i = 0; i < r; i++) {
    result *= BigInt(n - i);
  }

  const numVal = Number(result);
  const isLarge = result > BigInt(Number.MAX_SAFE_INTEGER);

  return {
    n,
    r,
    nPr: result.toString(),
    numericValue: numVal,
    isLarge,
    formulaSteps: [
      `P(${n}, ${r}) = ${n}! / (${n} - ${r})!`,
      `P(${n}, ${r}) = ${n}! / ${n - r}!`,
      `= ${Array.from({ length: r }, (_, i) => n - i).join(' × ') || '1'}`,
      `= ${result.toString()}`,
    ],
  };
}

// 5. LCM (Least Common Multiple)
export interface LcmResult {
  a: number;
  b: number;
  lcm: number;
  gcd: number;
  product: number;
  formulaSteps: string[];
}

function computeGcd(x: number, y: number): number {
  let a = Math.abs(x);
  let b = Math.abs(y);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function calculateLcm(a: number | '', b: number | ''): LcmResult | null {
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) return null;
  if (!Number.isInteger(a) || !Number.isInteger(b)) return null;

  if (a === 0 || b === 0) {
    return {
      a,
      b,
      lcm: 0,
      gcd: Math.abs(a || b),
      product: 0,
      formulaSteps: [`Since one number is 0, LCM(${a}, ${b}) = 0`],
    };
  }

  const gcd = computeGcd(a, b);
  const product = Math.abs(a * b);
  const lcm = product / gcd;

  return {
    a,
    b,
    lcm,
    gcd,
    product,
    formulaSteps: [
      `GCD(${a}, ${b}) = ${gcd}`,
      `LCM(${a}, ${b}) = |${a} × ${b}| / GCD(${a}, ${b})`,
      `LCM(${a}, ${b}) = ${product} / ${gcd} = ${lcm}`,
    ],
  };
}

// 6. Factorial (n!)
export interface FactorialResult {
  n: number;
  exactValue: string;
  scientificNotation: string;
  trailingZeros: number;
  isLarge: boolean;
  digitCount: number;
}

export function calculateFactorial(n: number | ''): FactorialResult | null {
  if (typeof n !== 'number' || isNaN(n) || !Number.isInteger(n) || n < 0) return null;
  if (n > 500) return null; // Safe computational cap for instant browser response

  let fact = BigInt(1);
  for (let i = 2; i <= n; i++) {
    fact *= BigInt(i);
  }

  const exactStr = fact.toString();
  const digitCount = exactStr.length;

  // Trailing zeros: Legendre's formula
  let trailingZeros = 0;
  let k = 5;
  while (Math.floor(n / k) > 0) {
    trailingZeros += Math.floor(n / k);
    k *= 5;
  }

  let scientificNotation = exactStr;
  if (digitCount > 12) {
    const lead = exactStr.slice(0, 5);
    scientificNotation = `${lead[0]}.${lead.slice(1)} × 10^${digitCount - 1}`;
  }

  return {
    n,
    exactValue: exactStr,
    scientificNotation,
    trailingZeros,
    isLarge: n > 20,
    digitCount,
  };
}

// 7. Quadratic Equation (ax² + bx + c = 0)
export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  rootType: 'two_real' | 'one_real' | 'two_complex';
  root1: string;
  root2: string;
  vertexX: number;
  vertexY: number;
  axisOfSymmetry: number;
  yIntercept: number;
  parabolaOpens: 'up' | 'down';
  formulaSteps: string[];
}

export function calculateQuadratic(a: number | '', b: number | '', c: number | ''): QuadraticResult | null {
  if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number' || isNaN(a) || isNaN(b) || isNaN(c)) {
    return null;
  }
  if (a === 0) return null; // Not a quadratic equation if a = 0

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const parabolaOpens = a > 0 ? 'up' : 'down';

  let rootType: 'two_real' | 'one_real' | 'two_complex';
  let root1 = '';
  let root2 = '';
  const formulaSteps: string[] = [
    `Equation: ${a}x² + ${b}x + ${c} = 0`,
    `Discriminant D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}`,
  ];

  if (discriminant > 0) {
    rootType = 'two_real';
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);
    root1 = (Math.round(r1 * 1e6) / 1e6).toString();
    root2 = (Math.round(r2 * 1e6) / 1e6).toString();
    formulaSteps.push(
      `x₁ = (-(${b}) + √${discriminant}) / (2 × ${a}) = ${root1}`,
      `x₂ = (-(${b}) - √${discriminant}) / (2 × ${a}) = ${root2}`
    );
  } else if (discriminant === 0) {
    rootType = 'one_real';
    const r = -b / (2 * a);
    root1 = (Math.round(r * 1e6) / 1e6).toString();
    root2 = root1;
    formulaSteps.push(`x = -(${b}) / (2 × ${a}) = ${root1} (Repeated real root)`);
  } else {
    rootType = 'two_complex';
    const realPart = Math.round((-b / (2 * a)) * 1e4) / 1e4;
    const imagPart = Math.round((Math.sqrt(Math.abs(discriminant)) / (2 * Math.abs(a))) * 1e4) / 1e4;
    root1 = `${realPart} + ${imagPart}i`;
    root2 = `${realPart} - ${imagPart}i`;
    formulaSteps.push(
      `x₁ = ${realPart} + ${imagPart}i`,
      `x₂ = ${realPart} - ${imagPart}i (Complex conjugate roots)`
    );
  }

  return {
    a,
    b,
    c,
    discriminant: Math.round(discriminant * 1e6) / 1e6,
    rootType,
    root1,
    root2,
    vertexX: Math.round(vertexX * 1e4) / 1e4,
    vertexY: Math.round(vertexY * 1e4) / 1e4,
    axisOfSymmetry: Math.round(vertexX * 1e4) / 1e4,
    yIntercept: c,
    parabolaOpens,
    formulaSteps,
  };
}
