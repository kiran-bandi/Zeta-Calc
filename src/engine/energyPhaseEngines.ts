/**
 * Phase 3: Electricity & Energy Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */
import { convertUnitValue } from './unitEngine';

// 11. Appliance Electricity Cost
export interface ApplianceCostResult {
  powerWatts: number;
  powerKw: number;
  dailyHours: number;
  daysPerMonth: number;
  ratePerKwh: number;
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  co2KgMonthly: number;
}

export function calculateApplianceCost(
  power: number | '',
  powerUnit = 'W',
  hoursPerDay: number | '',
  daysPerMonth: number | '' = 30,
  ratePerKwh: number | '' = ''
): ApplianceCostResult | null {
  if (
    typeof power !== 'number' ||
    typeof hoursPerDay !== 'number' ||
    typeof ratePerKwh !== 'number' ||
    isNaN(power) ||
    isNaN(hoursPerDay) ||
    isNaN(ratePerKwh) ||
    power < 0 ||
    hoursPerDay < 0 ||
    ratePerKwh < 0
  ) {
    return null;
  }

  const days = typeof daysPerMonth === 'number' && !isNaN(daysPerMonth) && daysPerMonth > 0 ? daysPerMonth : 30;
  const clampedHours = Math.min(24, Math.max(0, hoursPerDay));

  const powerWatts = convertUnitValue(power, powerUnit, 'W');
  const powerKw = powerWatts / 1000;

  const dailyKwh = powerKw * clampedHours;
  const monthlyKwh = dailyKwh * days;
  const annualKwh = dailyKwh * 365;

  const dailyCost = dailyKwh * ratePerKwh;
  const monthlyCost = monthlyKwh * ratePerKwh;
  const annualCost = annualKwh * ratePerKwh;

  // Approx 0.85 kg CO2 per kWh grid average
  const co2KgMonthly = monthlyKwh * 0.85;

  return {
    powerWatts: Math.round(powerWatts * 100) / 100,
    powerKw: Math.round(powerKw * 1e4) / 1e4,
    dailyHours: clampedHours,
    daysPerMonth: days,
    ratePerKwh,
    dailyKwh: Math.round(dailyKwh * 1e4) / 1e4,
    monthlyKwh: Math.round(monthlyKwh * 100) / 100,
    annualKwh: Math.round(annualKwh * 100) / 100,
    dailyCost: Math.round(dailyCost * 100) / 100,
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(annualCost * 100) / 100,
    co2KgMonthly: Math.round(co2KgMonthly * 10) / 10,
  };
}

// 12. Electrical Energy Calculator
export type ElectricalEnergyMode = 'power_time' | 'vi_time' | 'vr_time' | 'ir_time';

export interface ElectricalEnergyResult {
  mode: ElectricalEnergyMode;
  energyJoules: number;
  energyKwh: number;
  energyWh: number;
  energyKj: number;
  energyCal: number;
  energyBtu: number;
  formulaUsed: string;
  steps: string[];
}

