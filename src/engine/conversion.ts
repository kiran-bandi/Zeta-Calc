export type UnitCategory =
  | 'length'
  | 'mass'
  | 'area'
  | 'temperature'
  | 'volume'
  | 'speed'
  | 'time'
  | 'digital';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // For non-temperature: valueInBase = value * ratioToBase
}

export const UNIT_CATEGORIES: Record<
  UnitCategory,
  {
    name: string;
    baseUnitId: string;
    units: UnitDefinition[];
  }
> = {
  length: {
    name: 'Length & Distance',
    baseUnitId: 'meter',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm', ratioToBase: 1 },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'mile', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yard', name: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'foot', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'inch', name: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nautical_mile', name: 'Nautical Mile', symbol: 'nmi', ratioToBase: 1852 },
    ],
  },
  mass: {
    name: 'Mass & Weight',
    baseUnitId: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg', ratioToBase: 1 },
      { id: 'gram', name: 'Gram', symbol: 'g', ratioToBase: 0.001 },
      { id: 'milligram', name: 'Milligram', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 'metric_ton', name: 'Metric Ton', symbol: 't', ratioToBase: 1000 },
      { id: 'pound', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'stone', name: 'Stone', symbol: 'st', ratioToBase: 6.35029318 },
    ],
  },
  area: {
    name: 'Area',
    baseUnitId: 'square_meter',
    units: [
      { id: 'square_meter', name: 'Square Meter', symbol: 'm²', ratioToBase: 1 },
      { id: 'square_kilometer', name: 'Square Kilometer', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'square_foot', name: 'Square Foot', symbol: 'sq ft', ratioToBase: 0.09290304 },
      { id: 'square_yard', name: 'Square Yard', symbol: 'sq yd', ratioToBase: 0.83612736 },
      { id: 'square_inch', name: 'Square Inch', symbol: 'sq in', ratioToBase: 0.00064516 },
      { id: 'acre', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnitId: 'celsius',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    ],
  },
  volume: {
    name: 'Volume & Liquid',
    baseUnitId: 'liter',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L', ratioToBase: 1 },
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'cubic_meter', name: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gallon_us', name: 'Gallon (US)', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'quart_us', name: 'Quart (US)', symbol: 'qt', ratioToBase: 0.946352946 },
      { id: 'pint_us', name: 'Pint (US)', symbol: 'pt', ratioToBase: 0.473176473 },
      { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', ratioToBase: 0.2365882365 },
      { id: 'fluid_ounce_us', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
      { id: 'tablespoon_us', name: 'Tablespoon (US)', symbol: 'tbsp', ratioToBase: 0.01478676478125 },
      { id: 'teaspoon_us', name: 'Teaspoon (US)', symbol: 'tsp', ratioToBase: 0.00492892159375 },
    ],
  },
  speed: {
    name: 'Speed',
    baseUnitId: 'km_per_hour',
    units: [
      { id: 'km_per_hour', name: 'Kilometer per hour', symbol: 'km/h', ratioToBase: 1 },
      { id: 'miles_per_hour', name: 'Miles per hour', symbol: 'mph', ratioToBase: 1.609344 },
      { id: 'meter_per_second', name: 'Meter per second', symbol: 'm/s', ratioToBase: 3.6 },
      { id: 'knot', name: 'Knot', symbol: 'kn', ratioToBase: 1.852 },
      { id: 'foot_per_second', name: 'Foot per second', symbol: 'ft/s', ratioToBase: 1.09728 },
    ],
  },
  time: {
    name: 'Time',
    baseUnitId: 'second',
    units: [
      { id: 'second', name: 'Second', symbol: 's', ratioToBase: 1 },
      { id: 'minute', name: 'Minute', symbol: 'min', ratioToBase: 60 },
      { id: 'hour', name: 'Hour', symbol: 'hr', ratioToBase: 3600 },
      { id: 'day', name: 'Day', symbol: 'd', ratioToBase: 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', ratioToBase: 604800 },
      { id: 'month', name: 'Month (avg)', symbol: 'mo', ratioToBase: 2629746 },
      { id: 'year', name: 'Year (365d)', symbol: 'yr', ratioToBase: 31536000 },
    ],
  },
  digital: {
    name: 'Digital Data Storage',
    baseUnitId: 'byte',
    units: [
      { id: 'byte', name: 'Byte', symbol: 'B', ratioToBase: 1 },
      { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', ratioToBase: 1024 },
      { id: 'megabyte', name: 'Megabyte', symbol: 'MB', ratioToBase: 1048576 },
      { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', ratioToBase: 1073741824 },
      { id: 'terabyte', name: 'Terabyte', symbol: 'TB', ratioToBase: 1099511627776 },
    ],
  },
};

export function convertUnit(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): number {
  if (fromUnitId === toUnitId) return value;

  // Special case: Temperature
  if (category === 'temperature') {
    let celsius = value;
    if (fromUnitId === 'fahrenheit') {
      celsius = (value - 32) * (5 / 9);
    } else if (fromUnitId === 'kelvin') {
      celsius = value - 273.15;
    }

    if (toUnitId === 'celsius') return Math.round(celsius * 10000) / 10000;
    if (toUnitId === 'fahrenheit') return Math.round((celsius * (9 / 5) + 32) * 10000) / 10000;
    if (toUnitId === 'kelvin') return Math.round((celsius + 273.15) * 10000) / 10000;
    return celsius;
  }

  const cat = UNIT_CATEGORIES[category];
  if (!cat) return value;

  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return value;

  const baseValue = value * fromUnit.ratioToBase;
  const targetValue = baseValue / toUnit.ratioToBase;

  // Round intelligently based on magnitude
  if (Math.abs(targetValue) < 0.0001 && targetValue !== 0) {
    return Number(targetValue.toExponential(4));
  }
  return Math.round(targetValue * 10000) / 10000;
}

export interface UnitConversionRow {
  unitId: string;
  unitName: string;
  symbol: string;
  value: number;
  formatted: string;
}

export function getAllConversions(
  value: number,
  fromUnitId: string,
  category: UnitCategory
): UnitConversionRow[] {
  const cat = UNIT_CATEGORIES[category];
  if (!cat) return [];

  return cat.units.map((unit) => {
    const converted = convertUnit(value, fromUnitId, unit.id, category);
    return {
      unitId: unit.id,
      unitName: unit.name,
      symbol: unit.symbol,
      value: converted,
      formatted:
        converted == null || isNaN(converted)
          ? '0'
          : Math.abs(converted) >= 1000000 || (Math.abs(converted) < 0.001 && converted !== 0)
          ? converted.toExponential(4)
          : converted.toLocaleString(undefined, { maximumFractionDigits: 4 }),
    };
  });
}
