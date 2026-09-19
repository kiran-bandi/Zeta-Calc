/**
 * Canonical Unit Conversion Engine
 *
 * Implements the architecture:
 * [Input: value + unit] -> [Normalize to Canonical Base] -> [Calculate Engine] -> [Format in Target Regional Unit]
 *
 * All factors based on NIST SP 811 & ISO 80000-3.
 */

// Constant conversion factors
export const UNIT_CONVERSIONS = {
  // Distance to canonical km
  distanceToKm: {
    km: 1,
    mi: 1.609344,
    m: 0.001,
    ft: 0.0003048,
    yd: 0.0009144,
    nmi: 1.852,
  },
  // Fuel volume to canonical Liters
  volumeToLiters: {
    L: 1,
    mL: 0.001,
    'gal-US': 3.785411784,
    'gal-imp': 4.54609,
    'qt-US': 0.946352946,
    'pt-US': 0.473176473,
    'fl-oz-US': 0.0295735295625,
    'fl-oz-imp': 0.0284130625,
  },
  // Mass to canonical kg
  massToKg: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    tonne: 1000,
    lb: 0.45359237,
    oz: 0.028349523125,
    stone: 6.35029318,
  },
  // Area to canonical sq meters (m²)
  areaToSqM: {
    'sq m': 1,
    'sq ft': 0.09290304,
    'sq yd': 0.83612736,
    acre: 4046.8564224,
    hectare: 10000,
    'sq km': 1000000,
    'sq mi': 2589988.110336,
  },
  // Speed to canonical km/h
  speedToKmh: {
    'km/h': 1,
    mph: 1.609344,
    'm/s': 3.6,
    knots: 1.852,
  },
} as const;

export type SupportedDistanceUnit = keyof typeof UNIT_CONVERSIONS.distanceToKm;
export type SupportedVolumeUnit = keyof typeof UNIT_CONVERSIONS.volumeToLiters;
export type SupportedMassUnit = keyof typeof UNIT_CONVERSIONS.massToKg;
export type SupportedAreaUnit = keyof typeof UNIT_CONVERSIONS.areaToSqM;
export type SupportedFuelEconomyUnit = 'km/L' | 'L/100km' | 'mpg-US' | 'mpg-imp';

export type DistanceUnit = SupportedDistanceUnit;
export type VolumeUnit = SupportedVolumeUnit;
export type FuelEconomyUnit = SupportedFuelEconomyUnit;

/**
 * Helper to round converted units cleanly without collapsing micro/nano physics numbers to 0
 */
function roundPhysicsUnit(val: number): number {
  if (val === 0 || !isFinite(val)) return val;
  const abs = Math.abs(val);
  if (abs < 1e-4) {
    return Number(val.toPrecision(7));
  }
  return Math.round(val * 1e7) / 1e7;
}

/**
 * Universal Unit Converter function for in-field unit switching.
 * Converts numeric value from one unit to another seamlessly.
 */
