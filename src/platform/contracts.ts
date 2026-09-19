/**
 * Core Platform Contracts and Types
 * Represents the formalized contract for calculators, schemas, normalization, results, and engines.
 */

export type CalculatorType = 'calculate' | 'compare' | 'convert' | 'estimate' | 'plan' | 'decide';

export type MeasurementDimension =
  | 'length'
  | 'mass'
  | 'area'
  | 'volume'
  | 'temperature'
  | 'speed'
  | 'acceleration'
  | 'time'
  | 'force'
  | 'energy'
  | 'power'
  | 'pressure'
  | 'torque'
  | 'density'
  | 'angle'
  | 'voltage'
  | 'current'
  | 'resistance'
  | 'frequency'
  | 'charge'
  | 'data'
  | 'fuelEconomy';

export interface BaseInputDefinition {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  example?: string | number;
}

export interface NumberInputDefinition extends BaseInputDefinition {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
}

export interface CurrencyInputDefinition extends BaseInputDefinition {
  type: 'currency';
  min?: number;
  max?: number;
  step?: number;
  allowNegative?: boolean;
}

export interface PercentageInputDefinition extends BaseInputDefinition {
  type: 'percentage';
  min?: number;
  max?: number;
  step?: number;
  period?: 'annual' | 'monthly';
}

export interface MeasurementInputDefinition extends BaseInputDefinition {
  type: 'measurement';
  dimension: MeasurementDimension;
  allowedUnits: string[];
  defaultUnit: string;
}

export interface DurationInputDefinition extends BaseInputDefinition {
  type: 'duration';
  allowedUnits: ('years' | 'months' | 'days' | 'weeks')[];
  defaultUnit: 'years' | 'months' | 'days';
}

export interface SelectInputDefinition extends BaseInputDefinition {
  type: 'select';
  options: { label: string; value: string | number }[];
}

export interface DateInputDefinition extends BaseInputDefinition {
  type: 'date';
  minDate?: string;
  maxDate?: string;
}

export type InputDefinition =
  | NumberInputDefinition
  | CurrencyInputDefinition
  | PercentageInputDefinition
  | MeasurementInputDefinition
  | DurationInputDefinition
  | SelectInputDefinition
  | DateInputDefinition;

export interface ResultValue {
  id: string;
  label: string;
  value: number | string;
  formatted?: string;
  type?: 'currency' | 'percentage' | 'number' | 'text' | 'duration';
  highlight?: boolean;
  subtext?: string;
}

export interface TimelinePoint {
  period: number;
  label?: string;
  date?: string;
  values: Record<string, number>;
}

export interface CashFlow {
  period: number;
  date?: string;
  amount: number;
  type: 'contribution' | 'payment' | 'withdrawal' | 'income';
  description?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  type: 'donut' | 'bar' | 'line' | 'area';
  labels: string[];
  datasets?: ChartDataset[];
  slices?: { label: string; value: number; color?: string }[];
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: 'currency' | 'number' | 'percentage' | 'text';
}

export interface TableData {
  columns: TableColumn[];
  rows: Record<string, any>[];
}

export interface MethodologyDefinition {
  calculationMethod: string;
  formula?: string;
  assumptions?: string[];
  limitations?: string[];
}

export interface SourceReference {
  publisher: string;
  title: string;
  url?: string;
  effectiveDate?: string;
  retrievedDate?: string;
}

export interface CalculatorResult {
  primary: ResultValue[];
  secondary?: ResultValue[];
  breakdown?: { label: string; value: number; percentage?: number; color?: string }[];
  timeline?: TimelinePoint[];
  chart?: ChartData;
  table?: TableData;
  assumptions?: string[];
  methodology?: MethodologyDefinition;
  warnings?: string[];
  sources?: SourceReference[];
}

export interface ValidationDefinition<TInput = Record<string, any>> {
  validate: (input: TInput) => { isValid: boolean; errors: Record<string, string> };
}

export interface CalculatorEngineContract<TInput = Record<string, any>, TResult = CalculatorResult> {
  calculate: (input: TInput) => TResult;
}
