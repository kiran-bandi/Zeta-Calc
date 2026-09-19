import React, { useState } from 'react';
import { ShieldAlert, Globe, Check, Info } from 'lucide-react';
import { ZetaLogo } from '../common/ZetaLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useSettings } from '../../context/SettingsContext';
import { CURRENCIES } from '../../data/currencies';
import { CurrencyCode } from '../../types/globalization';
import { CATEGORIES } from '../../data/categories';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onNavigateAllTools: () => void;
  onNavigateDecisionCenter?: () => void;
  onSelectTool: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCategory,
  onNavigateAllTools,
  onNavigateDecisionCenter,
  onSelectTool,
}) => {
  const { preferences, setCurrency, setNumberSystem, setUnitSystem } = useSettings();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Highlight Box */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 mb-12 flex flex-col md:flex-row items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider block mb-1">
              Educational & Planning Notice
            </span>
            <p>
              Zeta Calculator is an independent, free-to-use educational utility. This platform is{' '}
              <strong>NOT</strong> affiliated with any government agency, bank, financial institution,
              medical authority, or official regulatory body. All calculations and estimations are
              strictly deterministic mathematical simulations for educational planning and personal
              guidance. For regulated matters (taxes, legal commitments, medical treatment, or bank
              borrowing), always consult with a licensed professional or certified institution.
            </p>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800 text-xs">
          {/* Brand & Localization Col */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="flex items-center">
              <ZetaLogo size="md" dark={true} />
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Everyday decision-making made clear, fast, and accessible. Deterministic calculators,
              converters, and planning tools for people across the globe.
            </p>

            {/* Regional Controls */}
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Global Currency Setting
                </label>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      id={`footer-currency-${code}`}
                      onClick={() => setCurrency(code)}
                      className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                        preferences.currency === code
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {code} ({CURRENCIES[code].symbol})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1">Number System</span>
                  <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
                    <button
                      type="button"
                      id="footer-numsys-indian"
                      onClick={() => setNumberSystem('indian')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        preferences.numberSystem === 'indian' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Lakh/Crore
                    </button>
                    <button
                      type="button"
                      id="footer-numsys-international"
                      onClick={() => setNumberSystem('international')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        preferences.numberSystem === 'international' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Million/Billion
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1">Units</span>
                  <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
                    <button
                      type="button"
                      id="footer-unit-metric"
                      onClick={() => setUnitSystem('metric')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        preferences.unitSystem === 'metric' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      id="footer-unit-imperial"
                      onClick={() => setUnitSystem('imperial')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        preferences.unitSystem === 'imperial' ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1">Theme</span>
                  <ThemeToggle variant="segmented" />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories Col */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    id={`footer-cat-link-${cat.id}`}
                    onClick={() => onNavigateCategory(cat.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Calculators Col */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Popular Tools</h3>
            <ul className="space-y-2">
              {[
                { name: 'EMI Calculator', slug: 'emi-calculator' },
                { name: 'SIP Calculator', slug: 'sip-calculator' },
                { name: 'Compound Interest', slug: 'compound-interest-calculator' },
                { name: 'Percentage Calculator', slug: 'percentage-calculator' },
                { name: 'Discount Calculator', slug: 'discount-calculator' },
                { name: 'Fuel Cost Calculator', slug: 'fuel-cost-calculator' },
                { name: 'Currency Converter', slug: 'currency-converter' },
              ].map((tool) => (
                <li key={tool.slug}>
                  <button
                    type="button"
                    id={`footer-tool-link-${tool.slug}`}
                    onClick={() => onSelectTool(tool.slug)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Trust Col */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Transparency</h3>
            <ul className="space-y-2 text-slate-400">
              {onNavigateDecisionCenter && (
                <li>
                  <button
                    type="button"
                    id="footer-link-decision-center"
                    onClick={onNavigateDecisionCenter}
                    className="hover:text-white text-indigo-400 font-semibold transition-colors"
                  >
                    Decision Center
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  id="footer-link-all-tools"
                  onClick={onNavigateAllTools}
                  className="hover:text-white transition-colors"
                >
                  All Tools Directory (A-Z)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-disclaimer"
                  onClick={() => setShowDisclaimerModal(true)}
                  className="hover:text-white transition-colors"
                >
                  Full Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-privacy"
                  onClick={() => setShowPrivacyModal(true)}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy (No-Log)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-terms"
                  onClick={() => setShowTermsModal(true)}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-cookies"
                  onClick={() => setShowCookieModal(true)}
                  className="hover:text-white transition-colors"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-feedback"
                  onClick={() => setShowFeedbackModal(true)}
                  className="hover:text-white transition-colors"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Zeta Calculator Utility Platform. All core tools remain free forever.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero User Tracking Required</span>
            </span>
            <span>Deterministic Verified Math</span>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className="bg-white text-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Privacy & Local Storage Policy</h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Zeta Calculator is engineered with a strict <strong>Privacy-First Architecture</strong>.
              All calculations (including your loan figures, income, and personal parameters) occur
              locally on your device. We do not store financial profiles on our servers, and we do
              not mandate account registration to use our tools. Your recently used tools and
              display preferences are stored solely in your browser's private localStorage.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="close-privacy-modal-btn"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowDisclaimerModal(false)}
        >
          <div
            className="bg-white text-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Educational & Non-Affiliation Disclaimer</h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                "This website provides general information and calculation tools for educational and planning purposes.
                Results are estimates based on the information entered and may differ from actual rates, fees, taxes,
                regulations, or decisions made by relevant institutions or authorities."
              </p>
              <p>
                Zeta Calculator is not a licensed financial advisor, credit broker, lender, medical provider, or government entity.
                Lenders may use differing amortization formulas (e.g. daily vs monthly interest compounding), compounding
                conventions, or levy additional taxes and stamp charges.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="close-disclaimer-modal-btn"
                onClick={() => setShowDisclaimerModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white text-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Terms of Service</h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2.5">
              <p>
                By accessing Zeta Calculator, you agree that all utility calculators, converters, and formulas
                are provided on an "as-is" and "as-available" basis for free individual personal planning.
              </p>
              <p>
                You acknowledge that calculations are estimates produced deterministically based on
                standard formulas and user-supplied parameters. Zeta Calculator assumes no liability for
                financial decisions, contracts, loan agreements, or medical choices made based on website outputs.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="close-terms-modal-btn"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showCookieModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowCookieModal(false)}
        >
          <div
            className="bg-white text-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Cookie & Privacy Preferences</h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Tracking Cookies: Zeta Calculator operates with no advertising or cross-site tracking cookies.</span>
              </div>
              <p>
                We only use local device storage (browser localStorage) to remember your chosen currency,
                number format (Lakh/Crore vs Million/Billion), and favorite calculator shortcuts.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="close-cookie-modal-btn"
                onClick={() => setShowCookieModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Feedback Modal */}
      {showFeedbackModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="bg-white text-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">Feedback & Tool Requests</h3>
            <p className="text-xs text-slate-500 mb-4">
              Have an idea for a new everyday calculator or noticed a formula that could be refined? Let us know!
            </p>

            {feedbackSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs text-center space-y-1">
                <p className="font-bold">Thank you for your feedback!</p>
                <p className="text-emerald-700">We continuously update Zeta Calculator to serve global users.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  id="feedback-input"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your suggestion or report an issue..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    id="submit-feedback-btn"
                    onClick={() => {
                      if (feedbackText.trim()) {
                        setFeedbackSent(true);
                        setTimeout(() => {
                          setShowFeedbackModal(false);
                          setFeedbackSent(false);
                          setFeedbackText('');
                        }, 1800);
                      }
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
