import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { Zap, Sun, DollarSign, BatteryCharging } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import {
  calculateApplianceCost,
  calculateElectricalEnergy,
  calculateSolarPanel,
  calculateSolarSavings,
  ElectricalEnergyMode,
} from '../../../engine/energyPhaseEngines';

export const ENERGY_PHASE_SLUGS = [
  'appliance-electricity-cost-calculator',
  'electrical-energy-calculator',
  'solar-panel-calculator',
  'solar-savings-calculator',
];

interface Props {
  toolSlug: string;
}

export const EnergyPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Appliance Cost
  const [appPower, setAppPower] = useState<number | ''>('');
  const [appPowerUnit, setAppPowerUnit] = useState<string>('W');
  const [appHours, setAppHours] = useState<number | ''>('');
  const [appDays, setAppDays] = useState<number | ''>(30);
  const [appRate, setAppRate] = useState<number | ''>('');
  const appResult = useMemo(
    () => calculateApplianceCost(appPower, appPowerUnit, appHours, appDays, appRate),
    [appPower, appPowerUnit, appHours, appDays, appRate]
  );

  // 2. Electrical Energy
  const [eeMode, setEeMode] = useState<ElectricalEnergyMode>('power_time');
  const [eePower, setEePower] = useState<number | ''>('');
  const [eeVolt, setEeVolt] = useState<number | ''>('');
  const [eeCurr, setEeCurr] = useState<number | ''>('');
  const [eeRes, setEeRes] = useState<number | ''>('');
  const [eeTime, setEeTime] = useState<number | ''>('');
  const [eeTimeUnit, setEeTimeUnit] = useState<string>('s');
  const eeResult = useMemo(
    () => calculateElectricalEnergy(eeMode, eePower, eeVolt, eeCurr, eeRes, eeTime, 'W', 'V', 'A', 'Ω', eeTimeUnit),
    [eeMode, eePower, eeVolt, eeCurr, eeRes, eeTime, eeTimeUnit]
  );

  // 3. Solar Panel Calculator
  const [spDailyEnergy, setSpDailyEnergy] = useState<number | ''>('');
  const [spSunHours, setSpSunHours] = useState<number | ''>('');
  const [spPanelWattage, setSpPanelWattage] = useState<number | ''>(400);
  const spResult = useMemo(
    () => calculateSolarPanel(spDailyEnergy, 'kWh', spSunHours, 80, spPanelWattage),
    [spDailyEnergy, spSunHours, spPanelWattage]
  );

  // 4. Solar Savings Calculator
  const [ssKw, setSsKw] = useState<number | ''>('');
  const [ssSunHours, setSsSunHours] = useState<number | ''>('');
  const [ssRate, setSsRate] = useState<number | ''>('');
  const [ssCost, setSsCost] = useState<number | ''>('');
  const ssResult = useMemo(
    () => calculateSolarSavings(ssKw, ssSunHours, ssRate, ssCost),
    [ssKw, ssSunHours, ssRate, ssCost]
  );

  // =========================================================================
  // VIEW 1: APPLIANCE ELECTRICITY COST
  // =========================================================================
  if (toolSlug === 'appliance-electricity-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="appliance-cost-calc"
        inputsTitle="Appliance Rating & Usage"
        resultsTitle="Electricity Consumption & Cost"
        onReset={() => {
          setAppPower('');
          setAppHours('');
          setAppRate('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <NumberSliderInput
                  label="Appliance Power Rating"
                  value={appPower}
                  onChange={setAppPower}
                  min={1}
                  max={10000}
                  step={10}
                  placeholder="e.g. 1500"
                />
              </div>
              <select
                value={appPowerUnit}
                onChange={(e) => setAppPowerUnit(e.target.value)}
                className="w-20 px-2.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 mb-1"
              >
                <option value="W">Watts (W)</option>
                <option value="kW">Kilowatts (kW)</option>
              </select>
            </div>

            <NumberSliderInput
              label="Hours Used per Day"
              value={appHours}
              onChange={setAppHours}
              min={0.1}
              max={24}
              step={0.5}
              suffix="hrs/day"
              placeholder="e.g. 4"
            />

            <NumberSliderInput
              label={`Electricity Tariff Rate (${currencySymbol} / kWh)`}
              value={appRate}
              onChange={setAppRate}
              min={0.01}
              max={100}
              step={0.05}
              prefix={currencySymbol}
              placeholder="e.g. 0.15"
            />
          </div>
        }
        results={
          appResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Monthly Running Cost
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(appResult.monthlyCost)}
                </div>
                <p className="text-sm text-amber-200">
                  Consumes {appResult.monthlyKwh} kWh / month ({appResult.dailyKwh} kWh / day).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Daily Cost</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(appResult.dailyCost)}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Annual Cost</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(appResult.annualCost)}</div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
                <div>
                  <span className="font-bold">Estimated Carbon Footprint:</span> {appResult.co2KgMonthly} kg CO₂ / mo
                </div>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter appliance wattage, daily hours, and utility tariff rate to compute operating cost.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: ELECTRICAL ENERGY CALCULATOR
  // =========================================================================
  if (toolSlug === 'electrical-energy-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="electrical-energy-calc"
        inputsTitle="Electrical Circuit Parameters"
        resultsTitle="Total Electrical Energy (Work)"
        onReset={() => {
          setEePower('');
          setEeVolt('');
          setEeCurr('');
          setEeRes('');
          setEeTime('');
        }}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Formula Variant</label>
              <select
                value={eeMode}
                onChange={(e) => setEeMode(e.target.value as ElectricalEnergyMode)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="power_time">E = Power (P) × Time (t)</option>
                <option value="vi_time">E = Voltage (V) × Current (I) × Time (t)</option>
                <option value="vr_time">E = (V² / Resistance) × Time (t)</option>
                <option value="ir_time">E = (Current² × Resistance) × Time (t)</option>
              </select>
            </div>

            {eeMode === 'power_time' && (
              <NumberSliderInput
                label="Electric Power (P in Watts)"
                value={eePower}
                onChange={setEePower}
                min={0}
                max={50000}
                step={10}
                placeholder="e.g. 100"
              />
            )}

            {(eeMode === 'vi_time' || eeMode === 'vr_time') && (
              <NumberSliderInput
                label="Voltage (V in Volts)"
                value={eeVolt}
                onChange={setEeVolt}
                min={0}
                max={1000}
                step={1}
                placeholder="e.g. 120"
              />
            )}

            {(eeMode === 'vi_time' || eeMode === 'ir_time') && (
              <NumberSliderInput
                label="Current (I in Amperes)"
                value={eeCurr}
                onChange={setEeCurr}
                min={0}
                max={500}
                step={0.1}
                placeholder="e.g. 2.5"
              />
            )}

            {(eeMode === 'vr_time' || eeMode === 'ir_time') && (
              <NumberSliderInput
                label="Resistance (R in Ohms Ω)"
                value={eeRes}
                onChange={setEeRes}
                min={0.1}
                max={100000}
                step={1}
                placeholder="e.g. 48"
              />
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <NumberSliderInput
                  label="Operating Time Duration"
                  value={eeTime}
                  onChange={setEeTime}
                  min={0.1}
                  max={3600}
                  step={1}
                  placeholder="e.g. 60"
                />
              </div>
              <select
                value={eeTimeUnit}
                onChange={(e) => setEeTimeUnit(e.target.value)}
                className="w-24 px-2.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 mb-1"
              >
                <option value="s">Seconds</option>
                <option value="min">Minutes</option>
                <option value="h">Hours</option>
                <option value="day">Days</option>
              </select>
            </div>
          </div>
        }
        results={
          eeResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Total Energy ({eeResult.formulaUsed})
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {eeResult.energyJoules.toLocaleString()} <span className="text-xl font-normal text-amber-300">Joules</span>
                </div>
                <p className="text-sm text-amber-200">
                  Equivalent to {eeResult.energyWh} Watt-hours ({eeResult.energyKwh} kWh).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Kilojoules (kJ)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{eeResult.energyKj.toLocaleString()} kJ</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Kilowatt-hours (kWh)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{eeResult.energyKwh} kWh</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-slate-800 mb-1">Calculation Steps:</div>
                {eeResult.steps.map((s, i) => (
                  <div key={i} className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BatteryCharging className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select circuit mode and enter electrical variables to compute total energy.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: SOLAR PANEL CALCULATOR
  // =========================================================================
  if (toolSlug === 'solar-panel-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="solar-panel-calc"
        inputsTitle="Energy Demand & Solar Resource"
        resultsTitle="PV Array Sizing & Panel Count"
        onReset={() => {
          setSpDailyEnergy('');
          setSpSunHours('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Daily Electricity Demand (kWh / day)"
              value={spDailyEnergy}
              onChange={setSpDailyEnergy}
              min={1}
              max={150}
              step={0.5}
              suffix="kWh"
              placeholder="e.g. 25"
            />
            <NumberSliderInput
              label="Peak Sun Hours per Day (Irradiance)"
              value={spSunHours}
              onChange={setSpSunHours}
              min={1}
              max={8}
              step={0.1}
              suffix="hrs"
              placeholder="e.g. 4.5"
            />
            <NumberSliderInput
              label="Solar Panel Rating (Watts)"
              value={spPanelWattage}
              onChange={setSpPanelWattage}
              min={250}
              max={600}
              step={25}
              suffix="W"
              placeholder="400"
            />
          </div>
        }
        results={
          spResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Required Solar System Capacity
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {spResult.requiredSystemKw} kW <span className="text-xl font-normal text-amber-300">({spResult.estimatedPanelCount} Panels)</span>
                </div>
                <p className="text-sm text-amber-200">
                  Estimated generation: {spResult.estimatedMonthlyGenKwh} kWh / month ({spResult.estimatedAnnualGenKwh.toLocaleString()} kWh / yr).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Estimated Panel Count</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{spResult.estimatedPanelCount} × {spResult.panelWattageW}W</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Roof Area Required</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{spResult.roofAreaRequiredSqFt} sq ft ({spResult.roofAreaRequiredSqM} m²)</div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                <div className="font-bold text-amber-900">Engineering Assumptions:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                  {spResult.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Sun className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter daily kWh requirement and solar peak sun hours to size your PV installation.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 4: SOLAR SAVINGS CALCULATOR
  // =========================================================================
  if (toolSlug === 'solar-savings-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="solar-savings-calc"
        inputsTitle="Solar PV Investment Parameters"
        resultsTitle="Financial ROI & Lifetime Savings"
        onReset={() => {
          setSsKw('');
          setSsSunHours('');
          setSsRate('');
          setSsCost('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Solar System Size (kW)"
              value={ssKw}
              onChange={setSsKw}
              min={1}
              max={50}
              step={0.5}
              suffix="kW"
              placeholder="e.g. 6.5"
            />
            <NumberSliderInput
              label="Peak Sun Hours per Day"
              value={ssSunHours}
              onChange={setSsSunHours}
              min={1}
              max={8}
              step={0.1}
              suffix="hrs"
              placeholder="e.g. 4.5"
            />
            <NumberSliderInput
              label={`Electricity Tariff (${currencySymbol} / kWh)`}
              value={ssRate}
              onChange={setSsRate}
              min={0.01}
              max={100}
              step={0.05}
              prefix={currencySymbol}
              placeholder="e.g. 0.16"
            />
            <NumberSliderInput
              label={`Turnkey Installation Cost (${currencySymbol})`}
              value={ssCost}
              onChange={setSsCost}
              min={500}
              max={200000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 15000"
            />
          </div>
        }
        results={
          ssResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  25-Year Lifetime Net Savings
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(ssResult.lifetimeNetSavings)}
                </div>
                <p className="text-sm text-amber-200">
                  Annual bill reduction of {formatMoney(ssResult.annualNetSavings)} / year.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Payback Period</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{ssResult.simplePaybackYears} Years</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Total ROI</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">{ssResult.totalRoiPct}%</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">CO₂ Offset</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{ssResult.co2OffsetTonsAnnual} t/yr</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter system capacity, sun hours, and installation cost to compute solar payback and 25-year ROI.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
