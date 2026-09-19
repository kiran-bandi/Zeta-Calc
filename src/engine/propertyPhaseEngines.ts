/**
 * Phase 4: Property & Construction Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */
import { convertUnitValue } from './unitEngine';

// 15. Mortgage Interest vs Principal
export interface MortgageAmortizationMonth {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface MortgagePrincipalInterestResult {
  monthlyPayment: number;
  totalPayments: number;
  totalPrincipal: number;
  totalInterest: number;
  principalPercent: number;
  interestPercent: number;
  crossoverMonth: number | null; // The month when principal portion first exceeds interest portion
  crossoverYear: number | null;
  amortizationSchedule: MortgageAmortizationMonth[];
  yearlySummary: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    endingBalance: number;
  }[];
}

export function calculateMortgagePrincipalInterest(
  loanAmount: number | '',
  interestRatePct: number | '',
  termYears: number | '',
  extraMonthlyPayment: number | '' = 0
): MortgagePrincipalInterestResult | null {
  if (
    typeof loanAmount !== 'number' ||
    typeof interestRatePct !== 'number' ||
    typeof termYears !== 'number' ||
    isNaN(loanAmount) ||
    isNaN(interestRatePct) ||
    isNaN(termYears) ||
    loanAmount <= 0 ||
    interestRatePct < 0 ||
    termYears <= 0
  ) {
    return null;
  }

  const extra = typeof extraMonthlyPayment === 'number' && !isNaN(extraMonthlyPayment) && extraMonthlyPayment > 0 ? extraMonthlyPayment : 0;
  const totalMonths = Math.round(termYears * 12);
  const monthlyRate = interestRatePct / 100 / 12;

  let baseMonthlyPmt = 0;
  if (monthlyRate === 0) {
    baseMonthlyPmt = loanAmount / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    baseMonthlyPmt = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const effectiveMonthlyPmt = baseMonthlyPmt + extra;
  let balance = loanAmount;
  let cumPrincipal = 0;
  let cumInterest = 0;
  let crossoverMonth: number | null = null;

  const schedule: MortgageAmortizationMonth[] = [];
  const yearlyMap = new Map<number, { principal: number; interest: number; endBal: number }>();

  for (let m = 1; m <= totalMonths && balance > 0.01; m++) {
    const interestPmt = balance * monthlyRate;
    let principalPmt = effectiveMonthlyPmt - interestPmt;

    if (principalPmt > balance) {
      principalPmt = balance;
    }

    balance -= principalPmt;
    cumPrincipal += principalPmt;
    cumInterest += interestPmt;

    if (crossoverMonth === null && principalPmt >= interestPmt) {
      crossoverMonth = m;
    }

    const yr = Math.ceil(m / 12);
    const existingYr = yearlyMap.get(yr) || { principal: 0, interest: 0, endBal: 0 };
    existingYr.principal += principalPmt;
    existingYr.interest += interestPmt;
    existingYr.endBal = Math.max(0, balance);
    yearlyMap.set(yr, existingYr);

    schedule.push({
      month: m,
      year: yr,
      payment: Math.round((principalPmt + interestPmt) * 100) / 100,
      principal: Math.round(principalPmt * 100) / 100,
      interest: Math.round(interestPmt * 100) / 100,
      remainingBalance: Math.round(Math.max(0, balance) * 100) / 100,
      cumulativePrincipal: Math.round(cumPrincipal * 100) / 100,
      cumulativeInterest: Math.round(cumInterest * 100) / 100,
    });
  }

  const totalPaid = cumPrincipal + cumInterest;
  const principalPct = totalPaid > 0 ? (cumPrincipal / totalPaid) * 100 : 0;
  const interestPct = totalPaid > 0 ? (cumInterest / totalPaid) * 100 : 0;

  const yearlySummary = Array.from(yearlyMap.entries()).map(([year, data]) => ({
    year,
    principalPaid: Math.round(data.principal * 100) / 100,
    interestPaid: Math.round(data.interest * 100) / 100,
    endingBalance: Math.round(data.endBal * 100) / 100,
  }));

  return {
    monthlyPayment: Math.round(baseMonthlyPmt * 100) / 100,
    totalPayments: Math.round(totalPaid * 100) / 100,
    totalPrincipal: Math.round(cumPrincipal * 100) / 100,
    totalInterest: Math.round(cumInterest * 100) / 100,
    principalPercent: Math.round(principalPct * 10) / 10,
    interestPercent: Math.round(interestPct * 10) / 10,
    crossoverMonth,
    crossoverYear: crossoverMonth ? Math.ceil(crossoverMonth / 12) : null,
    amortizationSchedule: schedule,
    yearlySummary,
  };
}

// 16. Landscaping Cost Calculator
export interface LandscapingCostResult {
  areaSqM: number;
  areaSqFt: number;
  areaDisplay: number;
  materialCost: number;
  laborCost: number;
  otherCost: number;
  totalCost: number;
  costPerSqUnit: number;
  materialPercent: number;
  laborPercent: number;
}

export function calculateLandscapingCost(
  areaVal: number | '',
  areaUnit = 'sq ft',
  materialCostPerArea: number | '',
  laborCostPerArea: number | '',
  otherCosts: number | '' = 0
): LandscapingCostResult | null {
  if (
    typeof areaVal !== 'number' ||
    typeof materialCostPerArea !== 'number' ||
    typeof laborCostPerArea !== 'number' ||
    isNaN(areaVal) ||
    isNaN(materialCostPerArea) ||
    isNaN(laborCostPerArea) ||
    areaVal <= 0 ||
    materialCostPerArea < 0 ||
    laborCostPerArea < 0
  ) {
    return null;
  }

  const other = typeof otherCosts === 'number' && !isNaN(otherCosts) && otherCosts >= 0 ? otherCosts : 0;
  const areaSqM = convertUnitValue(areaVal, areaUnit, 'sq m');
  const areaSqFt = convertUnitValue(areaVal, areaUnit, 'sq ft');

  const materialCost = areaVal * materialCostPerArea;
  const laborCost = areaVal * laborCostPerArea;
  const totalCost = materialCost + laborCost + other;

  const costPerSqUnit = areaVal > 0 ? totalCost / areaVal : 0;
  const materialPercent = totalCost > 0 ? (materialCost / totalCost) * 100 : 0;
  const laborPercent = totalCost > 0 ? (laborCost / totalCost) * 100 : 0;

  return {
    areaSqM: Math.round(areaSqM * 10) / 10,
    areaSqFt: Math.round(areaSqFt * 10) / 10,
    areaDisplay: areaVal,
    materialCost: Math.round(materialCost * 100) / 100,
    laborCost: Math.round(laborCost * 100) / 100,
    otherCost: Math.round(other * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerSqUnit: Math.round(costPerSqUnit * 100) / 100,
    materialPercent: Math.round(materialPercent * 10) / 10,
    laborPercent: Math.round(laborPercent * 10) / 10,
  };
}

// 17. Drywall Calculator
export interface DrywallResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  sheetType: string;
  sheetAreaSqFt: number;
  wastePercent: number;
  exactSheets: number;
  requiredSheets: number;
  screwsCount: number; // approx 32 screws per 4x8 sheet
  jointCompoundGallons: number; // approx 1.2 gallons per 100 sq ft
  drywallTapeFeet: number; // approx 1 roll (250 ft) per 500 sq ft
}

export function calculateDrywall(
  mode: 'dimensions' | 'area',
  lengthVal: number | '',
  heightVal: number | '',
  wallCount: number | '' = 4,
  totalAreaVal: number | '' = '',
  sheetSize: '4x8' | '4x10' | '4x12' | 'custom' = '4x8',
  customSheetWidthFt: number | '' = 4,
  customSheetLengthFt: number | '' = 8,
  wastePercent: number | '' = 10,
  dimUnit = 'ft'
): DrywallResult | null {
  let areaSqFt = 0;

  if (mode === 'dimensions') {
    if (typeof lengthVal !== 'number' || typeof heightVal !== 'number' || isNaN(lengthVal) || isNaN(heightVal) || lengthVal <= 0 || heightVal <= 0) {
      return null;
    }
    const lenFt = convertUnitValue(lengthVal, dimUnit, 'ft');
    const hFt = convertUnitValue(heightVal, dimUnit, 'ft');
    const count = typeof wallCount === 'number' && !isNaN(wallCount) && wallCount > 0 ? wallCount : 1;
    areaSqFt = lenFt * hFt * count;
  } else {
    if (typeof totalAreaVal !== 'number' || isNaN(totalAreaVal) || totalAreaVal <= 0) return null;
    areaSqFt = totalAreaVal; // Assume sq ft
  }

  let sheetAreaSqFt = 32;
  let sheetLabel = '4 × 8 ft (32 sq ft)';
  if (sheetSize === '4x10') {
    sheetAreaSqFt = 40;
    sheetLabel = '4 × 10 ft (40 sq ft)';
  } else if (sheetSize === '4x12') {
    sheetAreaSqFt = 48;
    sheetLabel = '4 × 12 ft (48 sq ft)';
  } else if (sheetSize === 'custom') {
    const w = typeof customSheetWidthFt === 'number' && customSheetWidthFt > 0 ? customSheetWidthFt : 4;
    const l = typeof customSheetLengthFt === 'number' && customSheetLengthFt > 0 ? customSheetLengthFt : 8;
    sheetAreaSqFt = w * l;
    sheetLabel = `${w} × ${l} ft (${sheetAreaSqFt} sq ft)`;
  }

  const waste = typeof wastePercent === 'number' && !isNaN(wastePercent) && wastePercent >= 0 ? wastePercent : 10;
  const totalAreaWithWaste = areaSqFt * (1 + waste / 100);
  const exactSheets = totalAreaWithWaste / sheetAreaSqFt;
  const requiredSheets = Math.ceil(exactSheets);

  const screwsCount = requiredSheets * 32;
  const jointCompoundGallons = Math.round((areaSqFt / 100) * 1.2 * 10) / 10;
  const drywallTapeFeet = Math.round((areaSqFt / 500) * 250);

  return {
    totalAreaSqFt: Math.round(areaSqFt * 10) / 10,
    totalAreaSqM: Math.round(areaSqFt * 0.092903 * 10) / 10,
    sheetType: sheetLabel,
    sheetAreaSqFt,
    wastePercent: waste,
    exactSheets: Math.round(exactSheets * 100) / 100,
    requiredSheets,
    screwsCount,
    jointCompoundGallons,
    drywallTapeFeet,
  };
}

// 18. Lumber Calculator
export interface LumberBoardFeetResult {
  mode: 'board_feet';
  thicknessInches: number;
  widthInches: number;
  lengthFeet: number;
  quantity: number;
  boardFeetPerPiece: number;
  totalBoardFeet: number;
  totalLinearFeet: number;
}

export interface LumberStudResult {
  mode: 'stud_estimate';
  wallLengthFeet: number;
  spacingInches: 16 | 24;
  cornersCount: number;
  intersectingWallsCount: number;
  baseStuds: number;
  cornerStuds: number;
  topBottomPlatesStuds: number;
  wasteStuds: number;
  totalStudsRecommended: number;
}

export function calculateLumberBoardFeet(
  thickness: number | '',
  width: number | '',
  length: number | '',
  quantity: number | '' = 1,
  dimUnit = 'in',
  lengthUnit = 'ft'
): LumberBoardFeetResult | null {
  if (
    typeof thickness !== 'number' ||
    typeof width !== 'number' ||
    typeof length !== 'number' ||
    isNaN(thickness) ||
    isNaN(width) ||
    isNaN(length) ||
    thickness <= 0 ||
    width <= 0 ||
    length <= 0
  ) {
    return null;
  }

  const tIn = convertUnitValue(thickness, dimUnit, 'in');
  const wIn = convertUnitValue(width, dimUnit, 'in');
  const lFt = convertUnitValue(length, lengthUnit, 'ft');
  const qty = typeof quantity === 'number' && !isNaN(quantity) && quantity > 0 ? quantity : 1;

  // Board Feet = (Thickness in * Width in * Length ft) / 12
  const bfPerPiece = (tIn * wIn * lFt) / 12;
  const totalBf = bfPerPiece * qty;

  return {
    mode: 'board_feet',
    thicknessInches: Math.round(tIn * 100) / 100,
    widthInches: Math.round(wIn * 100) / 100,
    lengthFeet: Math.round(lFt * 100) / 100,
    quantity: qty,
    boardFeetPerPiece: Math.round(bfPerPiece * 100) / 100,
    totalBoardFeet: Math.round(totalBf * 100) / 100,
    totalLinearFeet: Math.round(lFt * qty * 100) / 100,
  };
}

export function calculateLumberStuds(
  wallLength: number | '',
  spacingInches: 16 | 24 = 16,
  cornersCount: number | '' = 2,
  intersectingWalls: number | '' = 0,
  lengthUnit = 'ft'
): LumberStudResult | null {
  if (typeof wallLength !== 'number' || isNaN(wallLength) || wallLength <= 0) return null;

  const wallFt = convertUnitValue(wallLength, lengthUnit, 'ft');
  const corners = typeof cornersCount === 'number' && !isNaN(cornersCount) && cornersCount >= 0 ? cornersCount : 0;
  const intersections = typeof intersectingWalls === 'number' && !isNaN(intersectingWalls) && intersectingWalls >= 0 ? intersectingWalls : 0;

  // Basic formula: Wall length in inches / spacing + 1 starter stud
  const wallInches = wallFt * 12;
  const baseStuds = Math.ceil(wallInches / spacingInches) + 1;

  // 2 extra studs per 90° corner for nailing backing, 1 extra per intersecting partition wall
  const cornerStuds = corners * 2 + intersections * 1;

  // Top plate (double) + bottom plate (single) = 3x wall length in linear studs
  // Assuming 8ft studs for 8ft wall
  const platesStuds = Math.ceil((wallFt * 3) / 8);

  const subtotal = baseStuds + cornerStuds + platesStuds;
  const wasteStuds = Math.ceil(subtotal * 0.1); // 10% waste/cull allowance
  const totalStudsRecommended = subtotal + wasteStuds;

  return {
    mode: 'stud_estimate',
    wallLengthFeet: Math.round(wallFt * 10) / 10,
    spacingInches,
    cornersCount: corners,
    intersectingWallsCount: intersections,
    baseStuds,
    cornerStuds,
    topBottomPlatesStuds: platesStuds,
    wasteStuds,
    totalStudsRecommended,
  };
}

// 19. Stair Calculator
export interface StairResult {
  totalRiseInches: number;
  totalRiseCm: number;
  riserCount: number;
  actualRiserHeightInches: number;
  actualRiserHeightCm: number;
  treadCount: number;
  treadDepthInches: number;
  treadDepthCm: number;
  totalRunInches: number;
  totalRunFeet: number;
  stringerLengthInches: number;
  stringerLengthFeet: number;
  inclineAngleDegrees: number;
  headroomOk: boolean;
  comfortRuleScore: number; // 2R + T (Ideal 24 - 25 inches)
  isCodeCompliant: boolean;
  warnings: string[];
}

export function calculateStairs(
  totalRise: number | '',
  maxRiserHeight: number | '' = 7.75,
  preferredTreadDepth: number | '' = 10,
  unit = 'in'
): StairResult | null {
  if (typeof totalRise !== 'number' || isNaN(totalRise) || totalRise <= 0) return null;

  const totalRiseInches = convertUnitValue(totalRise, unit, 'in');
  const maxRiser = typeof maxRiserHeight === 'number' && maxRiserHeight > 0 ? convertUnitValue(maxRiserHeight, unit, 'in') : 7.75;
  const treadDepth = typeof preferredTreadDepth === 'number' && preferredTreadDepth > 0 ? convertUnitValue(preferredTreadDepth, unit, 'in') : 10;

  const riserCount = Math.ceil(totalRiseInches / maxRiser);
  const actualRiserHeight = totalRiseInches / riserCount;
  const treadCount = riserCount - 1; // Standard top step flush with upper landing
  const totalRunInches = treadCount * treadDepth;

  // Stringer length = √(Rise² + Run²)
  const stringerLengthInches = Math.sqrt(totalRiseInches * totalRiseInches + totalRunInches * totalRunInches);
  const inclineAngleRad = Math.atan2(totalRiseInches, totalRunInches);
  const inclineAngleDegrees = (inclineAngleRad * 180) / Math.PI;

  // Blondel's Rule of Comfort: 2 × Riser + Tread = 24" to 25"
  const comfortScore = 2 * actualRiserHeight + treadDepth;

  const warnings: string[] = [];
  let isCodeCompliant = true;

  if (actualRiserHeight > 7.75) {
    warnings.push('Riser height exceeds standard IRC building code maximum of 7.75 inches (19.7 cm).');
    isCodeCompliant = false;
  }
  if (treadDepth < 10) {
    warnings.push('Tread depth is less than standard IRC building code minimum of 10 inches (25.4 cm).');
    isCodeCompliant = false;
  }
  if (inclineAngleDegrees > 42) {
    warnings.push('Stair pitch exceeds 42° — consider increasing total run length for safer slope.');
  }

  return {
    totalRiseInches: Math.round(totalRiseInches * 100) / 100,
    totalRiseCm: Math.round(totalRiseInches * 2.54 * 10) / 10,
    riserCount,
    actualRiserHeightInches: Math.round(actualRiserHeight * 100) / 100,
    actualRiserHeightCm: Math.round(actualRiserHeight * 2.54 * 10) / 10,
    treadCount,
    treadDepthInches: Math.round(treadDepth * 100) / 100,
    treadDepthCm: Math.round(treadDepth * 2.54 * 10) / 10,
    totalRunInches: Math.round(totalRunInches * 100) / 100,
    totalRunFeet: Math.round((totalRunInches / 12) * 100) / 100,
    stringerLengthInches: Math.round(stringerLengthInches * 100) / 100,
    stringerLengthFeet: Math.round((stringerLengthInches / 12) * 100) / 100,
    inclineAngleDegrees: Math.round(inclineAngleDegrees * 10) / 10,
    headroomOk: true,
    comfortRuleScore: Math.round(comfortScore * 10) / 10,
    isCodeCompliant,
    warnings,
  };
}

// 20. Cubic Yard Calculator
export interface CubicYardResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  cubicYards: number;
  cubicFeet: number;
  cubicMeters: number;
  gravelTons: number; // ~1.4 tons per yd³
  topsoilTons: number; // ~1.1 tons per yd³
  mulchTons: number; // ~0.4 tons per yd³
  concreteBags60lb: number; // 60lb bag = ~0.45 cu ft -> ~60 bags per yd³
  concreteBags80lb: number; // 80lb bag = ~0.60 cu ft -> ~45 bags per yd³
}

