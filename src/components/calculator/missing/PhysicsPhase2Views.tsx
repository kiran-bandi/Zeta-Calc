import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { PhysicsResultDisplay } from '../physics/PhysicsResultDisplay';
import {
  calculateFriction,
  calculateImpulse,
  calculateHookesLaw,
  calculatePendulumPeriod,
  calculateGravitationalForce,
  calculateEscapeVelocity,
  calculateOrbitalVelocity,
  calculateCoulombsLaw,
  calculateElectricField,
  calculateCapacitance,
  calculateSpecificHeat,
  calculateThermalExpansion,
  calculateHeatTransferConduction,
  calculateIdealGasLaw,
  calculateSnellsLaw,
  calculateThinLens,
  calculateDopplerEffect,
  calculatePhotonEnergy,
  calculateDeBroglieWavelength,
  calculateHalfLifeDecay,
  calculateBernoulliPressure,
  calculateBuoyancyArchimedes,
  calculateStressStrain,
} from '../../../engine/physicsPhase2Engines';
import { convertUnitValue } from '../../../engine/unitEngine';

export const PHYSICS_PHASE2_SLUGS = [
  'friction-calculator',
  'impulse-calculator',
  'hookes-law-calculator',
  'spring-hookes-law-calculator',
  'pendulum-period-calculator',
  'pendulum-calculator',
  'gravitational-force-calculator',
  'escape-velocity-calculator',
  'orbital-velocity-calculator',
  'coulombs-law-calculator',
  'electric-field-calculator',
  'capacitance-calculator',
  'capacitor-calculator',
  'specific-heat-calculator',
  'thermal-expansion-calculator',
  'heat-transfer-calculator',
  'heat-energy-calculator',
  'ideal-gas-law-calculator',
  'snells-law-calculator',
  'thin-lens-calculator',
  'lens-calculator',
  'doppler-effect-calculator',
  'photon-energy-calculator',
  'de-broglie-wavelength-calculator',
  'half-life-calculator',
  'bernoulli-equation-calculator',
  'buoyant-force-calculator',
  'stress-strain-calculator',
];

// Common unit options
const MASS_UNITS = [
  { id: 'kg', label: 'Kilograms (kg)' },
  { id: 'g', label: 'Grams (g)' },
  { id: 'mg', label: 'Milligrams (mg)' },
  { id: 'tonne', label: 'Metric Tonnes (t)' },
  { id: 'lb', label: 'Pounds (lb)' },
  { id: 'oz', label: 'Ounces (oz)' },
  { id: 'M_earth', label: 'Earth Masses (M⊕ = 5.972e24 kg)' },
  { id: 'M_sun', label: 'Solar Masses (M☉ = 1.989e30 kg)' },
  { id: 'M_moon', label: 'Lunar Masses (M_moon = 7.342e22 kg)' },
  { id: 'M_jupiter', label: 'Jupiter Masses (M_jup = 1.898e27 kg)' },
  { id: 'M_mars', label: 'Mars Masses (M_mars = 6.417e23 kg)' },
];

const LENGTH_UNITS = [
  { id: 'm', label: 'Meters (m)' },
  { id: 'km', label: 'Kilometers (km)' },
  { id: 'cm', label: 'Centimeters (cm)' },
  { id: 'mm', label: 'Millimeters (mm)' },
  { id: 'μm', label: 'Micrometers (μm)' },
  { id: 'nm', label: 'Nanometers (nm)' },
  { id: 'pm', label: 'Picometers (pm)' },
  { id: 'ft', label: 'Feet (ft)' },
  { id: 'in', label: 'Inches (in)' },
  { id: 'mi', label: 'Miles (mi)' },
  { id: 'AU', label: 'Astronomical Units (AU = 1.496e11 m)' },
  { id: 'ly', label: 'Light-Years (ly = 9.461e15 m)' },
  { id: 'R_earth', label: 'Earth Radii (R⊕ = 6,371 km)' },
  { id: 'R_sun', label: 'Solar Radii (R☉ = 696,340 km)' },
  { id: 'R_moon', label: 'Lunar Radii (R_moon = 1,737 km)' },
  { id: 'R_jupiter', label: 'Jupiter Radii (R_jup = 69,911 km)' },
];

const FORCE_UNITS = [
  { id: 'N', label: 'Newtons (N)' },
  { id: 'kN', label: 'Kilonewtons (kN)' },
  { id: 'MN', label: 'Meganewtons (MN)' },
  { id: 'mN', label: 'Millinewtons (mN)' },
  { id: 'lbf', label: 'Pounds-force (lbf)' },
  { id: 'dyn', label: 'Dynes (dyn)' },
];

const TIME_UNITS = [
  { id: 's', label: 'Seconds (s)' },
  { id: 'ms', label: 'Milliseconds (ms)' },
  { id: 'μs', label: 'Microseconds (μs)' },
  { id: 'min', label: 'Minutes (min)' },
  { id: 'h', label: 'Hours (h)' },
  { id: 'days', label: 'Days (d)' },
  { id: 'years', label: 'Years (yr)' },
];

const VELOCITY_UNITS = [
  { id: 'm/s', label: 'Meters per second (m/s)' },
  { id: 'km/s', label: 'Kilometers per second (km/s)' },
  { id: 'km/h', label: 'Kilometers per hour (km/h)' },
  { id: 'mph', label: 'Miles per hour (mph)' },
  { id: 'ft/s', label: 'Feet per second (ft/s)' },
  { id: 'knots', label: 'Knots (kn)' },
];

const CHARGE_UNITS = [
  { id: 'C', label: 'Coulombs (C)' },
  { id: 'mC', label: 'Millicoulombs (mC)' },
  { id: 'μC', label: 'Microcoulombs (μC)' },
  { id: 'nC', label: 'Nanocoulombs (nC)' },
  { id: 'pC', label: 'Picocoulombs (pC)' },
  { id: 'e', label: 'Elementary charges (e = 1.602e-19 C)' },
];

const ENERGY_UNITS = [
  { id: 'J', label: 'Joules (J)' },
  { id: 'kJ', label: 'Kilojoules (kJ)' },
  { id: 'MJ', label: 'Megajoules (MJ)' },
  { id: 'cal', label: 'Calories (cal)' },
  { id: 'kcal', label: 'Kilocalories (kcal)' },
  { id: 'eV', label: 'Electron-volts (eV)' },
  { id: 'BTU', label: 'BTU' },
];

const PRESSURE_UNITS = [
  { id: 'Pa', label: 'Pascals (Pa)' },
  { id: 'kPa', label: 'Kilopascals (kPa)' },
  { id: 'MPa', label: 'Megapascals (MPa)' },
  { id: 'GPa', label: 'Gigapascals (GPa)' },
  { id: 'bar', label: 'Bar' },
  { id: 'atm', label: 'Standard Atmospheres (atm)' },
  { id: 'psi', label: 'Pounds per sq inch (psi)' },
  { id: 'torr', label: 'Torr (mmHg)' },
];

const AREA_UNITS = [
  { id: 'm²', label: 'Square Meters (m²)' },
  { id: 'cm²', label: 'Square Centimeters (cm²)' },
  { id: 'mm²', label: 'Square Millimeters (mm²)' },
  { id: 'ft²', label: 'Square Feet (ft²)' },
  { id: 'in²', label: 'Square Inches (in²)' },
];

const DENSITY_UNITS = [
  { id: 'kg/m³', label: 'Kilograms per cubic meter (kg/m³)' },
  { id: 'g/cm³', label: 'Grams per cubic centimeter (g/cm³)' },
  { id: 'lb/ft³', label: 'Pounds per cubic foot (lb/ft³)' },
];

const FREQUENCY_UNITS = [
  { id: 'Hz', label: 'Hertz (Hz)' },
  { id: 'kHz', label: 'Kilohertz (kHz)' },
  { id: 'MHz', label: 'Megahertz (MHz)' },
  { id: 'GHz', label: 'Gigahertz (GHz)' },
  { id: 'THz', label: 'Terahertz (THz)' },
];

interface Props {
  toolSlug: string;
}

