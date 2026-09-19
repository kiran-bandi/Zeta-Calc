/**
 * Phase 7: Physics Phase 2 Calculation Engines (28 Tools)
 * Pure TypeScript, deterministic, physical constants grounded in NIST/CODATA standards.
 */
import { convertUnitValue } from './unitEngine';
import { PhysicsCalculationResult } from './physicsEngine';

// Universal Physical Constants
const G_CONSTANT = 6.6743e-11; // N·m²/kg²
const K_COULOMB = 8.9875517923e9; // N·m²/C²
const EPSILON_0 = 8.8541878128e-12; // F/m
const SPEED_OF_LIGHT = 299792458; // m/s
const GAS_CONSTANT_R = 8.314462618; // J/(mol·K)
const GRAVITY_EARTH = 9.80665; // m/s²

// ==========================================
// MECHANICS & DYNAMICS (9 tools)
// ==========================================

// 28. Friction Calculator
export function calculateFriction(
  normalForce: number | '',
  mu: number | '',
  appliedForce: number | '' = '',
  normalUnit = 'N',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (typeof normalForce !== 'number' || typeof mu !== 'number' || isNaN(normalForce) || isNaN(mu) || normalForce < 0 || mu < 0) {
    return null;
  }

  const nSI = convertUnitValue(normalForce, normalUnit, 'N');
  const maxFrictionSI = mu * nSI;
  const maxFrictionOut = convertUnitValue(maxFrictionSI, 'N', forceUnit);

  let motionStatus = 'No applied force specified (calculating maximum static/kinetic holding friction force).';
  const secondary: { label: string; value: string }[] = [
    { label: 'Normal Reaction (N)', value: `${nSI.toFixed(3)} N` },
    { label: 'Coefficient of Friction (μ)', value: `${mu.toFixed(4)}` },
    { label: 'Max Friction Force (f_max)', value: `${maxFrictionSI.toFixed(3)} N` },
  ];

  if (typeof appliedForce === 'number' && !isNaN(appliedForce) && appliedForce >= 0) {
    const fAppliedSI = convertUnitValue(appliedForce, forceUnit, 'N');
    if (fAppliedSI > maxFrictionSI) {
      const netForceSI = fAppliedSI - maxFrictionSI;
      motionStatus = `Applied force (${fAppliedSI.toFixed(2)} N) > max friction (${maxFrictionSI.toFixed(2)} N). Object ACCELERATES with net force ${netForceSI.toFixed(2)} N.`;
      secondary.push({ label: 'Net Accelerating Force', value: `${netForceSI.toFixed(3)} N` });
    } else {
      motionStatus = `Applied force (${fAppliedSI.toFixed(2)} N) ≤ max static friction (${maxFrictionSI.toFixed(2)} N). Object REMAINS AT REST (static friction balances applied force = ${fAppliedSI.toFixed(2)} N).`;
      secondary.push({ label: 'Actual Static Friction Opposing Force', value: `${fAppliedSI.toFixed(3)} N` });
    }
  }

  return {
    primaryValue: Math.round(maxFrictionOut * 1e4) / 1e4,
    primaryUnit: forceUnit,
    formattedResult: `${maxFrictionOut.toFixed(3)} ${forceUnit}`,
    formulaUsed: 'f = \\mu \\times N',
    substitutionSteps: [
      `Normal force N = ${normalForce} ${normalUnit} (${nSI.toFixed(3)} N)`,
      `Coefficient μ = ${mu}`,
      `Max friction force f = ${mu} × ${nSI.toFixed(3)} N = ${maxFrictionSI.toFixed(3)} N`,
      motionStatus,
    ],
    assumptions: ['Assumes dry Coulomb friction approximation.', 'Applies to both static limit (μ_s) and kinetic sliding (μ_k).'],
    secondaryValues: secondary,
  };
}

// 29. Rotational Motion Calculator
export function calculateRotationalMotion(
  mode: 'final_omega' | 'angle' | 'acceleration',
  omega0: number | '',
  omega: number | '',
  alpha: number | '',
  t: number | '',
  theta0: number | '' = 0,
  omegaUnit = 'rad/s',
  alphaUnit = 'rad/s2',
  timeUnit = 's',
  angleUnit = 'rad'
): PhysicsCalculationResult | null {
  const w0SI = typeof omega0 === 'number' && !isNaN(omega0) ? convertUnitValue(omega0, omegaUnit, 'rad/s') : 0;
  const tSI = typeof t === 'number' && !isNaN(t) && t > 0 ? convertUnitValue(t, timeUnit, 's') : 0;
  const th0SI = typeof theta0 === 'number' && !isNaN(theta0) ? convertUnitValue(theta0, angleUnit, 'rad') : 0;

  if (mode === 'final_omega') {
    if (typeof alpha !== 'number' || typeof t !== 'number' || isNaN(alpha) || isNaN(t) || t <= 0) return null;
    const aSI = convertUnitValue(alpha, alphaUnit, 'rad/s2');
    const finalOmegaSI = w0SI + aSI * tSI;
    const finalOmegaOut = convertUnitValue(finalOmegaSI, 'rad/s', omegaUnit);
    const deltaThetaSI = w0SI * tSI + 0.5 * aSI * tSI * tSI;

    return {
      primaryValue: Math.round(finalOmegaOut * 1e4) / 1e4,
      primaryUnit: omegaUnit,
      formattedResult: `${finalOmegaOut.toFixed(3)} ${omegaUnit}`,
      formulaUsed: '\\omega = \\omega_0 + \\alpha t',
      substitutionSteps: [
        `Initial angular velocity ω₀ = ${w0SI.toFixed(3)} rad/s`,
        `Angular acceleration α = ${aSI.toFixed(3)} rad/s²`,
        `Time t = ${tSI.toFixed(3)} s`,
        `Final angular velocity ω = ${w0SI.toFixed(3)} + (${aSI.toFixed(3)} × ${tSI.toFixed(3)}) = ${finalOmegaSI.toFixed(3)} rad/s`,
      ],
      assumptions: ['Assumes constant angular acceleration α around a fixed axis of rotation.'],
      secondaryValues: [
        { label: 'Angular Displacement (Δθ)', value: `${deltaThetaSI.toFixed(3)} rad (${((deltaThetaSI * 180) / Math.PI).toFixed(2)}°)` },
        { label: 'Revolutions Completed', value: `${(deltaThetaSI / (2 * Math.PI)).toFixed(2)} rev` },
        { label: 'Final Speed in RPM', value: `${((finalOmegaSI * 60) / (2 * Math.PI)).toFixed(2)} RPM` },
      ],
    };
  } else if (mode === 'angle') {
    if (typeof alpha !== 'number' || typeof t !== 'number' || isNaN(alpha) || isNaN(t) || t <= 0) return null;
    const aSI = convertUnitValue(alpha, alphaUnit, 'rad/s2');
    const deltaThetaSI = w0SI * tSI + 0.5 * aSI * tSI * tSI;
    const totalThetaSI = th0SI + deltaThetaSI;
    const thetaOut = convertUnitValue(totalThetaSI, 'rad', angleUnit);

    return {
      primaryValue: Math.round(thetaOut * 1e4) / 1e4,
      primaryUnit: angleUnit,
      formattedResult: `${thetaOut.toFixed(3)} ${angleUnit}`,
      formulaUsed: '\\theta = \\theta_0 + \\omega_0 t + \\frac{1}{2}\\alpha t^2',
      substitutionSteps: [
        `ω₀ = ${w0SI.toFixed(3)} rad/s, α = ${aSI.toFixed(3)} rad/s², t = ${tSI.toFixed(3)} s`,
        `Δθ = (${w0SI.toFixed(3)} × ${tSI.toFixed(3)}) + 0.5 × ${aSI.toFixed(3)} × (${tSI.toFixed(3)})² = ${deltaThetaSI.toFixed(3)} rad`,
      ],
      assumptions: ['Constant rotational acceleration model.'],
      secondaryValues: [
        { label: 'Angle in Degrees', value: `${((totalThetaSI * 180) / Math.PI).toFixed(2)}°` },
        { label: 'Revolutions', value: `${(totalThetaSI / (2 * Math.PI)).toFixed(2)} rev` },
      ],
    };
  } else {
    // acceleration mode: α = (ω - ω₀) / t
    if (typeof omega !== 'number' || typeof t !== 'number' || isNaN(omega) || isNaN(t) || t <= 0) return null;
    const wSI = convertUnitValue(omega, omegaUnit, 'rad/s');
    const aSI = (wSI - w0SI) / tSI;
    const aOut = convertUnitValue(aSI, 'rad/s2', alphaUnit);

    return {
      primaryValue: Math.round(aOut * 1e4) / 1e4,
      primaryUnit: alphaUnit,
      formattedResult: `${aOut.toFixed(3)} ${alphaUnit}`,
      formulaUsed: '\\alpha = \\frac{\\omega - \\omega_0}{t}',
      substitutionSteps: [
        `ω = ${wSI.toFixed(3)} rad/s, ω₀ = ${w0SI.toFixed(3)} rad/s, t = ${tSI.toFixed(3)} s`,
        `α = (${wSI.toFixed(3)} - ${w0SI.toFixed(3)}) / ${tSI.toFixed(3)} = ${aSI.toFixed(3)} rad/s²`,
      ],
      assumptions: ['Uniform angular acceleration.'],
      secondaryValues: [{ label: 'Acceleration in deg/s²', value: `${((aSI * 180) / Math.PI).toFixed(2)} deg/s²` }],
    };
  }
}

// 30. Spring / Hooke's Law Calculator
export function calculateHookesLaw(
  springConstantK: number | '',
  displacementX: number | '',
  kUnit = 'N/m',
  xUnit = 'm',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (
    typeof springConstantK !== 'number' ||
    typeof displacementX !== 'number' ||
    isNaN(springConstantK) ||
    isNaN(displacementX) ||
    springConstantK <= 0
  ) {
    return null;
  }

  const kSI = springConstantK; // N/m
  const xSI = convertUnitValue(displacementX, xUnit, 'm');

  const forceSI = kSI * Math.abs(xSI);
  const potentialEnergyJoules = 0.5 * kSI * xSI * xSI;
  const forceOut = convertUnitValue(forceSI, 'N', forceUnit);

  return {
    primaryValue: Math.round(forceOut * 1e4) / 1e4,
    primaryUnit: forceUnit,
    formattedResult: `${forceOut.toFixed(3)} ${forceUnit}`,
    formulaUsed: 'F = k \\times x, \\quad U = \\frac{1}{2} k x^2',
    substitutionSteps: [
      `Spring constant k = ${springConstantK} N/m`,
      `Displacement x = ${displacementX} ${xUnit} (${xSI.toFixed(4)} m)`,
      `Restoring force F = ${kSI} N/m × ${Math.abs(xSI).toFixed(4)} m = ${forceSI.toFixed(3)} N`,
      `Elastic potential energy U = 0.5 × ${kSI} × (${xSI.toFixed(4)})² = ${potentialEnergyJoules.toFixed(4)} Joules`,
    ],
    assumptions: ['Assumes elastic deformation within the proportional limit of the spring (Hookean regime).'],
    secondaryValues: [
      { label: 'Elastic Potential Energy (U)', value: `${potentialEnergyJoules.toFixed(4)} J` },
      { label: 'Displacement in cm', value: `${(xSI * 100).toFixed(2)} cm` },
      { label: 'Displacement in inches', value: `${(xSI * 39.3701).toFixed(2)} in` },
    ],
  };
}