export function convertUnitValue(value: number, fromUnit: string, toUnit: string): number {
  if (value == null || isNaN(value) || fromUnit === toUnit) return value;

  // 1. Temperature conversion
  const tempUnits = ['°C', '°F', 'K'];
  if (tempUnits.includes(fromUnit) && tempUnits.includes(toUnit)) {
    let celsius = value;
    if (fromUnit === '°F') celsius = (value - 32) * (5 / 9);
    else if (fromUnit === 'K') celsius = value - 273.15;

    if (toUnit === '°C') return Math.round(celsius * 100) / 100;
    if (toUnit === '°F') return Math.round((celsius * (9 / 5) + 32) * 100) / 100;
    if (toUnit === 'K') return Math.round((celsius + 273.15) * 100) / 100;
  }

  // 2. Length / Distance (Base: Meters)
  const lengthToMeters: Record<string, number> = {
    pm: 1e-12,
    nm: 1e-9,
    'μm': 1e-6,
    um: 1e-6,
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
    nmi: 1852,
    AU: 1.495978707e11,
    au: 1.495978707e11,
    ly: 9.460730472e15,
    pc: 3.085677581e16,
    R_earth: 6.371e6,
    R_sun: 6.9634e8,
    R_moon: 1.7374e6,
    R_jupiter: 6.9911e7,
  };
  if (lengthToMeters[fromUnit] && lengthToMeters[toUnit]) {
    const meters = value * lengthToMeters[fromUnit];
    return roundPhysicsUnit(meters / lengthToMeters[toUnit]);
  }

  // 3. Mass / Weight (Base: Kilograms)
  const massToKg: Record<string, number> = {
    ng: 1e-12,
    'μg': 1e-9,
    ug: 1e-9,
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    tonne: 1000,
    t: 1000,
    oz: 0.028349523125,
    lb: 0.45359237,
    lbs: 0.45359237,
    stone: 6.35029318,
    'ton-US': 907.18474,
    M_earth: 5.9722e24,
    M_sun: 1.9885e30,
    M_moon: 7.342e22,
    M_jupiter: 1.898e27,
    M_mars: 6.4171e23,
  };
  if (massToKg[fromUnit] && massToKg[toUnit]) {
    const kg = value * massToKg[fromUnit];
    return roundPhysicsUnit(kg / massToKg[toUnit]);
  }

  // 4. Area (Base: Square Meters)
  const areaToSqM: Record<string, number> = {
    'mm²': 1e-6,
    mm2: 1e-6,
    'cm²': 0.0001,
    cm2: 0.0001,
    'in²': 0.00064516,
    in2: 0.00064516,
    'sq m': 1,
    'm²': 1,
    m2: 1,
    'sq ft': 0.09290304,
    'ft²': 0.09290304,
    ft2: 0.09290304,
    'sq yd': 0.83612736,
    yd2: 0.83612736,
    acre: 4046.8564224,
    hectare: 10000,
    'sq km': 1000000,
    'km²': 1000000,
    km2: 1000000,
    'sq mi': 2589988.110336,
    mi2: 2589988.110336,
  };
  if (areaToSqM[fromUnit] && areaToSqM[toUnit]) {
    const sqM = value * areaToSqM[fromUnit];
    return roundPhysicsUnit(sqM / areaToSqM[toUnit]);
  }

  // 5. Volume (Base: Liters)
  const volumeToLiters: Record<string, number> = {
    mL: 0.001,
    ml: 0.001,
    L: 1,
    l: 1,
    'cm³': 0.001,
    cm3: 0.001,
    'in³': 0.016387064,
    in3: 0.016387064,
    'm³': 1000,
    m3: 1000,
    'cu ft': 28.316846592,
    'ft³': 28.316846592,
    ft3: 28.316846592,
    'gal-US': 3.785411784,
    'gal-imp': 4.54609,
    'fl-oz-US': 0.0295735295625,
    'fl-oz-imp': 0.0284130625,
    'cup-US': 0.24,
  };
  if (volumeToLiters[fromUnit] && volumeToLiters[toUnit]) {
    const liters = value * volumeToLiters[fromUnit];
    return roundPhysicsUnit(liters / volumeToLiters[toUnit]);
  }

  // 6. Time (Base: Seconds)
  const timeToSeconds: Record<string, number> = {
    ns: 1e-9,
    'μs': 1e-6,
    us: 1e-6,
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    days: 86400,
    weeks: 604800,
    months: 2629800,
    years: 31557600,
  };
  if (timeToSeconds[fromUnit] && timeToSeconds[toUnit]) {
    const s = value * timeToSeconds[fromUnit];
    return roundPhysicsUnit(s / timeToSeconds[toUnit]);
  }

  // 7. Speed (Base: m/s)
  const speedToMps: Record<string, number> = {
    'm/s': 1,
    'km/h': 1 / 3.6,
    mph: 0.44704,
    'ft/s': 0.3048,
    'km/s': 1000,
  };
  if (speedToMps[fromUnit] && speedToMps[toUnit]) {
    const mps = value * speedToMps[fromUnit];
    return roundPhysicsUnit(mps / speedToMps[toUnit]);
  }

  // 8. Acceleration (Base: m/s²)
  const accelToMps2: Record<string, number> = {
    'm/s²': 1,
    'm/s2': 1,
    'ft/s²': 0.3048,
    'ft/s2': 0.3048,
    g: 9.80665,
  };
  if (accelToMps2[fromUnit] && accelToMps2[toUnit]) {
    const mps2 = value * accelToMps2[fromUnit];
    return roundPhysicsUnit(mps2 / accelToMps2[toUnit]);
  }

  // 9. Force (Base: Newton - N)
  const forceToN: Record<string, number> = {
    N: 1,
    n: 1,
    kN: 1000,
    kn: 1000,
    lbf: 4.448221615,
    dyn: 0.00001,
  };
  if (forceToN[fromUnit] && forceToN[toUnit]) {
    const n = value * forceToN[fromUnit];
    return roundPhysicsUnit(n / forceToN[toUnit]);
  }

  // 10. Energy (Base: Joules - J)
  const energyToJ: Record<string, number> = {
    J: 1,
    j: 1,
    kJ: 1000,
    kj: 1000,
    MJ: 1e6,
    mj: 1e6,
    Wh: 3600,
    wh: 3600,
    kWh: 3600000,
    kwh: 3600000,
    MWh: 3600000000,
    mwh: 3600000000,
    cal: 4.184,
    kcal: 4184,
    BTU: 1055.05585,
    eV: 1.602176634e-19,
    ev: 1.602176634e-19,
  };
  if (energyToJ[fromUnit] && energyToJ[toUnit]) {
    const j = value * energyToJ[fromUnit];
    return roundPhysicsUnit(j / energyToJ[toUnit]);
  }

  // 11. Power (Base: Watt - W)
  const powerToW: Record<string, number> = {
    W: 1,
    w: 1,
    kW: 1000,
    kw: 1000,
    MW: 1e6,
    mw: 1e6,
    hp: 745.699872,
    'BTU/h': 0.293071,
  };
  if (powerToW[fromUnit] && powerToW[toUnit]) {
    const w = value * powerToW[fromUnit];
    return roundPhysicsUnit(w / powerToW[toUnit]);
  }

  // 12. Pressure (Base: Pascal - Pa)
  const pressureToPa: Record<string, number> = {
    Pa: 1,
    pa: 1,
    kPa: 1000,
    kpa: 1000,
    MPa: 1000000,
    mpa: 1000000,
    bar: 100000,
    psi: 6894.75729,
    atm: 101325,
    mmHg: 133.322387415,
    mmhg: 133.322387415,
  };
  if (pressureToPa[fromUnit] && pressureToPa[toUnit]) {
    const pa = value * pressureToPa[fromUnit];
    return roundPhysicsUnit(pa / pressureToPa[toUnit]);
  }

  // 13. Density (Base: kg/m³)
  const densityToKgM3: Record<string, number> = {
    'kg/m³': 1,
    'kg/m3': 1,
    'g/cm³': 1000,
    'g/cm3': 1000,
    'g/mL': 1000,
    'g/ml': 1000,
    'kg/L': 1000,
    'kg/l': 1000,
    'lb/ft³': 16.018463,
    'lb/ft3': 16.018463,
  };
  if (densityToKgM3[fromUnit] && densityToKgM3[toUnit]) {
    const kgm3 = value * densityToKgM3[fromUnit];
    return roundPhysicsUnit(kgm3 / densityToKgM3[toUnit]);
  }

  // 14. Torque (Base: N·m)
  const torqueToNm: Record<string, number> = {
    'N·m': 1,
    'n-m': 1,
    'kN·m': 1000,
    'kn-m': 1000,
    'lbf·ft': 1.355817948,
    'lbf-ft': 1.355817948,
    'lbf·in': 0.112984829,
    'lbf-in': 0.112984829,
  };
  if (torqueToNm[fromUnit] && torqueToNm[toUnit]) {
    const nm = value * torqueToNm[fromUnit];
    return roundPhysicsUnit(nm / torqueToNm[toUnit]);
  }

  // 15. Angle (Base: Degrees)
  const angleToDeg: Record<string, number> = {
    deg: 1,
    '°': 1,
    rad: 180 / Math.PI,
    grad: 0.9,
  };
  if (angleToDeg[fromUnit] && angleToDeg[toUnit]) {
    const deg = value * angleToDeg[fromUnit];
    return roundPhysicsUnit(deg / angleToDeg[toUnit]);
  }

  // 16. Frequency (Base: Hertz - Hz)
  const freqToHz: Record<string, number> = {
    Hz: 1,
    hz: 1,
    kHz: 1000,
    khz: 1000,
    MHz: 1000000,
    mhz: 1000000,
    GHz: 1000000000,
    ghz: 1000000000,
    rpm: 1 / 60,
  };
  if (freqToHz[fromUnit] && freqToHz[toUnit]) {
    const hz = value * freqToHz[fromUnit];
    return roundPhysicsUnit(hz / freqToHz[toUnit]);
  }

  // 17. Voltage (Base: Volt - V)
  const voltToV: Record<string, number> = {
    V: 1,
    v: 1,
    mV: 0.001,
    mv: 0.001,
    kV: 1000,
    kv: 1000,
  };
  if (voltToV[fromUnit] && voltToV[toUnit]) {
    const v = value * voltToV[fromUnit];
    return roundPhysicsUnit(v / voltToV[toUnit]);
  }

  // 18. Current (Base: Ampere - A)
  const currToA: Record<string, number> = {
    A: 1,
    a: 1,
    mA: 0.001,
    ma: 0.001,
  };
  if (currToA[fromUnit] && currToA[toUnit]) {
    const a = value * currToA[fromUnit];
    return roundPhysicsUnit(a / currToA[toUnit]);
  }

  // 19. Resistance (Base: Ohm - Ω)
  const resToOhm: Record<string, number> = {
    'Ω': 1,
    ohm: 1,
    'kΩ': 1000,
    kohm: 1000,
    'MΩ': 1e6,
    mohm: 1e6,
  };
  if (resToOhm[fromUnit] && resToOhm[toUnit]) {
    const ohm = value * resToOhm[fromUnit];
    return roundPhysicsUnit(ohm / resToOhm[toUnit]);
  }

  // 20. Digital Data (Base: Bytes)
  const dataToBytes: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
    PB: 1024 * 1024 * 1024 * 1024 * 1024,
  };
  if (dataToBytes[fromUnit] && dataToBytes[toUnit]) {
    const b = value * dataToBytes[fromUnit];
    return roundPhysicsUnit(b / dataToBytes[toUnit]);
  }

  // 21. Flow Rate (Base: Liters per second - L/s)
  const flowToLps: Record<string, number> = {
    'L/s': 1,
    'L/min': 1 / 60,
    'm³/h': 1000 / 3600,
    gpm: 3.785411784 / 60,
  };
  if (flowToLps[fromUnit] && flowToLps[toUnit]) {
    const lps = value * flowToLps[fromUnit];
    return roundPhysicsUnit(lps / flowToLps[toUnit]);
  }

  // 22. Electric Charge (Base: Coulomb - C)
  const chargeToC: Record<string, number> = {
    C: 1,
    c: 1,
    mC: 1e-3,
    mc: 1e-3,
    'μC': 1e-6,
    uC: 1e-6,
    uc: 1e-6,
    nC: 1e-9,
    nc: 1e-9,
    pC: 1e-12,
    pc: 1e-12,
  };
  if (chargeToC[fromUnit] && chargeToC[toUnit]) {
    const c = value * chargeToC[fromUnit];
    return roundPhysicsUnit(c / chargeToC[toUnit]);
  }

  // 23. Capacitance (Base: Farad - F)
  const capToF: Record<string, number> = {
    F: 1,
    f: 1,
    mF: 1e-3,
    mf: 1e-3,
    'μF': 1e-6,
    uF: 1e-6,
    uf: 1e-6,
    nF: 1e-9,
    nf: 1e-9,
    pF: 1e-12,
    pf: 1e-12,
  };
  if (capToF[fromUnit] && capToF[toUnit]) {
    const f = value * capToF[fromUnit];
    return roundPhysicsUnit(f / capToF[toUnit]);
  }

  // 24. Electric Field (Base: N/C or V/m)
  const eFieldToNC: Record<string, number> = {
    'N/C': 1,
    'n/c': 1,
    'V/m': 1,
    'v/m': 1,
    'kV/m': 1000,
    'kv/m': 1000,
    'MV/m': 1e6,
    'mv/m': 1e6,
  };
  if (eFieldToNC[fromUnit] && eFieldToNC[toUnit]) {
    const nc = value * eFieldToNC[fromUnit];
    return roundPhysicsUnit(nc / eFieldToNC[toUnit]);
  }

  // 25. Specific Heat (Base: J/(kg·K))
  const specHeatToSI: Record<string, number> = {
    'J/(kg·K)': 1,
    'J/(kg·°C)': 1,
    'kJ/(kg·K)': 1000,
    'J/(g·°C)': 1000,
    'cal/(g·°C)': 4184,
    'kcal/(kg·°C)': 4184,
    'BTU/(lb·°F)': 4186.8,
  };
  if (specHeatToSI[fromUnit] && specHeatToSI[toUnit]) {
    const si = value * specHeatToSI[fromUnit];
    return roundPhysicsUnit(si / specHeatToSI[toUnit]);
  }

  // 26. Thermal Expansion (Base: 1/K or 1/°C)
  const expToPerK: Record<string, number> = {
    '1/K': 1,
    '1/°C': 1,
    '1/°F': 1.8,
    '10⁻⁶/K': 1e-6,
    '10⁻⁶/°C': 1e-6,
    'μm/(m·K)': 1e-6,
    'ppm/K': 1e-6,
  };
  if (expToPerK[fromUnit] && expToPerK[toUnit]) {
    const perK = value * expToPerK[fromUnit];
    return roundPhysicsUnit(perK / expToPerK[toUnit]);
  }

  // Default fallback if unknown combination
  return value;
}

