import React, { useEffect } from 'react';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { EMICalculatorView } from './EMICalculatorView';
import { TravelBudgetCalculatorView } from './TravelBudgetCalculatorView';
import { SimpleInterestCalculator } from './SimpleInterestCalculator';
import { GenericCalculatorView } from './GenericCalculatorView';
import { ExternalLink, Sparkles } from 'lucide-react';

interface EmbedCalculatorViewProps {
  toolSlug: string;
}

export const EmbedCalculatorView: React.FC<EmbedCalculatorViewProps> = ({ toolSlug }) => {
  const tool = TOOLS_REGISTRY.find((t) => t.slug === toolSlug);

  // postMessage communication for iframe resizing
  useEffect(() => {
    const notifyHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage(
        { type: 'zeta_calc_resize', toolSlug, height },
        '*'
      );
    };

    window.addEventListener('resize', notifyHeight);
    const observer = new ResizeObserver(notifyHeight);
    observer.observe(document.body);

    notifyHeight();

    return () => {
      window.removeEventListener('resize', notifyHeight);
      observer.disconnect();
    };
  }, [toolSlug]);

  if (!tool) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-medium">
        Calculator "{toolSlug}" not found.
      </div>
    );
  }

  const renderActiveCalculator = () => {
    if (tool.slug === 'emi-calculator') {
      return <EMICalculatorView />;
    }
    if (tool.slug === 'travel-budget-calculator') {
      return <TravelBudgetCalculatorView />;
    }
    if (tool.slug === 'simple-interest-calculator') {
      return <SimpleInterestCalculator />;
    }
    return <GenericCalculatorView tool={tool} />;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 antialiased text-slate-800">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Minimalist Embed Header with Zeta Calculator branding */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h1 className="text-sm font-bold text-slate-900">{tool.name}</h1>
          </div>
          <a
            href={`/#/tool/${tool.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Zeta Calculator</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* The Calculator UI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          {renderActiveCalculator()}
        </div>

        {/* Minimal Footer */}
        <div className="text-center pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Powered by Zeta Calculator • Free, Deterministic Mathematical Tools</span>
        </div>
      </div>
    </div>
  );
};
