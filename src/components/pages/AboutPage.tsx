import React, { useEffect } from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { updatePageSEO } from '../../utils/seo';
import { Calculator, CheckCircle2, Shield, Zap, Sparkles, Globe2, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateAllTools: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onNavigateAllTools }) => {
  useEffect(() => {
    updatePageSEO({
      title: 'About Zeta Calculator – Free Calculators & Everyday Utilities',
      description:
        'Zeta Calculator is a free, transparent suite of deterministic calculators and decision tools built for everyday personal, financial, and household planning.',
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/about` : undefined,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Zeta Calculator',
        description:
          'Zeta Calculator provides free calculators, converters, and decision-making tools for everyday life.',
        publisher: {
          '@type': 'Organization',
          name: 'Zeta Calculator',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://zetacalculator.net',
        },
      },
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'About Zeta Calculator', active: true }]} />

      <header className="mt-4 mb-8">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
          Our Mission &amp; Purpose
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Zeta Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed font-normal">
          Free, transparent calculators and everyday decision utilities built without paywalls, sign-ups, or algorithmic distortion.
        </p>
      </header>

      <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Why We Built Zeta Calculator</h2>
          <p>
            Every day, millions of people make quantitative decisions: calculating loan EMIs,
            estimating paint for a renovation, checking mortgage trade-offs, planning retirement savings,
            splitting restaurant bills, or converting units for a road trip.
          </p>
          <p>
            Too often, the tools available on the web are cluttered with deceptive advertising,
            aggressive lead-capture forms, forced user registrations, and opaque calculations.
            Zeta Calculator was created to be the exact opposite: an open, private, lightning-fast digital
            utility belt where every formula is transparent, every number is deterministic, and no
            account is ever required.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Deterministic Precision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every formula executes mathematically exact code verified against banking, civil engineering, and scientific reference standards.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Private &amp; Local</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All computations run client-side directly in your browser. Your financial numbers, personal dates, and inputs never touch our servers.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Global Localization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adapts automatically to local measurement systems, currency symbols, and number groupings (Lakh/Crore vs. Million/Billion).
            </p>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Open &amp; Educational Standard</h2>
          <p>
            Calculators on Zeta Calculator include complete step-by-step mathematical formulas, worked examples,
            variable breakdowns, and practical guidance. We believe that understanding <em>how</em> a number
            is derived is just as important as knowing the final answer.
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateAllTools}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Explore All 30+ Free Tools
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
            >
              Back to Home
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