/**
 * Normalizes distance to canonical kilometers (km)
 */
export function normalizeDistanceToKm(value: number, unit: SupportedDistanceUnit): number {
  if (value == null || isNaN(value)) return 0;
  const factor = UNIT_CONVERSIONS.distanceToKm[unit] || 1;
  return value * factor;
}

/**
 * Converts canonical kilometers (km) to target distance unit
 */
export function convertKmToTarget(km: number, targetUnit: SupportedDistanceUnit): number {
  if (km == null || isNaN(km)) return 0;
  const factor = UNIT_CONVERSIONS.distanceToKm[targetUnit] || 1;
  return km / factor;
}

/**
 * Normalizes volume to canonical Liters (L)
 */
export function normalizeVolumeToLiters(value: number, unit: SupportedVolumeUnit): number {
  if (value == null || isNaN(value)) return 0;
  const factor = UNIT_CONVERSIONS.volumeToLiters[unit] || 1;
  return value * factor;
}

/**
 * Converts canonical Liters (L) to target volume unit
 */
export function convertLitersToTarget(liters: number, targetUnit: SupportedVolumeUnit): number {
  if (liters == null || isNaN(liters)) return 0;
  const factor = UNIT_CONVERSIONS.volumeToLiters[targetUnit] || 1;
  return liters / factor;
}