// 31. Inclined Plane Calculator
export function calculateInclinedPlane(
  mass: number | '',
  angleDeg: number | '',
  muFriction: number | '' = 0,
  massUnit = 'kg'
): PhysicsCalculationResult | null {
  if (
    typeof mass !== 'number' ||
    typeof angleDeg !== 'number' ||
    isNaN(mass) ||
    isNaN(angleDeg) ||
    mass <= 0 ||
    angleDeg < 0 ||
    angleDeg > 90
  ) {
    return null;
  }

  const mSI = convertUnitValue(mass, massUnit, 'kg');
  const mu = typeof muFriction === 'number' && !isNaN(muFriction) && muFriction >= 0 ? muFriction : 0;
  const thetaRad = (angleDeg * Math.PI) / 180;

  const fParallel = mSI * GRAVITY_EARTH * Math.sin(thetaRad);
  const fNormal = mSI * GRAVITY_EARTH * Math.cos(thetaRad);
  const fFrictionMax = mu * fNormal;

  let netForce = fParallel - fFrictionMax;
  let acceleration = 0;
  let motionState = '';

  if (netForce > 0) {
    acceleration = netForce / mSI;
    motionState = `Object accelerates down the plane at ${acceleration.toFixed(3)} m/s².`;
  } else {
    netForce = 0;
    acceleration = 0;
    motionState = 'Static equilibrium (friction balances parallel force, object does not slide).';
  }

  return {
    primaryValue: Math.round(acceleration * 1e4) / 1e4,
    primaryUnit: 'm/s²',
    formattedResult: `${acceleration.toFixed(3)} m/s²`,
    formulaUsed: 'F_{\\parallel} = mg\\sin\\theta, \\quad N = mg\\cos\\theta, \\quad a = \\frac{F_{\\text{net}}}{m}',
    substitutionSteps: [
      `Mass m = ${mSI.toFixed(3)} kg, Incline angle θ = ${angleDeg}°, μ = ${mu}`,
      `Parallel gravitational force F_parallel = ${mSI.toFixed(2)} × 9.81 × sin(${angleDeg}°) = ${fParallel.toFixed(3)} N`,
      `Normal force N = ${mSI.toFixed(2)} × 9.81 × cos(${angleDeg}°) = ${fNormal.toFixed(3)} N`,
      `Max friction force = ${mu} × ${fNormal.toFixed(3)} N = ${fFrictionMax.toFixed(3)} N`,
      motionState,
    ],
    assumptions: ['Assumes standard Earth gravity g = 9.80665 m/s².', 'Assumes uniform incline angle with rigid planar contact.'],
    secondaryValues: [
      { label: 'Parallel Force (Down Ramp)', value: `${fParallel.toFixed(3)} N` },
      { label: 'Normal Reaction Force (N)', value: `${fNormal.toFixed(3)} N` },
      { label: 'Frictional Opposing Force', value: `${fFrictionMax.toFixed(3)} N` },
      { label: 'Net Unbalanced Force', value: `${netForce.toFixed(3)} N` },
    ],
  };
}

// 32. Pendulum Calculator
export function calculatePendulum(
  length: number | '',
  lengthUnit = 'm',
  gravity: number | '' = GRAVITY_EARTH
): PhysicsCalculationResult | null {
  if (typeof length !== 'number' || isNaN(length) || length <= 0) return null;

  const lSI = convertUnitValue(length, lengthUnit, 'm');
  const gSI = typeof gravity === 'number' && !isNaN(gravity) && gravity > 0 ? gravity : GRAVITY_EARTH;

  // T = 2π √(L/g)
  const periodT = 2 * Math.PI * Math.sqrt(lSI / gSI);
  const frequencyHz = 1 / periodT;
  const angularFreq = Math.sqrt(gSI / lSI);

  return {
    primaryValue: Math.round(periodT * 1e4) / 1e4,
    primaryUnit: 's',
    formattedResult: `${periodT.toFixed(3)} s`,
    formulaUsed: 'T = 2\\pi\\sqrt{\\frac{L}{g}}, \\quad f = \\frac{1}{T}',
    substitutionSteps: [
      `Pendulum length L = ${length} ${lengthUnit} (${lSI.toFixed(4)} m)`,
      `Gravitational acceleration g = ${gSI.toFixed(4)} m/s²`,
      `Period T = 2π × √(${lSI.toFixed(4)} / ${gSI.toFixed(4)}) = ${periodT.toFixed(3)} seconds`,
    ],
    assumptions: [
      'Applies small-angle harmonic approximation (sin θ ≈ θ for angles ≤ 15°).',
      'Assumes massless rod/string and point mass bob with negligible air drag.',
    ],
    secondaryValues: [
      { label: 'Oscillation Frequency (f)', value: `${frequencyHz.toFixed(4)} Hz` },
      { label: 'Angular Frequency (ω)', value: `${angularFreq.toFixed(4)} rad/s` },
      { label: 'Oscillations per Minute', value: `${(frequencyHz * 60).toFixed(1)} cpm` },
    ],
  };
}

// 33. Gravitational Force Calculator
export function calculateGravitationalForce(
  mass1: number | '',
  mass2: number | '',
  distance: number | '',
  m1Unit = 'kg',
  m2Unit = 'kg',
  distUnit = 'm',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (
    typeof mass1 !== 'number' ||
    typeof mass2 !== 'number' ||
    typeof distance !== 'number' ||
    isNaN(mass1) ||
    isNaN(mass2) ||
    isNaN(distance) ||
    mass1 <= 0 ||
    mass2 <= 0 ||
    distance <= 0
  ) {
    return null;
  }

  const m1SI = convertUnitValue(mass1, m1Unit, 'kg');
  const m2SI = convertUnitValue(mass2, m2Unit, 'kg');
  const rSI = convertUnitValue(distance, distUnit, 'm');

  const fSI = (G_CONSTANT * m1SI * m2SI) / (rSI * rSI);
  const fOut = convertUnitValue(fSI, 'N', forceUnit);

  return {
    primaryValue: fOut,
    primaryUnit: forceUnit,
    formattedResult: `${fOut < 1e-4 ? fOut.toExponential(4) : fOut.toFixed(4)} ${forceUnit}`,
    formulaUsed: 'F = G \\frac{m_1 m_2}{r^2}',
    substitutionSteps: [
      `Mass 1 = ${m1SI.toExponential(4)} kg, Mass 2 = ${m2SI.toExponential(4)} kg`,
      `Distance r = ${rSI.toExponential(4)} m`,
      `G = 6.67430 × 10⁻¹¹ N·m²/kg²`,
      `Force F = (6.6743e-11 × ${m1SI.toExponential(2)} × ${m2SI.toExponential(2)}) / (${rSI.toExponential(2)})² = ${fSI.toExponential(4)} N`,
    ],
    assumptions: ['Point mass approximation or spherical mass distributions with radial symmetry (Shell Theorem).'],
    secondaryValues: [
      { label: 'Gravitational Constant G', value: '6.67430 × 10⁻¹¹ N·m²/kg²' },
      { label: 'Separation in km', value: `${(rSI / 1000).toLocaleString()} km` },
    ],
  };
}

// 34. Escape Velocity Calculator
export function calculateEscapeVelocity(
  bodyMass: number | '',
  bodyRadius: number | '',
  massUnit = 'kg',
  radiusUnit = 'km',
  velocityUnit = 'km/s'
): PhysicsCalculationResult | null {
  if (
    typeof bodyMass !== 'number' ||
    typeof bodyRadius !== 'number' ||
    isNaN(bodyMass) ||
    isNaN(bodyRadius) ||
    bodyMass <= 0 ||
    bodyRadius <= 0
  ) {
    return null;
  }

  const mSI = convertUnitValue(bodyMass, massUnit, 'kg');
  const rSI = convertUnitValue(bodyRadius, radiusUnit, 'm');

  // v_esc = √(2GM / R)
  const vEscMps = Math.sqrt((2 * G_CONSTANT * mSI) / rSI);
  const vEscOut = convertUnitValue(vEscMps, 'm/s', velocityUnit);

  return {
    primaryValue: Math.round(vEscOut * 1e4) / 1e4,
    primaryUnit: velocityUnit,
    formattedResult: `${vEscOut.toFixed(3)} ${velocityUnit}`,
    formulaUsed: 'v_{\\text{escape}} = \\sqrt{\\frac{2GM}{R}}',
    substitutionSteps: [
      `Mass M = ${mSI.toExponential(4)} kg`,
      `Radius R = ${rSI.toExponential(4)} m (${bodyRadius} ${radiusUnit})`,
      `v_esc = √(2 × 6.6743e-11 × ${mSI.toExponential(2)} / ${rSI.toExponential(2)}) = ${vEscMps.toFixed(2)} m/s`,
    ],
    assumptions: [
      'Ideal ballistic trajectory ignoring atmospheric drag and planet rotational velocity.',
      'Spherically symmetric celestial body.',
    ],
    secondaryValues: [
      { label: 'Velocity in m/s', value: `${vEscMps.toFixed(2)} m/s` },
      { label: 'Velocity in km/h', value: `${(vEscMps * 3.6).toFixed(1)} km/h` },
      { label: 'Velocity in mph', value: `${(vEscMps * 2.23694).toFixed(1)} mph` },
    ],
  };
}

// 35. Angular Velocity Calculator
export function calculateAngularVelocity(
  mode: 'theta_time' | 'freq' | 'rpm',
  theta: number | '',
  t: number | '',
  frequency: number | '',
  rpmVal: number | '',
  angleUnit = 'rad',
  timeUnit = 's',
  outUnit = 'rad/s'
): PhysicsCalculationResult | null {
  let omegaRadSec = 0;
  let formula = '';
  const steps: string[] = [];

  if (mode === 'theta_time') {
    if (typeof theta !== 'number' || typeof t !== 'number' || isNaN(theta) || isNaN(t) || t <= 0) return null;
    const thRad = convertUnitValue(theta, angleUnit, 'rad');
    const tSec = convertUnitValue(t, timeUnit, 's');
    omegaRadSec = thRad / tSec;
    formula = '\\omega = \\frac{\\theta}{t}';
    steps.push(`Angle θ = ${theta} ${angleUnit} (${thRad.toFixed(4)} rad)`);
    steps.push(`Time t = ${t} ${timeUnit} (${tSec.toFixed(4)} s)`);
    steps.push(`ω = ${thRad.toFixed(4)} rad / ${tSec.toFixed(4)} s = ${omegaRadSec.toFixed(4)} rad/s`);
  } else if (mode === 'freq') {
    if (typeof frequency !== 'number' || isNaN(frequency) || frequency <= 0) return null;
    omegaRadSec = 2 * Math.PI * frequency;
    formula = '\\omega = 2\\pi f';
    steps.push(`Frequency f = ${frequency} Hz`);
    steps.push(`ω = 2π × ${frequency} = ${omegaRadSec.toFixed(4)} rad/s`);
  } else {
    if (typeof rpmVal !== 'number' || isNaN(rpmVal) || rpmVal < 0) return null;
    omegaRadSec = (rpmVal * 2 * Math.PI) / 60;
    formula = '\\omega = \\frac{2\\pi \\times \\text{RPM}}{60}';
    steps.push(`Rotations per minute = ${rpmVal} RPM`);
    steps.push(`ω = (2π × ${rpmVal}) / 60 = ${omegaRadSec.toFixed(4)} rad/s`);
  }

  const outVal = convertUnitValue(omegaRadSec, 'rad/s', outUnit);

  return {
    primaryValue: Math.round(outVal * 1e4) / 1e4,
    primaryUnit: outUnit,
    formattedResult: `${outVal.toFixed(3)} ${outUnit}`,
    formulaUsed: formula,
    substitutionSteps: steps,
    assumptions: ['Uniform rotational motion around a central axis.'],
    secondaryValues: [
      { label: 'Radians per second (rad/s)', value: `${omegaRadSec.toFixed(4)} rad/s` },
      { label: 'Degrees per second (deg/s)', value: `${((omegaRadSec * 180) / Math.PI).toFixed(2)} °/s` },
      { label: 'Revolutions per minute (RPM)', value: `${((omegaRadSec * 60) / (2 * Math.PI)).toFixed(2)} RPM` },
    ],
  };
}

// 36. Angular Acceleration Calculator
export function calculateAngularAcceleration(
  omegaInitial: number | '',
  omegaFinal: number | '',
  timeDelta: number | '',
  omegaUnit = 'rad/s',
  timeUnit = 's',
  accelUnit = 'rad/s2'
): PhysicsCalculationResult | null {
  if (
    typeof omegaInitial !== 'number' ||
    typeof omegaFinal !== 'number' ||
    typeof timeDelta !== 'number' ||
    isNaN(omegaInitial) ||
    isNaN(omegaFinal) ||
    isNaN(timeDelta) ||
    timeDelta <= 0
  ) {
    return null;
  }

  const w0SI = convertUnitValue(omegaInitial, omegaUnit, 'rad/s');
  const w1SI = convertUnitValue(omegaFinal, omegaUnit, 'rad/s');
  const tSI = convertUnitValue(timeDelta, timeUnit, 's');

  const alphaSI = (w1SI - w0SI) / tSI;
  const alphaOut = convertUnitValue(alphaSI, 'rad/s2', accelUnit);

  return {
    primaryValue: Math.round(alphaOut * 1e4) / 1e4,
    primaryUnit: accelUnit,
    formattedResult: `${alphaOut.toFixed(3)} ${accelUnit}`,
    formulaUsed: '\\alpha = \\frac{\\omega - \\omega_0}{\\Delta t}',
    substitutionSteps: [
      `Initial angular velocity ω₀ = ${w0SI.toFixed(3)} rad/s`,
      `Final angular velocity ω = ${w1SI.toFixed(3)} rad/s`,
      `Time elapsed Δt = ${tSI.toFixed(3)} s`,
      `Angular acceleration α = (${w1SI.toFixed(3)} - ${w0SI.toFixed(3)}) / ${tSI.toFixed(3)} = ${alphaSI.toFixed(3)} rad/s²`,
    ],
    assumptions: ['Constant rotational acceleration over the measurement interval.'],
    secondaryValues: [
      { label: 'Acceleration in deg/s²', value: `${((alphaSI * 180) / Math.PI).toFixed(2)} deg/s²` },
      { label: 'Change in angular velocity (Δω)', value: `${(w1SI - w0SI).toFixed(3)} rad/s` },
    ],
  };
}

