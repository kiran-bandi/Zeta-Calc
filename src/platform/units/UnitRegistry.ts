/**
 * Universal Unit Registry & Conversion Normalizer
 * Provides canonical base unit conversions for:
 * length, mass, area, volume, temperature, speed, time, energy, power, pressure, data, fuel economy
 */

import { MeasurementDimension } from '../contracts';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  dimension: MeasurementDimension;
  isCanonical?: boolean;
  toCanonical: (val: number) => number;
  fromCanonical: (val: number) => number;
}

class UnitRegistryImpl {
  private units: Map<string, UnitDefinition> = new Map();

  constructor() {
    this.registerDefaults();
  }

  register(unit: UnitDefinition) {
    this.units.set(unit.id.toLowerCase(), unit);
  }

  get(id: string): UnitDefinition | undefined {
    return this.units.get(id.toLowerCase());
  }

  convert(value: number, fromUnitId: string, toUnitId: string): number {
    if (fromUnitId.toLowerCase() === toUnitId.toLowerCase()) {
      return value;
    }
    const fromUnit = this.get(fromUnitId);
    const toUnit = this.get(toUnitId);

    if (!fromUnit || !toUnit) {
      throw new Error(`Invalid unit conversion: '${fromUnitId}' to '${toUnitId}'`);
    }

    if (fromUnit.dimension !== toUnit.dimension) {
      throw new Error(
        `Dimension mismatch in conversion: ${fromUnit.dimension} (${fromUnitId}) cannot convert to ${toUnit.dimension} (${toUnitId})`
      );
    }

    const canonical = fromUnit.toCanonical(value);
    return toUnit.fromCanonical(canonical);
  }

  getByDimension(dimension: MeasurementDimension): UnitDefinition[] {
    return Array.from(this.units.values()).filter((u) => u.dimension === dimension);
  }