export function calculateElectricalEnergy(
  mode: ElectricalEnergyMode,
  p: number | '',
  v: number | '',
  i: number | '',
  r: number | '',
  timeVal: number | '',
  powerUnit = 'W',
  voltUnit = 'V',
  currUnit = 'A',
  resUnit = 'Ω',
  timeUnit = 's'
): ElectricalEnergyResult | null {
  if (typeof timeVal !== 'number' || isNaN(timeVal) || timeVal <= 0) return null;
  const tSec = convertUnitValue(timeVal, timeUnit, 's');

  let powerWatts = 0;
  let formula = '';
  const steps: string[] = [];

  if (mode === 'power_time') {
    if (typeof p !== 'number' || isNaN(p) || p < 0) return null;
    powerWatts = convertUnitValue(p, powerUnit, 'W');
    formula = 'E = P × t';
    steps.push(`Power P = ${p} ${powerUnit} (${powerWatts.toFixed(2)} W)`);
    steps.push(`Time t = ${timeVal} ${timeUnit} (${tSec.toFixed(2)} s)`);
  } else if (mode === 'vi_time') {
    if (typeof v !== 'number' || typeof i !== 'number' || isNaN(v) || isNaN(i)) return null;
    const vVolts = convertUnitValue(v, voltUnit, 'V');
    const iAmps = convertUnitValue(i, currUnit, 'A');
    powerWatts = vVolts * iAmps;
    formula = 'E = V × I × t';
    steps.push(`Voltage V = ${v} ${voltUnit} (${vVolts.toFixed(2)} V)`);
    steps.push(`Current I = ${i} ${currUnit} (${iAmps.toFixed(4)} A)`);
    steps.push(`Power P = V × I = ${powerWatts.toFixed(2)} W`);
  } else if (mode === 'vr_time') {
    if (typeof v !== 'number' || typeof r !== 'number' || isNaN(v) || isNaN(r) || r <= 0) return null;
    const vVolts = convertUnitValue(v, voltUnit, 'V');
    const rOhms = convertUnitValue(r, resUnit, 'Ω');
    powerWatts = (vVolts * vVolts) / rOhms;
    formula = 'E = (V² / R) × t';
    steps.push(`Voltage V = ${v} ${voltUnit} (${vVolts.toFixed(2)} V)`);
    steps.push(`Resistance R = ${r} ${resUnit} (${rOhms.toFixed(2)} Ω)`);
    steps.push(`Power P = V² / R = ${powerWatts.toFixed(2)} W`);
  } else if (mode === 'ir_time') {
    if (typeof i !== 'number' || typeof r !== 'number' || isNaN(i) || isNaN(r) || r < 0) return null;
    const iAmps = convertUnitValue(i, currUnit, 'A');
    const rOhms = convertUnitValue(r, resUnit, 'Ω');
    powerWatts = iAmps * iAmps * rOhms;
    formula = 'E = (I² × R) × t';
    steps.push(`Current I = ${i} ${currUnit} (${iAmps.toFixed(4)} A)`);
    steps.push(`Resistance R = ${r} ${resUnit} (${rOhms.toFixed(2)} Ω)`);
    steps.push(`Power P = I² × R = ${powerWatts.toFixed(2)} W`);
  }

  const energyJoules = powerWatts * tSec;
  const energyKwh = energyJoules / 3600000;
  const energyWh = energyJoules / 3600;
  const energyKj = energyJoules / 1000;
  const energyCal = energyJoules / 4.184;
  const energyBtu = energyJoules / 1055.056;

  steps.push(`Total Energy E = ${powerWatts.toFixed(2)} W × ${tSec.toFixed(2)} s = ${energyJoules.toFixed(2)} Joules`);

  return {
    mode,
    energyJoules: Math.round(energyJoules * 100) / 100,
    energyKwh: Math.round(energyKwh * 1e5) / 1e5,
    energyWh: Math.round(energyWh * 100) / 100,
    energyKj: Math.round(energyKj * 100) / 100,
    energyCal: Math.round(energyCal * 100) / 100,
    energyBtu: Math.round(energyBtu * 100) / 100,
    formulaUsed: formula,
    steps,
  };
}

// 13. Solar Panel Calculator
export interface SolarPanelResult {
  dailyKwhNeeded: number;
  peakSunHours: number;
  systemEfficiencyPct: number;
  panelWattageW: number;
  requiredSystemKw: number;
  estimatedPanelCount: number;
  estimatedDailyGenKwh: number;
  estimatedMonthlyGenKwh: number;
  estimatedAnnualGenKwh: number;
  roofAreaRequiredSqM: number;
  roofAreaRequiredSqFt: number;
  assumptions: string[];
}

export function calculateSolarPanel(
  dailyEnergy: number | '',
  dailyEnergyUnit = 'kWh',
  peakSunHours: number | '',
  efficiencyPct: number | '' = 80,
  panelWattage: number | '' = 400
): SolarPanelResult | null {
  if (
    typeof dailyEnergy !== 'number' ||
    typeof peakSunHours !== 'number' ||
    isNaN(dailyEnergy) ||
    isNaN(peakSunHours) ||
    dailyEnergy <= 0 ||
    peakSunHours <= 0
  ) {
    return null;
  }

  const dailyKwh = dailyEnergyUnit === 'Wh' ? dailyEnergy / 1000 : dailyEnergy;
  const eff = typeof efficiencyPct === 'number' && !isNaN(efficiencyPct) && efficiencyPct > 0 ? efficiencyPct / 100 : 0.8;
  const pWatt = typeof panelWattage === 'number' && !isNaN(panelWattage) && panelWattage > 0 ? panelWattage : 400;

  // Required system capacity (kW) = Daily kWh / (Peak Sun Hours * efficiency)
  const requiredSystemKw = dailyKwh / (peakSunHours * eff);
  const totalWatts = requiredSystemKw * 1000;
  const estimatedPanelCount = Math.ceil(totalWatts / pWatt);

  const actualSystemKw = (estimatedPanelCount * pWatt) / 1000;
  const estimatedDailyGenKwh = actualSystemKw * peakSunHours * eff;
  const estimatedMonthlyGenKwh = estimatedDailyGenKwh * 30;
  const estimatedAnnualGenKwh = estimatedDailyGenKwh * 365;

  // Approx ~1.8 sq meters / ~19.5 sq ft per 400W modern residential panel
  const roofAreaRequiredSqM = Math.round(estimatedPanelCount * 1.9 * 10) / 10;
  const roofAreaRequiredSqFt = Math.round(roofAreaRequiredSqM * 10.7639);

  return {
    dailyKwhNeeded: Math.round(dailyKwh * 100) / 100,
    peakSunHours,
    systemEfficiencyPct: Math.round(eff * 100),
    panelWattageW: pWatt,
    requiredSystemKw: Math.round(requiredSystemKw * 100) / 100,
    estimatedPanelCount,
    estimatedDailyGenKwh: Math.round(estimatedDailyGenKwh * 100) / 100,
    estimatedMonthlyGenKwh: Math.round(estimatedMonthlyGenKwh * 10) / 10,
    estimatedAnnualGenKwh: Math.round(estimatedAnnualGenKwh),
    roofAreaRequiredSqM,
    roofAreaRequiredSqFt,
    assumptions: [
      `Assumes ${peakSunHours} peak sun hours per day and ${Math.round(eff * 100)}% overall system efficiency derate.`,
      `Using modern ${pWatt}W monocrystalline photovoltaic solar panels.`,
      'Calculations factor in inverter clipping, thermal coefficients, wire losses, and average soiling.',
    ],
  };
}