/**
 * Normalizes fuel economy to canonical km/L
 */
export function normalizeFuelEconomyToKmL(value: number, unit: SupportedFuelEconomyUnit): number {
  if (value == null || isNaN(value) || value <= 0) return 0;

  switch (unit) {
    case 'km/L':
      return value;
    case 'L/100km':
      return 100 / value;
    case 'mpg-US':
      // 1 mi = 1.609344 km; 1 US gal = 3.785411784 L
      return value * (1.609344 / 3.785411784);
    case 'mpg-imp':
      // 1 mi = 1.609344 km; 1 imp gal = 4.54609 L
      return value * (1.609344 / 4.54609);
    default:
      return value;
  }
}

/**
 * Converts canonical km/L to target fuel economy unit
 */
export function convertKmLToTarget(kmL: number, targetUnit: SupportedFuelEconomyUnit): number {
  if (kmL == null || isNaN(kmL) || kmL <= 0) return 0;

  switch (targetUnit) {
    case 'km/L':
      return kmL;
    case 'L/100km':
      return 100 / kmL;
    case 'mpg-US':
      return kmL * (3.785411784 / 1.609344);
    case 'mpg-imp':
      return kmL * (4.54609 / 1.609344);
    default:
      return kmL;
  }
}

/**
 * Normalizes fuel price to canonical price per Liter
 */
