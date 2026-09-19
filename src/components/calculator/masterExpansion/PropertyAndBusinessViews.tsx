import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { CurrencyInput } from '../../common/CurrencyInput';
import {
  calculateLTV,
  calculatePropertyAppreciation,
  calculateRentalCashFlow,
  calculateMortgagePoints,
  calculateROAS,
  calculateCAC,
  calculateCLV,
  calculateGMROI,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const PROPERTY_BUSINESS_SLUGS = [
  'ltv-calculator',
  'property-appreciation-calculator',
  'rental-cash-flow-calculator',
  'mortgage-points-calculator',
  'roas-calculator',
  'cac-calculator',
  'clv-calculator',
  'gmroi-calculator',
];

export const PropertyAndBusinessViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. LTV
  const [ltvLoan, setLtvLoan] = useSessionState<number | ''>('ltv_loan', 320000);
  const [ltvValue, setLtvValue] = useSessionState<number | ''>('ltv_val', 400000);

  const ltvResult = useMemo(() => {
    if (typeof ltvLoan !== 'number' || typeof ltvValue !== 'number') return null;
    return calculateLTV({ loanAmount: ltvLoan, propertyValue: ltvValue });
  }, [ltvLoan, ltvValue]);

  // 2. Property Appreciation
  const [paVal, setPaVal] = useSessionState<number | ''>('pa_cur_val', 350000);
  const [paRate, setPaRate] = useSessionState<number | ''>('pa_appr_rate', 5);
  const [paYrs, setPaYrs] = useSessionState<number | ''>('pa_appr_yrs', 10);

  const appreciationResult = useMemo(() => {
    if (typeof paVal !== 'number' || typeof paRate !== 'number' || typeof paYrs !== 'number') return null;
    return calculatePropertyAppreciation({ currentValue: paVal, annualAppreciationRate: paRate, years: paYrs });
  }, [paVal, paRate, paYrs]);

  // 3. Rental Cash Flow
  const [rcRent, setRcRent] = useSessionState<number | ''>('rc_rent', 2200);
  const [rcVac, setRcVac] = useSessionState<number | ''>('rc_vac', 5);
  const [rcMort, setRcMort] = useSessionState<number | ''>('rc_mort', 1200);
  const [rcTax, setRcTax] = useSessionState<number | ''>('rc_tax', 3600);
  const [rcIns, setRcIns] = useSessionState<number | ''>('rc_ins', 1200);
  const [rcMaint, setRcMaint] = useSessionState<number | ''>('rc_maint', 150);
  const [rcMgmt, setRcMgmt] = useSessionState<number | ''>('rc_mgmt', 8);
  const [rcInit, setRcInit] = useSessionState<number | ''>('rc_init', 60000);

  const rentalCashFlowResult = useMemo(() => {
    if (typeof rcRent !== 'number') return null;
    return calculateRentalCashFlow({
      monthlyGrossRent: rcRent,
      vacancyRatePercent: typeof rcVac === 'number' ? rcVac : 0,
      monthlyMortgagePayment: typeof rcMort === 'number' ? rcMort : 0,
      annualPropertyTax: typeof rcTax === 'number' ? rcTax : 0,
      annualInsurance: typeof rcIns === 'number' ? rcIns : 0,
      monthlyMaintenance: typeof rcMaint === 'number' ? rcMaint : 0,
      propertyManagementPercent: typeof rcMgmt === 'number' ? rcMgmt : 0,
      totalInitialInvestment: typeof rcInit === 'number' ? rcInit : undefined,
    });
  }, [rcRent, rcVac, rcMort, rcTax, rcIns, rcMaint, rcMgmt, rcInit]);

  // 4. Mortgage Points
  const [mpLoan, setMpLoan] = useSessionState<number | ''>('mp_loan', 300000);
  const [mpCost, setMpCost] = useSessionState<number | ''>('mp_cost', 3000);
  const [mpRate1, setMpRate1] = useSessionState<number | ''>('mp_rate1', 6.5);
  const [mpRate2, setMpRate2] = useSessionState<number | ''>('mp_rate2', 6.125);
  const [mpYrs, setMpYrs] = useSessionState<number | ''>('mp_yrs', 30);

  const pointsResult = useMemo(() => {
    if (typeof mpLoan !== 'number' || typeof mpCost !== 'number' || typeof mpRate1 !== 'number' || typeof mpRate2 !== 'number') return null;
    return calculateMortgagePoints({
      loanAmount: mpLoan,
      pointsCost: mpCost,
      interestRateWithoutPoints: mpRate1,
      interestRateWithPoints: mpRate2,
      termYears: typeof mpYrs === 'number' ? mpYrs : 30,
    });
  }, [mpLoan, mpCost, mpRate1, mpRate2, mpYrs]);

  // 5. ROAS
  const [roasRev, setRoasRev] = useSessionState<number | ''>('roas_rev', 15000);
  const [roasSpd, setRoasSpd] = useSessionState<number | ''>('roas_spd', 3000);

  const roasResult = useMemo(() => {
    if (typeof roasRev !== 'number' || typeof roasSpd !== 'number') return null;
    return calculateROAS(roasRev, roasSpd);
  }, [roasRev, roasSpd]);

  // 6. CAC
  const [cacCost, setCacCost] = useSessionState<number | ''>('cac_cost', 12000);
  const [cacCust, setCacCust] = useSessionState<number | ''>('cac_cust', 80);

  const cacResult = useMemo(() => {
    if (typeof cacCost !== 'number' || typeof cacCust !== 'number') return null;
    return calculateCAC(cacCost, cacCust);
  }, [cacCost, cacCust]);

  // 7. CLV
  const [clvAov, setClvAov] = useSessionState<number | ''>('clv_aov', 120);
  const [clvFreq, setClvFreq] = useSessionState<number | ''>('clv_freq', 4);
  const [clvMargin, setClvMargin] = useSessionState<number | ''>('clv_margin', 65);
  const [clvLife, setClvLife] = useSessionState<number | ''>('clv_life', 3);
  const [clvCac, setClvCac] = useSessionState<number | ''>('clv_cac', 150);

  const clvResult = useMemo(() => {
    if (typeof clvAov !== 'number' || typeof clvFreq !== 'number' || typeof clvMargin !== 'number' || typeof clvLife !== 'number') return null;
    return calculateCLV({
      averagePurchaseValue: clvAov,
      purchaseFrequencyPerYear: clvFreq,
      grossMarginPercent: clvMargin,
      customerLifespanYears: clvLife,
      cac: typeof clvCac === 'number' ? clvCac : undefined,
    });
  }, [clvAov, clvFreq, clvMargin, clvLife, clvCac]);

  // 8. GMROI
  const [gmMargin, setGmMargin] = useSessionState<number | ''>('gm_margin', 45000);
  const [gmInv, setGmInv] = useSessionState<number | ''>('gm_inv', 30000);

  const gmroiResult = useMemo(() => {
    if (typeof gmMargin !== 'number' || typeof gmInv !== 'number') return null;
    return calculateGMROI(gmMargin, gmInv);
  }, [gmMargin, gmInv]);

  // RENDERING
  if (toolSlug === 'ltv-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Loan-to-Value (LTV) Ratio Calculator"
        onReset={() => {
          setLtvLoan(320000);
          setLtvValue(400000);
        }}
        inputs={
          <div className="space-y-4">
            <CurrencyInput
              id="ltv-loan"
              label="Mortgage / Loan Amount"
              value={ltvLoan}
              onChange={setLtvLoan}
              min={0}
            />
            <CurrencyInput
              id="ltv-value"
              label="Property Appraised Value"
              value={ltvValue}
              onChange={setLtvValue}
              min={0}
            />
          </div>
        }
        results={
          ltvResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Loan-to-Value Ratio</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{ltvResult.ltvPercentage}%</div>
                <div className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-medium">{ltvResult.riskCategory}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-xs text-slate-500">Home Equity %</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{ltvResult.equityPercentage}%</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-xs text-slate-500">Equity Amount</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{formatMoney(ltvResult.equityValue)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'property-appreciation-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Real Estate Property Appreciation Calculator"
        onReset={() => {
          setPaVal(350000);
          setPaRate(5);
          setPaYrs(10);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="pa-val"
              label="Current Property Value"
              value={paVal}
              onChange={setPaVal}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="pa-rate"
                label="Annual Appreciation Rate"
                value={paRate}
                onChange={setPaRate}
                suffix="%/yr"
                step={0.1}
                min={0}
                max={100}
              />
              <UnitNumberInput
                id="pa-yrs"
                label="Holding Period"
                value={paYrs}
                onChange={setPaYrs}
                suffix="Years"
                min={1}
                max={50}
              />
            </div>
          </div>
        }
        results={
          appreciationResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Estimated Future Value</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(appreciationResult.futureValue)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-xs text-slate-500">Total Capital Gain</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{formatMoney(appreciationResult.totalAppreciation)}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-xs text-slate-500">Total Percentage Gain</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">+{appreciationResult.totalPercentageGain}%</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'rental-cash-flow-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Rental Property Cash Flow & Cash-on-Cash Return"
        onReset={() => {
          setRcRent(2200);
          setRcVac(5);
          setRcMort(1200);
          setRcTax(3600);
          setRcIns(1200);
          setRcMaint(150);
          setRcMgmt(8);
          setRcInit(60000);
        }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="rc-rent"
                label="Monthly Gross Rent"
                value={rcRent}
                onChange={setRcRent}
                min={0}
              />
              <UnitNumberInput
                id="rc-vac"
                label="Vacancy Allowance"
                value={rcVac}
                onChange={setRcVac}
                suffix="%"
                min={0}
                max={50}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="rc-mort"
                label="Mortgage P&I (Monthly)"
                value={rcMort}
                onChange={setRcMort}
                min={0}
              />
              <CurrencyInput
                id="rc-tax"
                label="Annual Property Tax"
                value={rcTax}
                onChange={setRcTax}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CurrencyInput
                id="rc-ins"
                label="Annual Insurance"
                value={rcIns}
                onChange={setRcIns}
                min={0}
              />
              <CurrencyInput
                id="rc-maint"
                label="Monthly Maintenance"
                value={rcMaint}
                onChange={setRcMaint}
                min={0}
              />
              <UnitNumberInput
                id="rc-mgmt"
                label="Property Mgmt"
                value={rcMgmt}
                onChange={setRcMgmt}
                suffix="%"
                min={0}
                max={50}
              />
            </div>
            <CurrencyInput
              id="rc-init"
              label="Total Initial Cash Invested"
              value={rcInit}
              onChange={setRcInit}
              min={0}
            />
          </div>
        }
        results={
          rentalCashFlowResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Net Monthly Cash Flow</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(rentalCashFlowResult.netMonthlyCashFlow)} / mo</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Annual Cash Flow: {formatMoney(rentalCashFlowResult.annualNetCashFlow)} / yr</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Effective Rent</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(rentalCashFlowResult.effectiveMonthlyGrossIncome)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Monthly Expenses</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(rentalCashFlowResult.totalMonthlyOperatingExpenses)}</div>
                </div>
                {rentalCashFlowResult.cashOnCashReturnPercent != null && (
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950 rounded-lg border col-span-2 text-center">
                    <div className="text-blue-700 dark:text-blue-400 font-semibold">Cash-on-Cash Return</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-200">{rentalCashFlowResult.cashOnCashReturnPercent}%</div>
                  </div>
                )}
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'mortgage-points-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Mortgage Points Break-Even Calculator"
        onReset={() => {
          setMpLoan(300000);
          setMpCost(3000);
          setMpRate1(6.5);
          setMpRate2(6.125);
          setMpYrs(30);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="mp-loan"
              label="Mortgage Loan Amount"
              value={mpLoan}
              onChange={setMpLoan}
              min={0}
            />
            <CurrencyInput
              id="mp-cost"
              label="Upfront Points Cost"
              value={mpCost}
              onChange={setMpCost}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="mp-rate1"
                label="Rate w/o Points"
                value={mpRate1}
                onChange={setMpRate1}
                suffix="%"
                step={0.01}
                min={0}
                max={30}
              />
              <UnitNumberInput
                id="mp-rate2"
                label="Rate with Points"
                value={mpRate2}
                onChange={setMpRate2}
                suffix="%"
                step={0.01}
                min={0}
                max={30}
              />
            </div>
          </div>
        }
        results={
          pointsResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Break-Even Timeline</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{pointsResult.breakEvenMonths} Months ({pointsResult.breakEvenYears} yrs)</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Saves {formatMoney(pointsResult.monthlySavings)}/mo on mortgage payments.</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Net 30-Year Savings</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatMoney(pointsResult.totalSavingsOverTerm)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'roas-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="ROAS (Return on Ad Spend) Calculator"
        onReset={() => {
          setRoasRev(15000);
          setRoasSpd(3000);
        }}
        inputs={
          <div className="space-y-4">
            <CurrencyInput
              id="roas-rev"
              label="Total Advertising Revenue"
              value={roasRev}
              onChange={setRoasRev}
              min={0}
            />
            <CurrencyInput
              id="roas-spd"
              label="Total Ad Spend Cost"
              value={roasSpd}
              onChange={setRoasSpd}
              min={0}
            />
          </div>
        }
        results={
          roasResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">ROAS Multiplier</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{roasResult.roasMultiplier}x</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{roasResult.roasPercentage}% return on advertising dollars</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'cac-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="CAC (Customer Acquisition Cost) Calculator"
        onReset={() => {
          setCacCost(12000);
          setCacCust(80);
        }}
        inputs={
          <div className="space-y-4">
            <CurrencyInput
              id="cac-cost"
              label="Total Sales & Marketing Spend"
              value={cacCost}
              onChange={setCacCost}
              min={0}
            />
            <UnitNumberInput
              id="cac-cust"
              label="New Customers Acquired"
              value={cacCust}
              onChange={setCacCust}
              suffix="Customers"
              min={1}
            />
          </div>
        }
        results={
          cacResult ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Average Customer Acquisition Cost</span>
              <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{formatMoney(cacResult.cac)} / customer</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'clv-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Customer Lifetime Value (CLV / LTV) Calculator"
        onReset={() => {
          setClvAov(120);
          setClvFreq(4);
          setClvMargin(65);
          setClvLife(3);
          setClvCac(150);
        }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="clv-aov"
                label="Average Order Value"
                value={clvAov}
                onChange={setClvAov}
                min={0}
              />
              <UnitNumberInput
                id="clv-freq"
                label="Orders per Year"
                value={clvFreq}
                onChange={setClvFreq}
                suffix="orders/yr"
                min={1}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <UnitNumberInput
                id="clv-margin"
                label="Gross Margin"
                value={clvMargin}
                onChange={setClvMargin}
                suffix="%"
                min={0}
                max={100}
              />
              <UnitNumberInput
                id="clv-life"
                label="Customer Lifespan"
                value={clvLife}
                onChange={setClvLife}
                suffix="Years"
                min={0.1}
              />
              <CurrencyInput
                id="clv-cac"
                label="CAC (Optional)"
                value={clvCac}
                onChange={setClvCac}
                min={0}
              />
            </div>
          </div>
        }
        results={
          clvResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Customer Lifetime Value (CLV)</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(clvResult.customerLifetimeValue)}</div>
              </div>
              {clvResult.clvToCacRatio != null && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border text-xs flex justify-between items-center">
                  <span className="text-blue-800 dark:text-blue-300 font-semibold">CLV : CAC Ratio</span>
                  <span className="font-bold text-blue-900 dark:text-white text-base">{clvResult.clvToCacRatio}x (Healthy benchmark ≥ 3.0x)</span>
                </div>
              )}
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / GMROI
  return (
    <CompactCalculatorWorkspace
      title="GMROI (Gross Margin Return on Inventory Investment)"
      onReset={() => {
        setGmMargin(45000);
        setGmInv(30000);
      }}
      inputs={
        <div className="space-y-4">
          <CurrencyInput
            id="gm-margin"
            label="Total Annual Gross Margin"
            value={gmMargin}
            onChange={setGmMargin}
            min={0}
          />
          <CurrencyInput
            id="gm-inv"
            label="Average Inventory at Cost"
            value={gmInv}
            onChange={setGmInv}
            min={0}
          />
        </div>
      }
      results={
        gmroiResult ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">GMROI Ratio</span>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{gmroiResult.gmroiRatio}x</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{gmroiResult.gmroiPercent}% return per dollar of inventory held</div>
          </div>
        ) : null
      }
    />
  );
};
