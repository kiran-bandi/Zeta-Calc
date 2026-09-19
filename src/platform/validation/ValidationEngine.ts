/**
 * Universal Validation Engine
 * Provides pure validation routines adhering to core architectural rules:
 * - Empty remains empty (no default silent fallback)
 * - Explicit zero is recognized as a valid numeric input
 * - Out of range / negative values produce structured validation errors
 */

export interface ValidationRule<T = any> {
  field: string;
  validate: (val: T, allInputs?: Record<string, any>) => boolean;
  message: string;
}

export class ValidationEngine {
  static validateFields(
    inputs: Record<string, any>,
    rules: ValidationRule[]
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const val = inputs[rule.field];
      const pass = rule.validate(val, inputs);
      if (!pass) {
        errors[rule.field] = rule.message;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static isRequired(val: any): boolean {
    if (val === undefined || val === null || val === '') return false;
    return true;
  }

  static isNonNegative(val: any): boolean {
    if (!this.isRequired(val)) return true; // defer required check
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }

  static isPositive(val: any): boolean {
    if (!this.isRequired(val)) return true;
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }

  static isInRange(val: any, min: number, max: number): boolean {
    if (!this.isRequired(val)) return true;
    const num = Number(val);
    return !isNaN(num) && num >= min && num <= max;
  }
}
