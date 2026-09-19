import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Code2 } from 'lucide-react';

interface EmbedModalProps {
  toolSlug: string;
  toolName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  toolSlug,
  toolName,
  isOpen,
  onClose,
}) => {
  const [theme, setTheme] = useState<'light' | 'slate'>('light');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://zetacalculator.net';
  const embedUrl = `${currentOrigin}/#embed/${toolSlug}?theme=${theme}`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="680" frameborder="0" style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;" title="${toolName}"></iframe>\n<p style="font-size: 11px; text-align: center; color: #64748b; margin-top: 6px;">Powered by <a href="${currentOrigin}" target="_blank" style="color: #2563eb; text-decoration: none;">Zeta Calculator</a></p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Embed this Calculator</h3>
              <p className="text-xs text-slate-500">Free, responsive iframe code for your blog or website</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Theme Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Clean Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('slate')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  theme === 'slate'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Modern Slate
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                HTML Embed Code
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-hidden select-all"
            />
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>
              The calculator is completely responsive and will automatically adapt to standard sidebar (300px) or full article container widths.
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
