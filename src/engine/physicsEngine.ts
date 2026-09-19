import { convertUnitValue } from './unitEngine';

export interface PhysicsCalculationResult {
  primaryValue: number;
  primaryUnit: string;
  formattedResult: string;
  formulaUsed: string;
  substitutionSteps: string[];
  assumptions: string[];
  secondaryValues?: { label: string; value: string }[];
  warning?: string;
  trajectoryPoints?: { x: number; y: number; t: number }[];
  timeBreakdown?: { t: number; v: number; s: number }[];
}

// 1. Force: F = m * a
export function calculateForce(
  mode: 'force' | 'mass' | 'accel',
  mass: number | '',
  accel: number | '',
  force: number | '',
  massUnit = 'kg',
  accelUnit = 'm/s2',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (mode === 'force') {
    if (typeof mass !== 'number' || typeof accel !== 'number') return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const aSI = convertUnitValue(accel, accelUnit, 'm/s2');
    const fSI = mSI * aSI;
    const fOut = convertUnitValue(fSI, 'N', forceUnit);
    return {
      primaryValue: fOut,
      primaryUnit: forceUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${forceUnit}`,
      formulaUsed: 'F = m × a',
      substitutionSteps: [
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Acceleration a = ${accel} ${accelUnit} (${aSI.toFixed(4)} m/s²)`,
        `Force F = ${mSI.toFixed(4)} kg × ${aSI.toFixed(4)} m/s² = ${fSI.toFixed(4)} N`,
      ],
      assumptions: ['Assumes constant mass (Newtonian classical mechanics).', 'Assumes net unbalanced force in 1 dimension.'],
      secondaryValues: [
        { label: 'Force in Newtons (N)', value: `${fSI.toFixed(4)} N` },
        { label: 'Force in Pound-force (lbf)', value: `${convertUnitValue(fSI, 'N', 'lbf').toFixed(4)} lbf` },
      ],
    };
  } else if (mode === 'mass') {
    if (typeof force !== 'number' || typeof accel !== 'number' || accel === 0) return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const aSI = convertUnitValue(accel, accelUnit, 'm/s2');
    const mSI = fSI / aSI;
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = F / a',
      substitutionSteps: [
        `Force F = ${force} ${forceUnit} (${fSI.toFixed(4)} N)`,
        `Acceleration a = ${accel} ${accelUnit} (${aSI.toFixed(4)} m/s²)`,
        `Mass m = ${fSI.toFixed(4)} N / ${aSI.toFixed(4)} m/s² = ${mSI.toFixed(4)} kg`,
      ],
      assumptions: ['Acceleration must be non-zero.'],
      secondaryValues: [{ label: 'Mass in kg', value: `${mSI.toFixed(4)} kg` }],
    };
  } else {
    if (typeof force !== 'number' || typeof mass !== 'number' || mass === 0) return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const aSI = fSI / mSI;
    const aOut = convertUnitValue(aSI, 'm/s2', accelUnit);
    return {
      primaryValue: aOut,
      primaryUnit: accelUnit,
      formattedResult: `${aOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${accelUnit}`,
      formulaUsed: 'a = F / m',
      substitutionSteps: [
        `Force F = ${force} ${forceUnit} (${fSI.toFixed(4)} N)`,
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Acceleration a = ${fSI.toFixed(4)} N / ${mSI.toFixed(4)} kg = ${aSI.toFixed(4)} m/s²`,
      ],
      assumptions: ['Mass must be strictly positive non-zero.'],
      secondaryValues: [{ label: 'Acceleration in m/s²', value: `${aSI.toFixed(4)} m/s²` }],
    };
  }
}

// 2. Velocity: v = d / t (Displacement / Time)
export function calculateVelocity(
  mode: 'velocity' | 'distance' | 'time',
  dist: number | '',
  time: number | '',
  vel: number | '',
  distUnit = 'm',
  timeUnit = 's',
  velUnit = 'm/s'
): PhysicsCalculationResult | null {
  if (mode === 'velocity') {
    if (typeof dist !== 'number' || typeof time !== 'number' || time <= 0) return null;
    const dSI = convertUnitValue(dist, distUnit, 'm');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const vSI = dSI / tSI;
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = Δx / Δt',
      substitutionSteps: [
        `Displacement Δx = ${dist} ${distUnit} (${dSI.toFixed(4)} m)`,
        `Elapsed Time Δt = ${time} ${timeUnit} (${tSI.toFixed(4)} s)`,
        `Velocity v = ${dSI.toFixed(4)} m / ${tSI.toFixed(4)} s = ${vSI.toFixed(4)} m/s`,
      ],
      assumptions: ['Velocity is a vector representing rate of change of displacement.'],
      secondaryValues: [
        { label: 'In km/h', value: `${convertUnitValue(vSI, 'm/s', 'km/h').toFixed(2)} km/h` },
        { label: 'In mph', value: `${convertUnitValue(vSI, 'm/s', 'mph').toFixed(2)} mph` },
      ],
    };
  } else if (mode === 'distance') {
    if (typeof vel !== 'number' || typeof time !== 'number' || time < 0) return null;
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const dSI = vSI * tSI;
    const dOut = convertUnitValue(dSI, 'm', distUnit);
    return {
      primaryValue: dOut,
      primaryUnit: distUnit,
      formattedResult: `${dOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${distUnit}`,
      formulaUsed: 'Δx = v × Δt',
      substitutionSteps: [`Velocity v = ${vSI.toFixed(4)} m/s`, `Time t = ${tSI.toFixed(4)} s`, `Δx = ${dSI.toFixed(4)} m`],
      assumptions: ['Constant uniform velocity over time.'],
    };
  } else {
    if (typeof dist !== 'number' || typeof vel !== 'number' || vel === 0) return null;
    const dSI = convertUnitValue(dist, distUnit, 'm');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const tSI = dSI / vSI;
    if (tSI < 0) return null;
    const tOut = convertUnitValue(tSI, 's', timeUnit);
    return {
      primaryValue: tOut,
      primaryUnit: timeUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${timeUnit}`,
      formulaUsed: 'Δt = Δx / v',
      substitutionSteps: [`Displacement Δx = ${dSI.toFixed(4)} m`, `Velocity v = ${vSI.toFixed(4)} m/s`, `Δt = ${tSI.toFixed(4)} s`],
      assumptions: ['Velocity must be non-zero.'],
    };
  }
}

// 3. Acceleration: a = (v2 - v1) / t
export function calculateAcceleration(
  mode: 'accel' | 'finalVel' | 'initialVel' | 'time',
  v1: number | '',
  v2: number | '',
  time: number | '',
  accel: number | '',
  velUnit = 'm/s',
  timeUnit = 's',
  accelUnit = 'm/s2'
): PhysicsCalculationResult | null {
  if (mode === 'accel') {
    if (typeof v1 !== 'number' || typeof v2 !== 'number' || typeof time !== 'number' || time <= 0) return null;
    const v1SI = convertUnitValue(v1, velUnit, 'm/s');
    const v2SI = convertUnitValue(v2, velUnit, 'm/s');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const aSI = (v2SI - v1SI) / tSI;
    const aOut = convertUnitValue(aSI, 'm/s2', accelUnit);
    return {
      primaryValue: aOut,
      primaryUnit: accelUnit,
      formattedResult: `${aOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${accelUnit}`,
      formulaUsed: 'a = (v₂ - v₁) / t',
      substitutionSteps: [
        `Initial Velocity v₁ = ${v1SI.toFixed(3)} m/s`,
        `Final Velocity v₂ = ${v2SI.toFixed(3)} m/s`,
        `Δv = ${(v2SI - v1SI).toFixed(3)} m/s`,
        `Elapsed Time t = ${tSI.toFixed(3)} s`,
        `Acceleration a = ${aSI.toFixed(4)} m/s²`,
      ],
      assumptions: ['Uniform constant acceleration.'],
      secondaryValues: [
        { label: 'In ft/s²', value: `${convertUnitValue(aSI, 'm/s2', 'ft/s2').toFixed(4)} ft/s²` },
        { label: 'In g-forces', value: `${(aSI / 9.80665).toFixed(3)} g` },
      ],
    };
  } else if (mode === 'finalVel') {
    if (typeof v1 !== 'number' || typeof accel !== 'number' || typeof time !== 'number' || time < 0) return null;
    const v1SI = convertUnitValue(v1, velUnit, 'm/s');
    const aSI = convertUnitValue(accel, accelUnit, 'm/s2');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const v2SI = v1SI + aSI * tSI;
    const v2Out = convertUnitValue(v2SI, 'm/s', velUnit);
    return {
      primaryValue: v2Out,
      primaryUnit: velUnit,
      formattedResult: `${v2Out.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v₂ = v₁ + a × t',
      substitutionSteps: [`v₁ = ${v1SI.toFixed(3)} m/s`, `a × t = ${(aSI * tSI).toFixed(3)} m/s`, `v₂ = ${v2SI.toFixed(4)} m/s`],
      assumptions: ['Uniform constant acceleration.'],
    };
  } else if (mode === 'initialVel') {
    if (typeof v2 !== 'number' || typeof accel !== 'number' || typeof time !== 'number' || time < 0) return null;
    const v2SI = convertUnitValue(v2, velUnit, 'm/s');
    const aSI = convertUnitValue(accel, accelUnit, 'm/s2');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const v1SI = v2SI - aSI * tSI;
    const v1Out = convertUnitValue(v1SI, 'm/s', velUnit);
    return {
      primaryValue: v1Out,
      primaryUnit: velUnit,
      formattedResult: `${v1Out.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v₁ = v₂ - a × t',
      substitutionSteps: [`v₂ = ${v2SI.toFixed(3)} m/s`, `v₁ = ${v1SI.toFixed(4)} m/s`],
      assumptions: ['Uniform constant acceleration.'],
    };
  } else {
    if (typeof v1 !== 'number' || typeof v2 !== 'number' || typeof accel !== 'number' || accel === 0) return null;
    const v1SI = convertUnitValue(v1, velUnit, 'm/s');
    const v2SI = convertUnitValue(v2, velUnit, 'm/s');
    const aSI = convertUnitValue(accel, accelUnit, 'm/s2');
    const tSI = (v2SI - v1SI) / aSI;
    if (tSI < 0) {
      return {
        primaryValue: 0,
        primaryUnit: timeUnit,
        formattedResult: 'Negative Time',
        formulaUsed: 't = (v₂ - v₁) / a',
        substitutionSteps: ['Acceleration direction opposes the velocity difference.'],
        assumptions: [],
        warning: 'The acceleration value produces a negative time. Verify the signs of acceleration and velocities.',
      };
    }
    const tOut = convertUnitValue(tSI, 's', timeUnit);
    return {
      primaryValue: tOut,
      primaryUnit: timeUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${timeUnit}`,
      formulaUsed: 't = (v₂ - v₁) / a',
      substitutionSteps: [`Δv = ${(v2SI - v1SI).toFixed(3)} m/s`, `a = ${aSI.toFixed(3)} m/s²`, `t = ${tSI.toFixed(4)} s`],
      assumptions: ['Acceleration must be non-zero.'],
    };
  }
}

// 4. Speed, Distance & Time: s = d / t (Scalar)
export function calculateSpeedDistanceTime(
  mode: 'speed' | 'distance' | 'time',
  speed: number | '',
  distance: number | '',
  time: number | '',
  speedUnit = 'm/s',
  distUnit = 'm',
  timeUnit = 's'
): PhysicsCalculationResult | null {
  if (mode === 'speed') {
    if (typeof distance !== 'number' || typeof time !== 'number' || time <= 0 || distance < 0) return null;
    const dSI = convertUnitValue(distance, distUnit, 'm');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const sSI = dSI / tSI;
    const sOut = convertUnitValue(sSI, 'm/s', speedUnit);
    return {
      primaryValue: sOut,
      primaryUnit: speedUnit,
      formattedResult: `${sOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${speedUnit}`,
      formulaUsed: 'Speed = Distance / Time',
      substitutionSteps: [
        `Distance d = ${distance} ${distUnit} (${dSI.toFixed(2)} m)`,
        `Time t = ${time} ${timeUnit} (${tSI.toFixed(2)} s)`,
        `Speed = ${dSI.toFixed(2)} m / ${tSI.toFixed(2)} s = ${sSI.toFixed(4)} m/s`,
      ],
      assumptions: ['Scalar speed without directional vector coordinates.'],
      secondaryValues: [
        { label: 'In km/h', value: `${convertUnitValue(sSI, 'm/s', 'km/h').toFixed(2)} km/h` },
        { label: 'In mph', value: `${convertUnitValue(sSI, 'm/s', 'mph').toFixed(2)} mph` },
      ],
    };
  } else if (mode === 'distance') {
    if (typeof speed !== 'number' || typeof time !== 'number' || speed < 0 || time < 0) return null;
    const sSI = convertUnitValue(speed, speedUnit, 'm/s');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const dSI = sSI * tSI;
    const dOut = convertUnitValue(dSI, 'm', distUnit);
    return {
      primaryValue: dOut,
      primaryUnit: distUnit,
      formattedResult: `${dOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${distUnit}`,
      formulaUsed: 'Distance = Speed × Time',
      substitutionSteps: [`Speed = ${sSI.toFixed(3)} m/s`, `Time = ${tSI.toFixed(2)} s`, `Distance = ${dSI.toFixed(3)} m`],
      assumptions: ['Constant average speed throughout trip.'],
    };
  } else {
    if (typeof distance !== 'number' || typeof speed !== 'number' || speed <= 0 || distance < 0) return null;
    const dSI = convertUnitValue(distance, distUnit, 'm');
    const sSI = convertUnitValue(speed, speedUnit, 'm/s');
    const tSI = dSI / sSI;
    const tOut = convertUnitValue(tSI, 's', timeUnit);
    return {
      primaryValue: tOut,
      primaryUnit: timeUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${timeUnit}`,
      formulaUsed: 'Time = Distance / Speed',
      substitutionSteps: [`Distance = ${dSI.toFixed(2)} m`, `Speed = ${sSI.toFixed(3)} m/s`, `Time = ${tSI.toFixed(3)} s`],
      assumptions: ['Speed must be strictly greater than 0.'],
    };
  }
}

// 5. Momentum: p = m * v
export function calculateMomentum(
  mode: 'momentum' | 'mass' | 'velocity',
  mass: number | '',
  vel: number | '',
  mom: number | '',
  massUnit = 'kg',
  velUnit = 'm/s'
): PhysicsCalculationResult | null {
  const momUnit = 'kg·m/s';
  if (mode === 'momentum') {
    if (typeof mass !== 'number' || typeof vel !== 'number' || mass < 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const pSI = mSI * vSI;
    return {
      primaryValue: pSI,
      primaryUnit: momUnit,
      formattedResult: `${pSI.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${momUnit}`,
      formulaUsed: 'p = m × v',
      substitutionSteps: [
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Velocity v = ${vel} ${velUnit} (${vSI.toFixed(4)} m/s)`,
        `Momentum p = ${mSI.toFixed(4)} kg × ${vSI.toFixed(4)} m/s = ${pSI.toFixed(4)} kg·m/s`,
      ],
      assumptions: ['Linear momentum in classical non-relativistic regime (v ≪ c).'],
      secondaryValues: [{ label: 'Equivalent Impulse', value: `${pSI.toFixed(4)} N·s` }],
    };
  } else if (mode === 'mass') {
    if (typeof mom !== 'number' || typeof vel !== 'number' || vel === 0) return null;
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const mSI = mom / vSI;
    if (mSI <= 0) return null;
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = p / v',
      substitutionSteps: [`Momentum p = ${mom.toFixed(4)} kg·m/s`, `Velocity v = ${vSI.toFixed(4)} m/s`, `Mass m = ${mSI.toFixed(4)} kg`],
      assumptions: ['Velocity must be non-zero.'],
    };
  } else {
    if (typeof mom !== 'number' || typeof mass !== 'number' || mass <= 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = mom / mSI;
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = p / m',
      substitutionSteps: [`Momentum p = ${mom.toFixed(4)} kg·m/s`, `Mass m = ${mSI.toFixed(4)} kg`, `Velocity v = ${vSI.toFixed(4)} m/s`],
      assumptions: ['Mass must be positive non-zero.'],
    };
  }
}

// 6. Kinetic Energy: KE = 0.5 * m * v^2
export function calculateKineticEnergy(
  mode: 'energy' | 'mass' | 'velocity',
  mass: number | '',
  vel: number | '',
  ke: number | '',
  massUnit = 'kg',
  velUnit = 'm/s',
  energyUnit = 'J'
): PhysicsCalculationResult | null {
  if (mode === 'energy') {
    if (typeof mass !== 'number' || typeof vel !== 'number' || mass < 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const keSI = 0.5 * mSI * vSI * vSI;
    const keOut = convertUnitValue(keSI, 'J', energyUnit);
    return {
      primaryValue: keOut,
      primaryUnit: energyUnit,
      formattedResult: `${keOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${energyUnit}`,
      formulaUsed: 'KE = ½ m v²',
      substitutionSteps: [
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Velocity v = ${vel} ${velUnit} (${vSI.toFixed(4)} m/s)`,
        `v² = ${(vSI * vSI).toFixed(4)} m²/s²`,
        `KE = 0.5 × ${mSI.toFixed(4)} × ${(vSI * vSI).toFixed(4)} = ${keSI.toFixed(4)} J`,
      ],
      assumptions: ['Kinetic energy is a scalar quantity, always non-negative.', 'Translational kinetic energy in classical mechanics.'],
      secondaryValues: [
        { label: 'In Joules (J)', value: `${keSI.toFixed(2)} J` },
        { label: 'In Kilojoules (kJ)', value: `${(keSI / 1000).toFixed(4)} kJ` },
        { label: 'In Calories (cal)', value: `${(keSI / 4.184).toFixed(2)} cal` },
      ],
    };
  } else if (mode === 'mass') {
    if (typeof ke !== 'number' || typeof vel !== 'number' || ke < 0 || vel === 0) return null;
    const keSI = convertUnitValue(ke, energyUnit, 'J');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const mSI = (2 * keSI) / (vSI * vSI);
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = 2·KE / v²',
      substitutionSteps: [`KE = ${keSI.toFixed(4)} J`, `v = ${vSI.toFixed(4)} m/s`, `m = (2 × ${keSI.toFixed(4)}) / ${(vSI * vSI).toFixed(4)} = ${mSI.toFixed(4)} kg`],
      assumptions: ['Velocity must be non-zero.'],
    };
  } else {
    if (typeof ke !== 'number' || typeof mass !== 'number' || ke < 0 || mass <= 0) return null;
    const keSI = convertUnitValue(ke, energyUnit, 'J');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = Math.sqrt((2 * keSI) / mSI);
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = √(2·KE / m)',
      substitutionSteps: [`KE = ${keSI.toFixed(4)} J`, `m = ${mSI.toFixed(4)} kg`, `v = √( (2 × ${keSI.toFixed(4)}) / ${mSI.toFixed(4)} ) = ${vSI.toFixed(4)} m/s`],
      assumptions: ['Calculates magnitude of velocity (speed).'],
    };
  }
}

// 7. Potential Energy: PE = m * g * h
export function calculatePotentialEnergy(
  mode: 'energy' | 'mass' | 'height' | 'gravity',
  mass: number | '',
  gravity: number | '',
  height: number | '',
  pe: number | '',
  massUnit = 'kg',
  heightUnit = 'm',
  energyUnit = 'J'
): PhysicsCalculationResult | null {
  if (mode === 'energy') {
    if (typeof mass !== 'number' || typeof gravity !== 'number' || typeof height !== 'number') return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const gSI = gravity; // m/s²
    const hSI = convertUnitValue(height, heightUnit, 'm');
    const peSI = mSI * gSI * hSI;
    const peOut = convertUnitValue(peSI, 'J', energyUnit);
    return {
      primaryValue: peOut,
      primaryUnit: energyUnit,
      formattedResult: `${peOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${energyUnit}`,
      formulaUsed: 'PE = m × g × h',
      substitutionSteps: [
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Acceleration g = ${gSI} m/s²`,
        `Height h = ${height} ${heightUnit} (${hSI.toFixed(4)} m)`,
        `PE = ${mSI.toFixed(4)} × ${gSI} × ${hSI.toFixed(4)} = ${peSI.toFixed(4)} J`,
      ],
      assumptions: ['Gravitational acceleration is uniform over height h (near Earth surface).'],
      secondaryValues: [
        { label: 'In Joules (J)', value: `${peSI.toFixed(2)} J` },
        { label: 'In Kilojoules (kJ)', value: `${(peSI / 1000).toFixed(4)} kJ` },
      ],
    };
  } else if (mode === 'height') {
    if (typeof pe !== 'number' || typeof mass !== 'number' || typeof gravity !== 'number' || mass === 0 || gravity === 0) return null;
    const peSI = convertUnitValue(pe, energyUnit, 'J');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const gSI = gravity;
    const hSI = peSI / (mSI * gSI);
    const hOut = convertUnitValue(hSI, 'm', heightUnit);
    return {
      primaryValue: hOut,
      primaryUnit: heightUnit,
      formattedResult: `${hOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${heightUnit}`,
      formulaUsed: 'h = PE / (m × g)',
      substitutionSteps: [`h = ${peSI.toFixed(4)} J / (${mSI.toFixed(4)} kg × ${gSI} m/s²) = ${hSI.toFixed(4)} m`],
      assumptions: ['Mass and gravity must be non-zero.'],
    };
  } else if (mode === 'mass') {
    if (typeof pe !== 'number' || typeof height !== 'number' || typeof gravity !== 'number' || height === 0 || gravity === 0) return null;
    const peSI = convertUnitValue(pe, energyUnit, 'J');
    const hSI = convertUnitValue(height, heightUnit, 'm');
    const gSI = gravity;
    const mSI = peSI / (gSI * hSI);
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = PE / (g × h)',
      substitutionSteps: [`m = ${peSI.toFixed(4)} J / (${gSI} m/s² × ${hSI.toFixed(4)} m) = ${mSI.toFixed(4)} kg`],
      assumptions: ['Height and gravity must be non-zero.'],
    };
  } else {
    if (typeof pe !== 'number' || typeof mass !== 'number' || typeof height !== 'number' || mass === 0 || height === 0) return null;
    const peSI = convertUnitValue(pe, energyUnit, 'J');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const hSI = convertUnitValue(height, heightUnit, 'm');
    const gSI = peSI / (mSI * hSI);
    return {
      primaryValue: gSI,
      primaryUnit: 'm/s²',
      formattedResult: `${gSI.toLocaleString(undefined, { maximumFractionDigits: 4 })} m/s²`,
      formulaUsed: 'g = PE / (m × h)',
      substitutionSteps: [`g = ${peSI.toFixed(4)} J / (${mSI.toFixed(4)} kg × ${hSI.toFixed(4)} m) = ${gSI.toFixed(4)} m/s²`],
      assumptions: ['Mass and height must be non-zero.'],
    };
  }
}

// 8. Work: W = F * d * cos(θ)
export function calculateWork(
  mode: 'work' | 'force' | 'distance' | 'angle',
  force: number | '',
  dist: number | '',
  angle: number | '',
  work: number | '',
  forceUnit = 'N',
  distUnit = 'm',
  angleUnit = 'deg',
  energyUnit = 'J'
): PhysicsCalculationResult | null {
  if (mode === 'work') {
    if (typeof force !== 'number' || typeof dist !== 'number' || typeof angle !== 'number') return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const dSI = convertUnitValue(dist, distUnit, 'm');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const cosTheta = Math.cos(thetaRad);
    const wSI = fSI * dSI * cosTheta;
    const wOut = convertUnitValue(wSI, 'J', energyUnit);
    return {
      primaryValue: wOut,
      primaryUnit: energyUnit,
      formattedResult: `${wOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${energyUnit}`,
      formulaUsed: 'W = F × d × cos(θ)',
      substitutionSteps: [
        `Force F = ${fSI.toFixed(4)} N`,
        `Displacement d = ${dSI.toFixed(4)} m`,
        `Angle θ = ${angle} ${angleUnit} (cos θ = ${cosTheta.toFixed(4)})`,
        `Work W = ${fSI.toFixed(4)} × ${dSI.toFixed(4)} × ${cosTheta.toFixed(4)} = ${wSI.toFixed(4)} J`,
      ],
      assumptions: ['Constant force vector along linear displacement.'],
      secondaryValues: [{ label: 'Work in kJ', value: `${(wSI / 1000).toFixed(4)} kJ` }],
    };
  } else if (mode === 'force') {
    if (typeof work !== 'number' || typeof dist !== 'number' || typeof angle !== 'number' || dist === 0) return null;
    const wSI = convertUnitValue(work, energyUnit, 'J');
    const dSI = convertUnitValue(dist, distUnit, 'm');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const cosTheta = Math.cos(thetaRad);
    if (Math.abs(cosTheta) < 1e-7) {
      return {
        primaryValue: 0,
        primaryUnit: forceUnit,
        formattedResult: 'Undefined (cos 90° = 0)',
        formulaUsed: 'F = W / (d × cos θ)',
        substitutionSteps: ['cos θ is 0 (perpendicular force does 0 work). Force cannot be computed.'],
        assumptions: [],
        warning: 'Perpendicular forces perform no work; solving for force is mathematically undefined at 90°.',
      };
    }
    const fSI = wSI / (dSI * cosTheta);
    const fOut = convertUnitValue(fSI, 'N', forceUnit);
    return {
      primaryValue: fOut,
      primaryUnit: forceUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${forceUnit}`,
      formulaUsed: 'F = W / (d × cos θ)',
      substitutionSteps: [`F = ${wSI.toFixed(4)} J / (${dSI.toFixed(4)} m × ${cosTheta.toFixed(4)}) = ${fSI.toFixed(4)} N`],
      assumptions: ['Displacement and cos(θ) must be non-zero.'],
    };
  } else if (mode === 'distance') {
    if (typeof work !== 'number' || typeof force !== 'number' || typeof angle !== 'number' || force === 0) return null;
    const wSI = convertUnitValue(work, energyUnit, 'J');
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const cosTheta = Math.cos(thetaRad);
    if (Math.abs(cosTheta) < 1e-7) return null;
    const dSI = wSI / (fSI * cosTheta);
    const dOut = convertUnitValue(dSI, 'm', distUnit);
    return {
      primaryValue: dOut,
      primaryUnit: distUnit,
      formattedResult: `${dOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${distUnit}`,
      formulaUsed: 'd = W / (F × cos θ)',
      substitutionSteps: [`d = ${wSI.toFixed(4)} J / (${fSI.toFixed(4)} N × ${cosTheta.toFixed(4)}) = ${dSI.toFixed(4)} m`],
      assumptions: ['Force and cos(θ) must be non-zero.'],
    };
  } else {
    if (typeof work !== 'number' || typeof force !== 'number' || typeof dist !== 'number' || force === 0 || dist === 0) return null;
    const wSI = convertUnitValue(work, energyUnit, 'J');
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const dSI = convertUnitValue(dist, distUnit, 'm');
    const cosVal = wSI / (fSI * dSI);
    if (cosVal < -1 || cosVal > 1) {
      return {
        primaryValue: 0,
        primaryUnit: angleUnit,
        formattedResult: 'No real angle',
        formulaUsed: 'cos θ = W / (F × d)',
        substitutionSteps: [`W / (F × d) = ${cosVal.toFixed(4)}, outside valid cosine range [-1, 1].`],
        assumptions: [],
        warning: 'Work cannot exceed maximum magnitude F × d. Check input parameters.',
      };
    }
    const thetaRad = Math.acos(cosVal);
    const thetaDeg = (thetaRad * 180) / Math.PI;
    const thetaOut = angleUnit === 'deg' ? thetaDeg : thetaRad;
    return {
      primaryValue: thetaOut,
      primaryUnit: angleUnit,
      formattedResult: `${thetaOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${angleUnit}`,
      formulaUsed: 'θ = arccos(W / (F × d))',
      substitutionSteps: [`cos θ = ${cosVal.toFixed(4)}`, `θ = ${thetaDeg.toFixed(2)}° (${thetaRad.toFixed(4)} rad)`],
      assumptions: ['Valid range for work magnitude |W| ≤ |F × d|.'],
    };
  }
}

// 9. Power: P = W / t
export function calculatePower(
  mode: 'power' | 'work' | 'time',
  work: number | '',
  time: number | '',
  power: number | '',
  workUnit = 'J',
  timeUnit = 's',
  powerUnit = 'W'
): PhysicsCalculationResult | null {
  if (mode === 'power') {
    if (typeof work !== 'number' || typeof time !== 'number' || time <= 0) return null;
    const wSI = convertUnitValue(work, workUnit, 'J');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const pSI = wSI / tSI;
    const pOut = convertUnitValue(pSI, 'W', powerUnit);
    return {
      primaryValue: pOut,
      primaryUnit: powerUnit,
      formattedResult: `${pOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${powerUnit}`,
      formulaUsed: 'P = W / t',
      substitutionSteps: [
        `Work W = ${work} ${workUnit} (${wSI.toFixed(4)} J)`,
        `Time t = ${time} ${timeUnit} (${tSI.toFixed(4)} s)`,
        `Power P = ${wSI.toFixed(4)} J / ${tSI.toFixed(4)} s = ${pSI.toFixed(4)} W`,
      ],
      assumptions: ['Rate of energy expenditure or mechanical work over elapsed duration.'],
      secondaryValues: [
        { label: 'In Kilowatts (kW)', value: `${(pSI / 1000).toFixed(4)} kW` },
        { label: 'In Horsepower (hp)', value: `${(pSI / 745.699872).toFixed(3)} hp` },
      ],
    };
  } else if (mode === 'work') {
    if (typeof power !== 'number' || typeof time !== 'number' || time < 0) return null;
    const pSI = convertUnitValue(power, powerUnit, 'W');
    const tSI = convertUnitValue(time, timeUnit, 's');
    const wSI = pSI * tSI;
    const wOut = convertUnitValue(wSI, 'J', workUnit);
    return {
      primaryValue: wOut,
      primaryUnit: workUnit,
      formattedResult: `${wOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${workUnit}`,
      formulaUsed: 'W = P × t',
      substitutionSteps: [`P = ${pSI.toFixed(4)} W`, `t = ${tSI.toFixed(4)} s`, `W = ${wSI.toFixed(4)} J`],
      assumptions: ['Constant uniform power output.'],
    };
  } else {
    if (typeof work !== 'number' || typeof power !== 'number' || power <= 0) return null;
    const wSI = convertUnitValue(work, workUnit, 'J');
    const pSI = convertUnitValue(power, powerUnit, 'W');
    const tSI = wSI / pSI;
    if (tSI < 0) return null;
    const tOut = convertUnitValue(tSI, 's', timeUnit);
    return {
      primaryValue: tOut,
      primaryUnit: timeUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${timeUnit}`,
      formulaUsed: 't = W / P',
      substitutionSteps: [`W = ${wSI.toFixed(4)} J`, `P = ${pSI.toFixed(4)} W`, `t = ${tSI.toFixed(4)} s`],
      assumptions: ['Power must be strictly positive.'],
    };
  }
}

// 10. Pressure: P = F / A
export function calculatePressure(
  mode: 'pressure' | 'force' | 'area',
  force: number | '',
  area: number | '',
  pressure: number | '',
  forceUnit = 'N',
  areaUnit = 'm2',
  pressureUnit = 'Pa'
): PhysicsCalculationResult | null {
  if (mode === 'pressure') {
    if (typeof force !== 'number' || typeof area !== 'number' || area <= 0) return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const aSI = convertUnitValue(area, areaUnit, 'm2');
    const pSI = fSI / aSI;
    const pOut = convertUnitValue(pSI, 'Pa', pressureUnit);
    return {
      primaryValue: pOut,
      primaryUnit: pressureUnit,
      formattedResult: `${pOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${pressureUnit}`,
      formulaUsed: 'P = F / A',
      substitutionSteps: [
        `Normal Force F = ${force} ${forceUnit} (${fSI.toFixed(4)} N)`,
        `Surface Area A = ${area} ${areaUnit} (${aSI.toFixed(6)} m²)`,
        `Pressure P = ${fSI.toFixed(4)} N / ${aSI.toFixed(6)} m² = ${pSI.toFixed(4)} Pa`,
      ],
      assumptions: ['Perpendicular force uniformly distributed across contact area.'],
      secondaryValues: [
        { label: 'In kPa', value: `${(pSI / 1000).toFixed(4)} kPa` },
        { label: 'In Bar', value: `${(pSI / 100000).toFixed(5)} bar` },
        { label: 'In PSI', value: `${convertUnitValue(pSI, 'Pa', 'psi').toFixed(3)} psi` },
        { label: 'In Standard Atmospheres (atm)', value: `${(pSI / 101325).toFixed(4)} atm` },
      ],
    };
  } else if (mode === 'force') {
    if (typeof pressure !== 'number' || typeof area !== 'number' || area <= 0) return null;
    const pSI = convertUnitValue(pressure, pressureUnit, 'Pa');
    const aSI = convertUnitValue(area, areaUnit, 'm2');
    const fSI = pSI * aSI;
    const fOut = convertUnitValue(fSI, 'N', forceUnit);
    return {
      primaryValue: fOut,
      primaryUnit: forceUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${forceUnit}`,
      formulaUsed: 'F = P × A',
      substitutionSteps: [`P = ${pSI.toFixed(4)} Pa`, `A = ${aSI.toFixed(6)} m²`, `F = ${fSI.toFixed(4)} N`],
      assumptions: ['Uniform pressure distribution.'],
    };
  } else {
    if (typeof force !== 'number' || typeof pressure !== 'number' || pressure <= 0) return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const pSI = convertUnitValue(pressure, pressureUnit, 'Pa');
    const aSI = fSI / pSI;
    const aOut = convertUnitValue(aSI, 'm2', areaUnit);
    return {
      primaryValue: aOut,
      primaryUnit: areaUnit,
      formattedResult: `${aOut.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${areaUnit}`,
      formulaUsed: 'A = F / P',
      substitutionSteps: [`F = ${fSI.toFixed(4)} N`, `P = ${pSI.toFixed(4)} Pa`, `A = ${aSI.toFixed(6)} m²`],
      assumptions: ['Pressure must be strictly positive.'],
    };
  }
}

// 11. Density: ρ = m / V
export function calculateDensity(
  mode: 'density' | 'mass' | 'volume',
  mass: number | '',
  volume: number | '',
  density: number | '',
  massUnit = 'kg',
  volUnit = 'm3',
  densityUnit = 'kg/m3'
): PhysicsCalculationResult | null {
  if (mode === 'density') {
    if (typeof mass !== 'number' || typeof volume !== 'number' || volume <= 0 || mass < 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vLiters = convertUnitValue(volume, volUnit, 'L');
    const vM3 = vLiters / 1000;
    const rhoSI = mSI / vM3;
    const rhoOut = convertUnitValue(rhoSI, 'kg/m3', densityUnit);
    return {
      primaryValue: rhoOut,
      primaryUnit: densityUnit,
      formattedResult: `${rhoOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${densityUnit}`,
      formulaUsed: 'ρ = m / V',
      substitutionSteps: [
        `Mass m = ${mass} ${massUnit} (${mSI.toFixed(4)} kg)`,
        `Volume V = ${volume} ${volUnit} (${vM3.toFixed(6)} m³)`,
        `Density ρ = ${mSI.toFixed(4)} kg / ${vM3.toFixed(6)} m³ = ${rhoSI.toFixed(4)} kg/m³`,
      ],
      assumptions: ['Homogeneous material composition with constant temperature and pressure.'],
      secondaryValues: [
        { label: 'In g/cm³', value: `${(rhoSI / 1000).toFixed(4)} g/cm³` },
        { label: 'In lb/ft³', value: `${convertUnitValue(rhoSI, 'kg/m3', 'lb/ft3').toFixed(3)} lb/ft³` },
        { label: 'Specific Gravity (relative to water)', value: `${(rhoSI / 1000).toFixed(4)}` },
      ],
    };
  } else if (mode === 'mass') {
    if (typeof density !== 'number' || typeof volume !== 'number' || density < 0 || volume < 0) return null;
    const rhoSI = convertUnitValue(density, densityUnit, 'kg/m3');
    const vLiters = convertUnitValue(volume, volUnit, 'L');
    const vM3 = vLiters / 1000;
    const mSI = rhoSI * vM3;
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = ρ × V',
      substitutionSteps: [`ρ = ${rhoSI.toFixed(4)} kg/m³`, `V = ${vM3.toFixed(6)} m³`, `m = ${mSI.toFixed(4)} kg`],
      assumptions: ['Homogeneous matter.'],
    };
  } else {
    if (typeof mass !== 'number' || typeof density !== 'number' || density <= 0 || mass < 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const rhoSI = convertUnitValue(density, densityUnit, 'kg/m3');
    const vM3 = mSI / rhoSI;
    const vLiters = vM3 * 1000;
    const vOut = convertUnitValue(vLiters, 'L', volUnit);
    return {
      primaryValue: vOut,
      primaryUnit: volUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${volUnit}`,
      formulaUsed: 'V = m / ρ',
      substitutionSteps: [`m = ${mSI.toFixed(4)} kg`, `ρ = ${rhoSI.toFixed(4)} kg/m³`, `V = ${vM3.toFixed(6)} m³`],
      assumptions: ['Density must be strictly positive.'],
    };
  }
}

// 12. Torque: τ = r * F * sin(θ)
export function calculateTorque(
  mode: 'torque' | 'force' | 'radius' | 'angle',
  force: number | '',
  radius: number | '',
  angle: number | '',
  torque: number | '',
  forceUnit = 'N',
  radiusUnit = 'm',
  angleUnit = 'deg',
  torqueUnit = 'N·m'
): PhysicsCalculationResult | null {
  if (mode === 'torque') {
    if (typeof force !== 'number' || typeof radius !== 'number' || typeof angle !== 'number') return null;
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const sinTheta = Math.sin(thetaRad);
    const tauSI = rSI * fSI * sinTheta;
    const tauOut = convertUnitValue(tauSI, 'N·m', torqueUnit);
    return {
      primaryValue: tauOut,
      primaryUnit: torqueUnit,
      formattedResult: `${tauOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${torqueUnit}`,
      formulaUsed: 'τ = r × F × sin(θ)',
      substitutionSteps: [
        `Lever Arm r = ${radius} ${radiusUnit} (${rSI.toFixed(4)} m)`,
        `Applied Force F = ${force} ${forceUnit} (${fSI.toFixed(4)} N)`,
        `Angle θ = ${angle} ${angleUnit} (sin θ = ${sinTheta.toFixed(4)})`,
        `Torque τ = ${rSI.toFixed(4)} × ${fSI.toFixed(4)} × ${sinTheta.toFixed(4)} = ${tauSI.toFixed(4)} N·m`,
      ],
      assumptions: ['Rotational axis perpendicular to plane formed by position vector r and force F.'],
      secondaryValues: [
        { label: 'In Foot-pounds (lbf·ft)', value: `${convertUnitValue(tauSI, 'N·m', 'lbf·ft').toFixed(4)} lbf·ft` },
        { label: 'In Inch-pounds (lbf·in)', value: `${convertUnitValue(tauSI, 'N·m', 'lbf·in').toFixed(4)} lbf·in` },
      ],
    };
  } else if (mode === 'force') {
    if (typeof torque !== 'number' || typeof radius !== 'number' || typeof angle !== 'number' || radius === 0) return null;
    const tauSI = convertUnitValue(torque, torqueUnit, 'N·m');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const sinTheta = Math.sin(thetaRad);
    if (Math.abs(sinTheta) < 1e-7) {
      return {
        primaryValue: 0,
        primaryUnit: forceUnit,
        formattedResult: 'Undefined (sin 0° = 0)',
        formulaUsed: 'F = τ / (r × sin θ)',
        substitutionSteps: ['Applied force parallel to lever arm generates zero rotational torque.'],
        assumptions: [],
        warning: 'Torque is zero when force is parallel to the lever arm (θ = 0° or 180°).',
      };
    }
    const fSI = tauSI / (rSI * sinTheta);
    const fOut = convertUnitValue(fSI, 'N', forceUnit);
    return {
      primaryValue: fOut,
      primaryUnit: forceUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${forceUnit}`,
      formulaUsed: 'F = τ / (r × sin θ)',
      substitutionSteps: [`F = ${tauSI.toFixed(4)} N·m / (${rSI.toFixed(4)} m × ${sinTheta.toFixed(4)}) = ${fSI.toFixed(4)} N`],
      assumptions: ['Radius and sin(θ) must be non-zero.'],
    };
  } else if (mode === 'radius') {
    if (typeof torque !== 'number' || typeof force !== 'number' || typeof angle !== 'number' || force === 0) return null;
    const tauSI = convertUnitValue(torque, torqueUnit, 'N·m');
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const thetaRad = angleUnit === 'deg' ? (angle * Math.PI) / 180 : angle;
    const sinTheta = Math.sin(thetaRad);
    if (Math.abs(sinTheta) < 1e-7) return null;
    const rSI = tauSI / (fSI * sinTheta);
    const rOut = convertUnitValue(rSI, 'm', radiusUnit);
    return {
      primaryValue: rOut,
      primaryUnit: radiusUnit,
      formattedResult: `${rOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${radiusUnit}`,
      formulaUsed: 'r = τ / (F × sin θ)',
      substitutionSteps: [`r = ${tauSI.toFixed(4)} N·m / (${fSI.toFixed(4)} N × ${sinTheta.toFixed(4)}) = ${rSI.toFixed(4)} m`],
      assumptions: ['Force and sin(θ) must be non-zero.'],
    };
  } else {
    if (typeof torque !== 'number' || typeof force !== 'number' || typeof radius !== 'number' || force === 0 || radius === 0) return null;
    const tauSI = convertUnitValue(torque, torqueUnit, 'N·m');
    const fSI = convertUnitValue(force, forceUnit, 'N');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const sinVal = tauSI / (rSI * fSI);
    if (sinVal < -1 || sinVal > 1) {
      return {
        primaryValue: 0,
        primaryUnit: angleUnit,
        formattedResult: 'No real angle',
        formulaUsed: 'sin θ = τ / (r × F)',
        substitutionSteps: [`Ratio ${sinVal.toFixed(4)} exceeds [-1, 1] range.`],
        assumptions: [],
        warning: 'Torque cannot physically exceed r × F.',
      };
    }
    const thetaRad = Math.asin(sinVal);
    const thetaDeg = (thetaRad * 180) / Math.PI;
    const thetaOut = angleUnit === 'deg' ? thetaDeg : thetaRad;
    return {
      primaryValue: thetaOut,
      primaryUnit: angleUnit,
      formattedResult: `${thetaOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${angleUnit}`,
      formulaUsed: 'θ = arcsin(τ / (r × F))',
      substitutionSteps: [`sin θ = ${sinVal.toFixed(4)}`, `θ = ${thetaDeg.toFixed(2)}°`],
      assumptions: ['Valid range |τ| ≤ |r × F|.'],
    };
  }
}

// 13. Free Fall: v = u + gt, s = ut + 0.5 g t^2, v^2 = u^2 + 2gs
export function calculateFreeFall(
  mode: 'velocityTime' | 'timeOfFall' | 'impactVelocity',
  initialVel: number | '',
  gravity: number | '',
  time: number | '',
  height: number | '',
  velUnit = 'm/s',
  distUnit = 'm',
  timeUnit = 's'
): PhysicsCalculationResult | null {
  const gSI = typeof gravity === 'number' ? gravity : 9.80665;
  const uSI = typeof initialVel === 'number' ? convertUnitValue(initialVel, velUnit, 'm/s') : 0;

  if (mode === 'velocityTime') {
    if (typeof time !== 'number' || time < 0) return null;
    const tSI = convertUnitValue(time, timeUnit, 's');
    const vSI = uSI + gSI * tSI;
    const sSI = uSI * tSI + 0.5 * gSI * tSI * tSI;
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    const sOut = convertUnitValue(sSI, 'm', distUnit);

    const breakdown: { t: number; v: number; s: number }[] = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const curT = (tSI * i) / steps;
      breakdown.push({
        t: Number(curT.toFixed(2)),
        v: Number((uSI + gSI * curT).toFixed(2)),
        s: Number((uSI * curT + 0.5 * gSI * curT * curT).toFixed(2)),
      });
    }

    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = u + g t ; s = u t + ½ g t²',
      substitutionSteps: [
        `Initial Velocity u = ${uSI.toFixed(2)} m/s`,
        `Gravity g = ${gSI} m/s²`,
        `Time t = ${tSI.toFixed(2)} s`,
        `Final Velocity v = ${uSI.toFixed(2)} + (${gSI} × ${tSI.toFixed(2)}) = ${vSI.toFixed(4)} m/s`,
        `Fallen Distance s = (${uSI.toFixed(2)} × ${tSI.toFixed(2)}) + 0.5 × ${gSI} × (${tSI.toFixed(2)})² = ${sSI.toFixed(4)} m`,
      ],
      assumptions: ['Neglects air resistance.', 'Uniform constant gravitational field.'],
      secondaryValues: [
        { label: 'Distance Fallen', value: `${sOut.toFixed(2)} ${distUnit}` },
        { label: 'Speed in km/h', value: `${convertUnitValue(vSI, 'm/s', 'km/h').toFixed(2)} km/h` },
        { label: 'Speed in mph', value: `${convertUnitValue(vSI, 'm/s', 'mph').toFixed(2)} mph` },
      ],
      timeBreakdown: breakdown,
    };
  } else if (mode === 'timeOfFall') {
    if (typeof height !== 'number' || height <= 0) return null;
    const hSI = convertUnitValue(height, distUnit, 'm');
    const disc = uSI * uSI + 2 * gSI * hSI;
    if (disc < 0) return null;
    const tSI = (-uSI + Math.sqrt(disc)) / gSI;
    const vSI = uSI + gSI * tSI;
    const tOut = convertUnitValue(tSI, 's', timeUnit);
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: tOut,
      primaryUnit: timeUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${timeUnit}`,
      formulaUsed: 't = (-u + √(u² + 2gh)) / g',
      substitutionSteps: [
        `Fall Distance h = ${hSI.toFixed(2)} m`,
        `u = ${uSI.toFixed(2)} m/s, g = ${gSI} m/s²`,
        `Discriminant √(u² + 2gh) = ${Math.sqrt(disc).toFixed(4)}`,
        `Time of Fall t = ${tSI.toFixed(4)} s`,
        `Impact Velocity v = ${vSI.toFixed(4)} m/s`,
      ],
      assumptions: ['Pure free fall with no aerodynamic drag.'],
      secondaryValues: [{ label: 'Impact Velocity', value: `${vOut.toFixed(2)} ${velUnit}` }],
    };
  } else {
    if (typeof height !== 'number' || height <= 0) return null;
    const hSI = convertUnitValue(height, distUnit, 'm');
    const vSq = uSI * uSI + 2 * gSI * hSI;
    if (vSq < 0) return null;
    const vSI = Math.sqrt(vSq);
    const tSI = (vSI - uSI) / gSI;
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = √(u² + 2 g s)',
      substitutionSteps: [
        `u = ${uSI.toFixed(2)} m/s, g = ${gSI} m/s², s = ${hSI.toFixed(2)} m`,
        `v² = ${vSq.toFixed(2)} m²/s²`,
        `v = ${vSI.toFixed(4)} m/s`,
      ],
      assumptions: ['Neglects air friction.'],
      secondaryValues: [
        { label: 'Time of Fall', value: `${tSI.toFixed(3)} s` },
        { label: 'In km/h', value: `${convertUnitValue(vSI, 'm/s', 'km/h').toFixed(2)} km/h` },
        { label: 'In mph', value: `${convertUnitValue(vSI, 'm/s', 'mph').toFixed(2)} mph` },
      ],
    };
  }
}

// 14. Projectile Motion
export function calculateProjectileMotion(
  initialSpeed: number | '',
  angle: number | '',
  initialHeight: number | '',
  gravity: number | '',
  speedUnit = 'm/s',
  distUnit = 'm'
): PhysicsCalculationResult | null {
  if (typeof initialSpeed !== 'number' || typeof angle !== 'number' || initialSpeed <= 0) return null;
  const vSI = convertUnitValue(initialSpeed, speedUnit, 'm/s');
  const h0SI = typeof initialHeight === 'number' && initialHeight >= 0 ? convertUnitValue(initialHeight, distUnit, 'm') : 0;
  const gSI = typeof gravity === 'number' && gravity > 0 ? gravity : 9.80665;
  const thetaRad = (angle * Math.PI) / 180;

  const vx = vSI * Math.cos(thetaRad);
  const vy0 = vSI * Math.sin(thetaRad);

  const disc = vy0 * vy0 + 2 * gSI * h0SI;
  const tFlight = (vy0 + Math.sqrt(disc)) / gSI;
  const rangeSI = vx * tFlight;

  const tPeak = Math.max(0, vy0 / gSI);
  const maxH = h0SI + (vy0 > 0 ? (vy0 * vy0) / (2 * gSI) : 0);

  const vyFinal = vy0 - gSI * tFlight;
  const vFinal = Math.sqrt(vx * vx + vyFinal * vyFinal);

  const points: { x: number; y: number; t: number }[] = [];
  const numSteps = 24;
  for (let i = 0; i <= numSteps; i++) {
    const curT = (tFlight * i) / numSteps;
    const curX = vx * curT;
    const curY = Math.max(0, h0SI + vy0 * curT - 0.5 * gSI * curT * curT);
    points.push({
      x: Number(curX.toFixed(2)),
      y: Number(curY.toFixed(2)),
      t: Number(curT.toFixed(2)),
    });
  }

  const rangeOut = convertUnitValue(rangeSI, 'm', distUnit);
  const maxHOut = convertUnitValue(maxH, 'm', distUnit);

  return {
    primaryValue: rangeOut,
    primaryUnit: distUnit,
    formattedResult: `${rangeOut.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${distUnit}`,
    formulaUsed: 'Range R = v_x × t_flight ; H_max = h_0 + v_y0² / (2g)',
    substitutionSteps: [
      `Horizontal velocity v_x = ${vx.toFixed(3)} m/s`,
      `Vertical initial velocity v_y0 = ${vy0.toFixed(3)} m/s`,
      `Time of flight t = [${vy0.toFixed(2)} + √(${vy0.toFixed(2)}² + 2×${gSI}×${h0SI.toFixed(2)})] / ${gSI} = ${tFlight.toFixed(3)} s`,
      `Horizontal Range R = ${vx.toFixed(3)} × ${tFlight.toFixed(3)} = ${rangeSI.toFixed(3)} m`,
      `Maximum Height H_max = ${maxH.toFixed(3)} m`,
    ],
    assumptions: ['Ideal 2D trajectory without aerodynamic drag.', 'Uniform flat ground level coordinate system.'],
    secondaryValues: [
      { label: 'Time of Flight', value: `${tFlight.toFixed(3)} s` },
      { label: 'Maximum Height', value: `${maxHOut.toFixed(2)} ${distUnit}` },
      { label: 'Time to Apex', value: `${tPeak.toFixed(3)} s` },
      { label: 'Impact Velocity', value: `${convertUnitValue(vFinal, 'm/s', speedUnit).toFixed(2)} ${speedUnit}` },
    ],
    trajectoryPoints: points,
  };
}

// 15. Centripetal Force: Fc = m * v^2 / r
export function calculateCentripetalForce(
  mode: 'force' | 'mass' | 'velocity' | 'radius',
  mass: number | '',
  vel: number | '',
  radius: number | '',
  force: number | '',
  massUnit = 'kg',
  velUnit = 'm/s',
  radiusUnit = 'm',
  forceUnit = 'N'
): PhysicsCalculationResult | null {
  if (mode === 'force') {
    if (typeof mass !== 'number' || typeof vel !== 'number' || typeof radius !== 'number' || radius <= 0 || mass < 0) return null;
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const fcSI = (mSI * vSI * vSI) / rSI;
    const acSI = (vSI * vSI) / rSI;
    const fcOut = convertUnitValue(fcSI, 'N', forceUnit);
    return {
      primaryValue: fcOut,
      primaryUnit: forceUnit,
      formattedResult: `${fcOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${forceUnit}`,
      formulaUsed: 'F_c = m × v² / r',
      substitutionSteps: [
        `Mass m = ${mSI.toFixed(4)} kg`,
        `Tangential Speed v = ${vSI.toFixed(4)} m/s (v² = ${(vSI * vSI).toFixed(4)})`,
        `Radius r = ${rSI.toFixed(4)} m`,
        `Centripetal Acceleration a_c = ${(vSI * vSI).toFixed(4)} / ${rSI.toFixed(4)} = ${acSI.toFixed(4)} m/s²`,
        `Centripetal Force F_c = ${mSI.toFixed(4)} × ${acSI.toFixed(4)} = ${fcSI.toFixed(4)} N`,
      ],
      assumptions: ['Uniform circular motion at constant orbital radius and speed.'],
      secondaryValues: [
        { label: 'Centripetal Acceleration', value: `${acSI.toFixed(4)} m/s²` },
        { label: 'In G-forces', value: `${(acSI / 9.80665).toFixed(2)} g` },
      ],
    };
  } else if (mode === 'mass') {
    if (typeof force !== 'number' || typeof vel !== 'number' || typeof radius !== 'number' || vel === 0) return null;
    const fcSI = convertUnitValue(force, forceUnit, 'N');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const mSI = (fcSI * rSI) / (vSI * vSI);
    const mOut = convertUnitValue(mSI, 'kg', massUnit);
    return {
      primaryValue: mOut,
      primaryUnit: massUnit,
      formattedResult: `${mOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${massUnit}`,
      formulaUsed: 'm = F_c × r / v²',
      substitutionSteps: [`m = (${fcSI.toFixed(4)} × ${rSI.toFixed(4)}) / ${(vSI * vSI).toFixed(4)} = ${mSI.toFixed(4)} kg`],
      assumptions: ['Tangential velocity must be non-zero.'],
    };
  } else if (mode === 'velocity') {
    if (typeof force !== 'number' || typeof mass !== 'number' || typeof radius !== 'number' || mass <= 0 || radius <= 0 || force < 0) return null;
    const fcSI = convertUnitValue(force, forceUnit, 'N');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const rSI = convertUnitValue(radius, radiusUnit, 'm');
    const vSI = Math.sqrt((fcSI * rSI) / mSI);
    const vOut = convertUnitValue(vSI, 'm/s', velUnit);
    return {
      primaryValue: vOut,
      primaryUnit: velUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${velUnit}`,
      formulaUsed: 'v = √(F_c × r / m)',
      substitutionSteps: [`v = √((${fcSI.toFixed(4)} × ${rSI.toFixed(4)}) / ${mSI.toFixed(4)}) = ${vSI.toFixed(4)} m/s`],
      assumptions: ['Mass and radius must be positive.'],
    };
  } else {
    if (typeof force !== 'number' || typeof mass !== 'number' || typeof vel !== 'number' || force <= 0 || mass <= 0) return null;
    const fcSI = convertUnitValue(force, forceUnit, 'N');
    const mSI = convertUnitValue(mass, massUnit, 'kg');
    const vSI = convertUnitValue(vel, velUnit, 'm/s');
    const rSI = (mSI * vSI * vSI) / fcSI;
    const rOut = convertUnitValue(rSI, 'm', radiusUnit);
    return {
      primaryValue: rOut,
      primaryUnit: radiusUnit,
      formattedResult: `${rOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${radiusUnit}`,
      formulaUsed: 'r = m × v² / F_c',
      substitutionSteps: [`r = (${mSI.toFixed(4)} × ${(vSI * vSI).toFixed(4)}) / ${fcSI.toFixed(4)} = ${rSI.toFixed(4)} m`],
      assumptions: ['Centripetal force must be strictly positive.'],
    };
  }
}

// 16. Ohm's Law: V = I * R
export function calculateOhmsLaw(
  mode: 'voltage' | 'current' | 'resistance',
  voltage: number | '',
  current: number | '',
  resistance: number | '',
  voltUnit = 'V',
  currUnit = 'A',
  resUnit = 'Ω'
): PhysicsCalculationResult | null {
  if (mode === 'voltage') {
    if (typeof current !== 'number' || typeof resistance !== 'number') return null;
    const iSI = convertUnitValue(current, currUnit, 'A');
    const rSI = convertUnitValue(resistance, resUnit, 'Ω');
    const vSI = iSI * rSI;
    const pSI = vSI * iSI;
    const vOut = convertUnitValue(vSI, 'V', voltUnit);
    return {
      primaryValue: vOut,
      primaryUnit: voltUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${voltUnit}`,
      formulaUsed: 'V = I × R',
      substitutionSteps: [
        `Current I = ${current} ${currUnit} (${iSI.toFixed(4)} A)`,
        `Resistance R = ${resistance} ${resUnit} (${rSI.toFixed(4)} Ω)`,
        `Voltage V = ${iSI.toFixed(4)} A × ${rSI.toFixed(4)} Ω = ${vSI.toFixed(4)} V`,
      ],
      assumptions: ['Ideal ohmic conductor obeying linear V-I proportionality at constant temperature.'],
      secondaryValues: [
        { label: 'Dissipated Power (P = VI)', value: `${pSI.toFixed(4)} W` },
        { label: 'In Millivolts (mV)', value: `${(vSI * 1000).toFixed(2)} mV` },
      ],
    };
  } else if (mode === 'current') {
    if (typeof voltage !== 'number' || typeof resistance !== 'number') return null;
    const vSI = convertUnitValue(voltage, voltUnit, 'V');
    const rSI = convertUnitValue(resistance, resUnit, 'Ω');
    if (rSI === 0) {
      return {
        primaryValue: 0,
        primaryUnit: currUnit,
        formattedResult: 'Infinite (Short Circuit)',
        formulaUsed: 'I = V / R',
        substitutionSteps: ['Resistance is 0 Ω, resulting in an ideal short circuit condition.'],
        assumptions: [],
        warning: 'Zero resistance produces a short circuit with theoretically infinite current flow.',
      };
    }
    const iSI = vSI / rSI;
    const pSI = vSI * iSI;
    const iOut = convertUnitValue(iSI, 'A', currUnit);
    return {
      primaryValue: iOut,
      primaryUnit: currUnit,
      formattedResult: `${iOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${currUnit}`,
      formulaUsed: 'I = V / R',
      substitutionSteps: [`Voltage V = ${vSI.toFixed(4)} V`, `Resistance R = ${rSI.toFixed(4)} Ω`, `Current I = ${vSI.toFixed(4)} V / ${rSI.toFixed(4)} Ω = ${iSI.toFixed(4)} A`],
      assumptions: ['Constant temperature ohmic resistor.'],
      secondaryValues: [
        { label: 'Current in mA', value: `${(iSI * 1000).toFixed(2)} mA` },
        { label: 'Dissipated Power (P = I²R)', value: `${pSI.toFixed(4)} W` },
      ],
    };
  } else {
    if (typeof voltage !== 'number' || typeof current !== 'number') return null;
    const vSI = convertUnitValue(voltage, voltUnit, 'V');
    const iSI = convertUnitValue(current, currUnit, 'A');
    if (iSI === 0) {
      return {
        primaryValue: 0,
        primaryUnit: resUnit,
        formattedResult: 'Infinite (Open Circuit)',
        formulaUsed: 'R = V / I',
        substitutionSteps: ['Zero current implies infinite resistance (open circuit).'],
        assumptions: [],
        warning: 'Zero current indicates an open circuit with infinite resistance.',
      };
    }
    const rSI = vSI / iSI;
    const pSI = vSI * iSI;
    const rOut = convertUnitValue(rSI, 'Ω', resUnit);
    return {
      primaryValue: rOut,
      primaryUnit: resUnit,
      formattedResult: `${rOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${resUnit}`,
      formulaUsed: 'R = V / I',
      substitutionSteps: [`Voltage V = ${vSI.toFixed(4)} V`, `Current I = ${iSI.toFixed(4)} A`, `Resistance R = ${vSI.toFixed(4)} V / ${iSI.toFixed(4)} A = ${rSI.toFixed(4)} Ω`],
      assumptions: ['Linear ohmic device.'],
      secondaryValues: [{ label: 'Dissipated Power', value: `${pSI.toFixed(4)} W` }],
    };
  }
}

// 17. Electrical Power: P = V * I = I^2 * R = V^2 / R
export function calculateElectricalPower(
  mode: 'VI' | 'IR' | 'VR',
  v: number | '',
  i: number | '',
  r: number | '',
  powerUnit = 'W'
): PhysicsCalculationResult | null {
  if (mode === 'VI') {
    if (typeof v !== 'number' || typeof i !== 'number') return null;
    const pSI = v * i;
    const pOut = convertUnitValue(pSI, 'W', powerUnit);
    return {
      primaryValue: pOut,
      primaryUnit: powerUnit,
      formattedResult: `${pOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${powerUnit}`,
      formulaUsed: 'P = V × I',
      substitutionSteps: [`Voltage V = ${v} V`, `Current I = ${i} A`, `P = ${v} V × ${i} A = ${pSI.toFixed(4)} W`],
      assumptions: ['DC electrical power or in-phase AC resistive circuit.'],
      secondaryValues: [{ label: 'Power in kW', value: `${(pSI / 1000).toFixed(4)} kW` }],
    };
  } else if (mode === 'IR') {
    if (typeof i !== 'number' || typeof r !== 'number') return null;
    const pSI = i * i * r;
    const pOut = convertUnitValue(pSI, 'W', powerUnit);
    return {
      primaryValue: pOut,
      primaryUnit: powerUnit,
      formattedResult: `${pOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${powerUnit}`,
      formulaUsed: 'P = I² × R',
      substitutionSteps: [`Current I = ${i} A (I² = ${(i * i).toFixed(4)})`, `Resistance R = ${r} Ω`, `P = ${(i * i).toFixed(4)} × ${r} = ${pSI.toFixed(4)} W`],
      assumptions: ['Joule heating dissipation across ohmic resistor.'],
      secondaryValues: [{ label: 'Power in kW', value: `${(pSI / 1000).toFixed(4)} kW` }],
    };
  } else {
    if (typeof v !== 'number' || typeof r !== 'number' || r === 0) return null;
    const pSI = (v * v) / r;
    const pOut = convertUnitValue(pSI, 'W', powerUnit);
    return {
      primaryValue: pOut,
      primaryUnit: powerUnit,
      formattedResult: `${pOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${powerUnit}`,
      formulaUsed: 'P = V² / R',
      substitutionSteps: [`Voltage V = ${v} V (V² = ${(v * v).toFixed(4)})`, `Resistance R = ${r} Ω`, `P = ${(v * v).toFixed(4)} / ${r} = ${pSI.toFixed(4)} W`],
      assumptions: ['Resistance must be non-zero.'],
      secondaryValues: [{ label: 'Power in kW', value: `${(pSI / 1000).toFixed(4)} kW` }],
    };
  }
}

// 18. Wave Speed: v = f * λ
export function calculateWaveSpeed(
  mode: 'speed' | 'freq' | 'wavelength',
  speed: number | '',
  freq: number | '',
  lambda: number | '',
  speedUnit = 'm/s',
  freqUnit = 'Hz',
  lambdaUnit = 'm'
): PhysicsCalculationResult | null {
  if (mode === 'speed') {
    if (typeof freq !== 'number' || typeof lambda !== 'number' || freq < 0 || lambda < 0) return null;
    const fSI = convertUnitValue(freq, freqUnit, 'Hz');
    const lSI = convertUnitValue(lambda, lambdaUnit, 'm');
    const vSI = fSI * lSI;
    const vOut = convertUnitValue(vSI, 'm/s', speedUnit);
    return {
      primaryValue: vOut,
      primaryUnit: speedUnit,
      formattedResult: `${vOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${speedUnit}`,
      formulaUsed: 'v = f × λ',
      substitutionSteps: [
        `Frequency f = ${freq} ${freqUnit} (${fSI.toFixed(2)} Hz)`,
        `Wavelength λ = ${lambda} ${lambdaUnit} (${lSI.toFixed(4)} m)`,
        `Wave Speed v = ${fSI.toFixed(2)} Hz × ${lSI.toFixed(4)} m = ${vSI.toFixed(4)} m/s`,
      ],
      assumptions: ['Harmonic wave propagation through non-dispersive uniform medium.'],
      secondaryValues: [
        { label: 'Speed in km/h', value: `${convertUnitValue(vSI, 'm/s', 'km/h').toFixed(2)} km/h` },
        { label: 'Wave Period (T = 1/f)', value: fSI > 0 ? `${(1 / fSI).toExponential(4)} s` : 'N/A' },
      ],
    };
  } else if (mode === 'freq') {
    if (typeof speed !== 'number' || typeof lambda !== 'number' || lambda <= 0 || speed < 0) return null;
    const vSI = convertUnitValue(speed, speedUnit, 'm/s');
    const lSI = convertUnitValue(lambda, lambdaUnit, 'm');
    const fSI = vSI / lSI;
    const fOut = convertUnitValue(fSI, 'Hz', freqUnit);
    return {
      primaryValue: fOut,
      primaryUnit: freqUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${freqUnit}`,
      formulaUsed: 'f = v / λ',
      substitutionSteps: [`Speed v = ${vSI.toFixed(4)} m/s`, `Wavelength λ = ${lSI.toFixed(6)} m`, `Frequency f = ${fSI.toFixed(4)} Hz`],
      assumptions: ['Wavelength must be strictly greater than zero.'],
    };
  } else {
    if (typeof speed !== 'number' || typeof freq !== 'number' || freq <= 0 || speed < 0) return null;
    const vSI = convertUnitValue(speed, speedUnit, 'm/s');
    const fSI = convertUnitValue(freq, freqUnit, 'Hz');
    const lSI = vSI / fSI;
    const lOut = convertUnitValue(lSI, 'm', lambdaUnit);
    return {
      primaryValue: lOut,
      primaryUnit: lambdaUnit,
      formattedResult: `${lOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${lambdaUnit}`,
      formulaUsed: 'λ = v / f',
      substitutionSteps: [`Speed v = ${vSI.toFixed(4)} m/s`, `Frequency f = ${fSI.toFixed(4)} Hz`, `Wavelength λ = ${lSI.toFixed(6)} m`],
      assumptions: ['Frequency must be strictly greater than zero.'],
    };
  }
}

// 19. Frequency & Period: f = 1 / T
export function calculateFrequency(
  mode: 'freq' | 'period',
  freq: number | '',
  period: number | '',
  freqUnit = 'Hz',
  periodUnit = 's'
): PhysicsCalculationResult | null {
  if (mode === 'freq') {
    if (typeof period !== 'number' || period <= 0) return null;
    const tSI = convertUnitValue(period, periodUnit, 's');
    const fSI = 1 / tSI;
    const fOut = convertUnitValue(fSI, 'Hz', freqUnit);
    return {
      primaryValue: fOut,
      primaryUnit: freqUnit,
      formattedResult: `${fOut.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${freqUnit}`,
      formulaUsed: 'f = 1 / T',
      substitutionSteps: [`Period T = ${period} ${periodUnit} (${tSI.toFixed(6)} s)`, `Frequency f = 1 / ${tSI.toFixed(6)} s = ${fSI.toFixed(4)} Hz`],
      assumptions: ['Periodic oscillation with constant duration per cycle.'],
      secondaryValues: [
        { label: 'Angular Frequency (ω = 2πf)', value: `${(2 * Math.PI * fSI).toFixed(3)} rad/s` },
        { label: 'Rotational Speed (RPM)', value: `${(fSI * 60).toFixed(2)} RPM` },
      ],
    };
  } else {
    if (typeof freq !== 'number' || freq <= 0) return null;
    const fSI = convertUnitValue(freq, freqUnit, 'Hz');
    const tSI = 1 / fSI;
    const tOut = convertUnitValue(tSI, 's', periodUnit);
    return {
      primaryValue: tOut,
      primaryUnit: periodUnit,
      formattedResult: `${tOut.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${periodUnit}`,
      formulaUsed: 'T = 1 / f',
      substitutionSteps: [`Frequency f = ${freq} ${freqUnit} (${fSI.toFixed(4)} Hz)`, `Period T = 1 / ${fSI.toFixed(4)} Hz = ${tSI.toFixed(6)} s`],
      assumptions: ['Frequency must be strictly positive.'],
    };
  }
}

// 20. Wavelength: λ = v / f
export function calculateWavelength(
  mode: 'wavelength' | 'speed' | 'freq',
  wavelength: number | '',
  speed: number | '',
  freq: number | '',
  lambdaUnit = 'm',
  speedUnit = 'm/s',
  freqUnit = 'Hz'
): PhysicsCalculationResult | null {
  return calculateWaveSpeed(
    mode === 'wavelength' ? 'wavelength' : mode === 'speed' ? 'speed' : 'freq',
    speed,
    freq,
    wavelength,
    speedUnit,
    freqUnit,
    lambdaUnit
  );
}
