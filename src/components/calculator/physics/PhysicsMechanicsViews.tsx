import React, { useMemo } from 'react';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { PhysicsResultDisplay } from './PhysicsResultDisplay';
import {
  calculateForce,
  calculateVelocity,
  calculateAcceleration,
  calculateSpeedDistanceTime,
  calculateMomentum,
  calculateDensity,
  calculateTorque,
  calculateFreeFall,
  calculateProjectileMotion,
  calculateCentripetalForce,
} from '../../../engine/physicsEngine';

export const PHYSICS_MECHANICS_SLUGS = [
  'force-calculator',
  'velocity-calculator',
  'acceleration-calculator',
  'speed-distance-time-calculator',
  'momentum-calculator',
  'density-calculator',
  'torque-calculator',
  'free-fall-calculator',
  'projectile-motion-calculator',
  'centripetal-force-calculator',
];

interface Props {
  toolSlug: string;
}

export const PhysicsMechanicsViews: React.FC<Props> = ({ toolSlug }) => {
  // 1. Force Calculator
  const [fMode, setFMode] = useSessionState<'force' | 'mass' | 'accel'>('p_f_mode', 'force');
  const [fMass, setFMass] = useSessionState<number | ''>('p_f_mass', 10);
  const [fMassUnit, setFMassUnit] = useSessionState<string>('p_f_mass_u', 'kg');
  const [fAccel, setFAccel] = useSessionState<number | ''>('p_f_accel', 9.8);
  const [fAccelUnit, setFAccelUnit] = useSessionState<string>('p_f_accel_u', 'm/s2');
  const [fForce, setFForce] = useSessionState<number | ''>('p_f_force', 98);
  const [fForceUnit, setFForceUnit] = useSessionState<string>('p_f_force_u', 'N');

  const forceResult = useMemo(() => {
    return calculateForce(fMode, fMass, fAccel, fForce, fMassUnit, fAccelUnit, fForceUnit);
  }, [fMode, fMass, fAccel, fForce, fMassUnit, fAccelUnit, fForceUnit]);

  // 2. Velocity Calculator
  const [vMode, setVMode] = useSessionState<'velocity' | 'distance' | 'time'>('p_v_mode', 'velocity');
  const [vDist, setVDist] = useSessionState<number | ''>('p_v_dist', 100);
  const [vDistUnit, setVDistUnit] = useSessionState<string>('p_v_dist_u', 'm');
  const [vTime, setVTime] = useSessionState<number | ''>('p_v_time', 9.58);
  const [vTimeUnit, setVTimeUnit] = useSessionState<string>('p_v_time_u', 's');
  const [vVel, setVVel] = useSessionState<number | ''>('p_v_vel', 10.44);
  const [vVelUnit, setVVelUnit] = useSessionState<string>('p_v_vel_u', 'm/s');

  const velocityResult = useMemo(() => {
    return calculateVelocity(vMode, vDist, vTime, vVel, vDistUnit, vTimeUnit, vVelUnit);
  }, [vMode, vDist, vTime, vVel, vDistUnit, vTimeUnit, vVelUnit]);

  // 3. Acceleration Calculator
  const [aMode, setAMode] = useSessionState<'accel' | 'finalVel' | 'initialVel' | 'time'>('p_a_mode', 'accel');
  const [aV1, setAV1] = useSessionState<number | ''>('p_a_v1', 0);
  const [aV2, setAV2] = useSessionState<number | ''>('p_a_v2', 27.8);
  const [aVelUnit, setAVelUnit] = useSessionState<string>('p_a_vel_u', 'm/s');
  const [aTime, setATime] = useSessionState<number | ''>('p_a_time', 3.5);
  const [aTimeUnit, setATimeUnit] = useSessionState<string>('p_a_time_u', 's');
  const [aAccel, setAAccel] = useSessionState<number | ''>('p_a_accel', 7.94);
  const [aAccelUnit, setAAccelUnit] = useSessionState<string>('p_a_accel_u', 'm/s2');

  const accelResult = useMemo(() => {
    return calculateAcceleration(aMode, aV1, aV2, aTime, aAccel, aVelUnit, aTimeUnit, aAccelUnit);
  }, [aMode, aV1, aV2, aTime, aAccel, aVelUnit, aTimeUnit, aAccelUnit]);

  // 4. Speed Distance Time
  const [sdtMode, setSdtMode] = useSessionState<'speed' | 'distance' | 'time'>('p_sdt_mode', 'speed');
  const [sdtDist, setSdtDist] = useSessionState<number | ''>('p_sdt_dist', 120);
  const [sdtDistUnit, setSdtDistUnit] = useSessionState<string>('p_sdt_dist_u', 'km');
  const [sdtTime, setSdtTime] = useSessionState<number | ''>('p_sdt_time', 1.5);
  const [sdtTimeUnit, setSdtTimeUnit] = useSessionState<string>('p_sdt_time_u', 'h');
  const [sdtSpeed, setSdtSpeed] = useSessionState<number | ''>('p_sdt_spd', 80);
  const [sdtSpeedUnit, setSdtSpeedUnit] = useSessionState<string>('p_sdt_spd_u', 'km/h');

  const sdtResult = useMemo(() => {
    return calculateSpeedDistanceTime(sdtMode, sdtSpeed, sdtDist, sdtTime, sdtSpeedUnit, sdtDistUnit, sdtTimeUnit);
  }, [sdtMode, sdtSpeed, sdtDist, sdtTime, sdtSpeedUnit, sdtDistUnit, sdtTimeUnit]);

  // 5. Momentum
  const [pMode, setPMode] = useSessionState<'momentum' | 'mass' | 'velocity'>('p_mom_mode', 'momentum');
  const [pMass, setPMass] = useSessionState<number | ''>('p_mom_mass', 1200);
  const [pMassUnit, setPMassUnit] = useSessionState<string>('p_mom_mass_u', 'kg');
  const [pVel, setPVel] = useSessionState<number | ''>('p_mom_vel', 25);
  const [pVelUnit, setPVelUnit] = useSessionState<string>('p_mom_vel_u', 'm/s');
  const [pMom, setPMom] = useSessionState<number | ''>('p_mom_mom', 30000);

  const momentumResult = useMemo(() => {
    return calculateMomentum(pMode, pMass, pVel, pMom, pMassUnit, pVelUnit);
  }, [pMode, pMass, pVel, pMom, pMassUnit, pVelUnit]);

  // 6. Density
  const [rhoMode, setRhoMode] = useSessionState<'density' | 'mass' | 'volume'>('p_rho_mode', 'density');
  const [rhoMass, setRhoMass] = useSessionState<number | ''>('p_rho_mass', 500);
  const [rhoMassUnit, setRhoMassUnit] = useSessionState<string>('p_rho_mass_u', 'g');
  const [rhoVol, setRhoVol] = useSessionState<number | ''>('p_rho_vol', 250);
  const [rhoVolUnit, setRhoVolUnit] = useSessionState<string>('p_rho_vol_u', 'mL');
  const [rhoDensity, setRhoDensity] = useSessionState<number | ''>('p_rho_rho', 2);
  const [rhoDensityUnit, setRhoDensityUnit] = useSessionState<string>('p_rho_rho_u', 'g/cm3');

  const densityResult = useMemo(() => {
    return calculateDensity(rhoMode, rhoMass, rhoVol, rhoDensity, rhoMassUnit, rhoVolUnit, rhoDensityUnit);
  }, [rhoMode, rhoMass, rhoVol, rhoDensity, rhoMassUnit, rhoVolUnit, rhoDensityUnit]);

  // 7. Torque
  const [tMode, setTMode] = useSessionState<'torque' | 'force' | 'radius' | 'angle'>('p_t_mode', 'torque');
  const [tForce, setTForce] = useSessionState<number | ''>('p_t_force', 150);
  const [tForceUnit, setTForceUnit] = useSessionState<string>('p_t_force_u', 'N');
  const [tRadius, setTRadius] = useSessionState<number | ''>('p_t_rad', 0.4);
  const [tRadiusUnit, setTRadiusUnit] = useSessionState<string>('p_t_rad_u', 'm');
  const [tAngle, setTAngle] = useSessionState<number | ''>('p_t_ang', 90);
  const [tAngleUnit, setTAngleUnit] = useSessionState<string>('p_t_ang_u', 'deg');
  const [tTorque, setTTorque] = useSessionState<number | ''>('p_t_tau', 60);
  const [tTorqueUnit, setTTorqueUnit] = useSessionState<string>('p_t_tau_u', 'N·m');

  const torqueResult = useMemo(() => {
    return calculateTorque(tMode, tForce, tRadius, tAngle, tTorque, tForceUnit, tRadiusUnit, tAngleUnit, tTorqueUnit);
  }, [tMode, tForce, tRadius, tAngle, tTorque, tForceUnit, tRadiusUnit, tAngleUnit, tTorqueUnit]);

  // 8. Free Fall
  const [ffMode, setFfMode] = useSessionState<'velocityTime' | 'timeOfFall' | 'impactVelocity'>('p_ff_mode', 'velocityTime');
  const [ffInitVel, setFfInitVel] = useSessionState<number | ''>('p_ff_u', 0);
  const [ffGravity, setFfGravity] = useSessionState<number | ''>('p_ff_g', 9.80665);
  const [ffTime, setFfTime] = useSessionState<number | ''>('p_ff_t', 3);
  const [ffHeight, setFfHeight] = useSessionState<number | ''>('p_ff_h', 45);
  const [ffVelUnit, setFfVelUnit] = useSessionState<string>('p_ff_vel_u', 'm/s');
  const [ffDistUnit, setFfDistUnit] = useSessionState<string>('p_ff_dist_u', 'm');
  const [ffTimeUnit, setFfTimeUnit] = useSessionState<string>('p_ff_time_u', 's');

  const freeFallResult = useMemo(() => {
    return calculateFreeFall(ffMode, ffInitVel, ffGravity, ffTime, ffHeight, ffVelUnit, ffDistUnit, ffTimeUnit);
  }, [ffMode, ffInitVel, ffGravity, ffTime, ffHeight, ffVelUnit, ffDistUnit, ffTimeUnit]);

  // 9. Projectile Motion
  const [pmSpeed, setPmSpeed] = useSessionState<number | ''>('p_pm_spd', 25);
  const [pmSpeedUnit, setPmSpeedUnit] = useSessionState<string>('p_pm_spd_u', 'm/s');
  const [pmAngle, setPmAngle] = useSessionState<number | ''>('p_pm_ang', 45);
  const [pmHeight, setPmHeight] = useSessionState<number | ''>('p_pm_h0', 0);
  const [pmDistUnit, setPmDistUnit] = useSessionState<string>('p_pm_dist_u', 'm');
  const [pmGravity, setPmGravity] = useSessionState<number | ''>('p_pm_g', 9.80665);

  const projectileResult = useMemo(() => {
    return calculateProjectileMotion(pmSpeed, pmAngle, pmHeight, pmGravity, pmSpeedUnit, pmDistUnit);
  }, [pmSpeed, pmAngle, pmHeight, pmGravity, pmSpeedUnit, pmDistUnit]);

  // 10. Centripetal Force
  const [cfMode, setCfMode] = useSessionState<'force' | 'mass' | 'velocity' | 'radius'>('p_cf_mode', 'force');
  const [cfMass, setCfMass] = useSessionState<number | ''>('p_cf_m', 800);
  const [cfMassUnit, setCfMassUnit] = useSessionState<string>('p_cf_m_u', 'kg');
  const [cfVel, setCfVel] = useSessionState<number | ''>('p_cf_v', 20);
  const [cfVelUnit, setCfVelUnit] = useSessionState<string>('p_cf_v_u', 'm/s');
  const [cfRadius, setCfRadius] = useSessionState<number | ''>('p_cf_r', 50);
  const [cfRadiusUnit, setCfRadiusUnit] = useSessionState<string>('p_cf_r_u', 'm');
  const [cfForce, setCfForce] = useSessionState<number | ''>('p_cf_f', 6400);
  const [cfForceUnit, setCfForceUnit] = useSessionState<string>('p_cf_f_u', 'N');

  const centripetalResult = useMemo(() => {
    return calculateCentripetalForce(cfMode, cfMass, cfVel, cfRadius, cfForce, cfMassUnit, cfVelUnit, cfRadiusUnit, cfForceUnit);
  }, [cfMode, cfMass, cfVel, cfRadius, cfForce, cfMassUnit, cfVelUnit, cfRadiusUnit, cfForceUnit]);

  // Render Dispatch
  if (toolSlug === 'force-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Force Calculator (Newton's Second Law)"
        badge="F = m × a"
        onReset={() => { setFMode('force'); setFMass(10); setFAccel(9.8); setFForce(98); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['force', 'mass', 'accel'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${fMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'accel' ? 'Acceleration' : m}
                  </button>
                ))}
              </div>
            </div>
            {fMode !== 'mass' && (
              <UnitNumberInput
                id="f-mass"
                label="Mass (m)"
                value={fMass}
                onChange={setFMass}
                currentUnit={fMassUnit}
                onUnitChange={setFMassUnit}
                units={[{ id: 'kg', label: 'kg' }, { id: 'g', label: 'g' }, { id: 'lb', label: 'lb' }, { id: 'oz', label: 'oz' }]}
              />
            )}
            {fMode !== 'accel' && (
              <UnitNumberInput
                id="f-accel"
                label="Acceleration (a)"
                value={fAccel}
                onChange={setFAccel}
                currentUnit={fAccelUnit}
                onUnitChange={setFAccelUnit}
                units={[{ id: 'm/s2', label: 'm/s²' }, { id: 'ft/s2', label: 'ft/s²' }, { id: 'g', label: 'g (Earth)' }]}
              />
            )}
            {fMode !== 'force' && (
              <UnitNumberInput
                id="f-force"
                label="Net Force (F)"
                value={fForce}
                onChange={setFForce}
                currentUnit={fForceUnit}
                onUnitChange={setFForceUnit}
                units={[{ id: 'N', label: 'Newtons (N)' }, { id: 'kN', label: 'kN' }, { id: 'lbf', label: 'lbf' }, { id: 'dyn', label: 'dynes' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={forceResult} />}
      />
    );
  }

  if (toolSlug === 'velocity-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Velocity Calculator"
        badge="v = Δx / Δt"
        onReset={() => { setVMode('velocity'); setVDist(100); setVTime(9.58); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['velocity', 'distance', 'time'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setVMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${vMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {vMode !== 'distance' && (
              <UnitNumberInput
                id="v-dist"
                label="Displacement (Δx)"
                value={vDist}
                onChange={setVDist}
                currentUnit={vDistUnit}
                onUnitChange={setVDistUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'km', label: 'kilometers (km)' }, { id: 'ft', label: 'feet (ft)' }, { id: 'mi', label: 'miles (mi)' }]}
              />
            )}
            {vMode !== 'time' && (
              <UnitNumberInput
                id="v-time"
                label="Elapsed Time (Δt)"
                value={vTime}
                onChange={setVTime}
                currentUnit={vTimeUnit}
                onUnitChange={setVTimeUnit}
                units={[{ id: 's', label: 'seconds (s)' }, { id: 'min', label: 'minutes (min)' }, { id: 'h', label: 'hours (h)' }, { id: 'ms', label: 'milliseconds' }]}
              />
            )}
            {vMode !== 'velocity' && (
              <UnitNumberInput
                id="v-vel"
                label="Velocity (v)"
                value={vVel}
                onChange={setVVel}
                currentUnit={vVelUnit}
                onUnitChange={setVVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }, { id: 'ft/s', label: 'ft/s' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={velocityResult} />}
      />
    );
  }

  if (toolSlug === 'acceleration-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Acceleration Calculator"
        badge="a = (v₂ - v₁) / t"
        onReset={() => { setAMode('accel'); setAV1(0); setAV2(27.8); setATime(3.5); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['accel', 'finalVel', 'initialVel', 'time'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAMode(m)}
                    className={`py-1.5 rounded text-center text-[11px] capitalize transition-all ${aMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'accel' ? 'Accel' : m === 'finalVel' ? 'Final v' : m === 'initialVel' ? 'Init v' : 'Time'}
                  </button>
                ))}
              </div>
            </div>
            {aMode !== 'initialVel' && (
              <UnitNumberInput
                id="a-v1"
                label="Initial Velocity (v₁)"
                value={aV1}
                onChange={setAV1}
                currentUnit={aVelUnit}
                onUnitChange={setAVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {aMode !== 'finalVel' && (
              <UnitNumberInput
                id="a-v2"
                label="Final Velocity (v₂)"
                value={aV2}
                onChange={setAV2}
                currentUnit={aVelUnit}
                onUnitChange={setAVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {aMode !== 'time' && (
              <UnitNumberInput
                id="a-time"
                label="Time Interval (t)"
                value={aTime}
                onChange={setATime}
                currentUnit={aTimeUnit}
                onUnitChange={setATimeUnit}
                units={[{ id: 's', label: 'seconds (s)' }, { id: 'min', label: 'minutes (min)' }, { id: 'h', label: 'hours (h)' }]}
              />
            )}
            {aMode !== 'accel' && (
              <UnitNumberInput
                id="a-accel"
                label="Acceleration (a)"
                value={aAccel}
                onChange={setAAccel}
                currentUnit={aAccelUnit}
                onUnitChange={setAAccelUnit}
                units={[{ id: 'm/s2', label: 'm/s²' }, { id: 'ft/s2', label: 'ft/s²' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={accelResult} />}
      />
    );
  }

  if (toolSlug === 'speed-distance-time-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Speed Distance Time Calculator"
        badge="Speed = Distance / Time"
        onReset={() => { setSdtMode('speed'); setSdtDist(120); setSdtTime(1.5); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['speed', 'distance', 'time'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSdtMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${sdtMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {sdtMode !== 'distance' && (
              <UnitNumberInput
                id="sdt-dist"
                label="Distance (d)"
                value={sdtDist}
                onChange={setSdtDist}
                currentUnit={sdtDistUnit}
                onUnitChange={setSdtDistUnit}
                units={[{ id: 'km', label: 'km' }, { id: 'mi', label: 'miles' }, { id: 'm', label: 'meters' }, { id: 'ft', label: 'feet' }]}
              />
            )}
            {sdtMode !== 'time' && (
              <UnitNumberInput
                id="sdt-time"
                label="Time (t)"
                value={sdtTime}
                onChange={setSdtTime}
                currentUnit={sdtTimeUnit}
                onUnitChange={setSdtTimeUnit}
                units={[{ id: 'h', label: 'hours (h)' }, { id: 'min', label: 'minutes (min)' }, { id: 's', label: 'seconds (s)' }]}
              />
            )}
            {sdtMode !== 'speed' && (
              <UnitNumberInput
                id="sdt-spd"
                label="Speed"
                value={sdtSpeed}
                onChange={setSdtSpeed}
                currentUnit={sdtSpeedUnit}
                onUnitChange={setSdtSpeedUnit}
                units={[{ id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }, { id: 'm/s', label: 'm/s' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={sdtResult} />}
      />
    );
  }

  if (toolSlug === 'momentum-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Momentum Calculator"
        badge="p = m × v"
        onReset={() => { setPMode('momentum'); setPMass(1200); setPVel(25); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['momentum', 'mass', 'velocity'] as const).map((m) => (
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
            {pMode !== 'mass' && (
              <UnitNumberInput
                id="mom-mass"
                label="Mass (m)"
                value={pMass}
                onChange={setPMass}
                currentUnit={pMassUnit}
                onUnitChange={setPMassUnit}
                units={[{ id: 'kg', label: 'kg' }, { id: 'g', label: 'g' }, { id: 'lb', label: 'lb' }]}
              />
            )}
            {pMode !== 'velocity' && (
              <UnitNumberInput
                id="mom-vel"
                label="Velocity (v)"
                value={pVel}
                onChange={setPVel}
                currentUnit={pVelUnit}
                onUnitChange={setPVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {pMode !== 'momentum' && (
              <UnitNumberInput
                id="mom-p"
                label="Momentum (p in kg·m/s)"
                value={pMom}
                onChange={setPMom}
                suffix="kg·m/s"
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={momentumResult} />}
      />
    );
  }

  if (toolSlug === 'density-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Density Calculator"
        badge="ρ = m / V"
        onReset={() => { setRhoMode('density'); setRhoMass(500); setRhoVol(250); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['density', 'mass', 'volume'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setRhoMode(m)}
                    className={`py-1.5 rounded text-center capitalize transition-all ${rhoMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {rhoMode !== 'mass' && (
              <UnitNumberInput
                id="rho-mass"
                label="Mass (m)"
                value={rhoMass}
                onChange={setRhoMass}
                currentUnit={rhoMassUnit}
                onUnitChange={setRhoMassUnit}
                units={[{ id: 'g', label: 'grams (g)' }, { id: 'kg', label: 'kilograms (kg)' }, { id: 'lb', label: 'pounds (lb)' }]}
              />
            )}
            {rhoMode !== 'volume' && (
              <UnitNumberInput
                id="rho-vol"
                label="Volume (V)"
                value={rhoVol}
                onChange={setRhoVol}
                currentUnit={rhoVolUnit}
                onUnitChange={setRhoVolUnit}
                units={[{ id: 'mL', label: 'mL / cm³' }, { id: 'L', label: 'Liters (L)' }, { id: 'm³', label: 'm³' }, { id: 'cu ft', label: 'ft³' }]}
              />
            )}
            {rhoMode !== 'density' && (
              <UnitNumberInput
                id="rho-rho"
                label="Density (ρ)"
                value={rhoDensity}
                onChange={setRhoDensity}
                currentUnit={rhoDensityUnit}
                onUnitChange={setRhoDensityUnit}
                units={[{ id: 'g/cm3', label: 'g/cm³' }, { id: 'kg/m3', label: 'kg/m³' }, { id: 'lb/ft3', label: 'lb/ft³' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={densityResult} />}
      />
    );
  }

  if (toolSlug === 'torque-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Torque Calculator"
        badge="τ = r × F × sin(θ)"
        onReset={() => { setTMode('torque'); setTForce(150); setTRadius(0.4); setTAngle(90); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['torque', 'force', 'radius', 'angle'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTMode(m)}
                    className={`py-1.5 rounded text-center text-[11px] capitalize transition-all ${tMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'radius' ? 'Lever arm' : m}
                  </button>
                ))}
              </div>
            </div>
            {tMode !== 'force' && (
              <UnitNumberInput
                id="t-force"
                label="Applied Force (F)"
                value={tForce}
                onChange={setTForce}
                currentUnit={tForceUnit}
                onUnitChange={setTForceUnit}
                units={[{ id: 'N', label: 'N' }, { id: 'kN', label: 'kN' }, { id: 'lbf', label: 'lbf' }]}
              />
            )}
            {tMode !== 'radius' && (
              <UnitNumberInput
                id="t-radius"
                label="Lever Arm Distance (r)"
                value={tRadius}
                onChange={setTRadius}
                currentUnit={tRadiusUnit}
                onUnitChange={setTRadiusUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'cm', label: 'cm' }, { id: 'in', label: 'inches (in)' }, { id: 'ft', label: 'feet (ft)' }]}
              />
            )}
            {tMode !== 'angle' && (
              <UnitNumberInput
                id="t-angle"
                label="Angle between Force & Arm (θ)"
                value={tAngle}
                onChange={setTAngle}
                currentUnit={tAngleUnit}
                onUnitChange={setTAngleUnit}
                units={[{ id: 'deg', label: 'degrees (°)' }, { id: 'rad', label: 'radians' }]}
              />
            )}
            {tMode !== 'torque' && (
              <UnitNumberInput
                id="t-torque"
                label="Torque (τ)"
                value={tTorque}
                onChange={setTTorque}
                currentUnit={tTorqueUnit}
                onUnitChange={setTTorqueUnit}
                units={[{ id: 'N·m', label: 'N·m' }, { id: 'lbf·ft', label: 'lbf·ft' }, { id: 'lbf·in', label: 'lbf·in' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={torqueResult} />}
      />
    );
  }

  if (toolSlug === 'free-fall-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Free Fall Calculator"
        badge="v = u + gt"
        onReset={() => { setFfMode('velocityTime'); setFfInitVel(0); setFfGravity(9.80665); setFfTime(3); setFfHeight(45); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculation Mode</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setFfMode('velocityTime')}
                  className={`py-1.5 rounded text-center transition-all ${ffMode === 'velocityTime' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Time elapsed
                </button>
                <button
                  onClick={() => setFfMode('timeOfFall')}
                  className={`py-1.5 rounded text-center transition-all ${ffMode === 'timeOfFall' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  From height
                </button>
                <button
                  onClick={() => setFfMode('impactVelocity')}
                  className={`py-1.5 rounded text-center transition-all ${ffMode === 'impactVelocity' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Impact speed
                </button>
              </div>
            </div>
            <UnitNumberInput
              id="ff-u"
              label="Initial Velocity (u, downward positive)"
              value={ffInitVel}
              onChange={setFfInitVel}
              currentUnit={ffVelUnit}
              onUnitChange={setFfVelUnit}
              units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
            />
            {ffMode === 'velocityTime' ? (
              <UnitNumberInput
                id="ff-time"
                label="Duration of Fall (t)"
                value={ffTime}
                onChange={setFfTime}
                currentUnit={ffTimeUnit}
                onUnitChange={setFfTimeUnit}
                units={[{ id: 's', label: 'seconds (s)' }, { id: 'min', label: 'minutes (min)' }]}
              />
            ) : (
              <UnitNumberInput
                id="ff-height"
                label="Fall Height / Distance (s)"
                value={ffHeight}
                onChange={setFfHeight}
                currentUnit={ffDistUnit}
                onUnitChange={setFfDistUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'ft', label: 'feet (ft)' }]}
              />
            )}
            <UnitNumberInput
              id="ff-g"
              label="Gravity (g in m/s²)"
              value={ffGravity}
              onChange={setFfGravity}
              suffix="m/s²"
              helpText="Earth default: 9.807 m/s² (Moon: 1.62, Mars: 3.72)"
            />
          </div>
        }
        results={<PhysicsResultDisplay result={freeFallResult} />}
      />
    );
  }

  if (toolSlug === 'projectile-motion-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Projectile Motion Calculator"
        badge="2D Trajectory Solver"
        onReset={() => { setPmSpeed(25); setPmAngle(45); setPmHeight(0); setPmGravity(9.80665); }}
        inputs={
          <div className="space-y-3.5">
            <UnitNumberInput
              id="pm-spd"
              label="Launch Speed (v₀)"
              value={pmSpeed}
              onChange={setPmSpeed}
              currentUnit={pmSpeedUnit}
              onUnitChange={setPmSpeedUnit}
              units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
            />
            <UnitNumberInput
              id="pm-ang"
              label="Launch Angle (θ in degrees)"
              value={pmAngle}
              onChange={setPmAngle}
              suffix="°"
              min={0}
              max={90}
            />
            <UnitNumberInput
              id="pm-h0"
              label="Initial Launch Elevation (h₀)"
              value={pmHeight}
              onChange={setPmHeight}
              currentUnit={pmDistUnit}
              onUnitChange={setPmDistUnit}
              units={[{ id: 'm', label: 'meters (m)' }, { id: 'ft', label: 'feet (ft)' }]}
            />
            <UnitNumberInput
              id="pm-g"
              label="Gravitational Acceleration (g)"
              value={pmGravity}
              onChange={setPmGravity}
              suffix="m/s²"
            />
          </div>
        }
        results={<PhysicsResultDisplay result={projectileResult} />}
      />
    );
  }

  if (toolSlug === 'centripetal-force-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Centripetal Force Calculator"
        badge="Fc = m × v² / r"
        onReset={() => { setCfMode('force'); setCfMass(800); setCfVel(20); setCfRadius(50); }}
        inputs={
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate For</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['force', 'mass', 'velocity', 'radius'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCfMode(m)}
                    className={`py-1.5 rounded text-center text-[11px] capitalize transition-all ${cfMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {m === 'force' ? 'Centripetal F' : m}
                  </button>
                ))}
              </div>
            </div>
            {cfMode !== 'mass' && (
              <UnitNumberInput
                id="cf-mass"
                label="Mass (m)"
                value={cfMass}
                onChange={setCfMass}
                currentUnit={cfMassUnit}
                onUnitChange={setCfMassUnit}
                units={[{ id: 'kg', label: 'kg' }, { id: 'g', label: 'g' }, { id: 'lb', label: 'lb' }]}
              />
            )}
            {cfMode !== 'velocity' && (
              <UnitNumberInput
                id="cf-vel"
                label="Tangential Speed (v)"
                value={cfVel}
                onChange={setCfVel}
                currentUnit={cfVelUnit}
                onUnitChange={setCfVelUnit}
                units={[{ id: 'm/s', label: 'm/s' }, { id: 'km/h', label: 'km/h' }, { id: 'mph', label: 'mph' }]}
              />
            )}
            {cfMode !== 'radius' && (
              <UnitNumberInput
                id="cf-rad"
                label="Radius of Circular Path (r)"
                value={cfRadius}
                onChange={setCfRadius}
                currentUnit={cfRadiusUnit}
                onUnitChange={setCfRadiusUnit}
                units={[{ id: 'm', label: 'meters (m)' }, { id: 'cm', label: 'cm' }, { id: 'ft', label: 'feet (ft)' }]}
              />
            )}
            {cfMode !== 'force' && (
              <UnitNumberInput
                id="cf-force"
                label="Centripetal Force (Fc)"
                value={cfForce}
                onChange={setCfForce}
                currentUnit={cfForceUnit}
                onUnitChange={setCfForceUnit}
                units={[{ id: 'N', label: 'Newtons (N)' }, { id: 'kN', label: 'kN' }, { id: 'lbf', label: 'lbf' }]}
              />
            )}
          </div>
        }
        results={<PhysicsResultDisplay result={centripetalResult} />}
      />
    );
  }

  return null;
};