export function normalizeFuelPricePerLiter(price: number, volumeUnit: SupportedVolumeUnit): number {
  if (price == null || isNaN(price)) return 0;
  const factor = UNIT_CONVERSIONS.volumeToLiters[volumeUnit] || 1;
  // If price is $3.50 per US gallon, price per liter is 3.50 / 3.785411784
  return price / factor;
}

/**
 * Canonical Fuel Cost Calculation Engine
 * Works across any combination of units seamlessly.
 */
export interface CanonicalFuelCostInput {
  distanceValue: number;
  distanceUnit: SupportedDistanceUnit;
  efficiencyValue: number;
  efficiencyUnit: SupportedFuelEconomyUnit;
  priceValue: number;
  priceVolumeUnit: SupportedVolumeUnit;
  passengers?: number;
}

export interface CanonicalFuelCostResult {
  // Canonical metrics (base SI)
  canonicalDistanceKm: number;
  canonicalLitersNeeded: number;
  canonicalPricePerLiter: number;
  totalCost: number;

  // Regional display quantities
  displayDistance: number;
  displayDistanceUnit: SupportedDistanceUnit;
  displayFuelNeeded: number;
  displayFuelVolumeUnit: SupportedVolumeUnit;
  costPerDistanceUnit: number;
  costPerPassenger: number;
}