  private registerDefaults() {
    // Length: Canonical = Meter (m)
    this.register({
      id: 'm',
      name: 'Meter',
      symbol: 'm',
      dimension: 'length',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'cm',
      name: 'Centimeter',
      symbol: 'cm',
      dimension: 'length',
      toCanonical: (v) => v / 100,
      fromCanonical: (v) => v * 100,
    });
    this.register({
      id: 'mm',
      name: 'Millimeter',
      symbol: 'mm',
      dimension: 'length',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });
    this.register({
      id: 'km',
      name: 'Kilometer',
      symbol: 'km',
      dimension: 'length',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'in',
      name: 'Inch',
      symbol: 'in',
      dimension: 'length',
      toCanonical: (v) => v * 0.0254,
      fromCanonical: (v) => v / 0.0254,
    });
    this.register({
      id: 'ft',
      name: 'Foot',
      symbol: 'ft',
      dimension: 'length',
      toCanonical: (v) => v * 0.3048,
      fromCanonical: (v) => v / 0.3048,
    });
    this.register({
      id: 'yd',
      name: 'Yard',
      symbol: 'yd',
      dimension: 'length',
      toCanonical: (v) => v * 0.9144,
      fromCanonical: (v) => v / 0.9144,
    });
    this.register({
      id: 'mi',
      name: 'Mile',
      symbol: 'mi',
      dimension: 'length',
      toCanonical: (v) => v * 1609.344,
      fromCanonical: (v) => v / 1609.344,
    });

    // Mass: Canonical = Kilogram (kg)
    this.register({
      id: 'kg',
      name: 'Kilogram',
      symbol: 'kg',
      dimension: 'mass',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'g',
      name: 'Gram',
      symbol: 'g',
      dimension: 'mass',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });
    this.register({
      id: 'mg',
      name: 'Milligram',
      symbol: 'mg',
      dimension: 'mass',
      toCanonical: (v) => v / 1e6,
      fromCanonical: (v) => v * 1e6,
    });
    this.register({
      id: 'lb',
      name: 'Pound',
      symbol: 'lb',
      dimension: 'mass',
      toCanonical: (v) => v * 0.45359237,
      fromCanonical: (v) => v / 0.45359237,
    });
    this.register({
      id: 'oz',
      name: 'Ounce',
      symbol: 'oz',
      dimension: 'mass',
      toCanonical: (v) => v * 0.028349523125,
      fromCanonical: (v) => v / 0.028349523125,
    });
    this.register({
      id: 'ozt',
      name: 'Troy Ounce',
      symbol: 'oz t',
      dimension: 'mass',
      toCanonical: (v) => v * 0.0311034768,
      fromCanonical: (v) => v / 0.0311034768,
    });
    this.register({
      id: 'tola',
      name: 'Tola',
      symbol: 'tola',
      dimension: 'mass',
      toCanonical: (v) => v * 0.0116638038,
      fromCanonical: (v) => v / 0.0116638038,
    });
    this.register({
      id: 'ton',
      name: 'Metric Ton',
      symbol: 't',
      dimension: 'mass',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });

    // Area: Canonical = Square Meter (m2)
    this.register({
      id: 'sqm',
      name: 'Square Meter',
      symbol: 'm²',
      dimension: 'area',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'sqft',
      name: 'Square Feet',
      symbol: 'sq ft',
      dimension: 'area',
      toCanonical: (v) => v * 0.09290304,
      fromCanonical: (v) => v / 0.09290304,
    });
    this.register({
      id: 'sqyd',
      name: 'Square Yard',
      symbol: 'sq yd',
      dimension: 'area',
      toCanonical: (v) => v * 0.83612736,
      fromCanonical: (v) => v / 0.83612736,
    });
    this.register({
      id: 'acre',
      name: 'Acre',
      symbol: 'ac',
      dimension: 'area',
      toCanonical: (v) => v * 4046.8564224,
      fromCanonical: (v) => v / 4046.8564224,
    });
    this.register({
      id: 'hectare',
      name: 'Hectare',
      symbol: 'ha',
      dimension: 'area',
      toCanonical: (v) => v * 10000,
      fromCanonical: (v) => v / 10000,
    });

    // Volume: Canonical = Liter (L)
    this.register({
      id: 'l',
      name: 'Liter',
      symbol: 'L',
      dimension: 'volume',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'ml',
      name: 'Milliliter',
      symbol: 'mL',
      dimension: 'volume',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });
    this.register({
      id: 'gal_us',
      name: 'US Gallon',
      symbol: 'gal (US)',
      dimension: 'volume',
      toCanonical: (v) => v * 3.785411784,
      fromCanonical: (v) => v / 3.785411784,
    });
    this.register({
      id: 'gal_uk',
      name: 'UK Gallon',
      symbol: 'gal (UK)',
      dimension: 'volume',
      toCanonical: (v) => v * 4.54609,
      fromCanonical: (v) => v / 4.54609,
    });

    // Temperature: Canonical = Celsius (°C)
    this.register({
      id: 'c',
      name: 'Celsius',
      symbol: '°C',
      dimension: 'temperature',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'f',
      name: 'Fahrenheit',
      symbol: '°F',
      dimension: 'temperature',
      toCanonical: (v) => ((v - 32) * 5) / 9,
      fromCanonical: (v) => (v * 9) / 5 + 32,
    });
    this.register({
      id: 'k',
      name: 'Kelvin',
      symbol: 'K',
      dimension: 'temperature',
      toCanonical: (v) => v - 273.15,
      fromCanonical: (v) => v + 273.15,
    });

    // Additional Length: μm, nm
    this.register({
      id: 'um',
      name: 'Micrometer',
      symbol: 'μm',
      dimension: 'length',
      toCanonical: (v) => v * 1e-6,
      fromCanonical: (v) => v / 1e-6,
    });
    this.register({
      id: 'nm',
      name: 'Nanometer',
      symbol: 'nm',
      dimension: 'length',
      toCanonical: (v) => v * 1e-9,
      fromCanonical: (v) => v / 1e-9,
    });

    // Speed: Canonical = m/s
    this.register({
      id: 'm/s',
      name: 'Meters per second',
      symbol: 'm/s',
      dimension: 'speed',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'km/h',
      name: 'Kilometers per hour',
      symbol: 'km/h',
      dimension: 'speed',
      toCanonical: (v) => v / 3.6,
      fromCanonical: (v) => v * 3.6,
    });
    this.register({
      id: 'mph',
      name: 'Miles per hour',
      symbol: 'mph',
      dimension: 'speed',
      toCanonical: (v) => v * 0.44704,
      fromCanonical: (v) => v / 0.44704,
    });
    this.register({
      id: 'ft/s',
      name: 'Feet per second',
      symbol: 'ft/s',
      dimension: 'speed',
      toCanonical: (v) => v * 0.3048,
      fromCanonical: (v) => v / 0.3048,
    });
    this.register({
      id: 'km/s',
      name: 'Kilometers per second',
      symbol: 'km/s',
      dimension: 'speed',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });

    // Acceleration: Canonical = m/s²
    this.register({
      id: 'm/s2',
      name: 'Meters per second squared',
      symbol: 'm/s²',
      dimension: 'acceleration',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'ft/s2',
      name: 'Feet per second squared',
      symbol: 'ft/s²',
      dimension: 'acceleration',
      toCanonical: (v) => v * 0.3048,
      fromCanonical: (v) => v / 0.3048,
    });

    // Time: Canonical = Seconds (s)
    this.register({
      id: 's',
      name: 'Second',
      symbol: 's',
      dimension: 'time',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'ms',
      name: 'Millisecond',
      symbol: 'ms',
      dimension: 'time',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });
    this.register({
      id: 'us',
      name: 'Microsecond',
      symbol: 'μs',
      dimension: 'time',
      toCanonical: (v) => v / 1e6,
      fromCanonical: (v) => v * 1e6,
    });
    this.register({
      id: 'ns',
      name: 'Nanosecond',
      symbol: 'ns',
      dimension: 'time',
      toCanonical: (v) => v / 1e9,
      fromCanonical: (v) => v * 1e9,
    });
    this.register({
      id: 'min',
      name: 'Minute',
      symbol: 'min',
      dimension: 'time',
      toCanonical: (v) => v * 60,
      fromCanonical: (v) => v / 60,
    });
    this.register({
      id: 'h',
      name: 'Hour',
      symbol: 'h',
      dimension: 'time',
      toCanonical: (v) => v * 3600,
      fromCanonical: (v) => v / 3600,
    });

    // Force: Canonical = Newton (N)
    this.register({
      id: 'n',
      name: 'Newton',
      symbol: 'N',
      dimension: 'force',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kn',
      name: 'Kilonewton',
      symbol: 'kN',
      dimension: 'force',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'lbf',
      name: 'Pound-force',
      symbol: 'lbf',
      dimension: 'force',
      toCanonical: (v) => v * 4.448221615,
      fromCanonical: (v) => v / 4.448221615,
    });

    // Energy: Canonical = Joule (J)
    this.register({
      id: 'j',
      name: 'Joule',
      symbol: 'J',
      dimension: 'energy',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kj',
      name: 'Kilojoule',
      symbol: 'kJ',
      dimension: 'energy',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'mj',
      name: 'Megajoule',
      symbol: 'MJ',
      dimension: 'energy',
      toCanonical: (v) => v * 1e6,
      fromCanonical: (v) => v / 1e6,
    });
    this.register({
      id: 'cal',
      name: 'Calorie',
      symbol: 'cal',
      dimension: 'energy',
      toCanonical: (v) => v * 4.184,
      fromCanonical: (v) => v / 4.184,
    });
    this.register({
      id: 'kcal',
      name: 'Kilocalorie',
      symbol: 'kcal',
      dimension: 'energy',
      toCanonical: (v) => v * 4184,
      fromCanonical: (v) => v / 4184,
    });
    this.register({
      id: 'wh',
      name: 'Watt-hour',
      symbol: 'Wh',
      dimension: 'energy',
      toCanonical: (v) => v * 3600,
      fromCanonical: (v) => v / 3600,
    });
    this.register({
      id: 'kwh',
      name: 'Kilowatt-hour',
      symbol: 'kWh',
      dimension: 'energy',
      toCanonical: (v) => v * 3.6e6,
      fromCanonical: (v) => v / 3.6e6,
    });
    this.register({
      id: 'ev',
      name: 'Electronvolt',
      symbol: 'eV',
      dimension: 'energy',
      toCanonical: (v) => v * 1.602176634e-19,
      fromCanonical: (v) => v / 1.602176634e-19,
    });

    // Power: Canonical = Watt (W)
    this.register({
      id: 'w',
      name: 'Watt',
      symbol: 'W',
      dimension: 'power',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kw',
      name: 'Kilowatt',
      symbol: 'kW',
      dimension: 'power',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'mw',
      name: 'Megawatt',
      symbol: 'MW',
      dimension: 'power',
      toCanonical: (v) => v * 1e6,
      fromCanonical: (v) => v / 1e6,
    });
    this.register({
      id: 'hp',
      name: 'Horsepower',
      symbol: 'hp',
      dimension: 'power',
      toCanonical: (v) => v * 745.699872,
      fromCanonical: (v) => v / 745.699872,
    });

    // Pressure: Canonical = Pascal (Pa)
    this.register({
      id: 'pa',
      name: 'Pascal',
      symbol: 'Pa',
      dimension: 'pressure',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kpa',
      name: 'Kilopascal',
      symbol: 'kPa',
      dimension: 'pressure',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'mpa',
      name: 'Megapascal',
      symbol: 'MPa',
      dimension: 'pressure',
      toCanonical: (v) => v * 1e6,
      fromCanonical: (v) => v / 1e6,
    });
    this.register({
      id: 'bar',
      name: 'Bar',
      symbol: 'bar',
      dimension: 'pressure',
      toCanonical: (v) => v * 100000,
      fromCanonical: (v) => v / 100000,
    });
    this.register({
      id: 'atm',
      name: 'Atmosphere',
      symbol: 'atm',
      dimension: 'pressure',
      toCanonical: (v) => v * 101325,
      fromCanonical: (v) => v / 101325,
    });
    this.register({
      id: 'psi',
      name: 'Pound per square inch',
      symbol: 'psi',
      dimension: 'pressure',
      toCanonical: (v) => v * 6894.75729,
      fromCanonical: (v) => v / 6894.75729,
    });
    this.register({
      id: 'mmhg',
      name: 'Millimeter of mercury',
      symbol: 'mmHg',
      dimension: 'pressure',
      toCanonical: (v) => v * 133.322387415,
      fromCanonical: (v) => v / 133.322387415,
    });

    // Density: Canonical = kg/m³
    this.register({
      id: 'kg/m3',
      name: 'Kilogram per cubic meter',
      symbol: 'kg/m³',
      dimension: 'density',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'g/cm3',
      name: 'Gram per cubic centimeter',
      symbol: 'g/cm³',
      dimension: 'density',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'g/ml',
      name: 'Gram per milliliter',
      symbol: 'g/mL',
      dimension: 'density',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'kg/l',
      name: 'Kilogram per liter',
      symbol: 'kg/L',
      dimension: 'density',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'lb/ft3',
      name: 'Pound per cubic foot',
      symbol: 'lb/ft³',
      dimension: 'density',
      toCanonical: (v) => v * 16.018463,
      fromCanonical: (v) => v / 16.018463,
    });

    // Torque: Canonical = N·m
    this.register({
      id: 'n-m',
      name: 'Newton-meter',
      symbol: 'N·m',
      dimension: 'torque',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kn-m',
      name: 'Kilonewton-meter',
      symbol: 'kN·m',
      dimension: 'torque',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'lbf-ft',
      name: 'Pound-foot',
      symbol: 'lbf·ft',
      dimension: 'torque',
      toCanonical: (v) => v * 1.355817948,
      fromCanonical: (v) => v / 1.355817948,
    });
    this.register({
      id: 'lbf-in',
      name: 'Pound-inch',
      symbol: 'lbf·in',
      dimension: 'torque',
      toCanonical: (v) => v * 0.112984829,
      fromCanonical: (v) => v / 0.112984829,
    });

    // Angle: Canonical = Radians (rad)
    this.register({
      id: 'rad',
      name: 'Radian',
      symbol: 'rad',
      dimension: 'angle',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'deg',
      name: 'Degree',
      symbol: '°',
      dimension: 'angle',
      toCanonical: (v) => (v * Math.PI) / 180,
      fromCanonical: (v) => (v * 180) / Math.PI,
    });

    // Electrical - Voltage: Canonical = Volt (V)
    this.register({
      id: 'v',
      name: 'Volt',
      symbol: 'V',
      dimension: 'voltage',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'mv',
      name: 'Millivolt',
      symbol: 'mV',
      dimension: 'voltage',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });
    this.register({
      id: 'kv',
      name: 'Kilovolt',
      symbol: 'kV',
      dimension: 'voltage',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });

    // Electrical - Current: Canonical = Ampere (A)
    this.register({
      id: 'a',
      name: 'Ampere',
      symbol: 'A',
      dimension: 'current',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'ma',
      name: 'Milliampere',
      symbol: 'mA',
      dimension: 'current',
      toCanonical: (v) => v / 1000,
      fromCanonical: (v) => v * 1000,
    });

    // Electrical - Resistance: Canonical = Ohm (Ω)
    this.register({
      id: 'ohm',
      name: 'Ohm',
      symbol: 'Ω',
      dimension: 'resistance',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'kohm',
      name: 'Kiloohm',
      symbol: 'kΩ',
      dimension: 'resistance',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'mohm',
      name: 'Megaohm',
      symbol: 'MΩ',
      dimension: 'resistance',
      toCanonical: (v) => v * 1e6,
      fromCanonical: (v) => v / 1e6,
    });

    // Frequency: Canonical = Hertz (Hz)
    this.register({
      id: 'hz',
      name: 'Hertz',
      symbol: 'Hz',
      dimension: 'frequency',
      isCanonical: true,
      toCanonical: (v) => v,
      fromCanonical: (v) => v,
    });
    this.register({
      id: 'khz',
      name: 'Kilohertz',
      symbol: 'kHz',
      dimension: 'frequency',
      toCanonical: (v) => v * 1000,
      fromCanonical: (v) => v / 1000,
    });
    this.register({
      id: 'mhz',
      name: 'Megahertz',
      symbol: 'MHz',
      dimension: 'frequency',
      toCanonical: (v) => v * 1e6,
      fromCanonical: (v) => v / 1e6,
    });
    this.register({
      id: 'ghz',
      name: 'Gigahertz',
      symbol: 'GHz',
      dimension: 'frequency',
      toCanonical: (v) => v * 1e9,
      fromCanonical: (v) => v / 1e9,
    });
  }
}

export const UnitRegistry = new UnitRegistryImpl();
