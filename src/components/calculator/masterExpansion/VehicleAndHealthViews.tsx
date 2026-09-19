import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { CurrencyInput } from '../../common/CurrencyInput';
import {
  calculateWhatGradeDoINeed,
  calculateCollegeCost,
  calculateCarDepreciation,
  calculateCarOwnershipCost,
  convertFuelEconomy,
  calculateFuelComparison,
  calculateEVChargingCost,
  calculateEVRange,
  calculateEVVsGasCost,
  calculateTravelTime,
  calculateAverageSpeed,
  calculateMultiLegAverageSpeed,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const VEHICLE_HEALTH_SLUGS = [
  'what-grade-do-i-need-calculator',
  'college-cost-calculator',
  'car-depreciation-calculator',
  'car-ownership-cost-calculator',
  'fuel-economy-converter',
  'ev-charging-cost-calculator',
  'ev-range-calculator',
  'ev-vs-gas-cost-calculator',
  'travel-time-calculator',
  'average-speed-calculator',
];

export const VehicleAndHealthViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. What Grade Do I Need
  const [wgCurrent, setWgCurrent] = useSessionState<number | ''>('wg_cur', 82);
  const [wgTarget, setWgTarget] = useSessionState<number | ''>('wg_tgt', 85);
  const [wgWeight, setWgWeight] = useSessionState<number | ''>('wg_wgt', 30);

  const whatGradeResult = useMemo(() => {
    if (typeof wgCurrent !== 'number' || typeof wgTarget !== 'number' || typeof wgWeight !== 'number') return null;
    return calculateWhatGradeDoINeed(wgCurrent, wgTarget, wgWeight);
  }, [wgCurrent, wgTarget, wgWeight]);

  // 2. College Cost
  const [ccTuition, setCcTuition] = useSessionState<number | ''>('cc_tuition', 18000);
  const [ccRoom, setCcRoom] = useSessionState<number | ''>('cc_room', 12000);
  const [ccBooks, setCcBooks] = useSessionState<number | ''>('cc_books', 1500);
  const [ccPersonal, setCcPersonal] = useSessionState<number | ''>('cc_pers', 2500);
  const [ccAid, setCcAid] = useSessionState<number | ''>('cc_aid', 6000);
  const [ccYears, setCcYears] = useSessionState<number | ''>('cc_yrs', 4);

  const collegeCostResult = useMemo(() => {
    if (typeof ccTuition !== 'number') return null;
    return calculateCollegeCost(
      ccTuition,
      typeof ccRoom === 'number' ? ccRoom : 0,
      typeof ccBooks === 'number' ? ccBooks : 0,
      typeof ccPersonal === 'number' ? ccPersonal : 0,
      typeof ccAid === 'number' ? ccAid : 0,
      typeof ccYears === 'number' ? ccYears : 4
    );
  }, [ccTuition, ccRoom, ccBooks, ccPersonal, ccAid, ccYears]);

  // 3. Car Depreciation
  const [cdPrice, setCdPrice] = useSessionState<number | ''>('cd_price', 35000);
  const [cdRate, setCdRate] = useSessionState<number | ''>('cd_rate', 15);
  const [cdYrs, setCdYrs] = useSessionState<number | ''>('cd_yrs', 5);

  const carDepreciationResult = useMemo(() => {
    if (typeof cdPrice !== 'number' || typeof cdYrs !== 'number') return null;
    return calculateCarDepreciation(cdPrice, cdYrs, typeof cdRate === 'number' ? cdRate : 15);
  }, [cdPrice, cdYrs, cdRate]);

  // 4. Car Ownership Cost
  const [coFinancing, setCoFinancing] = useSessionState<number | ''>('co_fin', 5400); // 450/mo * 12
  const [coIns, setCoIns] = useSessionState<number | ''>('co_ins', 1680);
  const [coFuel, setCoFuel] = useSessionState<number | ''>('co_fuel', 2160);
  const [coMaint, setCoMaint] = useSessionState<number | ''>('co_maint', 960);
  const [coDeprec, setCoDeprec] = useSessionState<number | ''>('co_depr', 3000);
  const [coMiles, setCoMiles] = useSessionState<number | ''>('co_miles', 12000);
  const [coDistUnit, setCoDistUnit] = useSessionState<'miles' | 'km'>('co_dist_u', 'miles');

  const carOwnershipResult = useMemo(() => {
    const rawMiles = typeof coMiles === 'number' ? coMiles : 12000;
    const normalizedMiles = coDistUnit === 'km' ? rawMiles * 0.621371 : rawMiles;
    return calculateCarOwnershipCost(
      typeof coFinancing === 'number' ? coFinancing : 0,
      typeof coIns === 'number' ? coIns : 0,
      typeof coFuel === 'number' ? coFuel : 0,
      typeof coMaint === 'number' ? coMaint : 0,
      typeof coDeprec === 'number' ? coDeprec : 0,
      normalizedMiles
    );
  }, [coFinancing, coIns, coFuel, coMaint, coDeprec, coMiles, coDistUnit]);

  // 5. Fuel Economy Converter & Comparison
  const [feMode, setFeMode] = useSessionState<'convert' | 'compare'>('fe_mode', 'convert');
  const [feVal, setFeVal] = useSessionState<number | ''>('fe_val', 30);
  const [feUnit, setFeUnit] = useSessionState<'US MPG' | 'Imp MPG' | 'L/100km' | 'km/L'>('fe_unit', 'US MPG');

  const [feCompDist, setFeCompDist] = useSessionState<number | ''>('fe_comp_dist', 15000);
  const [feCompDistUnit, setFeCompDistUnit] = useSessionState<'mi' | 'km'>('fe_comp_du', 'mi');
  const [feCompPrice, setFeCompPrice] = useSessionState<number | ''>('fe_comp_price', 3.5);
  const [feCompEffA, setFeCompEffA] = useSessionState<number | ''>('fe_comp_eff_a', 25);
  const [feCompEffB, setFeCompEffB] = useSessionState<number | ''>('fe_comp_eff_b', 38);
  const [feCompUnit, setFeCompUnit] = useSessionState<'US MPG' | 'L/100km' | 'km/L'>('fe_comp_unit', 'US MPG');

  const fuelEconomyResult = useMemo(() => {
    if (typeof feVal !== 'number') return null;
    return convertFuelEconomy(feVal, feUnit);
  }, [feVal, feUnit]);

  const fuelComparisonResult = useMemo(() => {
    if (
      typeof feCompDist !== 'number' ||
      typeof feCompPrice !== 'number' ||
      typeof feCompEffA !== 'number' ||
      typeof feCompEffB !== 'number'
    )
      return null;
    return calculateFuelComparison({
      fuelEconomyA: feCompEffA,
      unitA: feCompUnit,
      fuelEconomyB: feCompEffB,
      unitB: feCompUnit,
      annualDistance: feCompDist,
      distanceUnit: feCompDistUnit,
      fuelPricePerUnit: feCompPrice,
      pricePerVolumeUnit: feCompUnit === 'L/100km' || feCompUnit === 'km/L' ? 'liter' : 'gallon',
    });
  }, [feCompDist, feCompDistUnit, feCompPrice, feCompEffA, feCompEffB, feCompUnit]);

  // 6. EV Charging Cost
  const [evBat, setEvBat] = useSessionState<number | ''>('ev_bat', 75);
  const [evBatUnit, setEvBatUnit] = useSessionState<'kWh' | 'Wh' | 'MWh'>('ev_bat_u', 'kWh');
  const [evInc, setEvInc] = useSessionState<number | ''>('ev_inc', 60); // 20% to 80%
  const [evRate, setEvRate] = useSessionState<number | ''>('ev_rate', 0.16);
  const [evRateUnit, setEvRateUnit] = useSessionState<'per_kwh' | 'cents_kwh'>('ev_rate_u', 'per_kwh');
  const [evEff, setEvEff] = useSessionState<number | ''>('ev_eff', 90);

  const evChargingResult = useMemo(() => {
    if (typeof evBat !== 'number' || typeof evInc !== 'number' || typeof evRate !== 'number') return null;
    const capacityKWh = evBatUnit === 'Wh' ? evBat / 1000 : evBatUnit === 'MWh' ? evBat * 1000 : evBat;
    const rateDollars = evRateUnit === 'cents_kwh' ? evRate / 100 : evRate;
    return calculateEVChargingCost(capacityKWh, evInc, rateDollars, typeof evEff === 'number' ? evEff : 90);
  }, [evBat, evBatUnit, evInc, evRate, evRateUnit, evEff]);

  // 7. EV Range
  const [erBat, setErBat] = useSessionState<number | ''>('er_bat', 65);
  const [erBatUnit, setErBatUnit] = useSessionState<'kWh' | 'Wh' | 'MWh'>('er_bat_u', 'kWh');
  const [erCons, setErCons] = useSessionState<number | ''>('er_cons', 160); // Wh per km
  const [erConsUnit, setErConsUnit] = useSessionState<'Wh/km' | 'Wh/mi' | 'kWh/100km' | 'mi/kWh' | 'km/kWh'>('er_cons_u', 'Wh/km');

  const evRangeResult = useMemo(() => {
    if (typeof erBat !== 'number' || typeof erCons !== 'number' || erCons <= 0) return null;
    const capacityKWh = erBatUnit === 'Wh' ? erBat / 1000 : erBatUnit === 'MWh' ? erBat * 1000 : erBat;
    let consWhPerKm = erCons;
    if (erConsUnit === 'Wh/mi') {
      consWhPerKm = erCons / 1.60934;
    } else if (erConsUnit === 'kWh/100km') {
      consWhPerKm = erCons * 10;
    } else if (erConsUnit === 'mi/kWh') {
      consWhPerKm = (1000 / erCons) / 1.60934;
    } else if (erConsUnit === 'km/kWh') {
      consWhPerKm = 1000 / erCons;
    }
    return calculateEVRange(capacityKWh, consWhPerKm);
  }, [erBat, erBatUnit, erCons, erConsUnit]);

  // 8. EV vs Gas
  const [egDist, setEgDist] = useSessionState<number | ''>('eg_dist', 15000);
  const [egDistUnit, setEgDistUnit] = useSessionState<'km' | 'miles'>('eg_dist_u', 'km');
  const [egGasPrice, setEgGasPrice] = useSessionState<number | ''>('eg_gas_price', 1.45);
  const [egGasPriceUnit, setEgGasPriceUnit] = useSessionState<'per_l' | 'per_gal'>('eg_gp_u', 'per_l');
  const [egGasEff, setEgGasEff] = useSessionState<number | ''>('eg_gas_eff', 8.5); // L/100km
  const [egGasEffUnit, setEgGasEffUnit] = useSessionState<'L/100km' | 'US MPG' | 'Imp MPG' | 'km/L'>('eg_ge_u', 'L/100km');
  const [egElecPrice, setEgElecPrice] = useSessionState<number | ''>('eg_elec_price', 0.18);
  const [egElecPriceUnit, setEgElecPriceUnit] = useSessionState<'per_kwh' | 'cents_kwh'>('eg_ep_u', 'per_kwh');
  const [egEvEff, setEgEvEff] = useSessionState<number | ''>('eg_ev_eff', 17.5); // kWh/100km
  const [egEvEffUnit, setEgEvEffUnit] = useSessionState<'kWh/100km' | 'Wh/km' | 'mi/kWh' | 'km/kWh'>('eg_ee_u', 'kWh/100km');

  const evVsGasResult = useMemo(() => {
    if (
      typeof egDist !== 'number' ||
      typeof egGasPrice !== 'number' ||
      typeof egGasEff !== 'number' ||
      typeof egElecPrice !== 'number' ||
      typeof egEvEff !== 'number' ||
      egGasEff <= 0 ||
      egEvEff <= 0
    )
      return null;

    const distKm = egDistUnit === 'miles' ? egDist * 1.60934 : egDist;
    const gasPricePerL = egGasPriceUnit === 'per_gal' ? egGasPrice / 3.78541 : egGasPrice;
    let gasEffL100km = egGasEff;
    if (egGasEffUnit === 'US MPG') gasEffL100km = 235.215 / egGasEff;
    else if (egGasEffUnit === 'Imp MPG') gasEffL100km = 282.481 / egGasEff;
    else if (egGasEffUnit === 'km/L') gasEffL100km = 100 / egGasEff;

    const elecPricePerKwh = egElecPriceUnit === 'cents_kwh' ? egElecPrice / 100 : egElecPrice;
    let evEffKwh100km = egEvEff;
    if (egEvEffUnit === 'Wh/km') evEffKwh100km = egEvEff / 10;
    else if (egEvEffUnit === 'mi/kWh') evEffKwh100km = (100 / (egEvEff * 1.60934));
    else if (egEvEffUnit === 'km/kWh') evEffKwh100km = 100 / egEvEff;

    return calculateEVVsGasCost(distKm, gasPricePerL, gasEffL100km, elecPricePerKwh, evEffKwh100km);
  }, [
    egDist,
    egDistUnit,
    egGasPrice,
    egGasPriceUnit,
    egGasEff,
    egGasEffUnit,
    egElecPrice,
    egElecPriceUnit,
    egEvEff,
    egEvEffUnit,
  ]);

  // 9. Travel Time
  const [ttDist, setTtDist] = useSessionState<number | ''>('tt_dist', 240);
  const [ttDistUnit, setTtDistUnit] = useSessionState<'miles' | 'km'>('tt_dist_u', 'miles');
  const [ttSpd, setTtSpd] = useSessionState<number | ''>('tt_spd', 60);
  const [ttStops, setTtStops] = useSessionState<number | ''>('tt_stops', 30); // minutes of rest breaks

  const travelTimeResult = useMemo(() => {
    if (typeof ttDist !== 'number' || typeof ttSpd !== 'number' || ttSpd <= 0) return null;
    const base = calculateTravelTime(ttDist, ttSpd);
    const stopMins = typeof ttStops === 'number' ? ttStops : 0;
    const totalMinutes = base.hours * 60 + base.minutes + stopMins;
    const totalH = Math.floor(totalMinutes / 60);
    const totalM = Math.round(totalMinutes % 60);
    return {
      ...base,
      stopMinutes: stopMins,
      totalTripHours: totalH,
      totalTripMinutes: totalM,
      totalTripDecimal: Number((totalMinutes / 60).toFixed(2)),
    };
  }, [ttDist, ttSpd, ttStops]);

  // 10. Average Speed
  const [asMode, setAsMode] = useSessionState<'single' | 'multileg'>('as_mode', 'single');
  const [asDist, setAsDist] = useSessionState<number | ''>('as_dist', 150);
  const [asDistUnit, setAsDistUnit] = useSessionState<'miles' | 'km' | 'meters' | 'feet'>('as_du', 'miles');
  const [asHrs, setAsHrs] = useSessionState<number | ''>('as_hrs', 2);
  const [asMins, setAsMins] = useSessionState<number | ''>('as_mins', 30);
  const [asSecs, setAsSecs] = useSessionState<number | ''>('as_secs', 0);

  // Multi-leg speed state
  const [legs, setLegs] = useSessionState<
    Array<{
      id: string;
      distance: number | '';
      distanceUnit: 'km' | 'mi' | 'm' | 'ft' | 'yd' | 'nmi';
      hours: number | '';
      minutes: number | '';
      seconds: number | '';
    }>
  >('as_legs', [
    { id: '1', distance: 60, distanceUnit: 'mi', hours: 1, minutes: 0, seconds: 0 },
    { id: '2', distance: 40, distanceUnit: 'mi', hours: 1, minutes: 0, seconds: 0 },
  ]);

  const averageSpeedResult = useMemo(() => {
    if (typeof asDist !== 'number' || asDist <= 0) return null;
    const hrs = typeof asHrs === 'number' ? asHrs : 0;
    const mins = typeof asMins === 'number' ? asMins : 0;
    const secs = typeof asSecs === 'number' ? asSecs : 0;
    const totalHours = hrs + mins / 60 + secs / 3600;
    if (totalHours <= 0) return null;

    // Convert distance to standard kilometers and miles
    let distKm = asDist;
    if (asDistUnit === 'miles') distKm = asDist * 1.609344;
    else if (asDistUnit === 'meters') distKm = asDist / 1000;
    else if (asDistUnit === 'feet') distKm = (asDist * 0.3048) / 1000;

    const kmh = distKm / totalHours;
    const mph = kmh / 1.609344;
    const ms = (kmh * 1000) / 3600;
    const knots = kmh / 1.852;
    const fts = ms * 3.28084;

    return {
      mph: Number(mph.toFixed(2)),
      kmh: Number(kmh.toFixed(2)),
      ms: Number(ms.toFixed(2)),
      knots: Number(knots.toFixed(2)),
      fts: Number(fts.toFixed(2)),
      totalHours: Number(totalHours.toFixed(3)),
    };
  }, [asDist, asDistUnit, asHrs, asMins, asSecs]);

  const multiLegResult = useMemo(() => {
    if (!legs || legs.length === 0) return null;
    return calculateMultiLegAverageSpeed(legs);
  }, [legs]);

  // RENDERING
  if (toolSlug === 'what-grade-do-i-need-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="What Grade Do I Need on Final Exam Calculator"
        onReset={() => { setWgCurrent(82); setWgTarget(85); setWgWeight(30); }}
        inputs={
          <div className="space-y-3">
            <UnitNumberInput
              id="wg-current"
              label="Current Class Grade"
              value={wgCurrent}
              onChange={setWgCurrent}
              suffix="%"
              min={0}
              max={150}
            />
            <UnitNumberInput
              id="wg-target"
              label="Desired Final Grade"
              value={wgTarget}
              onChange={setWgTarget}
              suffix="%"
              min={0}
              max={150}
            />
            <UnitNumberInput
              id="wg-weight"
              label="Final Exam Weight"
              value={wgWeight}
              onChange={setWgWeight}
              suffix="%"
              min={1}
              max={100}
            />
          </div>
        }
        results={
          whatGradeResult ? (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${
                whatGradeResult.isAchievable ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
              }`}>
                <span className="text-xs font-semibold uppercase tracking-wider">Required Final Exam Score</span>
                <div className="text-3xl font-bold mt-1">{whatGradeResult.requiredFinalScore}%</div>
                <div className="text-xs mt-1 font-medium">
                  {whatGradeResult.isAchievable ? 'Achievable with standard exam score.' : 'Score exceeds 100% (Requires extra credit).'}
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'college-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="College Degree Cost & Net Price Calculator"
        onReset={() => { setCcTuition(18000); setCcRoom(12000); setCcBooks(1500); setCcPersonal(2500); setCcAid(6000); setCcYears(4); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="cc-tuition"
                label="Annual Tuition"
                value={ccTuition}
                onChange={setCcTuition}
                min={0}
              />
              <CurrencyInput
                id="cc-room"
                label="Room & Board"
                value={ccRoom}
                onChange={setCcRoom}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CurrencyInput
                id="cc-books"
                label="Books & Supplies / Yr"
                value={ccBooks}
                onChange={setCcBooks}
                min={0}
              />
              <CurrencyInput
                id="cc-personal"
                label="Personal Expenses / Yr"
                value={ccPersonal}
                onChange={setCcPersonal}
                min={0}
              />
              <CurrencyInput
                id="cc-aid"
                label="Grants & Aid / Yr"
                value={ccAid}
                onChange={setCcAid}
                min={0}
              />
            </div>
            <UnitNumberInput
              id="cc-years"
              label="Degree Duration"
              value={ccYears}
              onChange={setCcYears}
              suffix="Years"
              min={1}
              max={10}
            />
          </div>
        }
        results={
          collegeCostResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Total Out-of-Pocket Net Cost</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{formatMoney(collegeCostResult.totalNetCost)}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Annual net price: {formatMoney(collegeCostResult.annualNetCost)} / yr</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Gross Sticker Price ({ccYears} Years)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatMoney(collegeCostResult.totalGrossCost)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'car-depreciation-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Vehicle Depreciation & Resale Value Calculator"
        onReset={() => { setCdPrice(35000); setCdRate(15); setCdYrs(5); }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="cd-price"
              label="Vehicle Purchase Price"
              value={cdPrice}
              onChange={setCdPrice}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="cd-rate"
                label="Depreciation Rate"
                value={cdRate}
                onChange={setCdRate}
                suffix="%/yr"
                min={0}
                max={100}
              />
              <UnitNumberInput
                id="cd-yrs"
                label="Ownership Period"
                value={cdYrs}
                onChange={setCdYrs}
                suffix="Years"
                min={1}
                max={30}
              />
            </div>
          </div>
        }
        results={
          carDepreciationResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Estimated Resale Value</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{formatMoney(carDepreciationResult.estimatedCurrentValue)}</div>
                <div className="text-xs text-slate-500 mt-1">Loss of {carDepreciationResult.depreciationPercentage}% of initial purchase price</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Value Depreciated</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">-{formatMoney(carDepreciationResult.totalDepreciationLoss)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'car-ownership-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="True Cost of Car Ownership Calculator"
        onReset={() => { setCoFinancing(5400); setCoIns(1680); setCoFuel(2160); setCoMaint(960); setCoDeprec(3000); setCoMiles(12000); setCoDistUnit('miles'); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="co-financing"
                label="Annual Loan / Lease Financing"
                value={coFinancing}
                onChange={setCoFinancing}
                min={0}
              />
              <CurrencyInput
                id="co-ins"
                label="Annual Insurance"
                value={coIns}
                onChange={setCoIns}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="co-fuel"
                label="Annual Fuel / Charging"
                value={coFuel}
                onChange={setCoFuel}
                min={0}
              />
              <CurrencyInput
                id="co-maint"
                label="Annual Maintenance & Repairs"
                value={coMaint}
                onChange={setCoMaint}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="co-deprec"
                label="Annual Depreciation"
                value={coDeprec}
                onChange={setCoDeprec}
                min={0}
              />
              <UnitNumberInput
                id="co-miles"
                label="Annual Driving Distance"
                value={coMiles}
                onChange={setCoMiles}
                currentUnit={coDistUnit}
                onUnitChange={(u) => setCoDistUnit(u as any)}
                units={[
                  { id: 'miles', label: 'mi/yr' },
                  { id: 'km', label: 'km/yr' },
                ]}
                min={0}
              />
            </div>
          </div>
        }
        results={
          carOwnershipResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Total Annual Running Cost</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(carOwnershipResult.totalAnnualCost)} / yr</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Monthly average: {formatMoney(carOwnershipResult.monthlyCost)} / mo</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">True Cost per {coDistUnit === 'km' ? 'Kilometer' : 'Mile'}</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{currencySymbol}{carOwnershipResult.costPerDistanceUnit} / {coDistUnit === 'km' ? 'km' : 'mi'}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'fuel-economy-converter') {
    return (
      <CompactCalculatorWorkspace
        title="Fuel Economy Converter & Comparison Calculator"
        onReset={() => {
          setFeVal(30);
          setFeUnit('US MPG');
          setFeCompDist(15000);
          setFeCompDistUnit('mi');
          setFeCompPrice(3.5);
          setFeCompEffA(25);
          setFeCompEffB(38);
          setFeCompUnit('US MPG');
        }}
        inputs={
          <div className="space-y-4">
            <div className="flex border rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setFeMode('convert')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  feMode === 'convert'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Unit Converter
              </button>
              <button
                type="button"
                onClick={() => setFeMode('compare')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  feMode === 'compare'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Side-by-Side Car Comparison
              </button>
            </div>

            {feMode === 'convert' ? (
              <div className="space-y-3">
                <UnitNumberInput
                  id="fe-val"
                  label="Fuel Economy Rating"
                  value={feVal}
                  onChange={setFeVal}
                  currentUnit={feUnit}
                  onUnitChange={(u) => setFeUnit(u as any)}
                  units={[
                    { id: 'US MPG', label: 'US MPG' },
                    { id: 'Imp MPG', label: 'UK MPG' },
                    { id: 'L/100km', label: 'L/100km' },
                    { id: 'km/L', label: 'km/L' },
                  ]}
                  step={0.1}
                  min={0.1}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <UnitNumberInput
                    id="fe-comp-dist"
                    label="Annual Distance"
                    value={feCompDist}
                    onChange={setFeCompDist}
                    currentUnit={feCompDistUnit}
                    onUnitChange={(u) => setFeCompDistUnit(u as any)}
                    units={[
                      { id: 'mi', label: 'mi/yr' },
                      { id: 'km', label: 'km/yr' },
                    ]}
                    min={0}
                  />
                  <CurrencyInput
                    id="fe-comp-price"
                    label="Fuel Price (per gal or /L)"
                    value={feCompPrice}
                    onChange={setFeCompPrice}
                    step={0.01}
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <UnitNumberInput
                    id="fe-eff-a"
                    label="Vehicle A Efficiency"
                    value={feCompEffA}
                    onChange={setFeCompEffA}
                    suffix={feCompUnit}
                    step={0.1}
                    min={0.1}
                  />
                  <UnitNumberInput
                    id="fe-eff-b"
                    label="Vehicle B Efficiency"
                    value={feCompEffB}
                    onChange={setFeCompEffB}
                    suffix={feCompUnit}
                    step={0.1}
                    min={0.1}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Efficiency Unit Format
                  </label>
                  <select
                    value={feCompUnit}
                    onChange={(e) => setFeCompUnit(e.target.value as any)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="US MPG">Miles per Gallon (US MPG)</option>
                    <option value="L/100km">Liters per 100 km (L/100km)</option>
                    <option value="km/L">Kilometers per Liter (km/L)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        }
        results={
          feMode === 'convert' ? (
            fuelEconomyResult ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">US MPG</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{fuelEconomyResult.usMpg} mpg</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">UK / Imp MPG</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{fuelEconomyResult.impMpg} mpg</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">Metric (L/100km)</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{fuelEconomyResult.litersPer100Km} L/100km</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">km per Liter</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{fuelEconomyResult.kmPerLiter} km/L</div>
                  </div>
                </div>
              </div>
            ) : null
          ) : fuelComparisonResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Annual Fuel Savings ({fuelComparisonResult.moreEfficientVehicle})
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatMoney(fuelComparisonResult.annualSavings)} / yr
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  5-year cumulative savings: {formatMoney(fuelComparisonResult.fiveYearSavings)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Vehicle A Cost</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatMoney(fuelComparisonResult.annualCostA)} / yr
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {fuelComparisonResult.annualConsumptionA} {feCompUnit === 'L/100km' ? 'L' : 'gal'} / yr
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Vehicle B Cost</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatMoney(fuelComparisonResult.annualCostB)} / yr
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {fuelComparisonResult.annualConsumptionB} {feCompUnit === 'L/100km' ? 'L' : 'gal'} / yr
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'ev-charging-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="EV Electric Vehicle Charging Cost Calculator"
        onReset={() => {
          setEvBat(75);
          setEvBatUnit('kWh');
          setEvInc(60);
          setEvRate(0.16);
          setEvEff(90);
        }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="ev-bat"
                label="Battery Capacity"
                value={evBat}
                onChange={setEvBat}
                currentUnit={evBatUnit}
                onUnitChange={(u) => setEvBatUnit(u as any)}
                units={[
                  { id: 'kWh', label: 'kWh' },
                  { id: 'Wh', label: 'Wh' },
                  { id: 'MWh', label: 'MWh' },
                ]}
                min={0}
              />
              <UnitNumberInput
                id="ev-inc"
                label="Charge Added"
                value={evInc}
                onChange={setEvInc}
                suffix="%"
                min={1}
                max={100}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="ev-rate"
                label="Electricity Rate (per kWh)"
                value={evRate}
                onChange={setEvRate}
                step={0.01}
                min={0}
              />
              <UnitNumberInput
                id="ev-eff"
                label="Charger Efficiency"
                value={evEff}
                onChange={setEvEff}
                suffix="%"
                min={50}
                max={100}
              />
            </div>
          </div>
        }
        results={
          evChargingResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Estimated Charging Session Cost
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatMoney(evChargingResult.totalChargingCost)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {evChargingResult.energyRequiredKWh} kWh consumed from grid ({evChargingResult.energyDeliveredKWh} kWh into battery)
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'ev-range-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="EV Driving Range Estimator"
        onReset={() => {
          setErBat(65);
          setErBatUnit('kWh');
          setErCons(160);
          setErConsUnit('Wh/km');
        }}
        inputs={
          <div className="space-y-3">
            <UnitNumberInput
              id="er-bat"
              label="Usable Battery Capacity"
              value={erBat}
              onChange={setErBat}
              currentUnit={erBatUnit}
              onUnitChange={(u) => setErBatUnit(u as any)}
              units={[
                { id: 'kWh', label: 'kWh' },
                { id: 'Wh', label: 'Wh' },
                { id: 'MWh', label: 'MWh' },
              ]}
              min={0}
            />
            <UnitNumberInput
              id="er-cons"
              label="Energy Consumption Rate"
              value={erCons}
              onChange={setErCons}
              currentUnit={erConsUnit}
              onUnitChange={(u) => setErConsUnit(u as any)}
              units={[
                { id: 'Wh/km', label: 'Wh / km' },
                { id: 'Wh/mi', label: 'Wh / mi' },
                { id: 'kWh/100km', label: 'kWh / 100km' },
                { id: 'mi/kWh', label: 'mi / kWh' },
                { id: 'km/kWh', label: 'km / kWh' },
              ]}
              step={1}
              min={1}
            />
          </div>
        }
        results={
          evRangeResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">
                  Estimated Usable Range
                </span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">
                  {evRangeResult.estimatedRangeKm} km
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ({evRangeResult.estimatedRangeMiles} miles on full charge)
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'ev-vs-gas-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="EV vs Gas Vehicle Fuel Cost Comparison"
        onReset={() => {
          setEgDist(15000);
          setEgDistUnit('km');
          setEgGasPrice(1.45);
          setEgGasEff(8.5);
          setEgGasEffUnit('L/100km');
          setEgElecPrice(0.18);
          setEgEvEff(17.5);
          setEgEvEffUnit('kWh/100km');
        }}
        inputs={
          <div className="space-y-3">
            <UnitNumberInput
              id="eg-dist"
              label="Annual Driving Distance"
              value={egDist}
              onChange={setEgDist}
              currentUnit={egDistUnit}
              onUnitChange={(u) => setEgDistUnit(u as any)}
              units={[
                { id: 'km', label: 'km/yr' },
                { id: 'miles', label: 'mi/yr' },
              ]}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="eg-gas-eff"
                label="Gas Car Fuel Efficiency"
                value={egGasEff}
                onChange={setEgGasEff}
                currentUnit={egGasEffUnit}
                onUnitChange={(u) => setEgGasEffUnit(u as any)}
                units={[
                  { id: 'L/100km', label: 'L/100km' },
                  { id: 'US MPG', label: 'US MPG' },
                  { id: 'Imp MPG', label: 'UK MPG' },
                  { id: 'km/L', label: 'km/L' },
                ]}
                step={0.1}
                min={0.1}
              />
              <CurrencyInput
                id="eg-gas-price"
                label="Gas Fuel Price (per L or gal)"
                value={egGasPrice}
                onChange={setEgGasPrice}
                step={0.01}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="eg-ev-eff"
                label="EV Energy Efficiency"
                value={egEvEff}
                onChange={setEgEvEff}
                currentUnit={egEvEffUnit}
                onUnitChange={(u) => setEgEvEffUnit(u as any)}
                units={[
                  { id: 'kWh/100km', label: 'kWh/100km' },
                  { id: 'Wh/km', label: 'Wh/km' },
                  { id: 'mi/kWh', label: 'mi/kWh' },
                  { id: 'km/kWh', label: 'km/kWh' },
                ]}
                step={0.1}
                min={0.1}
              />
              <CurrencyInput
                id="eg-elec-price"
                label="Electricity Rate (per kWh)"
                value={egElecPrice}
                onChange={setEgElecPrice}
                step={0.01}
                min={0}
              />
            </div>
          </div>
        }
        results={
          evVsGasResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Annual Fuel Savings with EV
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatMoney(evVsGasResult.annualSavings)} / yr
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  5-year projected savings: {formatMoney(evVsGasResult.fiveYearSavings)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Gas Annual Cost</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(evVsGasResult.annualGasCost)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">EV Annual Cost</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(evVsGasResult.annualEVCost)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'travel-time-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Travel & Road Trip Driving Time Calculator"
        onReset={() => {
          setTtDist(240);
          setTtDistUnit('miles');
          setTtSpd(60);
          setTtStops(30);
        }}
        inputs={
          <div className="space-y-3">
            <UnitNumberInput
              id="tt-dist"
              label="Total Trip Distance"
              value={ttDist}
              onChange={setTtDist}
              currentUnit={ttDistUnit}
              onUnitChange={(u) => setTtDistUnit(u as any)}
              units={[
                { id: 'miles', label: 'Miles (mi)' },
                { id: 'km', label: 'Kilometers (km)' },
              ]}
              min={0}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="tt-spd"
                label="Average Speed"
                value={ttSpd}
                onChange={setTtSpd}
                suffix={ttDistUnit === 'miles' ? 'mph' : 'km/h'}
                min={1}
              />
              <UnitNumberInput
                id="tt-stops"
                label="Planned Rest & Fuel Stops"
                value={ttStops}
                onChange={setTtStops}
                suffix="mins"
                min={0}
              />
            </div>
          </div>
        }
        results={
          travelTimeResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">
                  Total Travel Time (With Stops)
                </span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">
                  {travelTimeResult.totalTripHours}h {travelTimeResult.totalTripMinutes}m
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Total decimal hours: {travelTimeResult.totalTripDecimal} hrs
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Pure Driving Time</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {travelTimeResult.hours}h {travelTimeResult.minutes}m
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Rest & Fuel Stops</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {travelTimeResult.stopMinutes} minutes
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / Average Speed
  return (
    <CompactCalculatorWorkspace
      title="Average Speed & Pace Calculator"
      onReset={() => {
        setAsDist(150);
        setAsDistUnit('miles');
        setAsHrs(2);
        setAsMins(30);
        setAsSecs(0);
        setLegs([
          { id: '1', distance: 60, distanceUnit: 'mi', hours: 1, minutes: 0, seconds: 0 },
          { id: '2', distance: 40, distanceUnit: 'mi', hours: 1, minutes: 0, seconds: 0 },
        ]);
      }}
      inputs={
        <div className="space-y-4">
          <div className="flex border rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setAsMode('single')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                asMode === 'single'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Single Leg Journey
            </button>
            <button
              type="button"
              onClick={() => setAsMode('multileg')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                asMode === 'multileg'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Multi-Leg Trip (Combined)
            </button>
          </div>

          {asMode === 'single' ? (
            <div className="space-y-3">
              <UnitNumberInput
                id="as-dist"
                label="Distance Covered"
                value={asDist}
                onChange={setAsDist}
                currentUnit={asDistUnit}
                onUnitChange={(u) => setAsDistUnit(u as any)}
                units={[
                  { id: 'miles', label: 'Miles (mi)' },
                  { id: 'km', label: 'Kilometers (km)' },
                  { id: 'meters', label: 'Meters (m)' },
                  { id: 'feet', label: 'Feet (ft)' },
                ]}
                min={0}
              />

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <UnitNumberInput
                  id="as-hrs"
                  label="Hours"
                  value={asHrs}
                  onChange={setAsHrs}
                  suffix="hrs"
                  min={0}
                />
                <UnitNumberInput
                  id="as-mins"
                  label="Minutes"
                  value={asMins}
                  onChange={setAsMins}
                  suffix="mins"
                  min={0}
                  max={59}
                />
                <UnitNumberInput
                  id="as-secs"
                  label="Seconds"
                  value={asSecs}
                  onChange={setAsSecs}
                  suffix="secs"
                  min={0}
                  max={59}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Add segments of your trip with distance and elapsed time to compute exact multi-leg average speed:
              </div>
              {legs.map((leg, index) => (
                <div key={leg.id || index} className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Leg {index + 1}</span>
                    {legs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setLegs(legs.filter((_, i) => i !== index))}
                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <UnitNumberInput
                    id={`leg-dist-${index}`}
                    label="Distance"
                    value={leg.distance}
                    onChange={(val) => {
                      const updated = [...legs];
                      updated[index].distance = val === '' ? '' : Number(val);
                      setLegs(updated);
                    }}
                    currentUnit={leg.distanceUnit}
                    onUnitChange={(u) => {
                      const updated = [...legs];
                      updated[index].distanceUnit = u as any;
                      setLegs(updated);
                    }}
                    units={[
                      { id: 'mi', label: 'Miles' },
                      { id: 'km', label: 'Kilometers' },
                      { id: 'm', label: 'Meters' },
                      { id: 'ft', label: 'Feet' },
                    ]}
                    min={0}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <UnitNumberInput
                      id={`leg-hrs-${index}`}
                      label="Hours"
                      value={leg.hours}
                      onChange={(val) => {
                        const updated = [...legs];
                        updated[index].hours = val === '' ? '' : Number(val);
                        setLegs(updated);
                      }}
                      suffix="hrs"
                      min={0}
                    />
                    <UnitNumberInput
                      id={`leg-mins-${index}`}
                      label="Minutes"
                      value={leg.minutes}
                      onChange={(val) => {
                        const updated = [...legs];
                        updated[index].minutes = val === '' ? '' : Number(val);
                        setLegs(updated);
                      }}
                      suffix="mins"
                      min={0}
                      max={59}
                    />
                    <UnitNumberInput
                      id={`leg-secs-${index}`}
                      label="Seconds"
                      value={leg.seconds}
                      onChange={(val) => {
                        const updated = [...legs];
                        updated[index].seconds = val === '' ? '' : Number(val);
                        setLegs(updated);
                      }}
                      suffix="secs"
                      min={0}
                      max={59}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setLegs([
                    ...legs,
                    {
                      id: String(Date.now()),
                      distance: 30,
                      distanceUnit: 'mi',
                      hours: 0,
                      minutes: 45,
                      seconds: 0,
                    },
                  ])
                }
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                + Add Another Journey Leg
              </button>
            </div>
          )}
        </div>
      }
      results={
        asMode === 'single' ? (
          averageSpeedResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Primary Average Speed
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {asDistUnit === 'miles' || asDistUnit === 'feet' ? `${averageSpeedResult.mph} mph` : `${averageSpeedResult.kmh} km/h`}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Equivalent to {asDistUnit === 'miles' || asDistUnit === 'feet' ? `${averageSpeedResult.kmh} km/h` : `${averageSpeedResult.mph} mph`}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Meters / sec</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{averageSpeedResult.ms} m/s</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Feet / sec</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{averageSpeedResult.fts} ft/s</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Knots</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{averageSpeedResult.knots} kn</div>
                </div>
              </div>
            </div>
          ) : null
        ) : multiLegResult ? (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                Overall Journey Average Speed
              </span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {multiLegResult.averageSpeedMph} mph ({multiLegResult.averageSpeedKmh} km/h)
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Total duration: {multiLegResult.totalTimeFormatted} across {multiLegResult.totalDistanceMiles} mi ({multiLegResult.totalDistanceKm} km)
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Leg Breakdown</span>
              {multiLegResult.legs.map((leg) => (
                <div
                  key={leg.legNumber}
                  className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded border flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">Leg #{leg.legNumber}</span>
                  <span className="text-slate-500">{leg.distanceKm} km in {leg.timeHours} hrs</span>
                  <span className="font-bold text-slate-900 dark:text-white">{leg.speedMph} mph ({leg.speedKmh} km/h)</span>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
};
