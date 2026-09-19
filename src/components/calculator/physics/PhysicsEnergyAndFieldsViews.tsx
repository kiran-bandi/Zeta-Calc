import React, { useMemo } from 'react';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { PhysicsResultDisplay } from './PhysicsResultDisplay';
import {
  calculateKineticEnergy,
  calculatePotentialEnergy,
  calculateWork,
  calculatePower,
  calculatePressure,
  calculateOhmsLaw,
  calculateElectricalPower,
  calculateWaveSpeed,
  calculateFrequency,
  calculateWavelength,
} from '../../../engine/physicsEngine';

export const PHYSICS_ENERGY_FIELDS_SLUGS = [
  'kinetic-energy-calculator',
  'potential-energy-calculator',
  'work-calculator',
  'power-calculator',
  'pressure-calculator',
  'ohms-law-calculator',
  'electrical-power-calculator',
  'wave-speed-calculator',
  'frequency-calculator',
  'wavelength-calculator',
];

interface Props {
  toolSlug: string;
}

export const PhysicsEnergyAndFieldsViews: React.FC<Props> = ({ toolSlug }) => {
  // 1. Kinetic Energy
  const [keMode, setKeMode] = useSessionState<'energy' | 'mass' | 'velocity'>('p_ke_mode', 'energy');
  const [keMass, setKeMass] = useSessionState<number | ''>('p_ke_m', 1500);
  const [keMassUnit, setKeMassUnit] = useSessionState<string>('p_ke_m_u', 'kg');
  const [keVel, setKeVel] = useSessionState<number | ''>('p_ke_v', 20);
  const [keVelUnit, setKeVelUnit] = useSessionState<string>('p_ke_v_u', 'm/s');
  const [keKe, setKeKe] = useSessionState<number | ''>('p_ke_ke', 300000);
  const [keKeUnit, setKeKeUnit] = useSessionState<string>('p_ke_ke_u', 'J');

  const keResult = useMemo(() => {
    return calculateKineticEnergy(keMode, keMass, keVel, keKe, keMassUnit, keVelUnit, keKeUnit);
  }, [keMode, keMass, keVel, keKe, keMassUnit, keVelUnit, keKeUnit]);

  // 2. Potential Energy
  const [peMode, setPeMode] = useSessionState<'energy' | 'mass' | 'height' | 'gravity'>('p_pe_mode', 'energy');
  const [peMass, setPeMass] = useSessionState<number | ''>('p_pe_m', 70);
  const [peMassUnit, setPeMassUnit] = useSessionState<string>('p_pe_m_u', 'kg');
  const [peHeight, setPeHeight] = useSessionState<number | ''>('p_pe_h', 15);
  const [peHeightUnit, setPeHeightUnit] = useSessionState<string>('p_pe_h_u', 'm');
  const [peGravity, setPeGravity] = useSessionState<number | ''>('p_pe_g', 9.80665);
  const [pePe, setPePe] = useSessionState<number | ''>('p_pe_pe', 10297);
  const [pePeUnit, setPePeUnit] = useSessionState<string>('p_pe_pe_u', 'J');

  const peResult = useMemo(() => {
    return calculatePotentialEnergy(peMode, peMass, peGravity, peHeight, pePe, peMassUnit, peHeightUnit, pePeUnit);
  }, [peMode, peMass, peGravity, peHeight, pePe, peMassUnit, peHeightUnit, pePeUnit]);

  // 3. Work Calculator
  const [wMode, setWMode] = useSessionState<'work' | 'force' | 'distance' | 'angle'>('p_w_mode', 'work');
  const [wForce, setWForce] = useSessionState<number | ''>('p_w_f', 250);
  const [wForceUnit, setWForceUnit] = useSessionState<string>('p_w_f_u', 'N');
  const [wDist, setWDist] = useSessionState<number | ''>('p_w_d', 8);
  const [wDistUnit, setWDistUnit] = useSessionState<string>('p_w_d_u', 'm');
  const [wAngle, setWAngle] = useSessionState<number | ''>('p_w_ang', 0);
  const [wAngleUnit, setWAngleUnit] = useSessionState<string>('p_w_ang_u', 'deg');
  const [wWork, setWWork] = useSessionState<number | ''>('p_w_w', 2000);
  const [wWorkUnit, setWWorkUnit] = useSessionState<string>('p_w_w_u', 'J');

  const workResult = useMemo(() => {
    return calculateWork(wMode, wForce, wDist, wAngle, wWork, wForceUnit, wDistUnit, wAngleUnit, wWorkUnit);
  }, [wMode, wForce, wDist, wAngle, wWork, wForceUnit, wDistUnit, wAngleUnit, wWorkUnit]);

  // 4. Power Calculator
  const [pMode, setPMode] = useSessionState<'power' | 'work' | 'time'>('p_p_mode', 'power');
  const [pWork, setPWork] = useSessionState<number | ''>('p_p_w', 5000);
  const [pWorkUnit, setPWorkUnit] = useSessionState<string>('p_p_w_u', 'J');
  const [pTime, setPTime] = useSessionState<number | ''>('p_p_t', 10);
  const [pTimeUnit, setPTimeUnit] = useSessionState<string>('p_p_t_u', 's');
  const [pPower, setPPower] = useSessionState<number | ''>('p_p_p', 500);
  const [pPowerUnit, setPPowerUnit] = useSessionState<string>('p_p_p_u', 'W');

  const powerResult = useMemo(() => {
    return calculatePower(pMode, pWork, pTime, pPower, pWorkUnit, pTimeUnit, pPowerUnit);
  }, [pMode, pWork, pTime, pPower, pWorkUnit, pTimeUnit, pPowerUnit]);

  // 5. Pressure Calculator
  const [prMode, setPrMode] = useSessionState<'pressure' | 'force' | 'area'>('p_pr_mode', 'pressure');
  const [prForce, setPrForce] = useSessionState<number | ''>('p_pr_f', 1500);
  const [prForceUnit, setPrForceUnit] = useSessionState<string>('p_pr_f_u', 'N');
  const [prArea, setPrArea] = useSessionState<number | ''>('p_pr_a', 0.05);
  const [prAreaUnit, setPrAreaUnit] = useSessionState<string>('p_pr_a_u', 'm2');
  const [prPres, setPrPres] = useSessionState<number | ''>('p_pr_p', 30000);
  const [prPresUnit, setPrPresUnit] = useSessionState<string>('p_pr_p_u', 'Pa');

  const pressureResult = useMemo(() => {
    return calculatePressure(prMode, prForce, prArea, prPres, prForceUnit, prAreaUnit, prPresUnit);
  }, [prMode, prForce, prArea, prPres, prForceUnit, prAreaUnit, prPresUnit]);

  // 6. Ohm's Law
  const [ohmMode, setOhmMode] = useSessionState<'voltage' | 'current' | 'resistance'>('p_ohm_mode', 'voltage');
  const [ohmVolt, setOhmVolt] = useSessionState<number | ''>('p_ohm_v', 12);
  const [ohmCurr, setOhmCurr] = useSessionState<number | ''>('p_ohm_i', 2.5);
  const [ohmRes, setOhmRes] = useSessionState<number | ''>('p_ohm_r', 4.8);
  const [ohmCurrUnit, setOhmCurrUnit] = useSessionState<string>('p_ohm_i_u', 'A');
  const [ohmResUnit, setOhmResUnit] = useSessionState<string>('p_ohm_r_u', 'ohm');

  const ohmsLawResult = useMemo(() => {
    return calculateOhmsLaw(ohmMode, ohmVolt, ohmCurr, ohmRes, 'V', ohmCurrUnit, ohmResUnit);
  }, [ohmMode, ohmVolt, ohmCurr, ohmRes, ohmCurrUnit, ohmResUnit]);

  // 7. Electrical Power
  const [epMode, setEpMode] = useSessionState<'VI' | 'IR' | 'VR'>('p_ep_mode', 'VI');
  const [epVolt, setEpVolt] = useSessionState<number | ''>('p_ep_v', 120);
  const [epCurr, setEpCurr] = useSessionState<number | ''>('p_ep_i', 10);
  const [epRes, setEpRes] = useSessionState<number | ''>('p_ep_r', 12);
  const [epPowerUnit, setEpPowerUnit] = useSessionState<string>('p_ep_p_u', 'W');

  const epResult = useMemo(() => {
    return calculateElectricalPower(epMode, epVolt, epCurr, epRes, epPowerUnit);
  }, [epMode, epVolt, epCurr, epRes, epPowerUnit]);

  // 8. Wave Speed
  const [wsMode, setWsMode] = useSessionState<'speed' | 'freq' | 'wavelength'>('p_ws_mode', 'speed');
  const [wsSpeed, setWsSpeed] = useSessionState<number | ''>('p_ws_v', 343);
  const [wsFreq, setWsFreq] = useSessionState<number | ''>('p_ws_f', 440);
  const [wsLambda, setWsLambda] = useSessionState<number | ''>('p_ws_l', 0.7795);
  const [wsSpeedUnit, setWsSpeedUnit] = useSessionState<string>('p_ws_v_u', 'm/s');
  const [wsFreqUnit, setWsFreqUnit] = useSessionState<string>('p_ws_f_u', 'Hz');
  const [wsLambdaUnit, setWsLambdaUnit] = useSessionState<string>('p_ws_l_u', 'm');

  const waveSpeedResult = useMemo(() => {
    return calculateWaveSpeed(wsMode, wsSpeed, wsFreq, wsLambda, wsSpeedUnit, wsFreqUnit, wsLambdaUnit);
  }, [wsMode, wsSpeed, wsFreq, wsLambda, wsSpeedUnit, wsFreqUnit, wsLambdaUnit]);

  // 9. Frequency
  const [freqMode, setFreqMode] = useSessionState<'freq' | 'period'>('p_fr_mode', 'freq');
  const [freqVal, setFreqVal] = useSessionState<number | ''>('p_fr_f', 50);
  const [periodVal, setPeriodVal] = useSessionState<number | ''>('p_fr_t', 0.02);
  const [freqUnit, setFreqUnit] = useSessionState<string>('p_fr_f_u', 'Hz');
  const [periodUnit, setPeriodUnit] = useSessionState<string>('p_fr_t_u', 's');

  const freqResult = useMemo(() => {
    return calculateFrequency(freqMode, freqVal, periodVal, freqUnit, periodUnit);
  }, [freqMode, freqVal, periodVal, freqUnit, periodUnit]);

  // 10. Wavelength
  const [wlSpeed, setWlSpeed] = useSessionState<number | ''>('p_wl_v', 299792458);
  const [wlFreq, setWlFreq] = useSessionState<number | ''>('p_wl_f', 2400000000);
  const [wlSpeedUnit, setWlSpeedUnit] = useSessionState<string>('p_wl_v_u', 'm/s');
  const [wlFreqUnit, setWlFreqUnit] = useSessionState<string>('p_wl_f_u', 'Hz');
  const [wlLambdaUnit, setWlLambdaUnit] = useSessionState<string>('p_wl_l_u', 'm');

  const wavelengthResult = useMemo(() => {
    return calculateWavelength('wavelength', '', wlSpeed, wlFreq, wlLambdaUnit, wlSpeedUnit, wlFreqUnit);
  }, [wlSpeed, wlFreq, wlSpeedUnit, wlFreqUnit, wlLambdaUnit]);

  // Render Dispatch
  if (toolSlug === 'kinetic-energy-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Kinetic Energy Calculator"
        badge="KE = ½ × m × v²"
        onReset={() => { setKeMode('energy'); setKeMass(1500); setKeVel(20); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['energy', 'mass', 'velocity'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setKeMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${keMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'energy' ? 'Energy (KE)' : m}
                  </button>
                ))}
              </div>
            </div>
            {keMode !== 'mass' && (
              <UnitNumberInput
                id="ke-mass"
                label="Mass (m)"
                value={keMass}
                onChange={setKeMass}
                currentUnit={keMassUnit}
                onUnitChange={setKeMassUnit}
                units={[{ id: 'kg', label: 'kg' }, { id: 'g', label: 'g' }, { id: 'lb', label: 'lb' }]}
              />
            )}
            {keMode !== 'velocity' && (
              <UnitNumberInput
                id="ke-vel"
                label="Velocity (v)"
                value={keVel}
                onChange={setKeVel}
                currentUnit={keVelUnit}
                onUnitChange={setKeVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {keMode !== 'energy' && (
              <UnitNumberInput
                id="ke-ke"
                label="Kinetic Energy"
                value={keKe}
                onChange={setKeKe}
                currentUnit={keKeUnit}
                onUnitChange={setKeKeUnit}
                units={[{ id: 'J', label: 'Joules (J)' }, { id: 'kJ', label: 'kJ' }, { id: 'cal', label: 'cal' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={keResult} />}
      />
    );
  }

  if (toolSlug === 'potential-energy-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Gravitational Potential Energy Calculator"
        badge="PE = m × g × h"
        onReset={() => { setPeMode('energy'); setPeMass(70); setPeHeight(15); setPeGravity(9.80665); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['energy', 'mass', 'height', 'gravity'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPeMode(m)}
                    className={`py-1.5 rounded text-center text-[11px] capitalize transition-all ${peMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'energy' ? 'PE' : m}
                  </button>
                ))}
              </div>
            </div>
            {peMode !== 'mass' && (
              <UnitNumberInput
                id="pe-mass"
                label="Mass (m)"
                value={peMass}
                onChange={setPeMass}
                currentUnit={peMassUnit}
                onUnitChange={setPeMassUnit}
                units={[{ id: 'kg', label: 'kg' }, { id: 'g', label: 'g' }, { id: 'lb', label: 'lb' }]}
              />
            )}
            {peMode !== 'height' && (
              <UnitNumberInput
                id="pe-height"
                label="Height (h)"
                value={peHeight}
                onChange={setPeHeight}
                currentUnit={peHeightUnit}
                onUnitChange={setPeHeightUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'ft', label: 'feet (ft)' }]}
              />
            )}
            {peMode !== 'gravity' && (
              <UnitNumberInput
                id="pe-g"
                label="Gravity (g)"
                value={peGravity}
                onChange={setPeGravity}
                suffix="m/s²"
              />
            )}
            {peMode !== 'energy' && (
              <UnitNumberInput
                id="pe-pe"
                label="Potential Energy (PE)"
                value={pePe}
                onChange={setPePe}
                currentUnit={pePeUnit}
                onUnitChange={setPePeUnit}
                units={[{ id: 'J', label: 'Joules (J)' }, { id: 'kJ', label: 'kJ' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={peResult} />}
      />
    );
  }

  if (toolSlug === 'work-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Mechanical Work Calculator"
        badge="W = F × d × cos(θ)"
        onReset={() => { setWMode('work'); setWForce(250); setWDist(8); setWAngle(0); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['work', 'force', 'distance', 'angle'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setWMode(m)}
                    className={`py-1.5 rounded text-center text-[11px] capitalize transition-all ${wMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'distance' ? 'Dist' : m}
                  </button>
                ))}
              </div>
            </div>
            {wMode !== 'force' && (
              <UnitNumberInput
                id="w-force"
                label="Applied Force (F)"
                value={wForce}
                onChange={setWForce}
                currentUnit={wForceUnit}
                onUnitChange={setWForceUnit}
                units={[{ id: 'N', label: 'Newtons (N)' }, { id: 'lbf', label: 'lbf' }]}
              />
            )}
            {wMode !== 'distance' && (
              <UnitNumberInput
                id="w-dist"
                label="Displacement (d)"
                value={wDist}
                onChange={setWDist}
                currentUnit={wDistUnit}
                onUnitChange={setWDistUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'ft', label: 'feet (ft)' }]}
              />
            )}
            {wMode !== 'angle' && (
              <UnitNumberInput
                id="w-angle"
                label="Angle between Force & Motion (θ)"
                value={wAngle}
                onChange={setWAngle}
                currentUnit={wAngleUnit}
                onUnitChange={setWAngleUnit}
                units={[{ id: 'deg', label: 'degrees (°)' }, { id: 'rad', label: 'radians' }]}
              />
            )}
            {wMode !== 'work' && (
              <UnitNumberInput
                id="w-work"
                label="Work Done (W)"
                value={wWork}
                onChange={setWWork}
                currentUnit={wWorkUnit}
                onUnitChange={setWWorkUnit}
                units={[{ id: 'J', label: 'Joules (J)' }, { id: 'kJ', label: 'kJ' }, { id: 'cal', label: 'cal' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={workResult} />}
      />
    );
  }

  if (toolSlug === 'power-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Power Calculator"
        badge="P = W / t"
        onReset={() => { setPMode('power'); setPWork(5000); setPTime(10); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['power', 'work', 'time'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${pMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {pMode !== 'work' && (
              <UnitNumberInput
                id="p-work"
                label="Work / Energy Done (W)"
                value={pWork}
                onChange={setPWork}
                currentUnit={pWorkUnit}
                onUnitChange={setPWorkUnit}
                units={[{ id: 'J', label: 'Joules (J)' }, { id: 'kJ', label: 'kJ' }]}
              />
            )}
            {pMode !== 'time' && (
              <UnitNumberInput
                id="p-time"
                label="Time Elapsed (t)"
                value={pTime}
                onChange={setPTime}
                currentUnit={pTimeUnit}
                onUnitChange={setPTimeUnit}
                units={[{ id: 's', label: 'seconds (s)' }, { id: 'min', label: 'minutes' }, { id: 'h', label: 'hours' }]}
              />
            )}
            {pMode !== 'power' && (
              <UnitNumberInput
                id="p-power"
                label="Power (P)"
                value={pPower}
                onChange={setPPower}
                currentUnit={pPowerUnit}
                onUnitChange={setPPowerUnit}
                units={[{ id: 'W', label: 'Watts (W)' }, { id: 'kW', label: 'kW' }, { id: 'hp', label: 'Horsepower (hp)' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={powerResult} />}
      />
    );
  }

  if (toolSlug === 'pressure-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Pressure Calculator"
        badge="P = F / A"
        onReset={() => { setPrMode('pressure'); setPrForce(1500); setPrArea(0.05); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['pressure', 'force', 'area'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPrMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${prMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {prMode !== 'force' && (
              <UnitNumberInput
                id="pr-force"
                label="Perpendicular Force (F)"
                value={prForce}
                onChange={setPrForce}
                currentUnit={prForceUnit}
                onUnitChange={setPrForceUnit}
                units={[{ id: 'N', label: 'Newtons (N)' }, { id: 'kN', label: 'kN' }, { id: 'lbf', label: 'lbf' }]}
              />
            )}
            {prMode !== 'area' && (
              <UnitNumberInput
                id="pr-area"
                label="Surface Area (A)"
                value={prArea}
                onChange={setPrArea}
                currentUnit={prAreaUnit}
                onUnitChange={setPrAreaUnit}
                units={[{ id: 'm2', label: 'm²' }, { id: 'cm2', label: 'cm²' }, { id: 'sq ft', label: 'ft²' }, { id: 'sq in', label: 'in²' }]}
              />
            )}
            {prMode !== 'pressure' && (
              <UnitNumberInput
                id="pr-pres"
                label="Pressure (P)"
                value={prPres}
                onChange={setPrPres}
                currentUnit={prPresUnit}
                onUnitChange={setPrPresUnit}
                units={[{ id: 'Pa', label: 'Pascals (Pa)' }, { id: 'kPa', label: 'kPa' }, { id: 'bar', label: 'bar' }, { id: 'psi', label: 'PSI' }, { id: 'atm', label: 'atm' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={pressureResult} />}
      />
    );
  }

  if (toolSlug === 'ohms-law-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Ohm's Law Calculator"
        badge="V = I × R"
        onReset={() => { setOhmMode('voltage'); setOhmCurr(2.5); setOhmRes(4.8); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['voltage', 'current', 'resistance'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setOhmMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${ohmMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {ohmMode !== 'voltage' && (
              <UnitNumberInput
                id="ohm-volt"
                label="Voltage (V in Volts)"
                value={ohmVolt}
                onChange={setOhmVolt}
                suffix="V"
              />
            )}
            {ohmMode !== 'current' && (
              <UnitNumberInput
                id="ohm-curr"
                label="Current (I)"
                value={ohmCurr}
                onChange={setOhmCurr}
                currentUnit={ohmCurrUnit}
                onUnitChange={setOhmCurrUnit}
                units={[{ id: 'A', label: 'Amperes (A)' }, { id: 'mA', label: 'milliamperes (mA)' }]}
              />
            )}
            {ohmMode !== 'resistance' && (
              <UnitNumberInput
                id="ohm-res"
                label="Resistance (R)"
                value={ohmRes}
                onChange={setOhmRes}
                currentUnit={ohmResUnit}
                onUnitChange={setOhmResUnit}
                units={[{ id: 'ohm', label: 'Ohms (Ω)' }, { id: 'kohm', label: 'kΩ' }, { id: 'mohm', label: 'MΩ' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={ohmsLawResult} />}
      />
    );
  }

  if (toolSlug === 'electrical-power-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Electrical Power Calculator"
        badge="P = V·I = I²·R = V²/R"
        onReset={() => { setEpMode('VI'); setEpVolt(120); setEpCurr(10); setEpRes(12); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Inputs</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setEpMode('VI')}
                  className={`py-1.5 rounded text-center transition-all ${epMode === 'VI' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  V & I
                </button>
                <button
                  onClick={() => setEpMode('IR')}
                  className={`py-1.5 rounded text-center transition-all ${epMode === 'IR' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  I & R
                </button>
                <button
                  onClick={() => setEpMode('VR')}
                  className={`py-1.5 rounded text-center transition-all ${epMode === 'VR' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  V & R
                </button>
              </div>
            </div>
            {epMode !== 'IR' && (
              <UnitNumberInput
                id="ep-volt"
                label="Voltage (V in Volts)"
                value={epVolt}
                onChange={setEpVolt}
                suffix="V"
              />
            )}
            {epMode !== 'VR' && (
              <UnitNumberInput
                id="ep-curr"
                label="Current (I in Amperes)"
                value={epCurr}
                onChange={setEpCurr}
                suffix="A"
              />
            )}
            {epMode !== 'VI' && (
              <UnitNumberInput
                id="ep-res"
                label="Resistance (R in Ohms)"
                value={epRes}
                onChange={setEpRes}
                suffix="Ω"
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={epResult} />}
      />
    );
  }

  if (toolSlug === 'wave-speed-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Wave Speed Calculator"
        badge="v = f × λ"
        onReset={() => { setWsMode('speed'); setWsFreq(440); setWsLambda(0.7795); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['speed', 'freq', 'wavelength'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setWsMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${wsMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'freq' ? 'Frequency' : m}
                  </button>
                ))}
              </div>
            </div>
            {wsMode !== 'speed' && (
              <UnitNumberInput
                id="ws-spd"
                label="Wave Speed (v)"
                value={wsSpeed}
                onChange={setWsSpeed}
                currentUnit={wsSpeedUnit}
                onUnitChange={setWsSpeedUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {wsMode !== 'freq' && (
              <UnitNumberInput
                id="ws-freq"
                label="Frequency (f)"
                value={wsFreq}
                onChange={setWsFreq}
                currentUnit={wsFreqUnit}
                onUnitChange={setWsFreqUnit}
                units={[{ id: 'Hz', label: 'Hertz (Hz)' }, { id: 'kHz', label: 'kHz' }, { id: 'MHz', label: 'MHz' }]}
              />
            )}
            {wsMode !== 'wavelength' && (
              <UnitNumberInput
                id="ws-lam"
                label="Wavelength (λ)"
                value={wsLambda}
                onChange={setWsLambda}
                currentUnit={wsLambdaUnit}
                onUnitChange={setWsLambdaUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'cm', label: 'cm' }, { id: 'nm', label: 'nm' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={waveSpeedResult} />}
      />
    );
  }

  if (toolSlug === 'frequency-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Frequency Calculator"
        badge="f = 1 / T ; ω = 2πf"
        onReset={() => { setFreqMode('freq'); setPeriodVal(0.02); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setFreqMode('freq')}
                  className={`py-1.5 rounded text-center transition-all ${freqMode === 'freq' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Frequency (f = 1/T)
                </button>
                <button
                  onClick={() => setFreqMode('period')}
                  className={`py-1.5 rounded text-center transition-all ${freqMode === 'period' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Period (T = 1/f)
                </button>
              </div>
            </div>
            {freqMode === 'freq' ? (
              <UnitNumberInput
                id="fr-t"
                label="Time Period of One Cycle (T)"
                value={periodVal}
                onChange={setPeriodVal}
                currentUnit={periodUnit}
                onUnitChange={setPeriodUnit}
                units={[{ id: 's', label: 'seconds (s)' }, { id: 'ms', label: 'milliseconds (ms)' }]}
              />
            ) : (
              <UnitNumberInput
                id="fr-f"
                label="Oscillation Frequency (f)"
                value={freqVal}
                onChange={setFreqVal}
                currentUnit={freqUnit}
                onUnitChange={setFreqUnit}
                units={[{ id: 'Hz', label: 'Hertz (Hz)' }, { id: 'kHz', label: 'kHz' }, { id: 'MHz', label: 'MHz' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={freqResult} />}
      />
    );
  }

  if (toolSlug === 'wavelength-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Wavelength Calculator"
        badge="λ = v / f"
        onReset={() => { setWlSpeed(299792458); setWlFreq(2400000000); }}
        inputs={
          <div className="space-y-3.5">
            <UnitNumberInput
              id="wl-spd"
              label="Wave Propagation Speed (v)"
              value={wlSpeed}
              onChange={setWlSpeed}
              currentUnit={wlSpeedUnit}
              onUnitChange={setWlSpeedUnit}
              units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }]}
              helpText="Speed of light in vacuum: 299,792,458 m/s; Speed of sound in air (20°C): 343 m/s"
            />
            <UnitNumberInput
              id="wl-freq"
              label="Oscillation Frequency (f)"
              value={wlFreq}
              onChange={setWlFreq}
              currentUnit={wlFreqUnit}
              onUnitChange={setWlFreqUnit}
              units={[{ id: 'Hz', label: 'Hertz (Hz)' }, { id: 'kHz', label: 'kHz' }, { id: 'MHz', label: 'MHz' }]}
            />
          </div>
        }
        results={<PhysicsResultDisplay result={wavelengthResult} />}
      />
    );
  }

  return null;
};
