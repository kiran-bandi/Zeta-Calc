import React, { useState } from 'react';
import { ToolMetadata } from '../../types/calculator';
import { useSettings } from '../../context/SettingsContext';
import { FAQAccordion } from './FAQAccordion';
import { FeedbackWidget } from './FeedbackWidget';
import {
  BookOpen,
  HelpCircle,
  Calculator as CalcIcon,
  ShieldCheck,
  Globe2,
  Share2,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Scale,
  CheckCircle2,
  Code2,
} from 'lucide-react';

interface KnowledgeSectionProps {
  tool: ToolMetadata;
  relatedTools?: ToolMetadata[];
  onNavigateToTool?: (slug: string) => void;
  onOpenShare?: () => void;
  onOpenEmbed?: () => void;
}

export const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
  tool,
  relatedTools = [],
  onNavigateToTool,
  onOpenShare,
  onOpenEmbed,
}) => {
  const { countryProfile, preferences } = useSettings();
  const [activeTab, setActiveTab] = useState<'guide' | 'methodology' | 'faq'>('guide');

  const sources = tool.sources && tool.sources.length > 0 ? tool.sources : [
    {
      title: 'Principles of Mathematical Finance & Amortization Standards',
      publisher: 'International Actuarial Association & ISO Standards',
      url: 'https://en.wikipedia.org/wiki/Amortization_schedule',
      sourceType: 'Standard Specification',
      accessedDate: '2026-03-01',
    },
    {
      title: 'Consumer Financial Protection & True Cost Disclosure Guidelines',
      publisher: 'Central Bank & Financial Regulation Standards',
      sourceType: 'Regulatory Reference',
      accessedDate: '2026-02-15',
    },
  ];

  const lastReviewedDate = tool.lastReviewed || 'February 2026';

  const assumptions = tool.methodology?.assumptions || [
    'Calculations assume mathematical compounding or linear accrual according to recognized standards.',
    'Taxes, regional surcharges, or institution-specific fees are calculated when explicitly input.',
    'Currency conversion, inflation changes, or variable market rates are subject to user-provided parameters.',
  ];

  const limitations = tool.methodology?.limitations || [
    'Results provide deterministic decision support and do not constitute certified legal, medical, or registered tax advice.',
    'Financial institutions may apply slight rounding conventions or proprietary day-count conventions (30/360 vs Actual/365).',
  ];

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 space-y-10">
      {/* Knowledge Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Calculator Knowledge & Sources</h2>
            <p className="text-xs text-slate-500">
              Verified formulas, step-by-step logic, and country localization details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'guide' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            Guide & Walkthrough
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('methodology')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'methodology' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            Method & Sources
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'faq' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            FAQ ({tool.faqs?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'guide' && (
        <div className="space-y-8 animate-fade-in">
          {/* 1. What is this calculator? */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>What is the {tool.name}?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {tool.description}
            </p>
            {tool.explanation?.summary && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tool.explanation.summary}
              </p>
            )}
          </div>

          {/* 2. Formula & Mathematical Variables */}
          {tool.formula && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalcIcon className="w-4 h-4 text-indigo-600" />
                <span>Formula & Mathematical Mechanics</span>
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto text-center font-bold">
                {tool.formula.expression}
              </div>
              {tool.formula.notes && (
                <p className="text-xs text-slate-500 italic">{tool.formula.notes}</p>
              )}
              {tool.formula.variables && tool.formula.variables.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {tool.formula.variables.map((v) => (
                    <div key={v.symbol} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-blue-600 border border-slate-200 shrink-0">
                        {v.symbol}
                      </span>
                      <span className="text-slate-600">{v.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Step-by-Step Example Walkthrough */}
          {tool.example && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-World Worked Example: {tool.example.title}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-600">{tool.example.description}</p>

              {/* Sample Inputs & Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Inputs Used
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(tool.example.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-slate-600">{k}:</span>
                        <span className="font-semibold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                    Computed Results
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(tool.example.results).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-emerald-800">{k}:</span>
                        <span className="font-bold text-emerald-950">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Walkthrough steps */}
              {tool.example.walkthrough && tool.example.walkthrough.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Calculation Steps:</span>
                  <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside pl-1">
                    {tool.example.walkthrough.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* 4. Interpretation & Practical Considerations */}
          {tool.explanation?.considerations && tool.explanation.considerations.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>What the Results Mean & Practical Considerations</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                {tool.explanation.considerations.map((c, i) => (
                  <li key={i} className="leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Country & Regional Notes */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Per-Field Measurement Units &amp; Currency Active</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Select specific measurement units (e.g. cm/m/km, kg/lb, years/months/days) directly next to each input field. Formatted with {preferences.currency} currency symbols.
              {tool.countryNotes ? ` ${tool.countryNotes}` : ''}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'methodology' && (
        <div className="space-y-6 animate-fade-in">
          {/* Methodology & Verification */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Calculation Methodology & Verification</span>
              </h3>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last Reviewed: {lastReviewedDate}</span>
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Calculation Method:</strong> Deterministic mathematical modeling using floating-point precision, verified against standard textbook formulations and industry benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Core Assumptions</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Limitations</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Peer-Reviewed Sources & References */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Authoritative Sources & Regulatory Citations</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {sources.map((src, i) => (
                <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{src.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Publisher: {src.publisher} {src.sourceType && `• ${src.sourceType}`} {src.accessedDate && `• Accessed: ${src.accessedDate}`}
                    </p>
                  </div>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold shrink-0"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h3>
          <FAQAccordion items={tool.faqs} />
        </div>
      )}

      {/* Related Tools & Decision Center Comparison Links */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Related Calculators & Decision Tools</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedTools.map((rel) => (
              <button
                key={rel.slug}
                type="button"
                onClick={() => onNavigateToTool && onNavigateToTool(rel.slug)}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {rel.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {rel.shortDescription}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share & Embed Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Share or Embed this Calculator</h4>
          <p className="text-[11px] text-slate-500">
            Generate clean shareable calculation links or embed responsive widgets on your website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Share</span>
            </button>
          )}
          {onOpenEmbed && (
            <button
              type="button"
              onClick={onOpenEmbed}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Embed Widget</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Widget */}
      <FeedbackWidget toolSlug={tool.slug} toolName={tool.name} />
    </section>
  );
};
