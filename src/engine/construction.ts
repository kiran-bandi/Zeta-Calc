/**
 * Construction & Home Utility Engine for OmniEveryday
 * Deterministic math for concrete, cement mixes, paint, tiles, room areas, electricity tariffs, and HVAC sizing.
 */

export interface ConcreteInput {
  shape: 'slab' | 'footing' | 'column';
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  diameterFeet?: number;
  quantity?: number;
}

export interface ConcreteResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags60lb: number;
  bags80lb: number;
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const qty = Math.max(1, input.quantity || 1);
  let cuFt = 0;

  if (input.shape === 'column') {
    const r = Math.max(0.1, (input.diameterFeet || 1) / 2);
    const h = Math.max(0.1, input.depthInches / 12);
    cuFt = Math.PI * r * r * h * qty;
  } else {
    // slab or footing
    const l = Math.max(0.1, input.lengthFeet);
    const w = Math.max(0.1, input.widthFeet);
    const d = Math.max(0.1, input.depthInches / 12);
    cuFt = l * w * d * qty;
  }

  // 1 cubic yard = 27 cubic feet
  const cubicYards = cuFt / 27;
  // 1 cubic meter = 35.3147 cubic feet
  const cubicMeters = cuFt / 35.3147;

  // A 60lb bag yields ~0.45 cu ft
  const bags60lb = Math.ceil(cuFt / 0.45);
  // An 80lb bag yields ~0.60 cu ft
  const bags80lb = Math.ceil(cuFt / 0.60);

  return {
    cubicFeet: Math.round(cuFt * 100) / 100,
    cubicYards: Math.round(cubicYards * 100) / 100,
    cubicMeters: Math.round(cubicMeters * 100) / 100,
    bags60lb,
    bags80lb,
  };
}

export interface PaintInput {
  lengthFeet: number;
  widthFeet: number;
  heightFeet: number;
  doorsCount: number;
  windowsCount: number;
  coats: number;
  includeCeiling: boolean;
}

export interface PaintResult {
  wallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalPaintAreaSqFt: number;
  gallonsNeeded: number;
  litersNeeded: number;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const l = Math.max(1, input.lengthFeet);
  const w = Math.max(1, input.widthFeet);
  const h = Math.max(1, input.heightFeet);
  const coats = Math.max(1, input.coats || 2);

  // Perimeter = 2*(l + w), Wall area = Perimeter * h
  const grossWallArea = 2 * (l + w) * h;
  // Deductions: standard door ~21 sq ft, standard window ~15 sq ft
  const deductions = (input.doorsCount * 21) + (input.windowsCount * 15);
  const netWallArea = Math.max(0, grossWallArea - deductions);

  const ceilingArea = input.includeCeiling ? (l * w) : 0;
  const totalSingleCoatArea = netWallArea + ceilingArea;
  const totalPaintAreaSqFt = totalSingleCoatArea * coats;

  // Standard paint coverage: ~350-400 sq ft per gallon (~9-10 sq m / liter)
  const gallonsNeeded = Math.ceil((totalPaintAreaSqFt / 350) * 10) / 10;
  // 1 gallon = 3.78541 liters
  const litersNeeded = Math.ceil((gallonsNeeded * 3.78541) * 10) / 10;

  return {
    wallAreaSqFt: Math.round(netWallArea),
    ceilingAreaSqFt: Math.round(ceilingArea),
    totalPaintAreaSqFt: Math.round(totalPaintAreaSqFt),
    gallonsNeeded: Math.max(1, Math.ceil(gallonsNeeded)),
    litersNeeded: Math.max(4, Math.ceil(litersNeeded)),
  };
}

export interface TileInput {
  roomLengthFeet: number;
  roomWidthFeet: number;
  tileLengthInches: number;
  tileWidthInches: number;
  wastePercentage: number; // e.g. 10%
  tilesPerBox?: number;
}

export interface TileResult {
  areaSqFt: number;
  areaWithWasteSqFt: number;
  tileCountExact: number;
  tileCountWithWaste: number;
  boxesNeeded: number;
}