export const PhysicsPhase2Views: React.FC<Props> = ({ toolSlug }) => {
  // 1. Friction
  const [fricNorm, setFricNorm] = useState<number | ''>(100);
  const [fricNormUnit, setFricNormUnit] = useState<string>('N');
  const [fricMu, setFricMu] = useState<number | ''>(0.35);
  const [fricApplied, setFricApplied] = useState<number | ''>('');
  const [fricAppliedUnit, setFricAppliedUnit] = useState<string>('N');
  const fricResult = useMemo(
    () => calculateFriction(fricNorm, fricMu, fricApplied, fricNormUnit, fricAppliedUnit),
    [fricNorm, fricMu, fricApplied, fricNormUnit, fricAppliedUnit]
  );

  // 2. Impulse
  const [impForce, setImpForce] = useState<number | ''>(500);
  const [impForceUnit, setImpForceUnit] = useState<string>('N');
  const [impTime, setImpTime] = useState<number | ''>(0.05);
  const [impTimeUnit, setImpTimeUnit] = useState<string>('s');
  const impResult = useMemo(
    () => calculateImpulse(impForce, impTime, impForceUnit, impTimeUnit),
    [impForce, impTime, impForceUnit, impTimeUnit]
  );

  // 3. Hooke's Law
  const [hookeK, setHookeK] = useState<number | ''>(250);
  const [hookeKUnit, setHookeKUnit] = useState<string>('N/m');
  const [hookeX, setHookeX] = useState<number | ''>(0.05);
  const [hookeXUnit, setHookeXUnit] = useState<string>('m');
  const [hookeForceUnit, setHookeForceUnit] = useState<string>('N');
  const hookeResult = useMemo(
    () => calculateHookesLaw(hookeK, hookeX, hookeKUnit, hookeXUnit, hookeForceUnit),
    [hookeK, hookeX, hookeKUnit, hookeXUnit, hookeForceUnit]
  );

  // 4. Pendulum Period
  const [pendLen, setPendLen] = useState<number | ''>(1.0);
  const [pendLenUnit, setPendLenUnit] = useState<string>('m');
  const [pendG, setPendG] = useState<number | ''>(9.80665);
  const pendResult = useMemo(
    () => calculatePendulumPeriod(pendLen, pendG, pendLenUnit),
    [pendLen, pendG, pendLenUnit]
  );

  // 5. Gravitational Force
  const [gravM1, setGravM1] = useState<number | ''>(1);
  const [gravM1Unit, setGravM1Unit] = useState<string>('M_earth');
  const [gravM2, setGravM2] = useState<number | ''>(1);
  const [gravM2Unit, setGravM2Unit] = useState<string>('M_moon');
  const [gravR, setGravR] = useState<number | ''>(384400);
  const [gravRUnit, setGravRUnit] = useState<string>('km');
  const [gravForceUnit, setGravForceUnit] = useState<string>('N');
  const gravResult = useMemo(
    () => calculateGravitationalForce(gravM1, gravM2, gravR, gravM1Unit, gravM2Unit, gravRUnit, gravForceUnit),
    [gravM1, gravM2, gravR, gravM1Unit, gravM2Unit, gravRUnit, gravForceUnit]
  );

  // 6. Escape Velocity
  const [escM, setEscM] = useState<number | ''>(1);
  const [escMUnit, setEscMUnit] = useState<string>('M_earth');
  const [escR, setEscR] = useState<number | ''>(6371);
  const [escRUnit, setEscRUnit] = useState<string>('km');
  const [escVUnit, setEscVUnit] = useState<string>('km/s');
  const escResult = useMemo(
    () => calculateEscapeVelocity(escM, escR, escMUnit, escRUnit, escVUnit),
    [escM, escR, escMUnit, escRUnit, escVUnit]
  );

  // 7. Orbital Velocity
  const [orbM, setOrbM] = useState<number | ''>(1);
  const [orbMUnit, setOrbMUnit] = useState<string>('M_earth');
  const [orbR, setOrbR] = useState<number | ''>(6771);
  const [orbRUnit, setOrbRUnit] = useState<string>('km');
  const orbResult = useMemo(
    () => calculateOrbitalVelocity(orbM, orbR, orbMUnit, orbRUnit),
    [orbM, orbR, orbMUnit, orbRUnit]
  );

  // 8. Coulomb's Law
  const [coulQ1, setCoulQ1] = useState<number | ''>(1);
  const [coulQ1Unit, setCoulQ1Unit] = useState<string>('μC');
  const [coulQ2, setCoulQ2] = useState<number | ''>(-1);
  const [coulQ2Unit, setCoulQ2Unit] = useState<string>('μC');
  const [coulR, setCoulR] = useState<number | ''>(0.1);
  const [coulRUnit, setCoulRUnit] = useState<string>('m');
  const [coulForceUnit, setCoulForceUnit] = useState<string>('N');
  const coulResult = useMemo(
    () => calculateCoulombsLaw(coulQ1, coulQ2, coulR, coulQ1Unit, coulQ2Unit, coulRUnit, coulForceUnit),
    [coulQ1, coulQ2, coulR, coulQ1Unit, coulQ2Unit, coulRUnit, coulForceUnit]
  );

  // 9. Electric Field
  const [efMode, setEfMode] = useState<'point_charge' | 'force_charge'>('point_charge');
  const [efQ, setEfQ] = useState<number | ''>(5);
  const [efQUnit, setEfQUnit] = useState<string>('μC');
  const [efR, setEfR] = useState<number | ''>(0.2);
  const [efRUnit, setEfRUnit] = useState<string>('m');
  const [efForce, setEfForce] = useState<number | ''>('');
  const [efTestQ, setEfTestQ] = useState<number | ''>('');
  const efResult = useMemo(
    () => calculateElectricField(efMode, efQ, efR, efForce, efTestQ, efQUnit, efRUnit),
    [efMode, efQ, efR, efForce, efTestQ, efQUnit, efRUnit]
  );

  // 10. Capacitance
  const [capArea, setCapArea] = useState<number | ''>(0.01);
  const [capAreaUnit, setCapAreaUnit] = useState<string>('m²');
  const [capDist, setCapDist] = useState<number | ''>(1);
  const [capDistUnit, setCapDistUnit] = useState<string>('mm');
  const [capEr, setCapEr] = useState<number | ''>(1);
  const capResult = useMemo(
    () => calculateCapacitance(capArea, capDist, capEr, capAreaUnit, capDistUnit),
    [capArea, capDist, capEr, capAreaUnit, capDistUnit]
  );

  // 11. Specific Heat
  const [shMass, setShMass] = useState<number | ''>(2);
  const [shMassUnit, setShMassUnit] = useState<string>('kg');
  const [shC, setShC] = useState<number | ''>(4184);
  const [shDt, setShDt] = useState<number | ''>(25);
  const [shEnergyUnit, setShEnergyUnit] = useState<string>('J');
  const shResult = useMemo(
    () => calculateSpecificHeat(shMass, shC, shDt, shMassUnit, shEnergyUnit),
    [shMass, shC, shDt, shMassUnit, shEnergyUnit]
  );

  // 12. Thermal Expansion
  const [teType, setTeType] = useState<'linear' | 'area' | 'volumetric'>('linear');
  const [teL0, setTeL0] = useState<number | ''>(10);
  const [teL0Unit, setTeL0Unit] = useState<string>('m');
  const [teAlpha, setTeAlpha] = useState<number | ''>(12e-6);
  const [teDt, setTeDt] = useState<number | ''>(50);
  const teResult = useMemo(
    () => calculateThermalExpansion(teType, teL0, teAlpha, teDt, teL0Unit),
    [teType, teL0, teAlpha, teDt, teL0Unit]
  );

  // 13. Heat Conduction
  const [hcK, setHcK] = useState<number | ''>(0.8);
  const [hcArea, setHcArea] = useState<number | ''>(5);
  const [hcDt, setHcDt] = useState<number | ''>(20);
  const [hcDx, setHcDx] = useState<number | ''>(0.1);
  const hcResult = useMemo(
    () => calculateHeatTransferConduction(hcK, hcArea, hcDt, hcDx),
    [hcK, hcArea, hcDt, hcDx]
  );

  // 14. Ideal Gas Law
  const [igTarget, setIgTarget] = useState<'P' | 'V' | 'n' | 'T'>('P');
  const [igP, setIgP] = useState<number | ''>('');
  const [igPUnit, setIgPUnit] = useState<string>('atm');
  const [igV, setIgV] = useState<number | ''>(22.414);
  const [igVUnit, setIgVUnit] = useState<string>('L');
  const [igN, setIgN] = useState<number | ''>(1);
  const [igT, setIgT] = useState<number | ''>(273.15);
  const [igTUnit, setIgTUnit] = useState<string>('K');
  const igResult = useMemo(() => {
    // Convert inputs to SI for standard formula
    const pSI = typeof igP === 'number' ? convertUnitValue(igP, igPUnit, 'Pa') : '';
    const vSI = typeof igV === 'number' ? convertUnitValue(igV, igVUnit, 'm3') : '';
    let tSI = igT;
    if (typeof igT === 'number') {
      if (igTUnit === '°C') tSI = igT + 273.15;
      else if (igTUnit === '°F') tSI = ((igT - 32) * 5) / 9 + 273.15;
    }
    return calculateIdealGasLaw(igTarget, pSI, vSI, igN, tSI);
  }, [igTarget, igP, igPUnit, igV, igVUnit, igN, igT, igTUnit]);

  // 15. Snell's Law
  const [snellN1, setSnellN1] = useState<number | ''>(1.0003);
  const [snellTheta1, setSnellTheta1] = useState<number | ''>(30);
  const [snellN2, setSnellN2] = useState<number | ''>(1.52);
  const snellResult = useMemo(
    () => calculateSnellsLaw(snellN1, snellTheta1, snellN2),
    [snellN1, snellTheta1, snellN2]
  );

  // 16. Thin Lens
  const [lensF, setLensF] = useState<number | ''>(10);
  const [lensDo, setLensDo] = useState<number | ''>(25);
  const [lensUnit, setLensUnit] = useState<string>('cm');
  const lensResult = useMemo(
    () => calculateThinLens(lensF, lensDo, lensUnit),
    [lensF, lensDo, lensUnit]
  );

  // 17. Doppler Effect
  const [dopF0, setDopF0] = useState<number | ''>(1000);
  const [dopV, setDopV] = useState<number | ''>(343);
  const [dopVo, setDopVo] = useState<number | ''>(0);
  const [dopVs, setDopVs] = useState<number | ''>(30);
  const [dopSrcDir, setDopSrcDir] = useState<'towards' | 'away' | 'stationary'>('towards');
  const [dopObsDir, setDopObsDir] = useState<'towards' | 'away' | 'stationary'>('stationary');
  const dopResult = useMemo(
    () => calculateDopplerEffect(dopF0, dopV, dopVo, dopVs, dopSrcDir, dopObsDir),
    [dopF0, dopV, dopVo, dopVs, dopSrcDir, dopObsDir]
  );

  // 18. Photon Energy
  const [photMode, setPhotMode] = useState<'wavelength' | 'frequency'>('wavelength');
  const [photVal, setPhotVal] = useState<number | ''>(532);
  const [photUnit, setPhotUnit] = useState<string>('nm');
  const photResult = useMemo(() => {
    if (typeof photVal !== 'number') return null;
    if (photMode === 'wavelength') {
      const lambdaMeters = convertUnitValue(photVal, photUnit, 'm');
      return calculatePhotonEnergy('wavelength', '', lambdaMeters);
    } else {
      const freqHz = convertUnitValue(photVal, photUnit, 'Hz');
      return calculatePhotonEnergy('frequency', freqHz, '');
    }
  }, [photMode, photVal, photUnit]);

  // 19. De Broglie Wavelength
  const [dbMass, setDbMass] = useState<number | ''>(9.1093837e-31);
  const [dbMassUnit, setDbMassUnit] = useState<string>('kg');
  const [dbVel, setDbVel] = useState<number | ''>(1e6);
  const [dbVelUnit, setDbVelUnit] = useState<string>('m/s');
  const dbResult = useMemo(() => {
    const mSI = typeof dbMass === 'number' ? convertUnitValue(dbMass, dbMassUnit, 'kg') : '';
    const vSI = typeof dbVel === 'number' ? convertUnitValue(dbVel, dbVelUnit, 'm/s') : '';
    return calculateDeBroglieWavelength(mSI, vSI);
  }, [dbMass, dbMassUnit, dbVel, dbVelUnit]);

  // 20. Half Life Decay
  const [hlN0, setHlN0] = useState<number | ''>(100);
  const [hlT12, setHlT12] = useState<number | ''>(5730);
  const [hlT12Unit, setHlT12Unit] = useState<string>('years');
  const [hlT, setHlT] = useState<number | ''>(11460);
  const [hlTUnit, setHlTUnit] = useState<string>('years');
  const hlResult = useMemo(() => {
    const t12Sec = typeof hlT12 === 'number' ? convertUnitValue(hlT12, hlT12Unit, 's') : '';
    const tSec = typeof hlT === 'number' ? convertUnitValue(hlT, hlTUnit, 's') : '';
    return calculateHalfLifeDecay(hlN0, t12Sec, tSec);
  }, [hlN0, hlT12, hlT12Unit, hlT, hlTUnit]);

  // 21. Bernoulli Pressure
  const [bernP1, setBernP1] = useState<number | ''>(200000);
  const [bernV1, setBernV1] = useState<number | ''>(2);
  const [bernV2, setBernV2] = useState<number | ''>(8);
  const [bernRho, setBernRho] = useState<number | ''>(1000);
  const bernResult = useMemo(
    () => calculateBernoulliPressure(bernP1, bernV1, 0, bernV2, 0, bernRho),
    [bernP1, bernV1, bernV2, bernRho]
  );

  // 22. Buoyant Force
  const [buoyRho, setBuoyRho] = useState<number | ''>(1000);
  const [buoyRhoUnit, setBuoyRhoUnit] = useState<string>('kg/m³');
  const [buoyV, setBuoyV] = useState<number | ''>(0.05);
  const [buoyVUnit, setBuoyVUnit] = useState<string>('m³');
  const buoyResult = useMemo(() => {
    const rhoSI = typeof buoyRho === 'number' ? convertUnitValue(buoyRho, buoyRhoUnit, 'kg/m3') : '';
    const vSI = typeof buoyV === 'number' ? convertUnitValue(buoyV, buoyVUnit, 'm3') : '';
    return calculateBuoyancyArchimedes(rhoSI, vSI);
  }, [buoyRho, buoyRhoUnit, buoyV, buoyVUnit]);

  // 23. Stress Strain
  const [ssF, setSsF] = useState<number | ''>(50000);
  const [ssFUnit, setSsFUnit] = useState<string>('N');
  const [ssA, setSsA] = useState<number | ''>(100);
  const [ssAUnit, setSsAUnit] = useState<string>('mm²');
  const [ssL0, setSsL0] = useState<number | ''>(2);
  const [ssL0Unit, setSsL0Unit] = useState<string>('m');
  const [ssDl, setSsDl] = useState<number | ''>(5);
  const [ssDlUnit, setSsDlUnit] = useState<string>('mm');
  const ssResult = useMemo(() => {
    const fSI = typeof ssF === 'number' ? convertUnitValue(ssF, ssFUnit, 'N') : '';
    const aSI = typeof ssA === 'number' ? convertUnitValue(ssA, ssAUnit, 'm2') : '';
    const l0SI = typeof ssL0 === 'number' ? convertUnitValue(ssL0, ssL0Unit, 'm') : '';
    const dlSI = typeof ssDl === 'number' ? convertUnitValue(ssDl, ssDlUnit, 'm') : '';
    return calculateStressStrain(fSI, aSI, l0SI, dlSI);
  }, [ssF, ssFUnit, ssA, ssAUnit, ssL0, ssL0Unit, ssDl, ssDlUnit]);

  // Render Dispatch
  switch (toolSlug) {
    case 'friction-calculator':
      return (
        <CompactCalculatorWorkspace
          id="friction-calc"
          inputsTitle="Forces & Friction Coefficient"
          resultsTitle="Frictional Resistance Analysis"
          onReset={() => {
            setFricNorm(100);
            setFricNormUnit('N');
            setFricMu(0.35);
            setFricApplied('');
            setFricAppliedUnit('N');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Normal Force (N)"
                value={fricNorm}
                onChange={setFricNorm}
                selectedUnit={fricNormUnit}
                onUnitChange={setFricNormUnit}
                units={FORCE_UNITS}
                placeholder="e.g. 100"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Coefficient of Friction (μ)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="2"
                  value={fricMu}
                  onChange={(e) => setFricMu(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 0.35"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'Rubber / Dry Road (0.9)', val: 0.9 },
                    { label: 'Steel / Steel (0.74)', val: 0.74 },
                    { label: 'Wood / Wood (0.4)', val: 0.4 },
                    { label: 'Ice / Ice (0.03)', val: 0.03 },
                    { label: 'Teflon / Teflon (0.04)', val: 0.04 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFricMu(p.val)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <UnitNumberInput
                label="Applied Pulling Force (optional)"
                value={fricApplied}
                onChange={setFricApplied}
                selectedUnit={fricAppliedUnit}
                onUnitChange={setFricAppliedUnit}
                units={FORCE_UNITS}
                placeholder="Optional applied force"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={fricResult} />}
        />
      );

    case 'impulse-calculator':
      return (
        <CompactCalculatorWorkspace
          id="impulse-calc"
          inputsTitle="Force & Collision Duration"
          resultsTitle="Impulse (Momentum Change)"
          onReset={() => {
            setImpForce(500);
            setImpForceUnit('N');
            setImpTime(0.05);
            setImpTimeUnit('s');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Average Impact Force (F)"
                value={impForce}
                onChange={setImpForce}
                selectedUnit={impForceUnit}
                onUnitChange={setImpForceUnit}
                units={FORCE_UNITS}
                placeholder="e.g. 500"
              />
              <UnitNumberInput
                label="Collision Duration (Δt)"
                value={impTime}
                onChange={setImpTime}
                selectedUnit={impTimeUnit}
                onUnitChange={setImpTimeUnit}
                units={TIME_UNITS}
                placeholder="e.g. 0.05"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {[
                  { label: 'Golf club impact (4 kN, 0.5 ms)', f: 4000, fu: 'N', t: 0.5, tu: 'ms' },
                  { label: 'Tennis serve (800 N, 5 ms)', f: 800, fu: 'N', t: 5, tu: 'ms' },
                  { label: 'Car airbag crash (50 kN, 30 ms)', f: 50, fu: 'kN', t: 30, tu: 'ms' },
                  { label: 'Football kick (1.2 kN, 12 ms)', f: 1200, fu: 'N', t: 12, tu: 'ms' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setImpForce(p.f);
                      setImpForceUnit(p.fu);
                      setImpTime(p.t);
                      setImpTimeUnit(p.tu);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={impResult} />}
        />
      );

    case 'hookes-law-calculator':
    case 'spring-hookes-law-calculator':
      return (
        <CompactCalculatorWorkspace
          id="hookes-law-calc"
          inputsTitle="Spring Properties & Displacement"
          resultsTitle="Restoring Force & Elastic Potential Energy"
          onReset={() => {
            setHookeK(250);
            setHookeKUnit('N/m');
            setHookeX(0.05);
            setHookeXUnit('m');
            setHookeForceUnit('N');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Spring Constant (k)"
                value={hookeK}
                onChange={setHookeK}
                selectedUnit={hookeKUnit}
                onUnitChange={setHookeKUnit}
                units={[
                  { id: 'N/m', label: 'Newtons per meter (N/m)' },
                  { id: 'kN/m', label: 'Kilonewtons per meter (kN/m)' },
                  { id: 'N/cm', label: 'Newtons per cm (N/cm)' },
                  { id: 'N/mm', label: 'Newtons per mm (N/mm)' },
                  { id: 'lbf/in', label: 'Pounds-force per inch (lbf/in)' },
                ]}
                placeholder="e.g. 250"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Ballpoint pen (100 N/m)', k: 100 },
                  { label: 'Mattress spring (500 N/m)', k: 500 },
                  { label: 'Car suspension (50 kN/m)', k: 50000 },
                  { label: 'Heavy industrial (200 kN/m)', k: 200000 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setHookeK(p.k);
                      setHookeKUnit('N/m');
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Displacement / Stretch (x)"
                value={hookeX}
                onChange={setHookeX}
                selectedUnit={hookeXUnit}
                onUnitChange={setHookeXUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 0.05"
              />
              <UnitNumberInput
                label="Force Output Unit"
                value={typeof hookeResult?.primaryValue === 'number' ? hookeResult.primaryValue : ''}
                onChange={() => {}}
                selectedUnit={hookeForceUnit}
                onUnitChange={setHookeForceUnit}
                units={FORCE_UNITS}
                disabled={true}
              />
            </div>
          }
          results={<PhysicsResultDisplay result={hookeResult} />}
        />
      );

    case 'pendulum-period-calculator':
    case 'pendulum-calculator':
      return (
        <CompactCalculatorWorkspace
          id="pendulum-calc"
          inputsTitle="Length & Local Gravity"
          resultsTitle="Oscillation Period & Frequency"
          onReset={() => {
            setPendLen(1.0);
            setPendLenUnit('m');
            setPendG(9.80665);
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Pendulum Length (L)"
                value={pendLen}
                onChange={setPendLen}
                selectedUnit={pendLenUnit}
                onUnitChange={setPendLenUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 1.0"
              />
              <UnitNumberInput
                label="Gravitational Acceleration (g)"
                value={pendG}
                onChange={setPendG}
                selectedUnit="m/s²"
                onUnitChange={() => {}}
                units={[{ id: 'm/s²', label: 'm/s²' }]}
                placeholder="9.80665"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Earth (9.81 m/s²)', g: 9.80665 },
                  { label: 'Moon (1.62 m/s²)', g: 1.62 },
                  { label: 'Mars (3.72 m/s²)', g: 3.72 },
                  { label: 'Jupiter (24.79 m/s²)', g: 24.79 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPendG(p.g)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={pendResult} />}
        />
      );

    case 'gravitational-force-calculator':
      return (
        <CompactCalculatorWorkspace
          id="grav-force-calc"
          inputsTitle="Masses & Separation Distance"
          resultsTitle="Mutual Gravitational Force"
          onReset={() => {
            setGravM1(1);
            setGravM1Unit('M_earth');
            setGravM2(1);
            setGravM2Unit('M_moon');
            setGravR(384400);
            setGravRUnit('km');
            setGravForceUnit('N');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Mass 1 (m₁)"
                value={gravM1}
                onChange={setGravM1}
                selectedUnit={gravM1Unit}
                onUnitChange={setGravM1Unit}
                units={MASS_UNITS}
                placeholder="e.g. 1"
              />
              <UnitNumberInput
                label="Mass 2 (m₂)"
                value={gravM2}
                onChange={setGravM2}
                selectedUnit={gravM2Unit}
                onUnitChange={setGravM2Unit}
                units={MASS_UNITS}
                placeholder="e.g. 1"
              />
              <UnitNumberInput
                label="Separation Distance (r)"
                value={gravR}
                onChange={setGravR}
                selectedUnit={gravRUnit}
                onUnitChange={setGravRUnit}
                units={LENGTH_UNITS}
                placeholder="e.g. 384400"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Earth-Moon System', m1: 1, u1: 'M_earth', m2: 1, u2: 'M_moon', r: 384400, ru: 'km' },
                  { label: 'Sun-Earth System', m1: 1, u1: 'M_sun', m2: 1, u2: 'M_earth', r: 1, ru: 'AU' },
                  { label: 'Sun-Jupiter System', m1: 1, u1: 'M_sun', m2: 1, u2: 'M_jupiter', r: 5.2, ru: 'AU' },
                  { label: 'Person & Earth (75kg)', m1: 75, u1: 'kg', m2: 1, u2: 'M_earth', r: 1, ru: 'R_earth' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setGravM1(p.m1);
                      setGravM1Unit(p.u1);
                      setGravM2(p.m2);
                      setGravM2Unit(p.u2);
                      setGravR(p.r);
                      setGravRUnit(p.ru);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Force Output Unit"
                value={typeof gravResult?.primaryValue === 'number' ? gravResult.primaryValue : ''}
                onChange={() => {}}
                selectedUnit={gravForceUnit}
                onUnitChange={setGravForceUnit}
                units={FORCE_UNITS}
                disabled={true}
              />
            </div>
          }
          results={<PhysicsResultDisplay result={gravResult} />}
        />
      );

    case 'escape-velocity-calculator':
      return (
        <CompactCalculatorWorkspace
          id="escape-velocity-calc"
          inputsTitle="Celestial Body Mass & Radius"
          resultsTitle="Theoretical Escape Velocity"
          onReset={() => {
            setEscM(1);
            setEscMUnit('M_earth');
            setEscR(6371);
            setEscRUnit('km');
            setEscVUnit('km/s');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Celestial Body Mass (M)"
                value={escM}
                onChange={setEscM}
                selectedUnit={escMUnit}
                onUnitChange={setEscMUnit}
                units={MASS_UNITS}
                placeholder="e.g. 1"
              />
              <UnitNumberInput
                label="Celestial Body Radius (R)"
                value={escR}
                onChange={setEscR}
                selectedUnit={escRUnit}
                onUnitChange={setEscRUnit}
                units={LENGTH_UNITS}
                placeholder="e.g. 6371"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Earth (1 M⊕, 6,371 km)', m: 1, mu: 'M_earth', r: 6371, ru: 'km' },
                  { label: 'Moon (1 M_moon, 1,737 km)', m: 1, mu: 'M_moon', r: 1737, ru: 'km' },
                  { label: 'Mars (1 M_mars, 3,390 km)', m: 1, mu: 'M_mars', r: 3390, ru: 'km' },
                  { label: 'Jupiter (1 M_jup, 69,911 km)', m: 1, mu: 'M_jupiter', r: 69911, ru: 'km' },
                  { label: 'Sun (1 M☉, 696,340 km)', m: 1, mu: 'M_sun', r: 696340, ru: 'km' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setEscM(p.m);
                      setEscMUnit(p.mu);
                      setEscR(p.r);
                      setEscRUnit(p.ru);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Velocity Unit"
                value={typeof escResult?.primaryValue === 'number' ? escResult.primaryValue : ''}
                onChange={() => {}}
                selectedUnit={escVUnit}
                onUnitChange={setEscVUnit}
                units={VELOCITY_UNITS}
                disabled={true}
              />
            </div>
          }
          results={<PhysicsResultDisplay result={escResult} />}
        />
      );

    case 'orbital-velocity-calculator':
      return (
        <CompactCalculatorWorkspace
          id="orbital-velocity-calc"
          inputsTitle="Central Body Mass & Orbit Radius"
          resultsTitle="Circular Orbital Velocity & Period"
          onReset={() => {
            setOrbM(1);
            setOrbMUnit('M_earth');
            setOrbR(6771);
            setOrbRUnit('km');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Central Body Mass (M)"
                value={orbM}
                onChange={setOrbM}
                selectedUnit={orbMUnit}
                onUnitChange={setOrbMUnit}
                units={MASS_UNITS}
                placeholder="e.g. 1"
              />
              <UnitNumberInput
                label="Orbital Radius from Center (r)"
                value={orbR}
                onChange={setOrbR}
                selectedUnit={orbRUnit}
                onUnitChange={setOrbRUnit}
                units={LENGTH_UNITS}
                placeholder="e.g. 6771"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'ISS Low Earth Orbit (r = 6,771 km)', m: 1, mu: 'M_earth', r: 6771, ru: 'km' },
                  { label: 'Geostationary GEO (r = 42,164 km)', m: 1, mu: 'M_earth', r: 42164, ru: 'km' },
                  { label: 'GPS Satellite (r = 26,560 km)', m: 1, mu: 'M_earth', r: 26560, ru: 'km' },
                  { label: 'Moon around Earth (384,400 km)', m: 1, mu: 'M_earth', r: 384400, ru: 'km' },
                  { label: 'Earth around Sun (1 AU)', m: 1, mu: 'M_sun', r: 1, ru: 'AU' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setOrbM(p.m);
                      setOrbMUnit(p.mu);
                      setOrbR(p.r);
                      setOrbRUnit(p.ru);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={orbResult} />}
        />
      );

    case 'coulombs-law-calculator':
      return (
        <CompactCalculatorWorkspace
          id="coulombs-law-calc"
          inputsTitle="Point Charges & Separation"
          resultsTitle="Electrostatic Force (F = k·|q₁q₂|/r²)"
          onReset={() => {
            setCoulQ1(1);
            setCoulQ1Unit('μC');
            setCoulQ2(-1);
            setCoulQ2Unit('μC');
            setCoulR(0.1);
            setCoulRUnit('m');
            setCoulForceUnit('N');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Point Charge 1 (q₁)"
                value={coulQ1}
                onChange={setCoulQ1}
                selectedUnit={coulQ1Unit}
                onUnitChange={setCoulQ1Unit}
                units={CHARGE_UNITS}
                placeholder="e.g. 1"
              />
              <UnitNumberInput
                label="Point Charge 2 (q₂)"
                value={coulQ2}
                onChange={setCoulQ2}
                selectedUnit={coulQ2Unit}
                onUnitChange={setCoulQ2Unit}
                units={CHARGE_UNITS}
                placeholder="e.g. -1"
              />
              <UnitNumberInput
                label="Separation Distance (r)"
                value={coulR}
                onChange={setCoulR}
                selectedUnit={coulRUnit}
                onUnitChange={setCoulRUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 0.1"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Proton-Electron (Hydrogen atom: 0.053 nm)', q1: 1, u1: 'e', q2: -1, u2: 'e', r: 0.053, ru: 'nm' },
                  { label: 'Two 1 μC charges at 10 cm', q1: 1, u1: 'μC', q2: 1, u2: 'μC', r: 0.1, ru: 'm' },
                  { label: 'Two 1 C charges at 1 km', q1: 1, u1: 'C', q2: 1, u2: 'C', r: 1, ru: 'km' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setCoulQ1(p.q1);
                      setCoulQ1Unit(p.u1);
                      setCoulQ2(p.q2);
                      setCoulQ2Unit(p.u2);
                      setCoulR(p.r);
                      setCoulRUnit(p.ru);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Force Output Unit"
                value={typeof coulResult?.primaryValue === 'number' ? coulResult.primaryValue : ''}
                onChange={() => {}}
                selectedUnit={coulForceUnit}
                onUnitChange={setCoulForceUnit}
                units={FORCE_UNITS}
                disabled={true}
              />
            </div>
          }
          results={<PhysicsResultDisplay result={coulResult} />}
        />
      );

    case 'electric-field-calculator':
      return (
        <CompactCalculatorWorkspace
          id="electric-field-calc"
          inputsTitle="Source Charge & Radial Distance"
          resultsTitle="Electric Field Intensity (E = kQ/r²)"
          onReset={() => {
            setEfMode('point_charge');
            setEfQ(5);
            setEfQUnit('μC');
            setEfR(0.2);
            setEfRUnit('m');
            setEfForce('');
            setEfTestQ('');
          }}
          inputs={
            <div className="space-y-4">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setEfMode('point_charge')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    efMode === 'point_charge' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  From Point Charge (E = kQ/r²)
                </button>
                <button
                  type="button"
                  onClick={() => setEfMode('force_charge')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    efMode === 'force_charge' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  From Force on Test Charge (E = F/q)
                </button>
              </div>

              {efMode === 'point_charge' ? (
                <>
                  <UnitNumberInput
                    label="Source Charge (Q)"
                    value={efQ}
                    onChange={setEfQ}
                    selectedUnit={efQUnit}
                    onUnitChange={setEfQUnit}
                    units={CHARGE_UNITS}
                    placeholder="e.g. 5"
                  />
                  <UnitNumberInput
                    label="Distance from Charge (r)"
                    value={efR}
                    onChange={setEfR}
                    selectedUnit={efRUnit}
                    onUnitChange={setEfRUnit}
                    units={LENGTH_UNITS.slice(0, 9)}
                    placeholder="e.g. 0.2"
                  />
                </>
              ) : (
                <>
                  <UnitNumberInput
                    label="Electrostatic Force (F)"
                    value={efForce}
                    onChange={setEfForce}
                    selectedUnit="N"
                    onUnitChange={() => {}}
                    units={FORCE_UNITS}
                    placeholder="e.g. 0.05"
                  />
                  <UnitNumberInput
                    label="Test Charge (q)"
                    value={efTestQ}
                    onChange={setEfTestQ}
                    selectedUnit={efQUnit}
                    onUnitChange={setEfQUnit}
                    units={CHARGE_UNITS}
                    placeholder="e.g. 2"
                  />
                </>
              )}
            </div>
          }
          results={<PhysicsResultDisplay result={efResult} />}
        />
      );

    case 'capacitance-calculator':
    case 'capacitor-calculator':
      return (
        <CompactCalculatorWorkspace
          id="capacitance-calc"
          inputsTitle="Parallel-Plate Geometry & Dielectric"
          resultsTitle="Capacitance (C = ε_r·ε_0·A/d)"
          onReset={() => {
            setCapArea(0.01);
            setCapAreaUnit('m²');
            setCapDist(1);
            setCapDistUnit('mm');
            setCapEr(1);
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Plate Surface Area (A)"
                value={capArea}
                onChange={setCapArea}
                selectedUnit={capAreaUnit}
                onUnitChange={setCapAreaUnit}
                units={AREA_UNITS}
                placeholder="e.g. 0.01"
              />
              <UnitNumberInput
                label="Plate Separation Distance (d)"
                value={capDist}
                onChange={setCapDist}
                selectedUnit={capDistUnit}
                onUnitChange={setCapDistUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 1"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dielectric Relative Permittivity (ε_r)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={capEr}
                  onChange={(e) => setCapEr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 1 (Vacuum/Air)"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'Air / Vacuum (1.0)', er: 1.0 },
                    { label: 'Paper (3.7)', er: 3.7 },
                    { label: 'Pyrex Glass (5.6)', er: 5.6 },
                    { label: 'Mica (6.0)', er: 6.0 },
                    { label: 'Silicon (11.7)', er: 11.7 },
                    { label: 'Water (80.0)', er: 80.0 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCapEr(p.er)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={capResult} />}
        />
      );

    case 'specific-heat-calculator':
      return (
        <CompactCalculatorWorkspace
          id="specific-heat-calc"
          inputsTitle="Mass, Heat Capacity & Temperature Change"
          resultsTitle="Thermal Energy Absorbed / Released (Q = mcΔT)"
          onReset={() => {
            setShMass(2);
            setShMassUnit('kg');
            setShC(4184);
            setShDt(25);
            setShEnergyUnit('J');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Sample Mass (m)"
                value={shMass}
                onChange={setShMass}
                selectedUnit={shMassUnit}
                onUnitChange={setShMassUnit}
                units={MASS_UNITS.slice(0, 6)}
                placeholder="e.g. 2"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Specific Heat Capacity c in J/(kg·K)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={shC}
                  onChange={(e) => setShC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 4184 (Water)"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'Water (4,184)', c: 4184 },
                    { label: 'Ice (2,090)', c: 2090 },
                    { label: 'Steam (2,010)', c: 2010 },
                    { label: 'Aluminum (900)', c: 900 },
                    { label: 'Iron/Steel (449)', c: 449 },
                    { label: 'Copper (385)', c: 385 },
                    { label: 'Gold (129)', c: 129 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setShC(p.c)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <UnitNumberInput
                label="Temperature Change (ΔT in °C / K)"
                value={shDt}
                onChange={setShDt}
                selectedUnit="°C"
                onUnitChange={() => {}}
                units={[{ id: '°C', label: '°C or Kelvin' }]}
                placeholder="e.g. 25"
              />
              <UnitNumberInput
                label="Energy Output Unit"
                value={typeof shResult?.primaryValue === 'number' ? shResult.primaryValue : ''}
                onChange={() => {}}
                selectedUnit={shEnergyUnit}
                onUnitChange={setShEnergyUnit}
                units={ENERGY_UNITS}
                disabled={true}
              />
            </div>
          }
          results={<PhysicsResultDisplay result={shResult} />}
        />
      );

    case 'thermal-expansion-calculator':
      return (
        <CompactCalculatorWorkspace
          id="thermal-expansion-calc"
          inputsTitle="Initial Dimension & Temperature Difference"
          resultsTitle="Thermal Expansion (ΔL = α·L₀·ΔT)"
          onReset={() => {
            setTeType('linear');
            setTeL0(10);
            setTeL0Unit('m');
            setTeAlpha(12e-6);
            setTeDt(50);
          }}
          inputs={
            <div className="space-y-4">
              <div className="flex rounded-lg bg-slate-100 p-1">
                {(['linear', 'area', 'volumetric'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTeType(t)}
                    className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition ${
                      teType === t ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t} (Δ{t === 'linear' ? 'L' : t === 'area' ? 'A' : 'V'})
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label={`Initial ${teType === 'linear' ? 'Length (L₀)' : teType === 'area' ? 'Area (A₀)' : 'Volume (V₀)'}`}
                value={teL0}
                onChange={setTeL0}
                selectedUnit={teL0Unit}
                onUnitChange={setTeL0Unit}
                units={teType === 'linear' ? LENGTH_UNITS.slice(0, 9) : teType === 'area' ? AREA_UNITS : [{ id: 'm³', label: 'm³' }, { id: 'L', label: 'Liters' }]}
                placeholder="e.g. 10"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Expansion Coefficient α in 1/K
                </label>
                <input
                  type="number"
                  step="1e-6"
                  value={teAlpha}
                  onChange={(e) => setTeAlpha(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 0.000012"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'Structural Steel (12e-6)', a: 12e-6 },
                    { label: 'Aluminum (23e-6)', a: 23e-6 },
                    { label: 'Copper (17e-6)', a: 17e-6 },
                    { label: 'Concrete (12e-6)', a: 12e-6 },
                    { label: 'Pyrex Glass (3.3e-6)', a: 3.3e-6 },
                    { label: 'Invar (1.2e-6)', a: 1.2e-6 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setTeAlpha(p.a)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <UnitNumberInput
                label="Temperature Difference (ΔT in °C or K)"
                value={teDt}
                onChange={setTeDt}
                selectedUnit="°C"
                onUnitChange={() => {}}
                units={[{ id: '°C', label: '°C or Kelvin' }]}
                placeholder="e.g. 50"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={teResult} />}
        />
      );

    case 'heat-transfer-calculator':
    case 'heat-energy-calculator':
      return (
        <CompactCalculatorWorkspace
          id="heat-transfer-calc"
          inputsTitle="Thermal Conduction Parameters"
          resultsTitle="Fourier Conductive Heat Flux (Q/t = kAΔT/d)"
          onReset={() => {
            setHcK(0.8);
            setHcArea(5);
            setHcDt(20);
            setHcDx(0.1);
          }}
          inputs={
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Thermal Conductivity k in W/(m·K)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={hcK}
                  onChange={(e) => setHcK(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 0.8"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'Copper (401)', k: 401 },
                    { label: 'Aluminum (237)', k: 237 },
                    { label: 'Steel (50)', k: 50 },
                    { label: 'Concrete (1.4)', k: 1.4 },
                    { label: 'Glass (0.8)', k: 0.8 },
                    { label: 'Brick (0.7)', k: 0.7 },
                    { label: 'Fiberglass Insulation (0.04)', k: 0.04 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setHcK(p.k)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <UnitNumberInput
                label="Cross-Sectional Area (A)"
                value={hcArea}
                onChange={setHcArea}
                selectedUnit="m²"
                onUnitChange={() => {}}
                units={AREA_UNITS}
                placeholder="e.g. 5"
              />
              <UnitNumberInput
                label="Temperature Difference (ΔT in °C or K)"
                value={hcDt}
                onChange={setHcDt}
                selectedUnit="°C"
                onUnitChange={() => {}}
                units={[{ id: '°C', label: '°C or Kelvin' }]}
                placeholder="e.g. 20"
              />
              <UnitNumberInput
                label="Wall Thickness (d)"
                value={hcDx}
                onChange={setHcDx}
                selectedUnit="m"
                onUnitChange={() => {}}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 0.1"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={hcResult} />}
        />
      );

    case 'ideal-gas-law-calculator':
      return (
        <CompactCalculatorWorkspace
          id="ideal-gas-calc"
          inputsTitle="Gas State Variables (PV = nRT)"
          resultsTitle="Ideal Gas Law Solver"
          onReset={() => {
            setIgTarget('P');
            setIgP('');
            setIgPUnit('atm');
            setIgV(22.414);
            setIgVUnit('L');
            setIgN(1);
            setIgT(273.15);
            setIgTUnit('K');
          }}
          inputs={
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Solve For Variable
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['P', 'V', 'n', 'T'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setIgTarget(v)}
                      className={`py-1.5 text-xs font-bold rounded-md transition ${
                        igTarget === v ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {v === 'P' ? 'Pressure (P)' : v === 'V' ? 'Volume (V)' : v === 'n' ? 'Moles (n)' : 'Temp (T)'}
                    </button>
                  ))}
                </div>
              </div>

              {igTarget !== 'P' && (
                <UnitNumberInput
                  label="Pressure (P)"
                  value={igP}
                  onChange={setIgP}
                  selectedUnit={igPUnit}
                  onUnitChange={setIgPUnit}
                  units={PRESSURE_UNITS}
                  placeholder="e.g. 1"
                />
              )}
              {igTarget !== 'V' && (
                <UnitNumberInput
                  label="Volume (V)"
                  value={igV}
                  onChange={setIgV}
                  selectedUnit={igVUnit}
                  onUnitChange={setIgVUnit}
                  units={[{ id: 'L', label: 'Liters (L)' }, { id: 'm3', label: 'Cubic Meters (m³)' }, { id: 'mL', label: 'Milliliters (mL)' }]}
                  placeholder="e.g. 22.414"
                />
              )}
              {igTarget !== 'n' && (
                <UnitNumberInput
                  label="Amount of Gas (n in moles)"
                  value={igN}
                  onChange={setIgN}
                  selectedUnit="mol"
                  onUnitChange={() => {}}
                  units={[{ id: 'mol', label: 'Moles (mol)' }]}
                  placeholder="e.g. 1"
                />
              )}
              {igTarget !== 'T' && (
                <UnitNumberInput
                  label="Temperature (T)"
                  value={igT}
                  onChange={setIgT}
                  selectedUnit={igTUnit}
                  onUnitChange={setIgTUnit}
                  units={[{ id: 'K', label: 'Kelvin (K)' }, { id: '°C', label: 'Celsius (°C)' }, { id: '°F', label: 'Fahrenheit (°F)' }]}
                  placeholder="e.g. 273.15"
                />
              )}
            </div>
          }
          results={<PhysicsResultDisplay result={igResult} />}
        />
      );

    case 'snells-law-calculator':
      return (
        <CompactCalculatorWorkspace
          id="snells-law-calc"
          inputsTitle="Refractive Indices & Incident Angle"
          resultsTitle="Refraction & Critical Angle (n₁ sinθ₁ = n₂ sinθ₂)"
          onReset={() => {
            setSnellN1(1.0003);
            setSnellTheta1(30);
            setSnellN2(1.52);
          }}
          inputs={
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Medium 1 Refractive Index (n₁)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="1"
                  value={snellN1}
                  onChange={(e) => setSnellN1(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 1.0 (Air)"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {[
                    { label: 'Air (1.00)', n: 1.0003 },
                    { label: 'Water (1.333)', n: 1.333 },
                    { label: 'Crown Glass (1.52)', n: 1.52 },
                    { label: 'Diamond (2.417)', n: 2.417 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setSnellN1(p.n)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <UnitNumberInput
                label="Angle of Incidence (θ₁ in degrees)"
                value={snellTheta1}
                onChange={setSnellTheta1}
                selectedUnit="°"
                onUnitChange={() => {}}
                units={[{ id: '°', label: 'Degrees (°)' }]}
                placeholder="e.g. 30"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Medium 2 Refractive Index (n₂)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="1"
                  value={snellN2}
                  onChange={(e) => setSnellN2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="e.g. 1.52 (Glass)"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {[
                    { label: 'Air (1.00)', n: 1.0003 },
                    { label: 'Water (1.333)', n: 1.333 },
                    { label: 'Crown Glass (1.52)', n: 1.52 },
                    { label: 'Diamond (2.417)', n: 2.417 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setSnellN2(p.n)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={snellResult} />}
        />
      );

    case 'thin-lens-calculator':
    case 'lens-calculator':
      return (
        <CompactCalculatorWorkspace
          id="thin-lens-calc"
          inputsTitle="Focal Length & Object Distance"
          resultsTitle="Thin Lens Image Formation (1/f = 1/d_o + 1/d_i)"
          onReset={() => {
            setLensF(10);
            setLensDo(25);
            setLensUnit('cm');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Focal Length (f: + for convex, - for concave)"
                value={lensF}
                onChange={setLensF}
                selectedUnit={lensUnit}
                onUnitChange={setLensUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 10"
              />
              <UnitNumberInput
                label="Object Distance (d_o)"
                value={lensDo}
                onChange={setLensDo}
                selectedUnit={lensUnit}
                onUnitChange={setLensUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 25"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Convex Magnifier (f = +10 cm, do = 6 cm)', f: 10, do: 6 },
                  { label: 'Real Inverted Image (f = +10 cm, do = 25 cm)', f: 10, do: 25 },
                  { label: 'Concave Lens (f = -15 cm, do = 30 cm)', f: -15, do: 30 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setLensF(p.f);
                      setLensDo(p.do);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={lensResult} />}
        />
      );

    case 'doppler-effect-calculator':
      return (
        <CompactCalculatorWorkspace
          id="doppler-effect-calc"
          inputsTitle="Wave Frequencies & Source/Observer Speeds"
          resultsTitle="Doppler Shift Frequency Analysis"
          onReset={() => {
            setDopF0(1000);
            setDopV(343);
            setDopVo(0);
            setDopVs(30);
            setDopSrcDir('towards');
            setDopObsDir('stationary');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Source Emitted Frequency (f₀)"
                value={dopF0}
                onChange={setDopF0}
                selectedUnit="Hz"
                onUnitChange={() => {}}
                units={FREQUENCY_UNITS}
                placeholder="e.g. 1000"
              />
              <UnitNumberInput
                label="Speed of Sound / Wave in Medium (v)"
                value={dopV}
                onChange={setDopV}
                selectedUnit="m/s"
                onUnitChange={() => {}}
                units={VELOCITY_UNITS}
                placeholder="343"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <UnitNumberInput
                    label="Source Velocity (v_s)"
                    value={dopVs}
                    onChange={setDopVs}
                    selectedUnit="m/s"
                    onUnitChange={() => {}}
                    units={VELOCITY_UNITS}
                    placeholder="e.g. 30"
                  />
                  <select
                    value={dopSrcDir}
                    onChange={(e) => setDopSrcDir(e.target.value as any)}
                    className="w-full mt-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="towards">Source Moving Towards Observer</option>
                    <option value="away">Source Moving Away from Observer</option>
                    <option value="stationary">Source Stationary (0 m/s)</option>
                  </select>
                </div>
                <div>
                  <UnitNumberInput
                    label="Observer Velocity (v_o)"
                    value={dopVo}
                    onChange={setDopVo}
                    selectedUnit="m/s"
                    onUnitChange={() => {}}
                    units={VELOCITY_UNITS}
                    placeholder="e.g. 0"
                  />
                  <select
                    value={dopObsDir}
                    onChange={(e) => setDopObsDir(e.target.value as any)}
                    className="w-full mt-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="stationary">Observer Stationary (0 m/s)</option>
                    <option value="towards">Observer Moving Towards Source</option>
                    <option value="away">Observer Moving Away from Source</option>
                  </select>
                </div>
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={dopResult} />}
        />
      );

    case 'photon-energy-calculator':
      return (
        <CompactCalculatorWorkspace
          id="photon-energy-calc"
          inputsTitle="Wavelength or Frequency of Light"
          resultsTitle="Photon Energy (E = hf = hc/λ)"
          onReset={() => {
            setPhotMode('wavelength');
            setPhotVal(532);
            setPhotUnit('nm');
          }}
          inputs={
            <div className="space-y-4">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setPhotMode('wavelength');
                    setPhotVal(532);
                    setPhotUnit('nm');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    photMode === 'wavelength' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  From Wavelength (λ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotMode('frequency');
                    setPhotVal(563);
                    setPhotUnit('THz');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    photMode === 'frequency' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  From Frequency (f)
                </button>
              </div>

              <UnitNumberInput
                label={photMode === 'wavelength' ? 'Wavelength (λ)' : 'Frequency (f)'}
                value={photVal}
                onChange={setPhotVal}
                selectedUnit={photUnit}
                onUnitChange={setPhotUnit}
                units={photMode === 'wavelength' ? LENGTH_UNITS.slice(0, 9) : FREQUENCY_UNITS}
                placeholder={photMode === 'wavelength' ? '532' : '563'}
              />

              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Red Laser (650 nm)', v: 650, u: 'nm' },
                  { label: 'Green Laser (532 nm)', v: 532, u: 'nm' },
                  { label: 'Blue Laser (405 nm)', v: 405, u: 'nm' },
                  { label: 'UV-C Germicidal (254 nm)', v: 254, u: 'nm' },
                  { label: 'Medical X-Ray (0.05 nm)', v: 0.05, u: 'nm' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setPhotMode('wavelength');
                      setPhotVal(p.v);
                      setPhotUnit(p.u);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={photResult} />}
        />
      );

    case 'de-broglie-wavelength-calculator':
      return (
        <CompactCalculatorWorkspace
          id="de-broglie-calc"
          inputsTitle="Particle Mass & Velocity"
          resultsTitle="Quantum De Broglie Wavelength (λ = h / mv)"
          onReset={() => {
            setDbMass(9.1093837e-31);
            setDbMassUnit('kg');
            setDbVel(1e6);
            setDbVelUnit('m/s');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Particle Rest Mass (m)"
                value={dbMass}
                onChange={setDbMass}
                selectedUnit={dbMassUnit}
                onUnitChange={setDbMassUnit}
                units={MASS_UNITS}
                placeholder="e.g. 9.109e-31"
              />
              <UnitNumberInput
                label="Particle Velocity (v)"
                value={dbVel}
                onChange={setDbVel}
                selectedUnit={dbVelUnit}
                onUnitChange={setDbVelUnit}
                units={VELOCITY_UNITS}
                placeholder="e.g. 1000000"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Electron @ 1,000 km/s (0.727 nm)', m: 9.109e-31, v: 1e6 },
                  { label: 'Proton @ 100 km/s (3.96 pm)', m: 1.673e-27, v: 1e5 },
                  { label: 'Thermal Neutron (0.18 nm)', m: 1.675e-27, v: 2200 },
                  { label: 'Baseball (145g @ 40 m/s)', m: 0.145, v: 40 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setDbMass(p.m);
                      setDbMassUnit('kg');
                      setDbVel(p.v);
                      setDbVelUnit('m/s');
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={dbResult} />}
        />
      );

    case 'half-life-calculator':
      return (
        <CompactCalculatorWorkspace
          id="half-life-calc"
          inputsTitle="Initial Quantity, Half-Life & Time Elapsed"
          resultsTitle="Radioactive Exponential Decay (N(t) = N₀(½)^(t/t½))"
          onReset={() => {
            setHlN0(100);
            setHlT12(5730);
            setHlT12Unit('years');
            setHlT(11460);
            setHlTUnit('years');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Initial Quantity (N₀)"
                value={hlN0}
                onChange={setHlN0}
                selectedUnit="units"
                onUnitChange={() => {}}
                units={[{ id: 'units', label: 'Units / Grams / %' }]}
                placeholder="e.g. 100"
              />
              <UnitNumberInput
                label="Half-Life Period (t½)"
                value={hlT12}
                onChange={setHlT12}
                selectedUnit={hlT12Unit}
                onUnitChange={setHlT12Unit}
                units={TIME_UNITS}
                placeholder="e.g. 5730"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Carbon-14 (5,730 yrs)', t: 5730, u: 'years' },
                  { label: 'Iodine-131 (8.02 days)', t: 8.02, u: 'days' },
                  { label: 'Technetium-99m (6.01 h)', t: 6.01, u: 'h' },
                  { label: 'Cobalt-60 (5.27 yrs)', t: 5.27, u: 'years' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setHlT12(p.t);
                      setHlT12Unit(p.u);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Elapsed Time (t)"
                value={hlT}
                onChange={setHlT}
                selectedUnit={hlTUnit}
                onUnitChange={setHlTUnit}
                units={TIME_UNITS}
                placeholder="e.g. 11460"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={hlResult} />}
        />
      );

    case 'bernoulli-equation-calculator':
      return (
        <CompactCalculatorWorkspace
          id="bernoulli-calc"
          inputsTitle="Fluid Velocity, Pressure & Density"
          resultsTitle="Bernoulli Dynamic Pressure Analysis"
          onReset={() => {
            setBernP1(200000);
            setBernV1(2);
            setBernV2(8);
            setBernRho(1000);
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Initial Static Pressure (P₁ in Pa)"
                value={bernP1}
                onChange={setBernP1}
                selectedUnit="Pa"
                onUnitChange={() => {}}
                units={PRESSURE_UNITS}
                placeholder="e.g. 200000"
              />
              <UnitNumberInput
                label="Initial Flow Velocity (v₁)"
                value={bernV1}
                onChange={setBernV1}
                selectedUnit="m/s"
                onUnitChange={() => {}}
                units={VELOCITY_UNITS}
                placeholder="e.g. 2"
              />
              <UnitNumberInput
                label="Constriction / Final Velocity (v₂)"
                value={bernV2}
                onChange={setBernV2}
                selectedUnit="m/s"
                onUnitChange={() => {}}
                units={VELOCITY_UNITS}
                placeholder="e.g. 8"
              />
              <UnitNumberInput
                label="Fluid Density (ρ)"
                value={bernRho}
                onChange={setBernRho}
                selectedUnit="kg/m³"
                onUnitChange={() => {}}
                units={DENSITY_UNITS}
                placeholder="1000"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Water (1,000 kg/m³)', rho: 1000 },
                  { label: 'Air @ Sea Level (1.225 kg/m³)', rho: 1.225 },
                  { label: 'Oil (850 kg/m³)', rho: 850 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBernRho(p.rho)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          }
          results={<PhysicsResultDisplay result={bernResult} />}
        />
      );

    case 'buoyant-force-calculator':
      return (
        <CompactCalculatorWorkspace
          id="buoyant-force-calc"
          inputsTitle="Fluid Density & Submerged Volume"
          resultsTitle="Archimedes Buoyant Force (F_b = ρ·g·V)"
          onReset={() => {
            setBuoyRho(1000);
            setBuoyRhoUnit('kg/m³');
            setBuoyV(0.05);
            setBuoyVUnit('m³');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Fluid Mass Density (ρ)"
                value={buoyRho}
                onChange={setBuoyRho}
                selectedUnit={buoyRhoUnit}
                onUnitChange={setBuoyRhoUnit}
                units={DENSITY_UNITS}
                placeholder="e.g. 1000"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Fresh Water (1,000 kg/m³)', rho: 1000 },
                  { label: 'Sea Water (1,025 kg/m³)', rho: 1025 },
                  { label: 'Dead Sea (1,240 kg/m³)', rho: 1240 },
                  { label: 'Air (1.225 kg/m³)', rho: 1.225 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBuoyRho(p.rho)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <UnitNumberInput
                label="Submerged Object Volume (V)"
                value={buoyV}
                onChange={setBuoyV}
                selectedUnit={buoyVUnit}
                onUnitChange={setBuoyVUnit}
                units={[{ id: 'm³', label: 'Cubic Meters (m³)' }, { id: 'L', label: 'Liters (L)' }, { id: 'cm³', label: 'Cubic cm (cm³)' }]}
                placeholder="e.g. 0.05"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={buoyResult} />}
        />
      );

    case 'stress-strain-calculator':
      return (
        <CompactCalculatorWorkspace
          id="stress-strain-calc"
          inputsTitle="Applied Load, Cross-Section & Elongation"
          resultsTitle="Tensile Stress, Strain & Young's Modulus"
          onReset={() => {
            setSsF(50000);
            setSsFUnit('N');
            setSsA(100);
            setSsAUnit('mm²');
            setSsL0(2);
            setSsL0Unit('m');
            setSsDl(5);
            setSsDlUnit('mm');
          }}
          inputs={
            <div className="space-y-4">
              <UnitNumberInput
                label="Applied Tensile Force (F)"
                value={ssF}
                onChange={setSsF}
                selectedUnit={ssFUnit}
                onUnitChange={setSsFUnit}
                units={FORCE_UNITS}
                placeholder="e.g. 50000"
              />
              <UnitNumberInput
                label="Cross-Sectional Area (A)"
                value={ssA}
                onChange={setSsA}
                selectedUnit={ssAUnit}
                onUnitChange={setSsAUnit}
                units={AREA_UNITS}
                placeholder="e.g. 100"
              />
              <UnitNumberInput
                label="Initial Rod / Cable Length (L₀)"
                value={ssL0}
                onChange={setSsL0}
                selectedUnit={ssL0Unit}
                onUnitChange={setSsL0Unit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 2"
              />
              <UnitNumberInput
                label="Elongation / Stretch (ΔL)"
                value={ssDl}
                onChange={setSsDl}
                selectedUnit={ssDlUnit}
                onUnitChange={setSsDlUnit}
                units={LENGTH_UNITS.slice(0, 9)}
                placeholder="e.g. 5"
              />
            </div>
          }
          results={<PhysicsResultDisplay result={ssResult} />}
        />
      );

    default:
      return null;
  }
};
