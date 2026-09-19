import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculatePPF,
  calculateNPS,
  calculateEPF,
  calculateSSY,
  calculateKVP,
  calculatePOMIS,
  calculateSCSS,
  calculateNSC,
  calculateAPY,
  calculatePORD,
} from '../../engine/governmentSchemes';
import { calculateCompoundInterest } from '../../engine/financial';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, Landmark, CheckCircle2 } from 'lucide-react';

interface GovernmentSchemesExpandedViewsProps {
  toolSlug: string;
}

export const GovernmentSchemesExpandedViews: React.FC<GovernmentSchemesExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. PPF
  const [ppfDep, setPpfDep] = useSessionState<number | ''>('ppf_dep', '');
  const [ppfRate, setPpfRate] = useSessionState<number | ''>('ppf_rate', 7.1);
  const [ppfTenure, setPpfTenure] = useSessionState<number | ''>('ppf_tenure', 15);

  // 2. NPS
  const [npsAge, setNpsAge] = useSessionState<number | ''>('nps_age', '');
  const [npsMonthly, setNpsMonthly] = useSessionState<number | ''>('nps_monthly', '');
  const [npsReturn, setNpsReturn] = useSessionState<number | ''>('nps_return', 10);
  const [npsAnnuityPct, setNpsAnnuityPct] = useSessionState<number | ''>('nps_annuity_pct', 40);

  // 3. EPF & VPF
  const [epfBasic, setEpfBasic] = useSessionState<number | ''>('epf_basic', '');
  const [epfVpf, setEpfVpf] = useSessionState<number | ''>('epf_vpf', '');
  const [epfAge, setEpfAge] = useSessionState<number | ''>('epf_age', '');
  const [epfHike, setEpfHike] = useSessionState<number | ''>('epf_hike', 5);
  const [epfRate, setEpfRate] = useSessionState<number | ''>('epf_rate', 8.25);

  // 4. SSY
  const [ssyDep, setSsyDep] = useSessionState<number | ''>('ssy_dep', '');
  const [ssyRate, setSsyRate] = useSessionState<number | ''>('ssy_rate', 8.2);

  // 5. Generic PO / Small Savings deposit
  const [govDep, setGovDep] = useSessionState<number | ''>(`gov_${toolSlug}_dep`, '');
  const [govRate, setGovRate] = useSessionState<number | ''>(`gov_${toolSlug}_rate`, '');

  // 6. APY
  const [apyAge, setApyAge] = useSessionState<number | ''>('apy_age', '');
  const [apyPension, setApyPension] = useSessionState<1000 | 2000 | 3000 | 4000 | 5000>('apy_pension', 5000);

  // Handlers
  const ppfResult = useMemo(() => {
    if (typeof ppfDep !== 'number' || ppfDep <= 0) return null;
    return calculatePPF({
      yearlyInvestment: ppfDep,
      interestRate: typeof ppfRate === 'number' ? ppfRate : 7.1,
      tenureYears: typeof ppfTenure === 'number' ? ppfTenure : 15,
    });
  }, [ppfDep, ppfRate, ppfTenure]);

  const npsResult = useMemo(() => {
    if (typeof npsAge !== 'number' || npsAge <= 0 || typeof npsMonthly !== 'number' || npsMonthly <= 0) return null;
    return calculateNPS({
      currentAge: npsAge,
      monthlyInvestment: npsMonthly,
      expectedAnnualReturnRate: typeof npsReturn === 'number' ? npsReturn : 10,
      annuityPercentage: typeof npsAnnuityPct === 'number' ? npsAnnuityPct : 40,
    });
  }, [npsAge, npsMonthly, npsReturn, npsAnnuityPct]);

  const epfResult = useMemo(() => {
    if (typeof epfBasic !== 'number' || epfBasic <= 0 || typeof epfAge !== 'number' || epfAge <= 0) return null;
    return calculateEPF({
      currentMonthlyBasicSalary: epfBasic,
      vpfContributionAmount: typeof epfVpf === 'number' ? epfVpf : 0,
      currentAge: epfAge,
      annualSalaryGrowthRate: typeof epfHike === 'number' ? epfHike : 5,
      interestRate: typeof epfRate === 'number' ? epfRate : 8.25,
    });
  }, [epfBasic, epfVpf, epfAge, epfHike, epfRate]);

  const ssyResult = useMemo(() => {
    if (typeof ssyDep !== 'number' || ssyDep <= 0) return null;
    return calculateSSY({
      yearlyDeposit: ssyDep,
      interestRate: typeof ssyRate === 'number' ? ssyRate : 8.2,
    });
  }, [ssyDep, ssyRate]);

  const kvpResult = useMemo(() => {
    if (typeof govDep !== 'number' || govDep <= 0) return null;
    return calculateKVP({
      depositAmount: govDep,
      interestRate: typeof govRate === 'number' ? govRate : 7.5,
    });
  }, [govDep, govRate]);

  const pomisResult = useMemo(() => {
    if (typeof govDep !== 'number' || govDep <= 0) return null;
    return calculatePOMIS({
      depositAmount: govDep,
      interestRate: typeof govRate === 'number' ? govRate : 7.4,
    });
  }, [govDep, govRate]);

  const scssResult = useMemo(() => {
    if (typeof govDep !== 'number' || govDep <= 0) return null;
    return calculateSCSS({
      depositAmount: govDep,
      interestRate: typeof govRate === 'number' ? govRate : 8.2,
    });
  }, [govDep, govRate]);

  const nscResult = useMemo(() => {
    if (typeof govDep !== 'number' || govDep <= 0) return null;
    return calculateNSC({
      depositAmount: govDep,
      interestRate: typeof govRate === 'number' ? govRate : 7.7,
    });
  }, [govDep, govRate]);

  const apyResult = useMemo(() => {
    if (typeof apyAge !== 'number' || apyAge <= 0) return null;
    return calculateAPY({
      entryAge: apyAge,
      targetMonthlyPension: apyPension,
    });
  }, [apyAge, apyPension]);

  const pordResult = useMemo(() => {
    if (typeof govDep !== 'number' || govDep <= 0) return null;
    return calculatePORD({
      monthlyDeposit: govDep,
      interestRate: typeof govRate === 'number' ? govRate : 6.7,
    });
  }, [govDep, govRate]);

  if (toolSlug === 'ppf-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                PPF Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPpfDep('');
                  setPpfRate(7.1);
                  setPpfTenure(15);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Annual PPF Deposit (Max ₹1.5 Lakh)"
              value={ppfDep}
              onChange={setPpfDep}
              min={500}
              max={150000}
              step={500}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="PPF Interest Rate (%)"
              value={ppfRate}
              onChange={setPpfRate}
              min={5}
              max={10}
              step={0.1}
              unitSuffix="%"
            />

            <NumberSliderInput
              label="Tenure (Years)"
              value={ppfTenure}
              onChange={setPpfTenure}
              min={15}
              max={30}
              step={5}
              unitSuffix="Years"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {ppfResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  PPF Maturity Value (Tax-Free EEE)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(ppfResult.maturityAmount)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Deposit</span>
                    <span className="font-bold text-base text-white">{formatMoney(ppfResult.totalInvested)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Total Interest</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(ppfResult.totalInterestEarned)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="MATURITY"
                  centerSubtitle={formatMoney(ppfResult.maturityAmount)}
                  segments={[
                    {
                      label: 'Total Deposit',
                      value: ppfResult.totalInvested,
                      color: '#2563eb',
                      formattedValue: formatMoney(ppfResult.totalInvested),
                    },
                    {
                      label: 'Interest Earned',
                      value: ppfResult.totalInterestEarned,
                      color: '#10b981',
                      formattedValue: formatMoney(ppfResult.totalInterestEarned),
                    },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Landmark className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter annual PPF deposit to calculate tax-free maturity value</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolSlug === 'nps-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                NPS Contribution Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setNpsAge('');
                  setNpsMonthly('');
                  setNpsReturn(10);
                  setNpsAnnuityPct(40);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Your Current Age"
              value={npsAge}
              onChange={setNpsAge}
              min={18}
              max={65}
              unitSuffix="Yrs"
              required
            />

            <NumberSliderInput
              label="Monthly NPS Investment"
              value={npsMonthly}
              onChange={setNpsMonthly}
              min={500}
              max={200000}
              step={500}
              unitPrefix={currencySymbol}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                label="Expected Return (%)"
                value={npsReturn}
                onChange={setNpsReturn}
                min={5}
                max={15}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="Annuity Ratio (%)"
                value={npsAnnuityPct}
                onChange={setNpsAnnuityPct}
                min={40}
                max={100}
                unitSuffix="%"
                helperText="Min 40% mandatory"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {npsResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Retirement Corpus at Age 60
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(npsResult.totalAccumulatedCorpus)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Invested</span>
                    <span className="font-bold text-base text-white">{formatMoney(npsResult.totalInvested)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Monthly Pension</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(npsResult.expectedMonthlyPension)}/mo</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="CORPUS"
                  centerSubtitle={formatMoney(npsResult.totalAccumulatedCorpus)}
                  segments={[
                    {
                      label: 'Tax-Free Lump Sum',
                      value: npsResult.lumpSumAmount,
                      color: '#2563eb',
                      formattedValue: formatMoney(npsResult.lumpSumAmount),
                    },
                    {
                      label: 'Annuity Reinvestment',
                      value: npsResult.annuityAmount,
                      color: '#10b981',
                      formattedValue: formatMoney(npsResult.annuityAmount),
                    },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Lump Sum (Withdrawal)</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(npsResult.lumpSumAmount)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Monthly Pension</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">{formatMoney(npsResult.expectedMonthlyPension)}/mo</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Landmark className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter age and monthly contribution to project NPS pension</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Generic view for SSY, KVP, POMIS, SCSS, NSC, APY, PO RD
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              Deposit & Scheme Parameters
            </h2>
            <button
              type="button"
              onClick={() => {
                setGovDep('');
                setGovRate('');
                setSsyDep('');
                setApyAge('');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {toolSlug === 'ssy-calculator' ? (
            <>
              <NumberSliderInput
                label="Yearly SSY Deposit (Max ₹1.5 Lakh)"
                value={ssyDep}
                onChange={setSsyDep}
                min={250}
                max={150000}
                step={250}
                unitPrefix={currencySymbol}
                required
              />
              <NumberSliderInput
                label="Interest Rate (%)"
                value={ssyRate}
                onChange={setSsyRate}
                min={5}
                max={12}
                unitSuffix="%"
              />
            </>
          ) : toolSlug === 'apy-calculator' ? (
            <>
              <NumberSliderInput
                label="Your Entry Age (18 to 40)"
                value={apyAge}
                onChange={setApyAge}
                min={18}
                max={40}
                unitSuffix="Yrs"
                required
              />
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-2">Target Guaranteed Monthly Pension</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1000, 2000, 3000, 4000, 5000].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setApyPension(p as any)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition ${
                        apyPension === p
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {currencySymbol}{p}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <NumberSliderInput
                label="Deposit Amount"
                value={govDep}
                onChange={setGovDep}
                min={1000}
                max={3000000}
                step={1000}
                unitPrefix={currencySymbol}
                required
              />
              <NumberSliderInput
                label="Annual Interest Rate (%)"
                value={govRate}
                onChange={setGovRate}
                min={1}
                max={15}
                step={0.1}
                unitSuffix="%"
                placeholder="Standard scheme rate"
              />
            </>
          )}
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {toolSlug === 'ssy-calculator' && ssyResult ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                SSY Maturity Value (at 21 Yrs)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                {formatMoney(ssyResult.maturityAmount)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Total Invested (15 yrs)</span>
                  <span className="font-bold text-base text-white">{formatMoney(ssyResult.totalInvested)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Interest Earned</span>
                  <span className="font-bold text-base text-emerald-400">+{formatMoney(ssyResult.totalInterestEarned)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
              <DonutChart
                size={180}
                centerTitle="MATURITY"
                centerSubtitle={formatMoney(ssyResult.maturityAmount)}
                segments={[
                  {
                    label: 'Total Invested',
                    value: ssyResult.totalInvested,
                    color: '#2563eb',
                    formattedValue: formatMoney(ssyResult.totalInvested),
                  },
                  {
                    label: 'Interest Earned',
                    value: ssyResult.totalInterestEarned,
                    color: '#10b981',
                    formattedValue: formatMoney(ssyResult.totalInterestEarned),
                  },
                ]}
              />
            </div>
          </div>
        ) : toolSlug === 'apy-calculator' && apyResult ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 text-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Required Monthly Contribution
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                {formatMoney(apyResult.monthlyContribution)} <span className="text-base font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-xs text-slate-400">for {apyResult.contributionYears} years until age 60</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Guaranteed Pension at 60:</span>
                <span className="font-bold text-emerald-700">{formatMoney(apyResult.guaranteedMonthlyPension)}/mo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Nominee Return Corpus:</span>
                <span className="font-semibold text-slate-900">{formatMoney(apyResult.guaranteedCorpusToNominee)}</span>
              </div>
            </div>
          </div>
        ) : pomisResult && toolSlug === 'pomis-calculator' ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 text-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Guaranteed Monthly Income
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                {formatMoney(pomisResult.monthlyIncome)} <span className="text-base font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-xs text-slate-400">Total Payout over 5 years: {formatMoney(pomisResult.totalIncomeOver5Years)}</p>
            </div>
          </div>
        ) : kvpResult && toolSlug === 'kvp-calculator' ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Doubled Maturity Value
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                {formatMoney(kvpResult.maturityAmount)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Deposit Amount</span>
                  <span className="font-bold text-base text-white">{formatMoney(kvpResult.depositAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Doubling Period</span>
                  <span className="font-bold text-base text-emerald-400">{kvpResult.doublingYearsString}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
              <DonutChart
                size={180}
                centerTitle="MATURITY"
                centerSubtitle={formatMoney(kvpResult.maturityAmount)}
                segments={[
                  {
                    label: 'Deposit Amount',
                    value: kvpResult.depositAmount,
                    color: '#2563eb',
                    formattedValue: formatMoney(kvpResult.depositAmount),
                  },
                  {
                    label: 'Gain / Interest',
                    value: kvpResult.depositAmount,
                    color: '#10b981',
                    formattedValue: formatMoney(kvpResult.depositAmount),
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <Landmark className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter deposit amount to view returns</p>
          </div>
        )}
      </div>
    </div>
  );
};
