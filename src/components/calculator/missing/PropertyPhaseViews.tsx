import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { Home, Trees, Layers, Box, Footprints, Grid } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import {
  calculateMortgagePrincipalInterest,
  calculateLandscapingCost,
  calculateDrywall,
  calculateLumberBoardFeet,
  calculateLumberStuds,
  calculateStairs,
  calculateCubicYards,
} from '../../../engine/propertyPhaseEngines';

export const PROPERTY_PHASE_SLUGS = [
  'mortgage-interest-vs-principal-calculator',
  'landscaping-cost-calculator',
  'drywall-calculator',
  'lumber-calculator',
  'stair-calculator',
  'cubic-yard-calculator',
];

interface Props {
  toolSlug: string;
}

export const PropertyPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Mortgage Interest vs Principal
  const [mipLoan, setMipLoan] = useState<number | ''>('');
  const [mipRate, setMipRate] = useState<number | ''>('');
  const [mipYears, setMipYears] = useState<number | ''>(30);
  const [mipExtra, setMipExtra] = useState<number | ''>(0);
  const mipResult = useMemo(
    () => calculateMortgagePrincipalInterest(mipLoan, mipRate, mipYears, mipExtra),
    [mipLoan, mipRate, mipYears, mipExtra]
  );

  // 2. Landscaping Cost
  const [landArea, setLandArea] = useState<number | ''>('');
  const [landUnit, setLandUnit] = useState<string>('sq ft');
  const [landMatCost, setLandMatCost] = useState<number | ''>('');
  const [landLabCost, setLandLabCost] = useState<number | ''>('');
  const landResult = useMemo(
    () => calculateLandscapingCost(landArea, landUnit, landMatCost, landLabCost),
    [landArea, landUnit, landMatCost, landLabCost]
  );

  // 3. Drywall Calculator
  const [dwLength, setDwLength] = useState<number | ''>('');
  const [dwHeight, setDwHeight] = useState<number | ''>('');
  const [dwWalls, setDwWalls] = useState<number | ''>(4);
  const [dwSheet, setDwSheet] = useState<'4x8' | '4x10' | '4x12'>('4x8');
  const dwResult = useMemo(
    () => calculateDrywall('dimensions', dwLength, dwHeight, dwWalls, '', dwSheet, 4, 8, 10, 'ft'),
    [dwLength, dwHeight, dwWalls, dwSheet]
  );

  // 4. Lumber Calculator
  const [lumMode, setLumMode] = useState<'board_feet' | 'studs'>('board_feet');
  const [lumThick, setLumThick] = useState<number | ''>(2);
  const [lumWidth, setLumWidth] = useState<number | ''>(4);
  const [lumLen, setLumLen] = useState<number | ''>(8);
  const [lumQty, setLumQty] = useState<number | ''>(10);
  const [lumWallLen, setLumWallLen] = useState<number | ''>('');
  const lumBfResult = useMemo(
    () => calculateLumberBoardFeet(lumThick, lumWidth, lumLen, lumQty, 'in', 'ft'),
    [lumThick, lumWidth, lumLen, lumQty]
  );
  const lumStudResult = useMemo(
    () => calculateLumberStuds(lumWallLen, 16, 2, 0, 'ft'),
    [lumWallLen]
  );

  // 5. Stair Calculator
  const [stairRise, setStairRise] = useState<number | ''>('');
  const [stairMaxRiser, setStairMaxRiser] = useState<number | ''>(7.75);
  const [stairTread, setStairTread] = useState<number | ''>(10);
  const stairResult = useMemo(
    () => calculateStairs(stairRise, stairMaxRiser, stairTread, 'in'),
    [stairRise, stairMaxRiser, stairTread]
  );

  // 6. Cubic Yard Calculator
  const [cyLength, setCyLength] = useState<number | ''>('');
  const [cyWidth, setCyWidth] = useState<number | ''>('');
  const [cyDepth, setCyDepth] = useState<number | ''>('');
  const cyResult = useMemo(
    () => calculateCubicYards(cyLength, cyWidth, cyDepth, 'ft', 'ft', 'in'),
    [cyLength, cyWidth, cyDepth]
  );

  // =========================================================================
  // VIEW 1: MORTGAGE INTEREST VS PRINCIPAL
  // =========================================================================
  if (toolSlug === 'mortgage-interest-vs-principal-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="mortgage-pi-calc"
        inputsTitle="Mortgage Terms"
        resultsTitle="Principal vs Interest Breakdown"
        onReset={() => {
          setMipLoan('');
          setMipRate('');
          setMipYears(30);
          setMipExtra(0);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Loan Amount / Principal"
              value={mipLoan}
              onChange={setMipLoan}
              min={10000}
              max={2000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 350000"
            />
            <NumberSliderInput
              label="Annual Interest Rate (%)"
              value={mipRate}
              onChange={setMipRate}
              min={0.1}
              max={20}
              step={0.125}
              suffix="%"
              placeholder="e.g. 6.5"
            />
            <NumberSliderInput
              label="Loan Term (Years)"
              value={mipYears}
              onChange={setMipYears}
              min={5}
              max={40}
              step={5}
              suffix="Years"
              placeholder="30"
            />
            <NumberSliderInput
              label="Extra Monthly Principal Payment"
              value={mipExtra}
              onChange={setMipExtra}
              min={0}
              max={5000}
              step={50}
              prefix={currencySymbol}
              placeholder="0"
            />
          </div>
        }
        results={
          mipResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-sky-300 font-semibold mb-1">
                  Monthly Payment (P&I)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(mipResult.monthlyPayment)} <span className="text-lg font-normal text-sky-300">/ mo</span>
                </div>
                <p className="text-sm text-sky-200">
                  Total lifetime repayment: {formatMoney(mipResult.totalPayments)} ({mipResult.interestPercent}% interest).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Total Principal Repaid</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(mipResult.totalPrincipal)}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">{mipResult.principalPercent}% of total</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Total Interest Paid</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(mipResult.totalInterest)}</div>
                  <div className="text-xs text-rose-600 font-semibold mt-0.5">{mipResult.interestPercent}% of total</div>
                </div>
              </div>

              {mipResult.crossoverYear && (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950">
                  <span className="font-bold">Principal Crossover Point:</span> In Year {mipResult.crossoverYear} (Month {mipResult.crossoverMonth}), your monthly payment transitions from majority interest to majority principal reduction.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Home className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter mortgage loan amount, interest rate, and term to view principal vs interest breakdown.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: LANDSCAPING COST
  // =========================================================================
  if (toolSlug === 'landscaping-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="landscaping-cost-calc"
        inputsTitle="Project Area & Cost per Unit"
        resultsTitle="Total Landscaping Estimate"
        onReset={() => {
          setLandArea('');
          setLandMatCost('');
          setLandLabCost('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <NumberSliderInput
                  label="Lawn / Yard Area"
                  value={landArea}
                  onChange={setLandArea}
                  min={50}
                  max={50000}
                  step={50}
                  placeholder="e.g. 1500"
                />
              </div>
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-24 px-2.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 mb-1"
              >
                <option value="sq ft">sq ft</option>
                <option value="sq m">sq m</option>
              </select>
            </div>

            <NumberSliderInput
              label={`Materials Cost (${currencySymbol} / ${landUnit})`}
              value={landMatCost}
              onChange={setLandMatCost}
              min={0.5}
              max={100}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 4.50"
            />

            <NumberSliderInput
              label={`Labor & Installation Cost (${currencySymbol} / ${landUnit})`}
              value={landLabCost}
              onChange={setLandLabCost}
              min={0.5}
              max={100}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 5.00"
            />
          </div>
        }
        results={
          landResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                  Estimated Total Project Cost
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(landResult.totalCost)}
                </div>
                <p className="text-sm text-emerald-200">
                  Unit cost: {formatMoney(landResult.costPerSqUnit)} / {landUnit}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Materials Subtotal</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(landResult.materialCost)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{landResult.materialPercent}% of total</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Labor Subtotal</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(landResult.laborCost)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{landResult.laborPercent}% of total</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Trees className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter yard area and cost per square unit to calculate landscaping cost estimate.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: DRYWALL CALCULATOR
  // =========================================================================
  if (toolSlug === 'drywall-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="drywall-calc"
        inputsTitle="Room / Wall Dimensions"
        resultsTitle="Drywall Sheets & Fasteners"
        onReset={() => {
          setDwLength('');
          setDwHeight('');
          setDwWalls(4);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Wall Length (Feet)"
              value={dwLength}
              onChange={setDwLength}
              min={1}
              max={100}
              step={1}
              suffix="ft"
              placeholder="e.g. 15"
            />
            <NumberSliderInput
              label="Ceiling / Wall Height (Feet)"
              value={dwHeight}
              onChange={setDwHeight}
              min={6}
              max={20}
              step={0.5}
              suffix="ft"
              placeholder="e.g. 9"
            />
            <NumberSliderInput
              label="Number of Walls"
              value={dwWalls}
              onChange={setDwWalls}
              min={1}
              max={12}
              step={1}
              placeholder="4"
            />
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Drywall Sheet Size</label>
              <select
                value={dwSheet}
                onChange={(e) => setDwSheet(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="4x8">4 × 8 ft (32 sq ft standard)</option>
                <option value="4x10">4 × 10 ft (40 sq ft)</option>
                <option value="4x12">4 × 12 ft (48 sq ft)</option>
              </select>
            </div>
          </div>
        }
        results={
          dwResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Required Drywall Sheets (incl. 10% waste)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {dwResult.requiredSheets} <span className="text-xl font-normal text-amber-300">Sheets ({dwResult.sheetType})</span>
                </div>
                <p className="text-sm text-amber-200">
                  Total surface area: {dwResult.totalAreaSqFt} sq ft ({dwResult.totalAreaSqM} m²).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Drywall Screws</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">~{dwResult.screwsCount} pcs</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Joint Compound</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">~{dwResult.jointCompoundGallons} gal</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Drywall Tape</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">~{dwResult.drywallTapeFeet} ft</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter room dimensions to calculate required drywall sheet count, screws, and mud.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 4: LUMBER CALCULATOR
  // =========================================================================
  if (toolSlug === 'lumber-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="lumber-calc"
        inputsTitle="Lumber Calculation Mode"
        resultsTitle="Board Feet & Framing Studs"
        onReset={() => {
          setLumThick(2);
          setLumWidth(4);
          setLumLen(8);
          setLumQty(10);
          setLumWallLen('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLumMode('board_feet')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${lumMode === 'board_feet' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                Board Feet (FBM)
              </button>
              <button
                type="button"
                onClick={() => setLumMode('studs')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${lumMode === 'studs' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                Wall Stud Estimator
              </button>
            </div>

            {lumMode === 'board_feet' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <NumberSliderInput
                    label="Thickness (in)"
                    value={lumThick}
                    onChange={setLumThick}
                    min={0.5}
                    max={12}
                    step={0.25}
                    suffix="in"
                    placeholder="2"
                  />
                  <NumberSliderInput
                    label="Width (in)"
                    value={lumWidth}
                    onChange={setLumWidth}
                    min={1}
                    max={24}
                    step={0.5}
                    suffix="in"
                    placeholder="4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberSliderInput
                    label="Length (ft)"
                    value={lumLen}
                    onChange={setLumLen}
                    min={1}
                    max={24}
                    step={1}
                    suffix="ft"
                    placeholder="8"
                  />
                  <NumberSliderInput
                    label="Quantity"
                    value={lumQty}
                    onChange={setLumQty}
                    min={1}
                    max={500}
                    step={1}
                    placeholder="10"
                  />
                </div>
              </>
            ) : (
              <NumberSliderInput
                label="Framed Wall Length (Feet)"
                value={lumWallLen}
                onChange={setLumWallLen}
                min={1}
                max={200}
                step={1}
                suffix="ft"
                placeholder="e.g. 24"
              />
            )}
          </div>
        }
        results={
          lumMode === 'board_feet' && lumBfResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Total Board Feet (FBM)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {lumBfResult.totalBoardFeet} <span className="text-xl font-normal text-amber-300">BF</span>
                </div>
                <p className="text-sm text-amber-200">
                  {lumBfResult.quantity} pieces @ {lumBfResult.boardFeetPerPiece} BF each ({lumBfResult.totalLinearFeet} linear ft).
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950">
                <span className="font-bold">Formula:</span> Board Feet = (Thickness (in) × Width (in) × Length (ft)) / 12
              </div>
            </div>
          ) : lumMode === 'studs' && lumStudResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Total Studs Recommended (16" OC)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {lumStudResult.totalStudsRecommended} <span className="text-xl font-normal text-amber-300">Studs</span>
                </div>
                <p className="text-sm text-amber-200">
                  Includes {lumStudResult.baseStuds} wall studs, {lumStudResult.topBottomPlatesStuds} plates, and {lumStudResult.cornerStuds} corner backers.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter lumber dimensions or wall length to calculate board feet or framing studs.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 5: STAIR CALCULATOR
  // =========================================================================
  if (toolSlug === 'stair-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="stair-calc"
        inputsTitle="Stairway Rise & Constraints"
        resultsTitle="Riser & Tread Geometry (IRC Code)"
        onReset={() => {
          setStairRise('');
          setStairMaxRiser(7.75);
          setStairTread(10);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Total Vertical Rise (Finished Floor to Floor)"
              value={stairRise}
              onChange={setStairRise}
              min={12}
              max={240}
              step={0.5}
              suffix="in"
              placeholder="e.g. 108"
            />
            <NumberSliderInput
              label="Max Permissible Riser Height"
              value={stairMaxRiser}
              onChange={setStairMaxRiser}
              min={6}
              max={9}
              step={0.125}
              suffix="in"
              placeholder="7.75"
            />
            <NumberSliderInput
              label="Preferred Tread Depth (Run)"
              value={stairTread}
              onChange={setStairTread}
              min={9}
              max={14}
              step={0.5}
              suffix="in"
              placeholder="10"
            />
          </div>
        }
        results={
          stairResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Stairway Layout ({stairResult.riserCount} Risers)
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  {stairResult.actualRiserHeightInches}" Riser × {stairResult.treadDepthInches}" Tread
                </div>
                <p className="text-sm text-indigo-200">
                  Total horizontal run: {stairResult.totalRunFeet} ft ({stairResult.totalRunInches} inches). Stringer length: {stairResult.stringerLengthFeet} ft.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Incline Pitch Angle</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{stairResult.inclineAngleDegrees}°</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Comfort Rule (2R + T)</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">{stairResult.comfortRuleScore}" (Ideal: 24–25")</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Footprints className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter total floor-to-floor rise to calculate code-compliant riser and tread steps.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 6: CUBIC YARD CALCULATOR
  // =========================================================================
  if (toolSlug === 'cubic-yard-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="cubic-yard-calc"
        inputsTitle="Volume Dimensions"
        resultsTitle="Cubic Yards & Material Weights"
        onReset={() => {
          setCyLength('');
          setCyWidth('');
          setCyDepth('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Length (Feet)"
              value={cyLength}
              onChange={setCyLength}
              min={1}
              max={200}
              step={1}
              suffix="ft"
              placeholder="e.g. 20"
            />
            <NumberSliderInput
              label="Width (Feet)"
              value={cyWidth}
              onChange={setCyWidth}
              min={1}
              max={200}
              step={1}
              suffix="ft"
              placeholder="e.g. 10"
            />
            <NumberSliderInput
              label="Depth / Thickness (Inches)"
              value={cyDepth}
              onChange={setCyDepth}
              min={1}
              max={36}
              step={0.5}
              suffix="in"
              placeholder="e.g. 4"
            />
          </div>
        }
        results={
          cyResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Required Volume
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {cyResult.cubicYards} <span className="text-xl font-normal text-amber-300">Cubic Yards (yd³)</span>
                </div>
                <p className="text-sm text-amber-200">
                  Equivalent to {cyResult.cubicFeet} cubic feet ({cyResult.cubicMeters} m³).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Gravel Weight (tons)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">~{cyResult.gravelTons} tons</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Topsoil Weight (tons)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">~{cyResult.topsoilTons} tons</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">60 lb Concrete Bags</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{cyResult.concreteBags60lb} bags</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">80 lb Concrete Bags</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{cyResult.concreteBags80lb} bags</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Grid className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter length, width, and depth to calculate cubic yards and premix concrete bags.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