// ==========================================
// ELECTROMAGNETISM (7 tools)
// ==========================================

// 37. Coulomb's Law Calculator
export function calculateCoulombsLaw(
  q1: number | '',
  q2: number | '',
  distance: number | '',
  q1Unit = 'C',
  q2Unit = 'C',
  distUnit = 'm',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (
    typeof q1 !== 'number' ||
    typeof q2 !== 'number' ||
    typeof distance !== 'number' ||
    isNaN(q1) ||
    isNaN(q2) ||
    isNaN(distance) ||
    distance <= 0
  ) {
    return null;
  }

  const q1SI = convertUnitValue(q1, q1Unit, 'C');
  const q2SI = convertUnitValue(q2, q2Unit, 'C');
  const rSI = convertUnitValue(distance, distUnit, 'm');

  const forceSI = (K_COULOMB * Math.abs(q1SI * q2SI)) / (rSI * rSI);
  const isAttractive = q1SI * q2SI < 0;
  const forceOut = convertUnitValue(forceSI, 'N', forceUnit);

  return {
    primaryValue: forceOut,
    primaryUnit: forceUnit,
    formattedResult: `${forceOut < 1e-4 ? forceOut.toExponential(4) : forceOut.toFixed(4)} ${forceUnit}`,
    formulaUsed: 'F = k_e \\frac{|q_1 q_2|}{r^2}',
    substitutionSteps: [
      `Charge q₁ = ${q1SI.toExponential(3)} C, Charge q₂ = ${q2SI.toExponential(3)} C`,
      `Distance r = ${rSI.toFixed(4)} m`,
      `k_e = 8.98755 × 10⁹ N·m²/C²`,
      `Electrostatic Force = (8.98755e9 × ${Math.abs(q1SI).toExponential(2)} × ${Math.abs(q2SI).toExponential(2)}) / (${rSI.toFixed(4)})² = ${forceSI.toExponential(4)} N`,
      `Nature: ${isAttractive ? 'ATTRACTIVE (opposite charge signs)' : 'REPULSIVE (like charge signs)'}`,
    ],
    assumptions: ['Stationary electrostatic point charges in vacuum or air (relative permittivity ε_r ≈ 1).'],
    secondaryValues: [
      { label: 'Interaction Type', value: isAttractive ? 'Attractive' : 'Repulsive' },
      { label: "Coulomb's Constant", value: '8.98755 × 10⁹ N·m²/C²' },
    ],
  };
}

// 38. Electric Field Calculator
export function calculateElectricField(
  mode: 'point_charge' | 'force_charge',
  sourceCharge: number | '',
  distance: number | '',
  testForce: number | '',
  testCharge: number | '',
  qUnit = 'C',
  distUnit = 'm',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  let eSI = 0;
  let formula = '';
  const steps: string[] = [];

  if (mode === 'point_charge') {
    if (typeof sourceCharge !== 'number' || typeof distance !== 'number' || isNaN(sourceCharge) || isNaN(distance) || distance <= 0) {
      return null;
    }
    const qSI = convertUnitValue(sourceCharge, qUnit, 'C');
    const rSI = convertUnitValue(distance, distUnit, 'm');
    eSI = (K_COULOMB * Math.abs(qSI)) / (rSI * rSI);
    formula = 'E = k_e \\frac{|Q|}{r^2}';
    steps.push(`Source Charge Q = ${qSI.toExponential(3)} C, Distance r = ${rSI.toFixed(4)} m`);
    steps.push(`E = (8.98755e9 × ${Math.abs(qSI).toExponential(3)}) / (${rSI.toFixed(4)})² = ${eSI.toExponential(4)} N/C`);
  } else {
    if (typeof testForce !== 'number' || typeof testCharge !== 'number' || isNaN(testForce) || isNaN(testCharge) || testCharge === 0) {
      return null;
    }
    const fSI = convertUnitValue(testForce, forceUnit, 'N');
    const qSI = convertUnitValue(testCharge, qUnit, 'C');
    eSI = Math.abs(fSI / qSI);
    formula = 'E = \\frac{F}{q}';
    steps.push(`Force F = ${fSI.toFixed(4)} N, Test Charge q = ${qSI.toExponential(3)} C`);
    steps.push(`E = ${fSI.toFixed(4)} N / ${Math.abs(qSI).toExponential(3)} C = ${eSI.toExponential(4)} N/C`);
  }

  return {
    primaryValue: eSI,
    primaryUnit: 'N/C',
    formattedResult: `${eSI < 1e-4 ? eSI.toExponential(4) : eSI.toFixed(4)} N/C`,
    formulaUsed: formula,
    substitutionSteps: steps,
    assumptions: ['Assumes isotropic free space permittivity.'],
    secondaryValues: [
      { label: 'Volts per meter (V/m)', value: `${eSI < 1e-4 ? eSI.toExponential(4) : eSI.toFixed(4)} V/m` },
    ],
  };
}

// 39. Electric Potential Calculator
export function calculateElectricPotential(
  charge: number | '',
  distance: number | '',
  testCharge: number | '' = '',
  qUnit = 'C',
  distUnit = 'm'
): PhysicsCalculationResult | null {
  if (typeof charge !== 'number' || typeof distance !== 'number' || isNaN(charge) || isNaN(distance) || distance <= 0) {
    return null;
  }

  const qSI = convertUnitValue(charge, qUnit, 'C');
  const rSI = convertUnitValue(distance, distUnit, 'm');

  const potentialVolts = (K_COULOMB * qSI) / rSI;
  const steps: string[] = [
    `Charge Q = ${qSI.toExponential(3)} C`,
    `Distance r = ${rSI.toFixed(4)} m`,
    `V = (8.98755e9 × ${qSI.toExponential(3)}) / ${rSI.toFixed(4)} = ${potentialVolts.toFixed(3)} Volts`,
  ];

  const secondary: { label: string; value: string }[] = [{ label: 'Potential in Kilovolts (kV)', value: `${(potentialVolts / 1000).toFixed(4)} kV` }];

  if (typeof testCharge === 'number' && !isNaN(testCharge)) {
    const qTestSI = convertUnitValue(testCharge, qUnit, 'C');
    const uJoules = qTestSI * potentialVolts;
    steps.push(`Test charge q = ${qTestSI.toExponential(3)} C`);
    steps.push(`Potential Energy U = q × V = ${uJoules.toExponential(4)} Joules`);
    secondary.push({ label: 'Electric Potential Energy (U)', value: `${uJoules.toExponential(4)} J` });
  }

  return {
    primaryValue: Math.round(potentialVolts * 1e4) / 1e4,
    primaryUnit: 'V',
    formattedResult: `${potentialVolts.toFixed(3)} V`,
    formulaUsed: 'V = k_e \\frac{Q}{r}, \\quad U = qV',
    substitutionSteps: steps,
    assumptions: ['Reference zero potential is defined at infinity (r → ∞).'],
    secondaryValues: secondary,
  };
}

// 40. Resistors in Series & Parallel Calculator
export interface ResistorItem {
  id: string;
  value: number | '';
  unit: string; // 'Ω', 'kΩ', 'MΩ'
}

export interface ResistorsCircuitResult {
  seriesReqOhms: number;
  parallelReqOhms: number;
  validCount: number;
  resistorsOhms: number[];
}

export function calculateResistorsCircuit(items: ResistorItem[]): ResistorsCircuitResult | null {
  const valid = items
    .map((it) => {
      if (typeof it.value !== 'number' || isNaN(it.value) || it.value <= 0) return null;
      return convertUnitValue(it.value, it.unit || 'Ω', 'Ω');
    })
    .filter((v): v is number => v !== null);

  if (valid.length === 0) return null;

  const seriesReqOhms = valid.reduce((acc, curr) => acc + curr, 0);
  const sumInv = valid.reduce((acc, curr) => acc + 1 / curr, 0);
  const parallelReqOhms = sumInv > 0 ? 1 / sumInv : 0;

  return {
    seriesReqOhms: Math.round(seriesReqOhms * 1e4) / 1e4,
    parallelReqOhms: Math.round(parallelReqOhms * 1e4) / 1e4,
    validCount: valid.length,
    resistorsOhms: valid,
  };
}

// 41. Voltage Divider Calculator
export function calculateVoltageDivider(
  vIn: number | '',
  r1: number | '',
  r2: number | '',
  rLoad: number | '' = '',
  vUnit = 'V',
  r1Unit = 'Ω',
  r2Unit = 'Ω',
  rLoadUnit = 'Ω'
): PhysicsCalculationResult | null {
  if (
    typeof vIn !== 'number' ||
    typeof r1 !== 'number' ||
    typeof r2 !== 'number' ||
    isNaN(vIn) ||
    isNaN(r1) ||
    isNaN(r2) ||
    r1 <= 0 ||
    r2 <= 0
  ) {
    return null;
  }

  const vInSI = convertUnitValue(vIn, vUnit, 'V');
  const r1SI = convertUnitValue(r1, r1Unit, 'Ω');
  const r2SI = convertUnitValue(r2, r2Unit, 'Ω');

  const unloadedVout = (vInSI * r2SI) / (r1SI + r2SI);
  const dividerRatio = r2SI / (r1SI + r2SI);

  const steps: string[] = [
    `Input Voltage V_in = ${vInSI.toFixed(3)} V`,
    `Resistors: R1 = ${r1SI.toFixed(2)} Ω, R2 = ${r2SI.toFixed(2)} Ω`,
    `Unloaded V_out = ${vInSI.toFixed(3)} × (${r2SI.toFixed(2)} / (${r1SI.toFixed(2)} + ${r2SI.toFixed(2)})) = ${unloadedVout.toFixed(4)} V`,
  ];

  const secondary: { label: string; value: string }[] = [
    { label: 'Divider Ratio (V_out / V_in)', value: `${dividerRatio.toFixed(4)} (${(dividerRatio * 100).toFixed(2)}%)` },
    { label: 'Quiescent Current (I)', value: `${((vInSI / (r1SI + r2SI)) * 1000).toFixed(3)} mA` },
    { label: 'Total Resistance', value: `${(r1SI + r2SI).toFixed(2)} Ω` },
  ];

  let primaryResult = unloadedVout;

  if (typeof rLoad === 'number' && !isNaN(rLoad) && rLoad > 0) {
    const rlSI = convertUnitValue(rLoad, rLoadUnit, 'Ω');
    const r2ParallelLoad = (r2SI * rlSI) / (r2SI + rlSI);
    const loadedVout = (vInSI * r2ParallelLoad) / (r1SI + r2ParallelLoad);
    primaryResult = loadedVout;
    steps.push(`With Load R_L = ${rlSI.toFixed(2)} Ω:`);
    steps.push(`Effective R2 || R_L = ${r2ParallelLoad.toFixed(2)} Ω`);
    steps.push(`Loaded V_out = ${loadedVout.toFixed(4)} V`);
    secondary.push({ label: 'Loaded V_out', value: `${loadedVout.toFixed(4)} V` });
    secondary.push({ label: 'Unloaded V_out', value: `${unloadedVout.toFixed(4)} V` });
  }

  return {
    primaryValue: Math.round(primaryResult * 1e4) / 1e4,
    primaryUnit: 'V',
    formattedResult: `${primaryResult.toFixed(4)} V`,
    formulaUsed: 'V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}',
    substitutionSteps: steps,
    assumptions: ['Linear ideal resistor behavior with negligible source impedance.'],
    secondaryValues: secondary,
  };
}

