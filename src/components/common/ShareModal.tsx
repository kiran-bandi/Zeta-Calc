import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Mail,
  Send,
  ExternalLink,
  Calculator,
  Link,
  FileText,
} from 'lucide-react';
import {
  CalculationShareData,
  buildShareableToolUrl,
  extractCalculationFromDOM,
  formatCalculationShareText,
  getShareableBaseUrl,
  getActiveCalculationData,
} from '../../utils/shareUtils';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  toolName?: string;
  toolSlug?: string;
  categorySlug?: string;
  description?: string;
  url?: string;
  calculationData?: CalculationShareData | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  toolName,
  toolSlug,
  categorySlug,
  description = 'Check out this free financial and everyday calculator on Zeta Calculator!',
  url,
  calculationData: propCalculationData,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Active calculation data: use prop if provided, else dynamically extract from DOM
  const activeCalculationData = useMemo(() => {
    if (!isOpen) return null;
    if (propCalculationData) return propCalculationData;
    const fromStore = getActiveCalculationData();
    if (fromStore && ((fromStore.inputs?.length > 0) || (fromStore.outputs?.length > 0))) {
      return fromStore;
    }
    return extractCalculationFromDOM(toolName || title);
  }, [isOpen, propCalculationData, toolName, title]);

  const hasCalculationMetrics = Boolean(
    activeCalculationData &&
      ((activeCalculationData.inputs && activeCalculationData.inputs.length > 0) ||
        (activeCalculationData.outputs && activeCalculationData.outputs.length > 0))
  );

  // Compute clean shareable URL (ensuring public canonical base domain instead of localhost)
  const shareUrl = useMemo(() => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      // If the provided url contains localhost, replace origin with public canonical URL
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const publicBase = getShareableBaseUrl();
        const hashPart = url.includes('#') ? url.slice(url.indexOf('#')) : '';
        return `${publicBase}/${hashPart}`;
      }
      return url;
    }

    if (toolSlug) {
      return buildShareableToolUrl(
        toolSlug,
        categorySlug,
        activeCalculationData?.customUrlParams
      );
    }

    const publicBase = getShareableBaseUrl();
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      return `${publicBase}/${hash}`;
    }

    return publicBase;
  }, [url, toolSlug, categorySlug, activeCalculationData]);

  // Generate full rich text summary
  const richShareText = useMemo(() => {
    if (hasCalculationMetrics && activeCalculationData) {
      return formatCalculationShareText(activeCalculationData, shareUrl);
    }
    return `${title} - ${description}\n\n🔗 ${shareUrl}`;
  }, [hasCalculationMetrics, activeCalculationData, title, description, shareUrl]);

  // Concise summary for platforms with tight character constraints (like Twitter/X)
  const conciseShareText = useMemo(() => {
    if (hasCalculationMetrics && activeCalculationData && activeCalculationData.outputs.length > 0) {
      const mainResult = activeCalculationData.outputs[0];
      return `Calculated with Zeta Calculator: ${activeCalculationData.toolName} -> ${mainResult.label}: ${mainResult.value}`;
    }
    return `${title} - ${description}`;
  }, [hasCalculationMetrics, activeCalculationData, title, description]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(richShareText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (hasCalculationMetrics) {
          // On mobile Android / Capacitor, richShareText already contains the complete calculation breakdown
          // (Tool name, Inputs, Outputs, and canonical link). Passing text directly ensures WhatsApp, Telegram,
          // Messages, and Gmail receive the full message without Android stripping text in favor of raw URL.
          await navigator.share({
            title: `${title} - Zeta Calculator`,
            text: richShareText,
          });
        } else {
          await navigator.share({
            title: `${title} - Zeta Calculator`,
            text: `${title} - ${description}`,
            url: shareUrl,
          });
        }
      } catch {
        // User cancelled or not supported
      }
    }
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#20bd5a] text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(richShareText)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-[#24A1DE] hover:bg-[#2092c7] text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(richShareText)}`,
    },
    {
      name: 'SMS',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: <Send className="w-4 h-4" />,
      url: `sms:?&body=${encodeURIComponent(richShareText)}`,
    },
    {
      name: 'Email',
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
      icon: <Mail className="w-4 h-4" />,
      url: `mailto:?subject=${encodeURIComponent(`${title} Calculation Results`)}&body=${encodeURIComponent(richShareText)}`,
    },
    {
      name: 'X (Twitter)',
      color: 'bg-slate-900 hover:bg-black text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(conciseShareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#095196] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Reddit',
      color: 'bg-[#FF4500] hover:bg-[#e03d00] text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 13.79c-.06.74-.359 1.43-.847 1.98-.949 1.07-2.617 1.73-5.219 1.73s-4.27-.66-5.219-1.73c-.488-.55-.787-1.24-.847-1.98-.24-.03-.48-.09-.7-.18-.87-.38-1.39-1.27-1.25-2.2.14-.94.94-1.63 1.89-1.63.26 0 .52.06.76.17.65-1.12 1.84-1.93 3.25-2.22l.68-3.19 2.22.47c.18-.38.56-.63.99-.63.62 0 1.12.5 1.12 1.12s-.5 1.12-1.12 1.12c-.52 0-.96-.36-1.08-.85l-1.69-.36-.53 2.51c1.47.28 2.72 1.11 3.4 2.26.24-.1.5-.16.76-.16.95 0 1.75.69 1.89 1.63.14.93-.38 1.82-1.25 2.2-.22.09-.46.15-.7.18zm-8.816-1.54c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm5.5 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-4.75 3.37c.56.44 1.34.72 2.25.72s1.69-.28 2.25-.72c.15-.12.18-.34.06-.49-.12-.15-.34-.18-.49-.06-.43.34-1.06.57-1.82.57s-1.39-.23-1.82-.57c-.15-.12-.37-.09-.49.06-.12.15-.09.37.06.49z" />
        </svg>
      ),
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] max-h-[92dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-base font-bold text-slate-900">
                Share Calculation &amp; Results
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-sm">
                {title}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Calculation Summary Preview (if available) */}
          {hasCalculationMetrics && activeCalculationData && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-blue-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                  <span>Calculated Summary to Share</span>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Inputs &amp; Outputs Included
                </span>
              </div>

              {/* Inputs */}
              {activeCalculationData.inputs.length > 0 && (
                <div className="mb-2.5">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Inputs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCalculationData.inputs.map((inp, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-xs font-medium text-slate-800 shadow-2xs"
                      >
                        <span className="text-slate-500 font-normal">{inp.label}:</span>
                        <span className="font-bold text-slate-900">{inp.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Outputs */}
              {activeCalculationData.outputs.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Outputs
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCalculationData.outputs.map((out, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-xs ${
                          out.isHighlight
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-white border border-slate-200 text-slate-800'
                        }`}
                      >
                        <div
                          className={`text-[10px] ${
                            out.isHighlight ? 'text-blue-300' : 'text-slate-500'
                          }`}
                        >
                          {out.label}
                        </div>
                        <div
                          className={`text-sm font-black ${
                            out.isHighlight ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {out.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Platforms Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Share to Messaging &amp; Social
            </label>
            <div className="grid grid-cols-4 gap-2">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  id={`share-${platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl transition-all shadow-2xs hover:scale-105 active:scale-95 ${platform.color}`}
                  title={`Share via ${platform.name}`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {platform.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-tight truncate max-w-full">
                    {platform.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons: Copy Full Summary & Copy Link */}
          <div className="space-y-2.5 pt-1">
            {hasCalculationMetrics && (
              <button
                type="button"
                id="share-modal-copy-summary-btn"
                onClick={handleCopySummary}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all shadow-xs ${
                  copiedSummary
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copiedSummary ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                <span>{copiedSummary ? 'Calculation Summary Copied!' : 'Copy Full Calculation Summary (Inputs + Outputs)'}</span>
              </button>
            )}

            {/* Direct Link Field */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="pl-2 text-slate-400">
                <Link className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                readOnly
                id="share-modal-link-input"
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-xs text-slate-600 font-mono focus:outline-hidden select-all"
                title="Direct link"
              />
              <button
                type="button"
                id="share-modal-copy-btn"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Native Device Share Sheet (Mobile / Capacitor support) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              id="share-modal-native-btn"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>More sharing options (Device Share Sheet)</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <p className="text-[11px] text-slate-500">
            Calculations run 100% locally in browser. No private data is logged or tracked.
          </p>
        </div>
      </div>
    </div>
  );
};
