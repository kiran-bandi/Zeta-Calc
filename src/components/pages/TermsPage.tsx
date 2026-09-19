import React, { useEffect } from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { updatePageSEO } from '../../utils/seo';

interface TermsPageProps {
  onNavigateHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigateHome }) => {
  useEffect(() => {
    updatePageSEO({
      title: 'Terms of Service – Zeta Calculator',
      description:
        'Zeta Calculator terms of service: free usage, acceptable use, intellectual property, and disclaimers for online utilities.',
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/terms` : undefined,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Terms of Service', active: true }]} />

      <header className="mt-4 mb-8">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
          Terms &amp; Conditions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed font-normal">
          Guidelines and terms governing your access to and use of Zeta Calculator calculators and utilities.
        </p>
      </header>

      <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Zeta Calculator, you agree to be bound by these Terms of Service. If you do not
            agree to these terms, please do not use the service. We provide Zeta Calculator on an &ldquo;as is&rdquo;
            and &ldquo;as available&rdquo; basis for personal and educational use.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Permitted Use &amp; Prohibitions</h2>
          <p>
            You are granted a non-exclusive, revocable license to access Zeta Calculator utilities. You agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>Attempt to disrupt, overload, or reverse-engineer the site infrastructure.</li>
            <li>Use automated scrapers or bots to extract proprietary calculation logic without permission.</li>
            <li>Misrepresent outputs from Zeta Calculator as official certified bank or government documentation.</li>
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property</h2>
          <p>
            The design, layout, code, formulas, and editorial guides of Zeta Calculator are protected by copyright,
            trademark, and intellectual property laws. Public mathematical formulas and scientific principles
            remain in the public domain.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">4. Modifications to Service</h2>
          <p>
            We reserve the right to modify, update, or discontinue any feature, tool, or calculator at any
            time without prior notice. Continued use of Zeta Calculator constitutes your acceptance of any revisions.
          </p>
        </section>
      </div>
    </div>
  );
};