// 42. Capacitor Calculator
export function calculateCapacitor(
  mode: 'qv' | 'parallel_plate',
  qVal: number | '',
  vVal: number | '',
  areaVal: number | '',
  distVal: number | '',
  dielectricEr: number | '' = 1,
  qUnit = 'C',
  vUnit = 'V',
  areaUnit = 'sq m',
  distUnit = 'm'
): PhysicsCalculationResult | null {
  let capFarads = 0;
  let formula = '';
  const steps: string[] = [];

  if (mode === 'qv') {
    if (typeof qVal !== 'number' || typeof vVal !== 'number' || isNaN(qVal) || isNaN(vVal) || vVal <= 0) return null;
    const qSI = convertUnitValue(qVal, qUnit, 'C');
    const vSI = convertUnitValue(vVal, vUnit, 'V');
    capFarads = qSI / vSI;
    formula = 'C = \\frac{Q}{V}';
    steps.push(`Charge Q = ${qSI.toExponential(4)} C, Voltage V = ${vSI.toFixed(3)} V`);
    steps.push(`Capacitance C = ${qSI.toExponential(4)} C / ${vSI.toFixed(3)} V = ${capFarads.toExponential(4)} Farads`);
  } else {
    if (typeof areaVal !== 'number' || typeof distVal !== 'number' || isNaN(areaVal) || isNaN(distVal) || areaVal <= 0 || distVal <= 0) {
      return null;
    }
    const aSI = convertUnitValue(areaVal, areaUnit, 'sq m');
    const dSI = convertUnitValue(distVal, distUnit, 'm');
    const er = typeof dielectricEr === 'number' && !isNaN(dielectricEr) && dielectricEr >= 1 ? dielectricEr : 1;
    capFarads = (er * EPSILON_0 * aSI) / dSI;
    formula = 'C = \\varepsilon_r \\varepsilon_0 \\frac{A}{d}';
    steps.push(`Plate Area A = ${aSI.toFixed(4)} m², Distance d = ${dSI.toExponential(3)} m, ε_r = ${er}`);
    steps.push(`ε₀ = 8.85419 × 10⁻¹² F/m`);
    steps.push(`C = (${er} × 8.85419e-12 × ${aSI.toFixed(4)}) / ${dSI.toExponential(3)} = ${capFarads.toExponential(4)} Farads`);
  }

  return {
    primaryValue: capFarads,
    primaryUnit: 'F',
    formattedResult: `${capFarads < 1e-4 ? capFarads.toExponential(4) : capFarads.toFixed(6)} F`,
    formulaUsed: formula,
    substitutionSteps: steps,
    assumptions: ['Assumes uniform electric field between parallel plates (edge fringe effects neglected).'],
    secondaryValues: [
      { label: 'Microfarads (μF)', value: `${(capFarads * 1e6).toFixed(4)} μF` },
      { label: 'Nanofarads (nF)', value: `${(capFarads * 1e9).toFixed(4)} nF` },
      { label: 'Picofarads (pF)', value: `${(capFarads * 1e12).toFixed(2)} pF` },
    ],
  };
}

// 43. Capacitor Energy Calculator
export function calculateCapacitorEnergy(
  capacitance: number | '',
  voltage: number | '',
  capUnit = 'μF',
  vUnit = 'V'
): PhysicsCalculationResult | null {
  if (
    typeof capacitance !== 'number' ||
    typeof voltage !== 'number' ||
    isNaN(capacitance) ||
    isNaN(voltage) ||
    capacitance <= 0 ||
    voltage < 0
  ) {
    return null;
  }

  const cFarads = convertUnitValue(capacitance, capUnit, 'F');
  const vVolts = convertUnitValue(voltage, vUnit, 'V');

  // U = 1/2 C V²
  const energyJoules = 0.5 * cFarads * vVolts * vVolts;
  const chargeCoulombs = cFarads * vVolts;

  return {
    primaryValue: energyJoules,
    primaryUnit: 'J',
    formattedResult: `${energyJoules < 1e-4 ? energyJoules.toExponential(4) : energyJoules.toFixed(6)} J`,
    formulaUsed: 'U = \\frac{1}{2} C V^2, \\quad Q = C V',
    substitutionSteps: [
      `Capacitance C = ${capacitance} ${capUnit} (${cFarads.toExponential(4)} F)`,
      `Voltage V = ${voltage} ${vUnit} (${vVolts.toFixed(2)} V)`,
      `Stored Energy U = 0.5 × ${cFarads.toExponential(4)} × (${vVolts.toFixed(2)})² = ${energyJoules.toExponential(4)} Joules`,
      `Stored Charge Q = ${cFarads.toExponential(4)} × ${vVolts.toFixed(2)} = ${chargeCoulombs.toExponential(4)} Coulombs`,
    ],
    assumptions: ['Linear dielectric behavior without breakdown or leakage currents.'],
    secondaryValues: [
      { label: 'Energy in Millijoules (mJ)', value: `${(energyJoules * 1000).toFixed(4)} mJ` },
      { label: 'Stored Charge (Q)', value: `${(chargeCoulombs * 1e6).toFixed(4)} μC` },
    ],
  };
}

// ==========================================
// THERMODYNAMICS (6 tools)
// ==========================================

// 44. Heat Energy Calculator
export function calculateHeatEnergy(
  mass: number | '',
  specificHeatC: number | '',
  tempInitial: number | '',
  tempFinal: number | '',
  massUnit = 'kg',
  cUnit = 'J/(kg·K)',
  tempUnit = '°C'
): PhysicsCalculationResult | null {
  if (
    typeof mass !== 'number' ||
    typeof specificHeatC !== 'number' ||
    typeof tempInitial !== 'number' ||
    typeof tempFinal !== 'number' ||
    isNaN(mass) ||
    isNaN(specificHeatC) ||
    isNaN(tempInitial) ||
    isNaN(tempFinal) ||
    mass <= 0 ||
    specificHeatC <= 0
  ) {
    return null;
  }

  const mSI = convertUnitValue(mass, massUnit, 'kg');
  const cSI = convertUnitValue(specificHeatC, cUnit, 'J/(kg·K)');

  // Temperature difference ΔT (in Kelvin or Celsius, difference is identical)
  let deltaT = 0;
  if (tempUnit === '°F') {
    deltaT = (tempFinal - tempInitial) * (5 / 9);
  } else {
    deltaT = tempFinal - tempInitial;
  }

  const qJoules = mSI * cSI * deltaT;
  const isHeating = deltaT >= 0;

  return {
    primaryValue: Math.round(qJoules * 100) / 100,
    primaryUnit: 'J',
    formattedResult: `${(qJoules / 1000).toFixed(3)} kJ (${qJoules.toFixed(2)} J)`,
    formulaUsed: 'Q = m \\cdot c \\cdot \\Delta T',
    substitutionSteps: [
      `Mass m = ${mSI.toFixed(3)} kg, Specific Heat c = ${cSI.toFixed(1)} J/(kg·K)`,
      `Temperature change ΔT = ${tempFinal} - ${tempInitial} = ${deltaT.toFixed(2)} K/°C`,
      `Heat Energy Q = ${mSI.toFixed(3)} kg × ${cSI.toFixed(1)} × ${deltaT.toFixed(2)} = ${qJoules.toFixed(2)} Joules`,
      isHeating ? 'Heat is ABSORBED by the substance.' : 'Heat is RELEASED by the substance.',
    ],
    assumptions: ['Constant specific heat capacity over the temperature range with no phase transition.'],
    secondaryValues: [
      { label: 'Kilojoules (kJ)', value: `${(qJoules / 1000).toFixed(3)} kJ` },
      { label: 'Calories (cal)', value: `${(qJoules / 4.184).toFixed(1)} cal` },
      { label: 'Kilocalories (kcal / dietary Cal)', value: `${(qJoules / 4184).toFixed(3)} kcal` },
      { label: 'BTU', value: `${(qJoules / 1055.056).toFixed(3)} BTU` },
    ],
  };
}

// 45. Specific Heat Calculator
export function calculateSpecificHeatCapacity(
  heatEnergyQ: number | '',
  mass: number | '',
  tempDelta: number | '',
  qUnit = 'J',
  massUnit = 'kg',
  tempUnit = '°C'
): PhysicsCalculationResult | null {
  if (
    typeof heatEnergyQ !== 'number' ||
    typeof mass !== 'number' ||
    typeof tempDelta !== 'number' ||
    isNaN(heatEnergyQ) ||
    isNaN(mass) ||
    isNaN(tempDelta) ||
    mass <= 0 ||
    tempDelta === 0
  ) {
    return null;
  }

  const qSI = convertUnitValue(heatEnergyQ, qUnit, 'J');
  const mSI = convertUnitValue(mass, massUnit, 'kg');
  const dtSI = tempUnit === '°F' ? tempDelta * (5 / 9) : tempDelta;

  const cSI = qSI / (mSI * Math.abs(dtSI));

  return {
    primaryValue: Math.round(cSI * 100) / 100,
    primaryUnit: 'J/(kg·K)',
    formattedResult: `${cSI.toFixed(2)} J/(kg·K)`,
    formulaUsed: 'c = \\frac{Q}{m \\cdot \\Delta T}',
    substitutionSteps: [
      `Heat Energy Q = ${qSI.toFixed(2)} J`,
      `Mass m = ${mSI.toFixed(3)} kg, ΔT = ${dtSI.toFixed(2)} K`,
      `Specific heat c = ${qSI.toFixed(2)} / (${mSI.toFixed(3)} × ${dtSI.toFixed(2)}) = ${cSI.toFixed(2)} J/(kg·K)`,
    ],
    assumptions: ['No heat losses to environment (ideal calorimeter).'],
    secondaryValues: [
      { label: 'Specific Heat in J/(g·°C)', value: `${(cSI / 1000).toFixed(4)} J/(g·°C)` },
      { label: 'Specific Heat in cal/(g·°C)', value: `${(cSI / 4184).toFixed(4)} cal/(g·°C)` },
    ],
  };
}

// 46. Latent Heat Calculator
export function calculateLatentHeat(
  mass: number | '',
  specificLatentL: number | '',
  massUnit = 'kg',
  lUnit = 'kJ/kg'
): PhysicsCalculationResult | null {
  if (
    typeof mass !== 'number' ||
    typeof specificLatentL !== 'number' ||
    isNaN(mass) ||
    isNaN(specificLatentL) ||
    mass <= 0 ||
    specificLatentL <= 0
  ) {
    return null;
  }

  const mSI = convertUnitValue(mass, massUnit, 'kg');
  const lSI = lUnit === 'kJ/kg' ? specificLatentL * 1000 : specificLatentL;

  const qJoules = mSI * lSI;

  return {
    primaryValue: Math.round(qJoules * 100) / 100,
    primaryUnit: 'J',
    formattedResult: `${(qJoules / 1000).toFixed(3)} kJ`,
    formulaUsed: 'Q = m \\cdot L',
    substitutionSteps: [
      `Mass m = ${mSI.toFixed(3)} kg`,
      `Specific Latent Heat L = ${specificLatentL} ${lUnit} (${lSI.toFixed(0)} J/kg)`,
      `Phase change heat Q = ${mSI.toFixed(3)} kg × ${lSI.toFixed(0)} J/kg = ${qJoules.toFixed(2)} Joules (${(qJoules / 1000).toFixed(3)} kJ)`,
    ],
    assumptions: ['Isothermal phase transition at constant saturation temperature.'],
    secondaryValues: [
      { label: 'Kilojoules (kJ)', value: `${(qJoules / 1000).toFixed(3)} kJ` },
      { label: 'Calories (cal)', value: `${(qJoules / 4.184).toFixed(1)} cal` },
      { label: 'BTU', value: `${(qJoules / 1055.056).toFixed(3)} BTU` },
    ],
  };
}

// 47. Thermal Expansion Calculator
export function calculateThermalExpansion(
  mode: 'linear' | 'area' | 'volumetric',
  initialDim: number | '',
  alphaCoeff: number | '',
  tempDelta: number | '',
  dimUnit = 'm',
  tempUnit = '°C'
): PhysicsCalculationResult | null {
  if (
    typeof initialDim !== 'number' ||
    typeof alphaCoeff !== 'number' ||
    typeof tempDelta !== 'number' ||
    isNaN(initialDim) ||
    isNaN(alphaCoeff) ||
    isNaN(tempDelta) ||
    initialDim <= 0
  ) {
    return null;
  }

  const dtSI = tempUnit === '°F' ? tempDelta * (5 / 9) : tempDelta;
  let multiplier = 1;
  let formula = '';

  if (mode === 'linear') {
    multiplier = 1;
    formula = '\\Delta L = \\alpha \\cdot L_0 \\cdot \\Delta T';
  } else if (mode === 'area') {
    multiplier = 2;
    formula = '\\Delta A \\approx 2\\alpha \\cdot A_0 \\cdot \\Delta T';
  } else {
    multiplier = 3;
    formula = '\\Delta V \\approx 3\\alpha \\cdot V_0 \\cdot \\Delta T';
  }

  const deltaDim = multiplier * alphaCoeff * initialDim * dtSI;
  const finalDim = initialDim + deltaDim;

  return {
    primaryValue: Math.round(deltaDim * 1e6) / 1e6,
    primaryUnit: dimUnit,
    formattedResult: `${deltaDim >= 0 ? '+' : ''}${deltaDim.toFixed(5)} ${dimUnit}`,
    formulaUsed: formula,
    substitutionSteps: [
      `Initial dimension = ${initialDim} ${dimUnit}`,
      `Expansion coefficient = ${alphaCoeff} /°C (effective factor = ${multiplier * alphaCoeff})`,
      `Temperature change ΔT = ${dtSI.toFixed(2)} °C`,
      `Expansion Δ = ${initialDim} × (${multiplier * alphaCoeff}) × ${dtSI.toFixed(2)} = ${deltaDim.toFixed(5)} ${dimUnit}`,
      `Final dimension = ${finalDim.toFixed(5)} ${dimUnit}`,
    ],
    assumptions: ['Linearized small-deformation thermal expansion model.'],
    secondaryValues: [
      { label: 'Final Dimension', value: `${finalDim.toFixed(5)} ${dimUnit}` },
      { label: 'Percentage Change', value: `${((deltaDim / initialDim) * 100).toFixed(4)}%` },
    ],
  };
}