// 14. Solar Savings Calculator
export interface SolarSavingsResult {
  systemKw: number;
  annualGenerationKwh: number;
  annualBillSavings: number;
  annualNetSavings: number;
  lifetimeNetSavings: number;
  simplePaybackYears: number;
  totalRoiPct: number;
  annualizedRoiPct: number;
  co2OffsetTonsAnnual: number;
  chartData: { year: number; cumulativeSavings: number; netCashFlow: number }[];
}

export function calculateSolarSavings(
  systemSizeKw: number | '',
  peakSunHours: number | '',
  electricityRate: number | '',
  systemCost: number | '',
  annualMaintenance: number | '' = 0,
  efficiencyPct: number | '' = 80,
  analysisPeriodYears: number | '' = 25
): SolarSavingsResult | null {
  if (
    typeof systemSizeKw !== 'number' ||
    typeof peakSunHours !== 'number' ||
    typeof electricityRate !== 'number' ||
    typeof systemCost !== 'number' ||
    isNaN(systemSizeKw) ||
    isNaN(peakSunHours) ||
    isNaN(electricityRate) ||
    isNaN(systemCost) ||
    systemSizeKw <= 0 ||
    peakSunHours <= 0 ||
    electricityRate <= 0 ||
    systemCost <= 0
  ) {
    return null;
  }

  const maint = typeof annualMaintenance === 'number' && !isNaN(annualMaintenance) && annualMaintenance >= 0 ? annualMaintenance : 0;
  const eff = typeof efficiencyPct === 'number' && !isNaN(efficiencyPct) && efficiencyPct > 0 ? efficiencyPct / 100 : 0.8;
  const years = typeof analysisPeriodYears === 'number' && !isNaN(analysisPeriodYears) && analysisPeriodYears > 0 ? analysisPeriodYears : 25;

  const annualGenKwh = systemSizeKw * peakSunHours * 365 * eff;
  const annualBillSavings = annualGenKwh * electricityRate;
  const annualNetSavings = annualBillSavings - maint;

  const simplePaybackYears = annualNetSavings > 0 ? systemCost / annualNetSavings : 999;
  const lifetimeGrossSavings = annualNetSavings * years;
  const lifetimeNetSavings = lifetimeGrossSavings - systemCost;
  const totalRoiPct = (lifetimeNetSavings / systemCost) * 100;
  const annualizedRoiPct = (annualNetSavings / systemCost) * 100;

  const co2OffsetTonsAnnual = (annualGenKwh * 0.85) / 1000;

  const chartData: { year: number; cumulativeSavings: number; netCashFlow: number }[] = [];
  for (let yr = 0; yr <= years; yr++) {
    const cumSavings = yr * annualNetSavings;
    const netFlow = cumSavings - systemCost;
    chartData.push({
      year: yr,
      cumulativeSavings: Math.round(cumSavings),
      netCashFlow: Math.round(netFlow),
    });
  }

  return {
    systemKw: systemSizeKw,
    annualGenerationKwh: Math.round(annualGenKwh),
    annualBillSavings: Math.round(annualBillSavings * 100) / 100,
    annualNetSavings: Math.round(annualNetSavings * 100) / 100,
    lifetimeNetSavings: Math.round(lifetimeNetSavings * 100) / 100,
    simplePaybackYears: Math.round(simplePaybackYears * 10) / 10,
    totalRoiPct: Math.round(totalRoiPct * 10) / 10,
    annualizedRoiPct: Math.round(annualizedRoiPct * 10) / 10,
    co2OffsetTonsAnnual: Math.round(co2OffsetTonsAnnual * 10) / 10,
    chartData,
  };
}