export function calculateCubicYards(
  lengthVal: number | '',
  widthVal: number | '',
  depthVal: number | '',
  lenUnit = 'ft',
  widthUnit = 'ft',
  depthUnit = 'in'
): CubicYardResult | null {
  if (
    typeof lengthVal !== 'number' ||
    typeof widthVal !== 'number' ||
    typeof depthVal !== 'number' ||
    isNaN(lengthVal) ||
    isNaN(widthVal) ||
    isNaN(depthVal) ||
    lengthVal <= 0 ||
    widthVal <= 0 ||
    depthVal <= 0
  ) {
    return null;
  }

  const lengthFeet = convertUnitValue(lengthVal, lenUnit, 'ft');
  const widthFeet = convertUnitValue(widthVal, widthUnit, 'ft');
  const depthFeet = convertUnitValue(depthVal, depthUnit, 'ft');
  const depthInches = convertUnitValue(depthVal, depthUnit, 'in');

  const cubicFeet = lengthFeet * widthFeet * depthFeet;
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.0283168;

  return {
    lengthFeet: Math.round(lengthFeet * 100) / 100,
    widthFeet: Math.round(widthFeet * 100) / 100,
    depthInches: Math.round(depthInches * 100) / 100,
    cubicYards: Math.round(cubicYards * 100) / 100,
    cubicFeet: Math.round(cubicFeet * 100) / 100,
    cubicMeters: Math.round(cubicMeters * 100) / 100,
    gravelTons: Math.round(cubicYards * 1.4 * 10) / 10,
    topsoilTons: Math.round(cubicYards * 1.1 * 10) / 10,
    mulchTons: Math.round(cubicYards * 0.4 * 10) / 10,
    concreteBags60lb: Math.ceil(cubicFeet / 0.45),
    concreteBags80lb: Math.ceil(cubicFeet / 0.6),
  };
}