// 48. Ideal Gas Law Calculator
export function calculateIdealGas(
  solveFor: 'pressure' | 'volume' | 'moles' | 'temperature',
  pVal: number | '',
  vVal: number | '',
  nVal: number | '',
  tVal: number | '',
  pUnit = 'atm',
  vUnit = 'L',
  tUnit = 'K'
): PhysicsCalculationResult | null {
  const R = GAS_CONSTANT_R; // 8.31446 J/(mol·K)

  if (solveFor === 'pressure') {
    if (typeof vVal !== 'number' || typeof nVal !== 'number' || typeof tVal !== 'number' || vVal <= 0 || nVal <= 0) return null;
    const vM3 = convertUnitValue(vVal, vUnit, 'm³');
    const tK = tUnit === '°C' ? tVal + 273.15 : tUnit === '°F' ? (tVal - 32) * (5 / 9) + 273.15 : tVal;
    if (tK <= 0) return null;

    const pPa = (nVal * R * tK) / vM3;
    const pOut = convertUnitValue(pPa, 'Pa', pUnit);

    return {
      primaryValue: Math.round(pOut * 1e4) / 1e4,
      primaryUnit: pUnit,
      formattedResult: `${pOut.toFixed(3)} ${pUnit}`,
      formulaUsed: 'P = \\frac{nRT}{V}',
      substitutionSteps: [
        `n = ${nVal} mol, T = ${tK.toFixed(2)} K, V = ${vM3.toFixed(4)} m³`,
        `P = (${nVal} × 8.3145 × ${tK.toFixed(2)}) / ${vM3.toFixed(4)} = ${pPa.toFixed(0)} Pa = ${pOut.toFixed(3)} ${pUnit}`,
      ],
      assumptions: ['Ideal gas behavior (point particles with no intermolecular forces).'],
      secondaryValues: [
        { label: 'Pressure in Pascals (Pa)', value: `${pPa.toFixed(0)} Pa` },
        { label: 'Pressure in atm', value: `${(pPa / 101325).toFixed(3)} atm` },
        { label: 'Pressure in bar', value: `${(pPa / 100000).toFixed(3)} bar` },
      ],
    };
  } else if (solveFor === 'volume') {
    if (typeof pVal !== 'number' || typeof nVal !== 'number' || typeof tVal !== 'number' || pVal <= 0 || nVal <= 0) return null;
    const pPa = convertUnitValue(pVal, pUnit, 'Pa');
    const tK = tUnit === '°C' ? tVal + 273.15 : tUnit === '°F' ? (tVal - 32) * (5 / 9) + 273.15 : tVal;
    if (tK <= 0) return null;

    const vM3 = (nVal * R * tK) / pPa;
    const vOut = convertUnitValue(vM3, 'm³', vUnit);

    return {
      primaryValue: Math.round(vOut * 1e4) / 1e4,
      primaryUnit: vUnit,
      formattedResult: `${vOut.toFixed(3)} ${vUnit}`,
      formulaUsed: 'V = \\frac{nRT}{P}',
      substitutionSteps: [
        `n = ${nVal} mol, T = ${tK.toFixed(2)} K, P = ${pPa.toFixed(0)} Pa`,
        `V = (${nVal} × 8.3145 × ${tK.toFixed(2)}) / ${pPa.toFixed(0)} = ${vM3.toFixed(4)} m³ = ${vOut.toFixed(3)} ${vUnit}`,
      ],
      assumptions: ['Ideal gas approximation.'],
      secondaryValues: [
        { label: 'Volume in Liters (L)', value: `${(vM3 * 1000).toFixed(2)} L` },
        { label: 'Volume in m³', value: `${vM3.toFixed(4)} m³` },
      ],
    };
  } else if (solveFor === 'moles') {
    if (typeof pVal !== 'number' || typeof vVal !== 'number' || typeof tVal !== 'number' || pVal <= 0 || vVal <= 0) return null;
    const pPa = convertUnitValue(pVal, pUnit, 'Pa');
    const vM3 = convertUnitValue(vVal, vUnit, 'm³');
    const tK = tUnit === '°C' ? tVal + 273.15 : tUnit === '°F' ? (tVal - 32) * (5 / 9) + 273.15 : tVal;
    if (tK <= 0) return null;

    const nMoles = (pPa * vM3) / (R * tK);

    return {
      primaryValue: Math.round(nMoles * 1e4) / 1e4,
      primaryUnit: 'mol',
      formattedResult: `${nMoles.toFixed(4)} mol`,
      formulaUsed: 'n = \\frac{PV}{RT}',
      substitutionSteps: [
        `P = ${pPa.toFixed(0)} Pa, V = ${vM3.toFixed(4)} m³, T = ${tK.toFixed(2)} K`,
        `n = (${pPa.toFixed(0)} × ${vM3.toFixed(4)}) / (8.3145 × ${tK.toFixed(2)}) = ${nMoles.toFixed(4)} moles`,
      ],
      assumptions: ['Ideal gas law.'],
      secondaryValues: [{ label: 'Number of Gas Molecules', value: `${(nMoles * 6.02214e23).toExponential(4)} molecules` }],
    };
  } else {
    if (typeof pVal !== 'number' || typeof vVal !== 'number' || typeof nVal !== 'number' || pVal <= 0 || vVal <= 0 || nVal <= 0) return null;
    const pPa = convertUnitValue(pVal, pUnit, 'Pa');
    const vM3 = convertUnitValue(vVal, vUnit, 'm³');

    const tK = (pPa * vM3) / (nVal * R);
    const tC = tK - 273.15;
    const tF = tC * (9 / 5) + 32;

    return {
      primaryValue: Math.round(tK * 100) / 100,
      primaryUnit: 'K',
      formattedResult: `${tK.toFixed(2)} K (${tC.toFixed(2)} °C)`,
      formulaUsed: 'T = \\frac{PV}{nR}',
      substitutionSteps: [
        `P = ${pPa.toFixed(0)} Pa, V = ${vM3.toFixed(4)} m³, n = ${nVal} mol`,
        `T = (${pPa.toFixed(0)} × ${vM3.toFixed(4)}) / (${nVal} × 8.3145) = ${tK.toFixed(2)} K`,
      ],
      assumptions: ['Ideal gas equation.'],
      secondaryValues: [
        { label: 'Temperature in Celsius', value: `${tC.toFixed(2)} °C` },
        { label: 'Temperature in Fahrenheit', value: `${tF.toFixed(2)} °F` },
      ],
    };
  }
}

// 49. Combined Gas Law Calculator
export function calculateCombinedGasLaw(
  p1: number | '',
  v1: number | '',
  t1: number | '',
  p2: number | '',
  v2: number | '',
  t2: number | '',
  solveTarget: 'p2' | 'v2' | 't2'
): PhysicsCalculationResult | null {
  if (typeof t1 !== 'number' || t1 <= 0) return null;

  if (solveTarget === 'p2') {
    if (typeof p1 !== 'number' || typeof v1 !== 'number' || typeof v2 !== 'number' || typeof t2 !== 'number' || v2 <= 0 || t2 <= 0) return null;
    const p2Val = (p1 * v1 * t2) / (v2 * t1);
    return {
      primaryValue: Math.round(p2Val * 1e4) / 1e4,
      primaryUnit: 'same as P1',
      formattedResult: `${p2Val.toFixed(3)}`,
      formulaUsed: 'P_2 = \\frac{P_1 V_1 T_2}{V_2 T_1}',
      substitutionSteps: [`P₂ = (${p1} × ${v1} × ${t2}) / (${v2} × ${t1}) = ${p2Val.toFixed(3)}`],
      assumptions: ['Temperatures must be expressed in absolute Kelvin.', 'Mass of gas is conserved.'],
    };
  } else if (solveTarget === 'v2') {
    if (typeof p1 !== 'number' || typeof v1 !== 'number' || typeof p2 !== 'number' || typeof t2 !== 'number' || p2 <= 0 || t2 <= 0) return null;
    const v2Val = (p1 * v1 * t2) / (p2 * t1);
    return {
      primaryValue: Math.round(v2Val * 1e4) / 1e4,
      primaryUnit: 'same as V1',
      formattedResult: `${v2Val.toFixed(3)}`,
      formulaUsed: 'V_2 = \\frac{P_1 V_1 T_2}{P_2 T_1}',
      substitutionSteps: [`V₂ = (${p1} × ${v1} × ${t2}) / (${p2} × ${t1}) = ${v2Val.toFixed(3)}`],
      assumptions: ['Temperatures in Kelvin.'],
    };
  } else {
    if (typeof p1 !== 'number' || typeof v1 !== 'number' || typeof p2 !== 'number' || typeof v2 !== 'number' || p1 * v1 === 0) return null;
    const t2Val = (p2 * v2 * t1) / (p1 * v1);
    return {
      primaryValue: Math.round(t2Val * 1e4) / 1e4,
      primaryUnit: 'K',
      formattedResult: `${t2Val.toFixed(2)} K`,
      formulaUsed: 'T_2 = \\frac{P_2 V_2 T_1}{P_1 V_1}',
      substitutionSteps: [`T₂ = (${p2} × ${v2} × ${t1}) / (${p1} × ${v1}) = ${t2Val.toFixed(2)} K`],
      assumptions: ['Absolute temperature in Kelvin.'],
    };
  }
}

// ==========================================
// OPTICS & WAVES (6 tools)
// ==========================================

// 50. Snell's Law Calculator
export function calculateSnellsLaw(
  n1: number | '',
  theta1Deg: number | '',
  n2: number | ''
): PhysicsCalculationResult | null {
  if (
    typeof n1 !== 'number' ||
    typeof theta1Deg !== 'number' ||
    typeof n2 !== 'number' ||
    isNaN(n1) ||
    isNaN(theta1Deg) ||
    isNaN(n2) ||
    n1 <= 0 ||
    n2 <= 0 ||
    theta1Deg < 0 ||
    theta1Deg > 90
  ) {
    return null;
  }

  const th1Rad = (theta1Deg * Math.PI) / 180;
  const sinTh2 = (n1 * Math.sin(th1Rad)) / n2;

  if (sinTh2 > 1.0000001) {
    // Total Internal Reflection
    const criticalAngleRad = Math.asin(n2 / n1);
    const criticalAngleDeg = (criticalAngleRad * 180) / Math.PI;

    return {
      primaryValue: 0,
      primaryUnit: '°',
      formattedResult: 'Total Internal Reflection (No Refraction)',
      formulaUsed: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2',
      substitutionSteps: [
        `n₁ = ${n1}, θ₁ = ${theta1Deg}°, n₂ = ${n2}`,
        `sin(θ₂) = (${n1} × sin(${theta1Deg}°)) / ${n2} = ${sinTh2.toFixed(4)} > 1`,
        `Since sin(θ₂) > 1, all light is REFLECTED internally.`,
        `Critical angle θ_c = arcsin(${n2}/${n1}) = ${criticalAngleDeg.toFixed(2)}°`,
      ],
      assumptions: ['Total internal reflection occurs when traveling from denser to rarer optical medium (n1 > n2) past critical angle.'],
      warning: 'Total Internal Reflection occurs: angle of incidence exceeds critical angle.',
      secondaryValues: [{ label: 'Critical Angle (θ_c)', value: `${criticalAngleDeg.toFixed(2)}°` }],
    };
  }

  const th2Rad = Math.asin(Math.min(1, sinTh2));
  const th2Deg = (th2Rad * 180) / Math.PI;

  return {
    primaryValue: Math.round(th2Deg * 1e4) / 1e4,
    primaryUnit: '°',
    formattedResult: `${th2Deg.toFixed(2)}°`,
    formulaUsed: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\implies \\theta_2 = \\arcsin\\left(\\frac{n_1 \\sin\\theta_1}{n_2}\\right)',
    substitutionSteps: [
      `n₁ = ${n1}, θ₁ = ${theta1Deg}°, n₂ = ${n2}`,
      `sin(θ₂) = (${n1} × sin(${theta1Deg}°)) / ${n2} = ${sinTh2.toFixed(4)}`,
      `θ₂ = arcsin(${sinTh2.toFixed(4)}) = ${th2Deg.toFixed(2)}°`,
    ],
    assumptions: ['Monochromatic light passing through optically flat boundary between isotropic media.'],
    secondaryValues: [
      { label: 'Angle of Refraction (θ₂)', value: `${th2Deg.toFixed(2)}°` },
      { label: 'Angle of Incidence (θ₁)', value: `${theta1Deg.toFixed(2)}°` },
    ],
  };
}

