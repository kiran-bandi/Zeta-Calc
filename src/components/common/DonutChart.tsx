import React from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  formattedValue?: string;
}

interface DonutChartProps {
  segments?: DonutSegment[];
  data?: DonutSegment[];
  centerTitle?: string;
  centerLabel?: string;
  centerSubtitle?: string;
  centerValue?: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  data,
  centerTitle,
  centerLabel,
  centerSubtitle,
  centerValue,
  size = 220,
}) => {
  const chartSegments = segments || data || [];
  const title = centerTitle || centerLabel;
  const subtitle = centerSubtitle || centerValue;

  const total = chartSegments.reduce((sum, s) => sum + Math.max(0, s?.value || 0), 0);
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center w-full min-w-0">
      <div className="relative w-full aspect-square flex items-center justify-center max-w-[220px]" style={{ maxWidth: size, maxHeight: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {total > 0 &&
            chartSegments.map((seg, idx) => {
              const portion = Math.max(0, seg.value) / total;
              const strokeDasharray = `${portion * circumference} ${circumference}`;
              const strokeDashoffset = -(accumulatedPercent * circumference);
              accumulatedPercent += portion;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
          {title && (
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate max-w-full px-1">
              {title}
            </span>
          )}
          {subtitle && (
            <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight mt-0.5 truncate max-w-full px-1">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 w-full text-xs">
        {chartSegments.map((seg, i) => {
          const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : '0';
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-600 font-medium">{seg.label}:</span>
              {seg.formattedValue && (
                <span className="font-semibold text-slate-900">{seg.formattedValue}</span>
              )}
              <span className="text-slate-400">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
