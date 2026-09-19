import React from 'react';
import { PhysicsCalculationResult } from '../../../engine/physicsEngine';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Props {
  result: PhysicsCalculationResult | null;
  emptyMessage?: string;
}

export const PhysicsResultDisplay: React.FC<Props> = ({
  result,
  emptyMessage = 'Enter the required parameters on the left to compute real-time physics results with step-by-step mathematical verification.',
}) => {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl min-h-[260px]">
        <Info className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {result.warning && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{result.warning}</span>
        </div>
      )}

      {/* Primary Result Banner */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl">
        <div className="text-[11px] font-bold tracking-wider uppercase text-sky-800 mb-1">
          Calculated Result
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {result.formattedResult}
        </div>
        <div className="text-xs text-sky-700 font-mono mt-1">
          Formula: {result.formulaUsed}
        </div>
      </div>

      {/* Secondary Values Grid */}
      {result.secondaryValues && result.secondaryValues.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {result.secondaryValues.map((sec, idx) => (
            <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500 font-medium truncate">{sec.label}</div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{sec.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Step-by-Step Mathematical Walkthrough */}
      {result.substitutionSteps && result.substitutionSteps.length > 0 && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step-by-Step Calculation</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {result.substitutionSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Trajectory or Interval Steps (if free fall or projectile) */}
      {result.trajectoryPoints && result.trajectoryPoints.length > 0 && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
            Trajectory Profile Data
          </div>
          <div className="max-h-40 overflow-y-auto text-[11px] font-mono border border-slate-100 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-slate-100 sticky top-0 text-slate-600">
                <tr>
                  <th className="px-2 py-1">Time (s)</th>
                  <th className="px-2 py-1">Distance X (m)</th>
                  <th className="px-2 py-1">Altitude Y (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.trajectoryPoints.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-2 py-1">{pt.t.toFixed(2)}s</td>
                    <td className="px-2 py-1">{pt.x.toFixed(2)}m</td>
                    <td className="px-2 py-1">{pt.y.toFixed(2)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.timeBreakdown && result.timeBreakdown.length > 0 && (
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
            Time-Interval Fall Progression
          </div>
          <div className="max-h-40 overflow-y-auto text-[11px] font-mono border border-slate-100 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-slate-100 sticky top-0 text-slate-600">
                <tr>
                  <th className="px-2 py-1">Time (s)</th>
                  <th className="px-2 py-1">Velocity (m/s)</th>
                  <th className="px-2 py-1">Fallen Distance (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.timeBreakdown.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-2 py-1">{pt.t.toFixed(2)}s</td>
                    <td className="px-2 py-1">{pt.v.toFixed(2)} m/s</td>
                    <td className="px-2 py-1">{pt.s.toFixed(2)} m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assumptions & Physical Constraints */}
      {result.assumptions && result.assumptions.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs">
          <div className="font-semibold text-slate-700 mb-1">Physical Assumptions:</div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500">
            {result.assumptions.map((assump, idx) => (
              <li key={idx}>{assump}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