// 51. Refractive Index Calculator
export function calculateRefractiveIndex(
  mode: 'speed' | 'angles',
  velocityInMedium: number | '',
  thetaIncident: number | '',
  thetaRefracted: number | ''
): PhysicsCalculationResult | null {
  if (mode === 'speed') {
    if (typeof velocityInMedium !== 'number' || isNaN(velocityInMedium) || velocityInMedium <= 0) return null;
    const n = SPEED_OF_LIGHT / velocityInMedium;
    return {
      primaryValue: Math.round(n * 1e4) / 1e4,
      primaryUnit: '',
      formattedResult: `${n.toFixed(4)}`,
      formulaUsed: 'n = \\frac{c}{v}',
      substitutionSteps: [
        `Speed of light in vacuum c = 299,792,458 m/s`,
        `Phase velocity in medium v = ${velocityInMedium.toLocaleString()} m/s`,
        `Refractive index n = 299,792,458 / ${velocityInMedium} = ${n.toFixed(4)}`,
      ],
      assumptions: ['Phase velocity in isotropic, non-magnetic optical medium.'],
    };
  } else {
    if (typeof thetaIncident !== 'number' || typeof thetaRefracted !== 'number' || thetaIncident <= 0 || thetaRefracted <= 0) return null;
    const sin1 = Math.sin((thetaIncident * Math.PI) / 180);
    const sin2 = Math.sin((thetaRefracted * Math.PI) / 180);
    const n = sin1 / sin2;
    return {
      primaryValue: Math.round(n * 1e4) / 1e4,
      primaryUnit: '',
      formattedResult: `${n.toFixed(4)}`,
      formulaUsed: 'n = \\frac{\\sin\\theta_1}{\\sin\\theta_2}',
      substitutionSteps: [
        `Incident angle θ₁ = ${thetaIncident}°, Refracted angle θ₂ = ${thetaRefracted}°`,
        `n = sin(${thetaIncident}°) / sin(${thetaRefracted}°) = ${sin1.toFixed(4)} / ${sin2.toFixed(4)} = ${n.toFixed(4)}`,
      ],
      assumptions: ['Light entering medium from vacuum/air (n1 ≈ 1).'],
    };
  }
}

// 52. Lens Calculator
export function calculateLens(
  focalLength: number | '',
  objectDistance: number | '',
  unit = 'cm'
): PhysicsCalculationResult | null {
  if (
    typeof focalLength !== 'number' ||
    typeof objectDistance !== 'number' ||
    isNaN(focalLength) ||
    isNaN(objectDistance) ||
    focalLength === 0 ||
    objectDistance <= 0
  ) {
    return null;
  }

  // Thin Lens Equation: 1/f = 1/do + 1/di => 1/di = 1/f - 1/do = (do - f) / (f * do) => di = (f * do) / (do - f)
  const f = focalLength;
  const doDist = objectDistance;

  if (Math.abs(doDist - f) < 1e-6) {
    return {
      primaryValue: Infinity,
      primaryUnit: unit,
      formattedResult: 'Image at Infinity (Parallel Rays / No distinct image formed)',
      formulaUsed: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
      substitutionSteps: [
        `Object placed at focal point (do = f = ${f} ${unit}).`,
        `Refracted rays emerge parallel; image formed at infinity.`,
      ],
      assumptions: ['Thin lens approximation.'],
    };
  }

  const di = (f * doDist) / (doDist - f);
  const magnification = -di / doDist;

  const isReal = di > 0;
  const isInverted = magnification < 0;
  const imageScale = Math.abs(magnification) > 1 ? 'Magnified' : Math.abs(magnification) < 1 ? 'Diminished' : 'Same Size';

  return {
    primaryValue: Math.round(di * 1e4) / 1e4,
    primaryUnit: unit,
    formattedResult: `${di.toFixed(2)} ${unit}`,
    formulaUsed: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}, \\quad m = -\\frac{d_i}{d_o}',
    substitutionSteps: [
      `Focal length f = ${f} ${unit} (${f > 0 ? 'Convex / Converging' : 'Concave / Diverging'})`,
      `Object distance do = ${doDist} ${unit}`,
      `Image distance di = (${f} × ${doDist}) / (${doDist} - (${f})) = ${di.toFixed(2)} ${unit}`,
      `Magnification m = -(${di.toFixed(2)}) / ${doDist} = ${magnification.toFixed(3)}`,
    ],
    assumptions: ['Thin lens paraxial approximation.'],
    secondaryValues: [
      { label: 'Magnification (m)', value: `${magnification.toFixed(3)}x` },
      { label: 'Image Type', value: isReal ? 'Real (Projectable)' : 'Virtual' },
      { label: 'Orientation', value: isInverted ? 'Inverted (Upside down)' : 'Upright' },
      { label: 'Image Scale', value: imageScale },
    ],
  };
}

// 53. Mirror Calculator
export function calculateMirror(
  mirrorType: 'concave' | 'convex' | 'plane',
  focalLength: number | '',
  objectDistance: number | '',
  unit = 'cm'
): PhysicsCalculationResult | null {
  if (mirrorType === 'plane') {
    if (typeof objectDistance !== 'number' || isNaN(objectDistance) || objectDistance <= 0) return null;
    return {
      primaryValue: -objectDistance,
      primaryUnit: unit,
      formattedResult: `${-objectDistance} ${unit} (Virtual)`,
      formulaUsed: 'd_i = -d_o, \\quad m = +1',
      substitutionSteps: [
        `Plane mirror forms virtual, upright image at equal distance behind the mirror surface.`,
      ],
      assumptions: ['Flat specular reflection.'],
      secondaryValues: [
        { label: 'Magnification (m)', value: '+1.000x' },
        { label: 'Image Type', value: 'Virtual & Upright' },
      ],
    };
  }

  if (typeof focalLength !== 'number' || typeof objectDistance !== 'number' || isNaN(focalLength) || isNaN(objectDistance) || focalLength <= 0 || objectDistance <= 0) {
    return null;
  }

  const f = mirrorType === 'concave' ? focalLength : -focalLength;
  const doDist = objectDistance;

  if (Math.abs(doDist - f) < 1e-6) {
    return {
      primaryValue: Infinity,
      primaryUnit: unit,
      formattedResult: 'Image at Infinity',
      formulaUsed: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
      substitutionSteps: ['Object placed at focal point; reflected rays are parallel.'],
      assumptions: ['Spherical paraxial mirror approximation.'],
    };
  }

  const di = (f * doDist) / (doDist - f);
  const magnification = -di / doDist;

  return {
    primaryValue: Math.round(di * 1e4) / 1e4,
    primaryUnit: unit,
    formattedResult: `${di.toFixed(2)} ${unit}`,
    formulaUsed: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}, \\quad m = -\\frac{d_i}{d_o}',
    substitutionSteps: [
      `Mirror: ${mirrorType}, f = ${f} ${unit}, do = ${doDist} ${unit}`,
      `di = (${f} × ${doDist}) / (${doDist} - (${f})) = ${di.toFixed(2)} ${unit}`,
      `Magnification m = -(${di.toFixed(2)}) / ${doDist} = ${magnification.toFixed(3)}`,
    ],
    assumptions: ['Spherical mirror paraxial rays.'],
    secondaryValues: [
      { label: 'Magnification (m)', value: `${magnification.toFixed(3)}x` },
      { label: 'Image Type', value: di > 0 ? 'Real' : 'Virtual' },
      { label: 'Orientation', value: magnification < 0 ? 'Inverted' : 'Upright' },
    ],
  };
}

// 54. Magnification Calculator
export function calculateMagnification(
  mode: 'heights' | 'distances',
  heightObj: number | '',
  heightImg: number | '',
  distObj: number | '',
  distImg: number | '',
  unit = 'cm'
): PhysicsCalculationResult | null {
  if (mode === 'heights') {
    if (typeof heightObj !== 'number' || typeof heightImg !== 'number' || isNaN(heightObj) || isNaN(heightImg) || heightObj === 0) return null;
    const m = heightImg / heightObj;
    return {
      primaryValue: Math.round(m * 1e4) / 1e4,
      primaryUnit: 'x',
      formattedResult: `${m.toFixed(3)}x`,
      formulaUsed: 'm = \\frac{h_i}{h_o}',
      substitutionSteps: [
        `Image Height h_i = ${heightImg} ${unit}, Object Height h_o = ${heightObj} ${unit}`,
        `Magnification m = ${heightImg} / ${heightObj} = ${m.toFixed(3)}`,
      ],
      assumptions: ['Linear transverse optical magnification.'],
      secondaryValues: [
        { label: 'Image Scale', value: Math.abs(m) > 1 ? 'Magnified (Enlarged)' : Math.abs(m) < 1 ? 'Diminished (Reduced)' : 'Same Size' },
        { label: 'Orientation', value: m < 0 ? 'Inverted' : 'Upright' },
      ],
    };
  } else {
    if (typeof distObj !== 'number' || typeof distImg !== 'number' || isNaN(distObj) || isNaN(distImg) || distObj === 0) return null;
    const m = -distImg / distObj;
    return {
      primaryValue: Math.round(m * 1e4) / 1e4,
      primaryUnit: 'x',
      formattedResult: `${m.toFixed(3)}x`,
      formulaUsed: 'm = -\\frac{d_i}{d_o}',
      substitutionSteps: [
        `Image Distance d_i = ${distImg} ${unit}, Object Distance d_o = ${distObj} ${unit}`,
        `Magnification m = -(${distImg}) / ${distObj} = ${m.toFixed(3)}`,
      ],
      assumptions: ['Standard Cartesian optical sign convention.'],
      secondaryValues: [
        { label: 'Magnitude', value: `${Math.abs(m).toFixed(3)}x` },
        { label: 'Orientation', value: m < 0 ? 'Inverted' : 'Upright' },
      ],
    };
  }
}

// 55. Doppler Effect Calculator
export function calculateDopplerEffect(
  emittedFreqHz: number | '',
  waveSpeed: number | '',
  observerSpeed: number | '',
  sourceSpeed: number | '',
  observerDirection: 'towards' | 'away' | 'stationary',
  sourceDirection: 'towards' | 'away' | 'stationary',
  speedUnit = 'm/s'
): PhysicsCalculationResult | null {
  if (
    typeof emittedFreqHz !== 'number' ||
    typeof waveSpeed !== 'number' ||
    isNaN(emittedFreqHz) ||
    isNaN(waveSpeed) ||
    emittedFreqHz <= 0 ||
    waveSpeed <= 0
  ) {
    return null;
  }

  const vWave = convertUnitValue(waveSpeed, speedUnit, 'm/s');
  const vObs = observerDirection === 'stationary' ? 0 : typeof observerSpeed === 'number' && !isNaN(observerSpeed) ? convertUnitValue(observerSpeed, speedUnit, 'm/s') : 0;
  const vSrc = sourceDirection === 'stationary' ? 0 : typeof sourceSpeed === 'number' && !isNaN(sourceSpeed) ? convertUnitValue(sourceSpeed, speedUnit, 'm/s') : 0;

  // Numerator: v + v_o (towards) or v - v_o (away)
  const numSign = observerDirection === 'towards' ? 1 : observerDirection === 'away' ? -1 : 0;
  const num = vWave + numSign * vObs;

  // Denominator: v - v_s (towards) or v + v_s (away)
  const denSign = sourceDirection === 'towards' ? -1 : sourceDirection === 'away' ? 1 : 0;
  const den = vWave + denSign * vSrc;

  if (den <= 0) {
    return {
      primaryValue: Infinity,
      primaryUnit: 'Hz',
      formattedResult: 'Sonic Boom / Shockwave (Source speed ≥ Wave speed)',
      formulaUsed: "f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",
      substitutionSteps: ['Source is moving at or above the medium wave speed, forming a Mach shock wave.'],
      assumptions: ['Classical Doppler shift in stationary fluid medium.'],
      warning: 'Mach speed reached: shock wave singularity.',
    };
  }

  const observedFreq = emittedFreqHz * (num / den);
  const freqShift = observedFreq - emittedFreqHz;

  return {
    primaryValue: Math.round(observedFreq * 100) / 100,
    primaryUnit: 'Hz',
    formattedResult: `${observedFreq.toFixed(2)} Hz`,
    formulaUsed: "f' = f \\times \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",
    substitutionSteps: [
      `Source frequency f = ${emittedFreqHz} Hz, Wave speed v = ${vWave.toFixed(1)} m/s`,
      `Observer: ${observerDirection} at ${vObs.toFixed(1)} m/s`,
      `Source: ${sourceDirection} at ${vSrc.toFixed(1)} m/s`,
      `f' = ${emittedFreqHz} × [(${vWave.toFixed(1)} ${numSign >= 0 ? '+' : '-'} ${vObs.toFixed(1)}) / (${vWave.toFixed(1)} ${denSign >= 0 ? '+' : '-'} ${vSrc.toFixed(1)})] = ${observedFreq.toFixed(2)} Hz`,
    ],
    assumptions: ['Observer and source move along the collinear line of sight in a stationary acoustic medium.'],
    secondaryValues: [
      { label: 'Frequency Shift (Δf)', value: `${freqShift >= 0 ? '+' : ''}${freqShift.toFixed(2)} Hz` },
      { label: 'Shift Direction', value: freqShift > 0 ? 'Blue shift (Higher Pitch)' : freqShift < 0 ? 'Red shift (Lower Pitch)' : 'No Shift' },
    ],
  };
}