export function calculateCanonicalFuelCost(input: CanonicalFuelCostInput): CanonicalFuelCostResult {
  const distKm = normalizeDistanceToKm(input.distanceValue, input.distanceUnit);
  const efficiencyKmL = normalizeFuelEconomyToKmL(input.efficiencyValue, input.efficiencyUnit);
  const pricePerLiter = normalizeFuelPricePerLiter(input.priceValue, input.priceVolumeUnit);
  const passengers = Math.max(1, input.passengers || 1);

  const litersNeeded = efficiencyKmL > 0 ? distKm / efficiencyKmL : 0;
  const totalCost = litersNeeded * pricePerLiter;

  // Format into preferred display units
  const fuelInDisplayUnit = convertLitersToTarget(litersNeeded, input.priceVolumeUnit);
  const costPerDistUnit = input.distanceValue > 0 ? totalCost / input.distanceValue : 0;
  const costPerPerson = totalCost / passengers;

  return {
    canonicalDistanceKm: Math.round(distKm * 100) / 100,
    canonicalLitersNeeded: Math.round(litersNeeded * 100) / 100,
    canonicalPricePerLiter: pricePerLiter,
    totalCost: Math.round(totalCost * 100) / 100,

    displayDistance: input.distanceValue,
    displayDistanceUnit: input.distanceUnit,
    displayFuelNeeded: Math.round(fuelInDisplayUnit * 100) / 100,
    displayFuelVolumeUnit: input.priceVolumeUnit,
    costPerDistanceUnit: Math.round(costPerDistUnit * 100) / 100,
    costPerPassenger: Math.round(costPerPerson * 100) / 100,
  };
}
