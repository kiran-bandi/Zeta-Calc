/**
 * Timeline, Cashflow, Scenario and Goal Engines
 * High-order financial calculation primitives enabling comparisons, timelines, and goal simulations.
 */

import { CashFlow, TimelinePoint } from '../contracts';

export class CashFlowEngine {
  /**
   * Generates a monthly amortization/contribution cash flow sequence.
   */
  static generateMonthlyFlows(
    principal: number,
    monthlyPayment: number,
    monthlyRate: number,
    totalMonths: number
  ): CashFlow[] {
    const flows: CashFlow[] = [];
    let balance = principal;

    for (let month = 1; month <= totalMonths; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(balance, monthlyPayment - interest);
      balance = Math.max(0, balance - principalPaid);

      flows.push({
        period: month,
        amount: monthlyPayment,
        type: 'payment',
        description: `Month ${month}: Principal ${principalPaid.toFixed(2)}, Interest ${interest.toFixed(2)}, Balance ${balance.toFixed(2)}`,
      });

      if (balance <= 0) break;
    }

    return flows;
  }
}

export class TimelineEngine {
  /**
   * Normalizes monthly values into unified timeline data points for Recharts and tables.
   */
  static generateAnnualTimeline(
    monthlyPoints: { period: number; principal: number; interest: number; balance: number }[]
  ): TimelinePoint[] {
    const annualMap = new Map<number, { principal: number; interest: number; balance: number }>();

    for (const pt of monthlyPoints) {
      const year = Math.ceil(pt.period / 12);
      const existing = annualMap.get(year) || { principal: 0, interest: 0, balance: pt.balance };
      existing.principal += pt.principal;
      existing.interest += pt.interest;
      existing.balance = pt.balance; // year-end balance
      annualMap.set(year, existing);
    }

    return Array.from(annualMap.entries()).map(([year, values]) => ({
      period: year,
      label: `Year ${year}`,
      values: {
        principalPaid: Math.round(values.principal),
        interestPaid: Math.round(values.interest),
        remainingBalance: Math.round(values.balance),
      },
    }));
  }
}

export interface Scenario<TInput, TOutput> {
  id: string;
  name: string;
  input: TInput;
  output?: TOutput;
}

export class ScenarioEngine {
  /**
   * Runs multiple input variations against a single deterministic engine and compares outcomes.
   */
  static compareScenarios<TInput, TOutput>(
    scenarios: Scenario<TInput, TOutput>[],
    engine: (input: TInput) => TOutput
  ): { id: string; name: string; input: TInput; output: TOutput }[] {
    return scenarios.map((s) => ({
      id: s.id,
      name: s.name,
      input: s.input,
      output: engine(s.input),
    }));
  }
}

export interface GoalInput {
  targetAmount: number;
  years: number;
  expectedAnnualReturnRate: number; // e.g. 12 for 12% p.a.
  initialSavings?: number;
}

export interface GoalResult {
  requiredMonthlySIP: number;
  totalTarget: number;
  futureValueOfInitial: number;
  shortfallCoveredBySIP: number;
  totalInvested: number;
  estimatedGains: number;
}

export class GoalEngine {
  static calculateMonthlyContribution(goal: GoalInput): GoalResult {
    const r = goal.expectedAnnualReturnRate / 100 / 12;
    const n = Math.round(goal.years * 12);
    const initial = goal.initialSavings || 0;

    // Future value of initial lump sum
    const futureInitial = initial * Math.pow(1 + r, n);
    const netTarget = Math.max(0, goal.targetAmount - futureInitial);

    let monthly = 0;
    if (r === 0) {
      monthly = n > 0 ? netTarget / n : 0;
    } else {
      // FV of annuity = P * [((1+r)^n - 1) / r] * (1+r)
      const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      monthly = factor > 0 ? netTarget / factor : 0;
    }

    const roundedMonthly = Math.round(monthly);
    const totalInvested = initial + roundedMonthly * n;
    const estimatedGains = Math.max(0, goal.targetAmount - totalInvested);

    return {
      requiredMonthlySIP: roundedMonthly,
      totalTarget: goal.targetAmount,
      futureValueOfInitial: Math.round(futureInitial),
      shortfallCoveredBySIP: Math.round(netTarget),
      totalInvested,
      estimatedGains,
    };
  }
}