export function calculateTile(input: TileInput): TileResult {
  const areaSqFt = Math.max(1, input.roomLengthFeet * input.roomWidthFeet);
  const waste = Math.max(0, input.wastePercentage || 10) / 100;
  const areaWithWaste = areaSqFt * (1 + waste);

  // Tile area in sq ft
  const tileSqFt = Math.max(0.01, (input.tileLengthInches * input.tileWidthInches) / 144);
  const tileCountExact = Math.ceil(areaSqFt / tileSqFt);
  const tileCountWithWaste = Math.ceil(areaWithWaste / tileSqFt);

  const perBox = Math.max(1, input.tilesPerBox || 10);
  const boxesNeeded = Math.ceil(tileCountWithWaste / perBox);

  return {
    areaSqFt: Math.round(areaSqFt * 10) / 10,
    areaWithWasteSqFt: Math.round(areaWithWaste * 10) / 10,
    tileCountExact,
    tileCountWithWaste,
    boxesNeeded,
  };
}

export interface ElectricityBillInput {
  wattage: number; // Watts
  dailyHours: number; // Hours per day
  costPerKWh: number; // Rate per kWh
}

export interface ElectricityBillResult {
  dailyKWh: number;
  monthlyKWh: number;
  annualKWh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
}

export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const watts = Math.max(0, input.wattage);
  const hours = Math.max(0, Math.min(24, input.dailyHours));
  const rate = Math.max(0, input.costPerKWh);

  const dailyKWh = (watts * hours) / 1000;
  const monthlyKWh = dailyKWh * 30;
  const annualKWh = dailyKWh * 365;

  const dailyCost = dailyKWh * rate;
  const monthlyCost = monthlyKWh * rate;
  const annualCost = annualKWh * rate;

  return {
    dailyKWh: Math.round(dailyKWh * 100) / 100,
    monthlyKWh: Math.round(monthlyKWh * 10) / 10,
    annualKWh: Math.round(annualKWh),
    dailyCost: Math.round(dailyCost * 100) / 100,
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(annualCost * 100) / 100,
  };
}

export interface CoolingBTUInput {
  lengthFeet: number;
  widthFeet: number;
  ceilingHeightFeet: number;
  sunExposure: 'shady' | 'normal' | 'sunny';
  occupants: number;
}

export interface CoolingBTUResult {
  roomSqFt: number;
  baseBTU: number;
  adjustedBTU: number;
  recommendedTons: number;
  guideline: string;
}

export function calculateCoolingBTU(input: CoolingBTUInput): CoolingBTUResult {
  const sqFt = Math.max(20, input.lengthFeet * input.widthFeet);
  // Base cooling: ~20 to 25 BTU per sq ft for 8ft ceilings
  let btu = sqFt * 25;

  // Adjust for ceiling height > 8ft
  if (input.ceilingHeightFeet > 8) {
    btu *= 1 + (input.ceilingHeightFeet - 8) * 0.05;
  }

  // Sunlight adjustment
  if (input.sunExposure === 'shady') {
    btu *= 0.9;
  } else if (input.sunExposure === 'sunny') {
    btu *= 1.15;
  }

  // Occupancy: add 600 BTU per person beyond 2
  if (input.occupants > 2) {
    btu += (input.occupants - 2) * 600;
  }

  const finalBTU = Math.round(btu);
  // 1 Ton of AC cooling = 12,000 BTU
  const tons = Math.round((finalBTU / 12000) * 10) / 10;

  let guideline = '1.0 Ton AC';
  if (finalBTU > 21000) guideline = '2.0 Ton AC (or multi-split)';
  else if (finalBTU > 15000) guideline = '1.5 Ton AC';
  else if (finalBTU > 10500) guideline = '1.0 - 1.2 Ton AC';
  else guideline = '0.75 - 1.0 Ton AC';

  return {
    roomSqFt: Math.round(sqFt),
    baseBTU: Math.round(sqFt * 25),
    adjustedBTU: finalBTU,
    recommendedTons: tons,
    guideline,
  };
}