// =========================================================================
// PHASE 2 DIRECT HELPER EXPORTS
// =========================================================================

// Impulse: J = F * Δt = Δp
export function calculateImpulse(
  force: number | '',
  time: number | '',
  forceUnit = 'N',
  timeUnit = 's'
): PhysicsCalculationResult | null {
  if (typeof force !== 'number' || typeof time !== 'number' || isNaN(force) || isNaN(time) || time < 0) {
    return null;
  }
  const fSI = convertUnitValue(force, forceUnit, 'N');
  const tSI = convertUnitValue(time, timeUnit, 's');
  const jSI = fSI * tSI;

  return {
    primaryValue: Math.round(jSI * 1e4) / 1e4,
    primaryUnit: 'N·s',
    formattedResult: `${jSI.toFixed(3)} N·s`,
    formulaUsed: 'J = F \\times \\Delta t = \\Delta p',
    substitutionSteps: [
      `Force F = ${force} ${forceUnit} (${fSI.toFixed(3)} N)`,
      `Duration Δt = ${time} ${timeUnit} (${tSI.toFixed(3)} s)`,
      `Impulse J = ${fSI.toFixed(3)} N × ${tSI.toFixed(3)} s = ${jSI.toFixed(3)} N·s (kg·m/s)`,
    ],
    assumptions: ['Assumes constant average force over contact duration Δt.'],
    secondaryValues: [
      { label: 'Momentum Change (Δp)', value: `${jSI.toFixed(3)} kg·m/s` },
      { label: 'Contact Duration', value: `${(tSI * 1000).toFixed(1)} ms` },
    ],
  };
}

// Pendulum Period: T = 2π √(L/g)
export function calculatePendulumPeriod(
  length: number | '',
  gravity: number | '' = GRAVITY_EARTH,
  lengthUnit = 'm'
): PhysicsCalculationResult | null {
  return calculatePendulum(length, lengthUnit, gravity);
}

// Orbital Velocity: v = √(G*M / r)
export function calculateOrbitalVelocity(
  centralMass: number | '',
  orbitalRadius: number | '',
  massUnit = 'kg',
  radiusUnit = 'm'
): PhysicsCalculationResult | null {
  if (
    typeof centralMass !== 'number' ||
    typeof orbitalRadius !== 'number' ||
    isNaN(centralMass) ||
    isNaN(orbitalRadius) ||
    centralMass <= 0 ||
    orbitalRadius <= 0
  ) {
    return null;
  }
  const mSI = convertUnitValue(centralMass, massUnit, 'kg');
  const rSI = convertUnitValue(orbitalRadius, radiusUnit, 'm');
  const vSI = Math.sqrt((G_CONSTANT * mSI) / rSI);
  const periodSec = (2 * Math.PI * rSI) / vSI;

  return {
    primaryValue: Math.round(vSI * 100) / 100,
    primaryUnit: 'm/s',
    formattedResult: `${vSI.toFixed(2)} m/s`,
    formulaUsed: 'v_{orb} = \\sqrt{\\frac{G M}{r}}, \\quad T = 2\\pi \\sqrt{\\frac{r^3}{G M}}',
    substitutionSteps: [
      `Central Mass M = ${mSI.toExponential(4)} kg`,
      `Orbital Radius r = ${rSI.toExponential(4)} m`,
      `v = √[(6.6743e-11 × ${mSI.toExponential(3)}) / ${rSI.toExponential(3)}] = ${vSI.toFixed(2)} m/s (${(vSI / 1000).toFixed(2)} km/s)`,
    ],
    assumptions: ['Circular orbit around spherical mass.'],
    secondaryValues: [
      { label: 'Speed in km/s', value: `${(vSI / 1000).toFixed(2)} km/s` },
      { label: 'Speed in mph', value: `${(vSI * 2.23694).toFixed(1)} mph` },
      { label: 'Orbital Period (T)', value: `${(periodSec / 3600).toFixed(2)} hours (${(periodSec / 86400).toFixed(2)} days)` },
    ],
  };
}

// Capacitance of parallel plates
export function calculateCapacitance(
  plateArea: number | '',
  separationDist: number | '',
  relativePermittivity = 1,
  areaUnit = 'm2',
  distUnit = 'm'
): PhysicsCalculationResult | null {
  if (
    typeof plateArea !== 'number' ||
    typeof separationDist !== 'number' ||
    isNaN(plateArea) ||
    isNaN(separationDist) ||
    plateArea <= 0 ||
    separationDist <= 0
  ) {
    return null;
  }
  const aSI = convertUnitValue(plateArea, areaUnit, 'm2');
  const dSI = convertUnitValue(separationDist, distUnit, 'm');
  const er = typeof relativePermittivity === 'number' && !isNaN(relativePermittivity) && relativePermittivity >= 1 ? relativePermittivity : 1;
  const cFarads = (er * EPSILON_0 * aSI) / dSI;

  return {
    primaryValue: cFarads,
    primaryUnit: 'F',
    formattedResult: cFarads < 1e-6 ? `${(cFarads * 1e12).toFixed(2)} pF` : `${(cFarads * 1e6).toFixed(2)} µF`,
    formulaUsed: 'C = \\varepsilon_r \\varepsilon_0 \\frac{A}{d}',
    substitutionSteps: [
      `Plate Area A = ${aSI.toExponential(3)} m², Separation d = ${dSI.toExponential(3)} m`,
      `Relative Permittivity ε_r = ${er}, ε₀ = 8.854 × 10⁻¹² F/m`,
      `C = (${er} × 8.854e-12 × ${aSI.toExponential(3)}) / ${dSI.toExponential(3)} = ${cFarads.toExponential(4)} F`,
    ],
    assumptions: ['Uniform electric field between planar parallel conductors (edge fringing neglected).'],
    secondaryValues: [
      { label: 'Picofarads (pF)', value: `${(cFarads * 1e12).toFixed(2)} pF` },
      { label: 'Microfarads (µF)', value: `${(cFarads * 1e6).toFixed(4)} µF` },
    ],
  };
}

// Specific Heat Q = m * c * ΔT
export function calculateSpecificHeat(
  mass: number | '',
  specificHeatC: number | '',
  deltaT: number | '',
  massUnit = 'kg',
  energyUnit = 'J'
): PhysicsCalculationResult | null {
  if (
    typeof mass !== 'number' ||
    typeof specificHeatC !== 'number' ||
    typeof deltaT !== 'number' ||
    isNaN(mass) ||
    isNaN(specificHeatC) ||
    isNaN(deltaT) ||
    mass <= 0 ||
    specificHeatC <= 0
  ) {
    return null;
  }
  const mSI = convertUnitValue(mass, massUnit, 'kg');
  const qJoules = mSI * specificHeatC * deltaT;
  const qOut = convertUnitValue(qJoules, 'J', energyUnit);

  return {
    primaryValue: Math.round(qOut * 100) / 100,
    primaryUnit: energyUnit,
    formattedResult: `${(qJoules / 1000).toFixed(2)} kJ (${qJoules.toFixed(1)} J)`,
    formulaUsed: 'Q = m \\cdot c \\cdot \\Delta T',
    substitutionSteps: [
      `Mass m = ${mSI.toFixed(3)} kg, Specific heat capacity c = ${specificHeatC} J/(kg·K)`,
      `Temperature change ΔT = ${deltaT} K (°C)`,
      `Thermal energy Q = ${mSI.toFixed(3)} × ${specificHeatC} × ${deltaT} = ${qJoules.toFixed(1)} Joules`,
    ],
    assumptions: ['No phase change occurs during the temperature transition.'],
    secondaryValues: [
      { label: 'Energy in Kilojoules (kJ)', value: `${(qJoules / 1000).toFixed(3)} kJ` },
      { label: 'Energy in Kilocalories (kcal)', value: `${(qJoules / 4184).toFixed(2)} kcal` },
      { label: 'Energy in BTU', value: `${(qJoules / 1055.06).toFixed(2)} BTU` },
    ],
  };
}

// Heat Transfer by Conduction: Q/t = k * A * ΔT / Δx
export function calculateHeatTransferConduction(
  thermalConductivityK: number | '',
  area: number | '',
  deltaT: number | '',
  thickness: number | ''
): PhysicsCalculationResult | null {
  if (
    typeof thermalConductivityK !== 'number' ||
    typeof area !== 'number' ||
    typeof deltaT !== 'number' ||
    typeof thickness !== 'number' ||
    isNaN(thermalConductivityK) ||
    isNaN(area) ||
    isNaN(deltaT) ||
    isNaN(thickness) ||
    thermalConductivityK <= 0 ||
    area <= 0 ||
    thickness <= 0
  ) {
    return null;
  }
  const powerWatts = (thermalConductivityK * area * Math.abs(deltaT)) / thickness;

  return {
    primaryValue: Math.round(powerWatts * 100) / 100,
    primaryUnit: 'W',
    formattedResult: `${powerWatts.toFixed(2)} W (Joules/sec)`,
    formulaUsed: '\\frac{Q}{t} = k \\cdot A \\cdot \\frac{\\Delta T}{d}',
    substitutionSteps: [
      `Conductivity k = ${thermalConductivityK} W/(m·K), Area A = ${area} m²`,
      `Temperature difference ΔT = ${Math.abs(deltaT)} °C (K), Thickness d = ${thickness} m`,
      `Heat rate = (${thermalConductivityK} × ${area} × ${Math.abs(deltaT)}) / ${thickness} = ${powerWatts.toFixed(2)} W`,
    ],
    assumptions: ['Steady-state one-dimensional conductive heat flux through planar layer.'],
    secondaryValues: [
      { label: 'Heat Rate (kW)', value: `${(powerWatts / 1000).toFixed(3)} kW` },
      { label: 'Heat Rate (BTU/hr)', value: `${(powerWatts * 3.41214).toFixed(1)} BTU/hr` },
      { label: 'Thermal Resistance (R-value)', value: `${(thickness / thermalConductivityK).toFixed(3)} (m²·K)/W` },
    ],
  };
}

// Ideal Gas Law
export function calculateIdealGasLaw(
  targetVar: 'P' | 'V' | 'n' | 'T',
  p: number | '',
  v: number | '',
  n: number | '',
  t: number | ''
): PhysicsCalculationResult | null {
  const modeMap: Record<'P' | 'V' | 'n' | 'T', 'pressure' | 'volume' | 'moles' | 'temperature'> = {
    P: 'pressure',
    V: 'volume',
    n: 'moles',
    T: 'temperature',
  };
  return calculateIdealGas(modeMap[targetVar], p, v, n, t);
}

// Thin Lens
export function calculateThinLens(
  focalLength: number | '',
  objectDistance: number | '',
  unit = 'cm'
): PhysicsCalculationResult | null {
  return calculateLens(focalLength, objectDistance, unit);
}

