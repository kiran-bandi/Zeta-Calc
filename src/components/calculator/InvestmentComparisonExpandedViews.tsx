import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateSIPVsInstrument,
  calculateSIPVsSGB,
  calculateSWPVsFD,
} from '../../engine/investmentComparisons';
import { CurrencyInput } from '../common/CurrencyInput';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, Scale, CheckCircle2, TrendingUp } from 'lucide-react';

interface InvestmentComparisonExpandedViewsProps {
  toolSlug: string;
}

export const InvestmentComparisonExpandedViews: React.FC<InvestmentComparisonExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // Instrument configuration mapping
  const instrumentConfig = useMemo(() => {
    switch (toolSlug) {
      case 'sip-vs-fd-calculator':
        return { name: 'Fixed Deposit (FD)', defaultCompRate: 7.0, sipDefault: 13.0 };
      case 'sip-vs-nps-calculator':
        return { name: 'National Pension System (NPS)', defaultCompRate: 10.0, sipDefault: 13.0 };
      case 'sip-vs-ppf-calculator':
        return { name: 'Public Provident Fund (PPF)', defaultCompRate: 7.1, sipDefault: 13.0 };
      case 'sip-vs-rd-calculator':
        return { name: 'Recurring Deposit (RD)', defaultCompRate: 6.8, sipDefault: 13.0 };
      case 'sip-vs-scss-calculator':
        return { name: 'Senior Citizens Savings (SCSS)', defaultCompRate: 8.2, sipDefault: 13.0 };
      case 'sip-vs-gold-calculator':
        return { name: 'Physical / Digital Gold', defaultCompRate: 9.5, sipDefault: 13.0 };
      case 'sip-vs-sgb-calculator':
        return { name: 'Sovereign Gold Bond (SGB)', defaultCompRate: 11.5, sipDefault: 13.0 };
      case 'sip-vs-real-estate-calculator':
        return { name: 'Real Estate Investment', defaultCompRate: 9.0, sipDefault: 13.0 };
      default:
        return { name: 'Fixed Income Instrument', defaultCompRate: 7.0, sipDefault: 13.0 };
    }
  }, [toolSlug]);

  const [monthlyInv, setMonthlyInv] = useSessionState<number | ''>(`comp_${toolSlug}_monthly`, '');
  const [sipRate, setSipRate] = useSessionState<number | ''>(`comp_${toolSlug}_sip_rate`, instrumentConfig.sipDefault);
  const [compRate, setCompRate] = useSessionState<number | ''>(`comp_${toolSlug}_comp_rate`, instrumentConfig.defaultCompRate);
  const [years, setYears] = useSessionState<number | ''>(`comp_${toolSlug}_years`, 10);

  // SWP vs FD States
  const [swpCorpus, setSwpCorpus] = useSessionState<number | ''>('comp_swp_fd_corpus', '');
  const [swpMonthlyCash, setSwpMonthlyCash] = useSessionState<number | ''>('comp_swp_fd_cash', '');
  const [swpRate, setSwpRate] = useSessionState<number | ''>('comp_swp_fd_rate', 11);
  const [fdRate, setFdRate] = useSessionState<number | ''>('comp_swp_fd_fd_rate', 7);
  const [swpYears, setSwpYears] = useSessionState<number | ''>('comp_swp_fd_years', 10);

  const resetGenericComp = () => {
    setMonthlyInv('');
    setSipRate(instrumentConfig.sipDefault);
    setCompRate(instrumentConfig.defaultCompRate);
    setYears(10);
  };

  const resetSwpFd = () => {
    setSwpCorpus('');
    setSwpMonthlyCash('');
    setSwpRate(11);
    setFdRate(7);
    setSwpYears(10);
  };

  const comparisonResult = useMemo(() => {
    if (
      typeof monthlyInv !== 'number' || monthlyInv <= 0 ||
      typeof sipRate !== 'number' || sipRate <= 0 ||
      typeof compRate !== 'number' || compRate <= 0 ||
      typeof years !== 'number' || years <= 0
    ) {
      return null;
    }
    return calculateSIPVsInstrument(
      {
        monthlyInvestment: monthlyInv,
        sipReturnRate: sipRate,
        comparisonInstrumentRate: compRate,
        timePeriodYears: years,
      },
      instrumentConfig.name
    );
  }, [monthlyInv, sipRate, compRate, years, instrumentConfig.name]);

  const swpFdResult = useMemo(() => {
    if (toolSlug !== 'swp-vs-fd-calculator') return null;
    if (
      typeof swpCorpus !== 'number' || swpCorpus <= 0 ||
      typeof swpMonthlyCash !== 'number' || swpMonthlyCash <= 0 ||
      typeof swpRate !== 'number' || swpRate <= 0 ||
      typeof fdRate !== 'number' || fdRate <= 0 ||
      typeof swpYears !== 'number' || swpYears <= 0
    ) {
      return null;
    }
    return calculateSWPVsFD({
      principalCorpus: swpCorpus,
      monthlyCashflowNeeded: swpMonthlyCash,
      swpExpectedReturnRate: swpRate,
      fdInterestRate: fdRate,
      timePeriodYears: swpYears,
    });
  }, [toolSlug, swpCorpus, swpMonthlyCash, swpRate, fdRate, swpYears]);

  if (toolSlug === 'swp-vs-fd-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                SWP vs FD Monthly Payout Comparison
              </h2>
              <button
                type="button"
                onClick={resetSwpFd}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <CurrencyInput
              label="Initial Principal Corpus"
              value={swpCorpus}
              onChange={setSwpCorpus}
              min={500000}
              max={50000000}
              step={50000}
              placeholder="e.g. 1000000"
            />

            <CurrencyInput
              label="Target Monthly Cashflow"
              value={swpMonthlyCash}
              onChange={setSwpMonthlyCash}
              min={2000}
              max={500000}
              step={1000}
              placeholder="e.g. 10000"
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                label="SWP Mutual Fund Return (%)"
                value={swpRate}
                onChange={setSwpRate}
                min={1}
                max={20}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="FD Interest Rate (%)"
                value={fdRate}
                onChange={setFdRate}
                min={1}
                max={15}
                unitSuffix="%"
              />
            </div>

            <NumberSliderInput
              label="Time Horizon (Years)"
              value={swpYears}
              onChange={setSwpYears}
              min={1}
              max={30}
              unitSuffix="Years"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {swpFdResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  SWP Final Remaining Corpus
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(swpFdResult.swpFinalCorpus)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Cashflow Paid</span>
                    <span className="font-bold text-base text-white">{formatMoney(swpFdResult.totalCashflowReceived)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">FD Remaining Corpus</span>
                    <span className="font-bold text-base text-slate-300">{formatMoney(swpFdResult.fdFinalCorpus)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Remaining Corpus Comparison</h3>
                <DonutChart
                  size={180}
                  centerTitle="SWP"
                  centerSubtitle={formatMoney(swpFdResult.swpFinalCorpus)}
                  segments={[
                    {
                      label: 'SWP Remaining',
                      value: Math.max(0, swpFdResult.swpFinalCorpus),
                      color: '#2563eb',
                      formattedValue: formatMoney(swpFdResult.swpFinalCorpus),
                    },
                    {
                      label: 'FD Remaining',
                      value: Math.max(0, swpFdResult.fdFinalCorpus),
                      color: '#94a3b8',
                      formattedValue: formatMoney(swpFdResult.fdFinalCorpus),
                    },
                  ]}
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 font-semibold text-base text-emerald-950 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {swpFdResult.betterForWealthGrowth === 'swp'
                    ? 'SWP Delivers Superior Capital Preservation & Growth'
                    : 'FD Delivers Fixed Capital Guarantee'}
                </div>
                <p className="text-sm text-emerald-900">
                  After paying {formatMoney(swpFdResult.totalCashflowReceived)} in monthly cashflows over {swpYears} years,{' '}
                  SWP leaves <strong>{formatMoney(Math.abs(swpFdResult.differenceCorpus))}</strong> more remaining principal.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Scale className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter principal corpus and monthly cashflow needs</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard SIP vs Instrument Comparison
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              SIP vs {instrumentConfig.name}
            </h2>
            <button
              type="button"
              onClick={resetGenericComp}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <CurrencyInput
            label="Monthly Investment Amount"
            value={monthlyInv}
            onChange={setMonthlyInv}
            min={500}
            max={500000}
            step={500}
            placeholder="e.g. 5000"
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              label="SIP Expected Return (%)"
              value={sipRate}
              onChange={setSipRate}
              min={1}
              max={25}
              unitSuffix="%"
              required
            />
            <NumberSliderInput
              label={`${instrumentConfig.name} Rate (%)`}
              value={compRate}
              onChange={setCompRate}
              min={1}
              max={20}
              unitSuffix="%"
              required
            />
          </div>

          <NumberSliderInput
            label="Investment Tenure (Years)"
            value={years}
            onChange={setYears}
            min={1}
            max={35}
            unitSuffix="Years"
            required
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {comparisonResult ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                SIP Maturity Corpus
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                {formatMoney(comparisonResult.sipCorpus)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Total Invested</span>
                  <span className="font-bold text-base text-white">{formatMoney(comparisonResult.totalInvested)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">{instrumentConfig.name}</span>
                  <span className="font-bold text-base text-slate-300">{formatMoney(comparisonResult.comparisonCorpus)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Corpus Comparison</h3>
              <DonutChart
                size={180}
                centerTitle="SIP"
                centerSubtitle={formatMoney(comparisonResult.sipCorpus)}
                segments={[
                  {
                    label: 'SIP Corpus',
                    value: comparisonResult.sipCorpus,
                    color: '#2563eb',
                    formattedValue: formatMoney(comparisonResult.sipCorpus),
                  },
                  {
                    label: `${instrumentConfig.name} Corpus`,
                    value: comparisonResult.comparisonCorpus,
                    color: '#f59e0b',
                    formattedValue: formatMoney(comparisonResult.comparisonCorpus),
                  },
                ]}
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 font-semibold text-base text-emerald-950 mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Wealth Comparison Summary
              </div>
              <p className="text-sm text-emerald-900">{comparisonResult.recommendation}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <Scale className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter monthly investment and timeframe to compare</p>
          </div>
        )}
      </div>
    </div>
  );
};
