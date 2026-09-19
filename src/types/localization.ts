import { CurrencyCode } from './globalization';

export type CountryCode =
  | 'IN' // India
  | 'US' // United States
  | 'GB' // United Kingdom
  | 'AU' // Australia
  | 'CA' // Canada
  | 'DE' // Germany
  | 'FR' // France
  | 'JP' // Japan
  | 'AE' // UAE
  | 'SG' // Singapore
  | 'NZ' // New Zealand
  | 'ZA' // South Africa
  | 'BR' // Brazil
  | 'MX'; // Mexico

export type MeasurementSystem = 'metric' | 'us-customary' | 'uk-customary';

export type DistanceUnit = 'km' | 'mi' | 'm' | 'ft' | 'cm' | 'in' | 'yd' | 'nmi';
export type MassUnit = 'kg' | 'g' | 'mg' | 'tonne' | 'lb' | 'oz' | 'stone';
export type TemperatureUnit = 'C' | 'F' | 'K';
export type SpeedUnit = 'km/h' | 'mph' | 'm/s' | 'knots';
export type VolumeUnit = 'L' | 'mL' | 'gal-US' | 'gal-imp' | 'qt-US' | 'pt-US' | 'fl-oz-US' | 'fl-oz-imp' | 'cu-m' | 'cu-ft';
export type FuelVolumeUnit = 'L' | 'gal-US' | 'gal-imp';
export type FuelEconomyUnit = 'km/L' | 'L/100km' | 'mpg-US' | 'mpg-imp';
export type AreaUnit = 'sq ft' | 'sq m' | 'sq yd' | 'acre' | 'hectare' | 'sq km' | 'sq mi';

export interface RegionalUnitDefaults {
  distance: DistanceUnit;
  shortDistance: DistanceUnit;
  personHeight: 'cm' | 'ft-in';
  mass: MassUnit;
  personWeight: 'kg' | 'lb' | 'stone-lb';
  temperature: TemperatureUnit;
  speed: SpeedUnit;
  volume: VolumeUnit;
  fuelVolume: FuelVolumeUnit;
  fuelEconomy: FuelEconomyUnit;
  propertyArea: AreaUnit;
  landArea: AreaUnit;
}

export interface CountryProfile {
  code: CountryCode;
  name: string;
  flag: string;
  defaultCurrency: CurrencyCode;
  measurementSystem: MeasurementSystem;
  locale: string;
  numberFormatting: 'indian' | 'international';
  defaults: RegionalUnitDefaults;
  standardSource: string; // Documenting CLDR / NIST / Legal Metrology source
}

export interface UserLocalizationPreferences {
  country: CountryCode;
  currency: CurrencyCode;
  isCountryExplicit: boolean;
  unitOverrides: Partial<Record<string, string>>; // contextKey -> overriddenUnit
}