// Photon Energy
export function calculatePhotonEnergy(
  mode: 'frequency' | 'wavelength',
  frequencyHz: number | '',
  wavelengthMeters: number | ''
): PhysicsCalculationResult | null {
  const hPlanck = 6.62607015e-34; // J·s
  let fSI = 0;

  if (mode === 'wavelength') {
    if (typeof wavelengthMeters !== 'number' || isNaN(wavelengthMeters) || wavelengthMeters <= 0) return null;
    fSI = SPEED_OF_LIGHT / wavelengthMeters;
  } else {
    if (typeof frequencyHz !== 'number' || isNaN(frequencyHz) || frequencyHz <= 0) return null;
    fSI = frequencyHz;
  }

  const eJoules = hPlanck * fSI;
  const eEV = eJoules / 1.602176634e-19;

  return {
    primaryValue: eJoules,
    primaryUnit: 'J',
    formattedResult: `${eEV.toFixed(3)} eV (${eJoules.toExponential(3)} J)`,
    formulaUsed: 'E = h f = \\frac{h c}{\\lambda}',
    substitutionSteps: [
      `Frequency f = ${fSI.toExponential(3)} Hz, Planck constant h = 6.626 × 10⁻³⁴ J·s`,
      `Photon energy E = 6.626e-34 × ${fSI.toExponential(3)} = ${eJoules.toExponential(3)} Joules`,
      `In electron-volts: E = ${eEV.toFixed(3)} eV`,
    ],
    assumptions: ['Single photon in vacuum.'],
    secondaryValues: [
      { label: 'Energy in Electron-Volts (eV)', value: `${eEV.toFixed(3)} eV` },
      { label: 'Energy in Joules (J)', value: `${eJoules.toExponential(4)} J` },
      { label: 'Photon Frequency', value: `${(fSI / 1e12).toFixed(2)} THz` },
    ],
  };
}

// De Broglie Wavelength: λ = h / (m * v)
export function calculateDeBroglieWavelength(
  mass: number | '',
  velocity: number | ''
): PhysicsCalculationResult | null {
  if (typeof mass !== 'number' || typeof velocity !== 'number' || isNaN(mass) || isNaN(velocity) || mass <= 0 || velocity <= 0) {
    return null;
  }
  const hPlanck = 6.62607015e-34;
  const p = mass * velocity;
  const lambda = hPlanck / p;

  return {
    primaryValue: lambda,
    primaryUnit: 'm',
    formattedResult: lambda < 1e-9 ? `${(lambda * 1e12).toFixed(3)} pm (${(lambda * 1e9).toFixed(3)} nm)` : `${lambda.toExponential(3)} m`,
    formulaUsed: '\\lambda = \\frac{h}{p} = \\frac{h}{m v}',
    substitutionSteps: [
      `Mass m = ${mass.toExponential(3)} kg, Velocity v = ${velocity.toFixed(2)} m/s`,
      `Linear momentum p = ${p.toExponential(3)} kg·m/s`,
      `Wavelength λ = 6.626e-34 / ${p.toExponential(3)} = ${lambda.toExponential(4)} m`,
    ],
    assumptions: ['Non-relativistic quantum matter wave.'],
    secondaryValues: [
      { label: 'Wavelength in Nanometers (nm)', value: `${(lambda * 1e9).toFixed(4)} nm` },
      { label: 'Wavelength in Picometers (pm)', value: `${(lambda * 1e12).toFixed(3)} pm` },
      { label: 'Momentum (p)', value: `${p.toExponential(3)} kg·m/s` },
    ],
  };
}

// Half-Life Decay: N(t) = N0 * (1/2)^(t / t1/2)
export function calculateHalfLifeDecay(
  initialQuantity: number | '',
  halfLife: number | '',
  elapsedTime: number | ''
): PhysicsCalculationResult | null {
  if (
    typeof initialQuantity !== 'number' ||
    typeof halfLife !== 'number' ||
    typeof elapsedTime !== 'number' ||
    isNaN(initialQuantity) ||
    isNaN(halfLife) ||
    isNaN(elapsedTime) ||
    initialQuantity <= 0 ||
    halfLife <= 0 ||
    elapsedTime < 0
  ) {
    return null;
  }

  const numHalfLives = elapsedTime / halfLife;
  const remaining = initialQuantity * Math.pow(0.5, numHalfLives);
  const decayed = initialQuantity - remaining;
  const fractionRemaining = (remaining / initialQuantity) * 100;
  const decayConstantLambda = Math.LN2 / halfLife;

  return {
    primaryValue: Math.round(remaining * 1e4) / 1e4,
    primaryUnit: 'units',
    formattedResult: `${remaining.toFixed(3)} remaining (${fractionRemaining.toFixed(1)}%)`,
    formulaUsed: 'N(t) = N_0 \\left(\\frac{1}{2}\\right)^{\\frac{t}{t_{1/2}}} = N_0 e^{-\\lambda t}',
    substitutionSteps: [
      `Initial quantity N₀ = ${initialQuantity}, Half-life t₁/₂ = ${halfLife}`,
      `Elapsed time t = ${elapsedTime} (${numHalfLives.toFixed(2)} half-lives)`,
      `Remaining N(t) = ${initialQuantity} × 0.5^(${numHalfLives.toFixed(2)}) = ${remaining.toFixed(3)}`,
      `Decayed amount = ${decayed.toFixed(3)} (${(100 - fractionRemaining).toFixed(1)}%)`,
    ],
    assumptions: ['Exponential radioactive or first-order kinetic decay.'],
    secondaryValues: [
      { label: 'Decayed Amount', value: `${decayed.toFixed(3)} (${(100 - fractionRemaining).toFixed(1)}%)` },
      { label: 'Half-Lives Elapsed', value: `${numHalfLives.toFixed(2)}` },
      { label: 'Decay Constant (λ)', value: `${decayConstantLambda.toExponential(3)} s⁻¹` },
    ],
  };
}

// Bernoulli Equation: P2 = P1 + 0.5*ρ*(v1² - v2²) + ρ*g*(h1 - h2)
export function calculateBernoulliPressure(
  p1: number | '',
  v1: number | '',
  h1: number | '',
  v2: number | '',
  h2: number | '',
  fluidDensity: number | '' = 1000
): PhysicsCalculationResult | null {
  if (
    typeof p1 !== 'number' ||
    typeof v1 !== 'number' ||
    typeof v2 !== 'number' ||
    isNaN(p1) ||
    isNaN(v1) ||
    isNaN(v2)
  ) {
    return null;
  }
  const rho = typeof fluidDensity === 'number' && !isNaN(fluidDensity) && fluidDensity > 0 ? fluidDensity : 1000;
  const height1 = typeof h1 === 'number' && !isNaN(h1) ? h1 : 0;
  const height2 = typeof h2 === 'number' && !isNaN(h2) ? h2 : 0;

  const dynamicDiff = 0.5 * rho * (v1 * v1 - v2 * v2);
  const staticDiff = rho * GRAVITY_EARTH * (height1 - height2);
  const p2 = p1 + dynamicDiff + staticDiff;

  return {
    primaryValue: Math.round(p2 * 100) / 100,
    primaryUnit: 'Pa',
    formattedResult: `${p2.toFixed(1)} Pa (${(p2 / 1000).toFixed(2)} kPa)`,
    formulaUsed: 'P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2',
    substitutionSteps: [
      `P₁ = ${p1} Pa, v₁ = ${v1} m/s, v₂ = ${v2} m/s, ρ = ${rho} kg/m³`,
      `Dynamic pressure change = 0.5 × ${rho} × (${v1}² - ${v2}²) = ${dynamicDiff.toFixed(1)} Pa`,
      `P₂ = ${p1} + ${dynamicDiff.toFixed(1)} + ${staticDiff.toFixed(1)} = ${p2.toFixed(1)} Pa`,
    ],
    assumptions: ['Incompressible, non-viscous (inviscid) fluid in laminar streamline flow.'],
    secondaryValues: [
      { label: 'Pressure in kPa', value: `${(p2 / 1000).toFixed(2)} kPa` },
      { label: 'Pressure in bar', value: `${(p2 / 100000).toFixed(3)} bar` },
      { label: 'Pressure in psi', value: `${(p2 * 0.000145038).toFixed(2)} psi` },
    ],
  };
}

// Buoyancy / Archimedes Principle: F_b = ρ * g * V
export function calculateBuoyancyArchimedes(
  fluidDensity: number | '',
  submergedVolume: number | '',
  gravity: number | '' = GRAVITY_EARTH
): PhysicsCalculationResult | null {
  if (
    typeof fluidDensity !== 'number' ||
    typeof submergedVolume !== 'number' ||
    isNaN(fluidDensity) ||
    isNaN(submergedVolume) ||
    fluidDensity <= 0 ||
    submergedVolume <= 0
  ) {
    return null;
  }
  const g = typeof gravity === 'number' && !isNaN(gravity) && gravity > 0 ? gravity : GRAVITY_EARTH;
  const fBuoyant = fluidDensity * g * submergedVolume;
  const displacedMass = fluidDensity * submergedVolume;

  return {
    primaryValue: Math.round(fBuoyant * 100) / 100,
    primaryUnit: 'N',
    formattedResult: `${fBuoyant.toFixed(2)} N (${(fBuoyant / 9.80665).toFixed(2)} kgf)`,
    formulaUsed: 'F_b = \\rho_{fluid} \\cdot g \\cdot V_{displaced}',
    substitutionSteps: [
      `Fluid Density ρ = ${fluidDensity} kg/m³, Submerged Volume V = ${submergedVolume} m³`,
      `Displaced fluid mass = ${fluidDensity} × ${submergedVolume} = ${displacedMass.toFixed(2)} kg`,
      `Buoyant Force F_b = ${fluidDensity} × ${g.toFixed(3)} × ${submergedVolume} = ${fBuoyant.toFixed(2)} N`,
    ],
    assumptions: ['Static fluid equilibrium, complete/partial submersion.'],
    secondaryValues: [
      { label: 'Displaced Fluid Mass', value: `${displacedMass.toFixed(2)} kg` },
      { label: 'Buoyancy in lbf', value: `${(fBuoyant * 0.224809).toFixed(2)} lbf` },
    ],
  };
}

// Stress, Strain, and Young's Modulus: σ = F/A, ε = ΔL/L0, E = σ/ε
export function calculateStressStrain(
  appliedForce: number | '',
  crossSectionalArea: number | '',
  initialLength: number | '',
  deltaLength: number | ''
): PhysicsCalculationResult | null {
  if (
    typeof appliedForce !== 'number' ||
    typeof crossSectionalArea !== 'number' ||
    typeof initialLength !== 'number' ||
    typeof deltaLength !== 'number' ||
    isNaN(appliedForce) ||
    isNaN(crossSectionalArea) ||
    isNaN(initialLength) ||
    isNaN(deltaLength) ||
    appliedForce <= 0 ||
    crossSectionalArea <= 0 ||
    initialLength <= 0 ||
    deltaLength <= 0
  ) {
    return null;
  }

  const stressPa = appliedForce / crossSectionalArea;
  const strain = deltaLength / initialLength;
  const youngsModulusPa = stressPa / strain;

  return {
    primaryValue: Math.round((stressPa / 1e6) * 100) / 100,
    primaryUnit: 'MPa',
    formattedResult: `${(stressPa / 1e6).toFixed(2)} MPa (Stress)`,
    formulaUsed: '\\sigma = \\frac{F}{A}, \\quad \\varepsilon = \\frac{\\Delta L}{L_0}, \\quad E = \\frac{\\sigma}{\\varepsilon}',
    substitutionSteps: [
      `Force F = ${appliedForce} N, Cross-section A = ${crossSectionalArea} m²`,
      `Tensile Stress σ = ${appliedForce} / ${crossSectionalArea} = ${stressPa.toExponential(3)} Pa (${(stressPa / 1e6).toFixed(2)} MPa)`,
      `Tensile Strain ε = ${deltaLength} / ${initialLength} = ${strain.toExponential(3)} (${(strain * 100).toFixed(3)}%)`,
      `Young's Modulus E = ${(stressPa / 1e6).toFixed(2)} MPa / ${strain.toFixed(4)} = ${(youngsModulusPa / 1e9).toFixed(2)} GPa`,
    ],
    assumptions: ['Linear elastic deformation obeying Hooke’s law (below yield point).'],
    secondaryValues: [
      { label: 'Stress (σ)', value: `${(stressPa / 1e6).toFixed(2)} MPa` },
      { label: 'Strain (ε)', value: `${(strain * 100).toFixed(3)}%` },
      { label: "Young's Modulus (E)", value: `${(youngsModulusPa / 1e9).toFixed(2)} GPa` },
    ],
  };
}

