import React, { useEffect } from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { updatePageSEO } from '../../utils/seo';
import { Lock, ShieldCheck } from 'lucide-react';

interface PrivacyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigateHome }) => {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy – Zeta Calculator',
      description:
        'Zeta Calculator privacy policy: client-side processing, zero server storage of user inputs, local device preferences, and transparent privacy protections.',
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/privacy` : undefined,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Privacy Policy', active: true }]} />

      <header className="mt-4 mb-8">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
          Data Privacy &amp; Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed font-normal">
          We believe financial and personal planning data belongs exclusively to you.
        </p>
      </header>

      <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
              Core Privacy Promise: Client-Side Local Computation
            </h2>
            <p>
              Zeta Calculator executes all arithmetic, amortization tables, and formula evaluations directly
              inside your web browser via JavaScript. Your numerical inputs (such as income, loan balances,
              birthdates, or body measurements) are <strong>never</strong> transmitted to our servers or saved in a remote database.
            </p>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Information We Do NOT Collect</h2>
          <p>
            When you use any calculator or tool on Zeta Calculator:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>We do NOT require account creation, logins, or social sign-in.</li>
            <li>We do NOT collect credit card details, bank account numbers, or Social Security numbers.</li>
            <li>We do NOT log or track the specific financial numbers or personal inputs you enter into calculators.</li>
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Local Storage (`localStorage`)</h2>
          <p>
            Zeta Calculator uses standard browser <code>localStorage</code> purely to remember your display preferences across sessions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>Your chosen Country/Region, display currency, and number formatting mode.</li>
            <li>Your recent tool history (the slugs of recently visited tools for quick access on the homepage).</li>
            <li>Your starred favorite calculators.</li>
          </ul>
          <p className="text-xs text-slate-500">
            This information resides entirely within your personal browser storage and can be cleared at any time through your browser settings.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Third-Party Analytics &amp; Cookies</h2>
          <p>
            Zeta Calculator may collect anonymous, aggregated technical metrics (such as browser type, operating system, and page view counts) to ensure site stability, monitor performance, and optimize loading speeds. We do not sell user data or engage in cross-site behavioral tracking.
          </p>
        </section>
      </div>
    </div>
  );
};
