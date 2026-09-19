/**
 * Share Utilities for Zeta Calculator
 * Handles structured calculation extraction, formatting, query parameter serialization,
 * and canonical sharing URLs for all 232+ calculators.
 */

export interface CalculationMetric {
  label: string;
  value: string;
  isHighlight?: boolean;
}

export interface CalculationShareData {
  toolSlug?: string;
  toolName: string;
  categorySlug?: string;
  inputs: CalculationMetric[];
  outputs: CalculationMetric[];
  notes?: string;
  customUrlParams?: Record<string, string | number | boolean>;
}

let currentActiveCalculation: CalculationShareData | null = null;
const calculationListeners = new Set<(data: CalculationShareData | null) => void>();

/**
 * Registers or updates the current active calculation data.
 * Used by calculators to supply exact inputs and outputs for sharing.
 */
export const setActiveCalculationData = (data: CalculationShareData | null) => {
  currentActiveCalculation = data;
  calculationListeners.forEach((fn) => {
    try {
      fn(data);
    } catch {
      // safe invoke
    }
  });
};

/**
 * Retrieves the currently registered active calculation data, if any.
 */
export const getActiveCalculationData = (): CalculationShareData | null => {
  return currentActiveCalculation;
};

/**
 * Subscribes to changes in active calculation data.
 */
export const subscribeActiveCalculation = (fn: (data: CalculationShareData | null) => void) => {
  calculationListeners.add(fn);
  return () => {
    calculationListeners.delete(fn);
  };
};

/**
 * Returns a publicly accessible base URL for sharing.
 * In local Capacitor Android environment ('localhost' or '127.0.0.1'),
 * defaults to the public canonical domain 'https://zetacalculator.net'
 * so recipients on WhatsApp, SMS, or Social Media can open the link.
 */
export const getShareableBaseUrl = (): string => {
  if (typeof window === 'undefined') return 'https://zetacalculator.net';
  const origin = window.location.origin;
  if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('capacitor://') || origin.startsWith('file://')) {
    return 'https://zetacalculator.net';
  }
  return origin;
};

/**
 * Builds a canonical shareable URL with embedded query parameters
 */
export const buildShareableToolUrl = (
  toolSlug: string,
  categorySlug?: string,
  queryParams?: Record<string, string | number | boolean | undefined | null>
): string => {
  const baseUrl = getShareableBaseUrl();
  const cat = categorySlug ? categorySlug.replace(/^\//, '') : 'tool';
  const slug = toolSlug.replace(/^\//, '');

  let url = `${baseUrl}/#/${cat}/${slug}`;

  if (queryParams && Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, String(val));
      }
    });
    const queryStr = params.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
  }

  return url;
};

/**
 * Generates a clean, professional multi-line text summary of inputs and calculated outputs
 */
export const formatCalculationShareText = (
  data: CalculationShareData,
  shareUrl: string
): string => {
  const lines: string[] = [];

  // Clean canonical public URL
  const cleanUrl = shareUrl.includes('localhost') || shareUrl.includes('127.0.0.1')
    ? shareUrl.replace(/https?:\/\/[^/]+/, 'https://zetacalculator.net')
    : shareUrl;

  // Header
  lines.push(`📊 ${data.toolName} Results — Zeta Calculator`);
  lines.push('');

  // Inputs Section
  if (data.inputs && data.inputs.length > 0) {
    lines.push('📝 Inputs:');
    data.inputs.forEach((item) => {
      lines.push(`• ${item.label}: ${item.value}`);
    });
    lines.push('');
  }

  // Calculated Results Section
  if (data.outputs && data.outputs.length > 0) {
    lines.push('✨ Calculated Results:');
    data.outputs.forEach((item) => {
      const prefix = item.isHighlight ? '🏆 ' : '• ';
      lines.push(`${prefix}${item.label}: ${item.value}`);
    });
    lines.push('');
  }

  if (data.notes) {
    lines.push(`ℹ️ Note: ${data.notes}`);
    lines.push('');
  }

  // Link
  lines.push('🔗 View or customize this calculation:');
  lines.push(cleanUrl);

  return lines.join('\n');
};

/**
 * Universal DOM scraper to extract inputs and calculated results from any active calculator
 * on the page when explicit calculation data is not directly provided.
 */
export const extractCalculationFromDOM = (
  fallbackToolName: string = 'Calculator'
): CalculationShareData | null => {
  if (typeof document === 'undefined') return null;

  try {
    // 0. Check if active calculation is already cached and valid
    if (currentActiveCalculation) {
      const hasData = (currentActiveCalculation.inputs?.length > 0) || (currentActiveCalculation.outputs?.length > 0);
      if (hasData) {
        return currentActiveCalculation;
      }
    }

    // 1. Identify calculator results container
    // We strictly avoid buttons, dialogs, or awaiting-input banners
    let resultContainer: Element | null = null;

    // Check explicit results panel first
    const explicitResultsPanel = document.querySelector('[data-results-panel="true"]');
    if (explicitResultsPanel) {
      resultContainer = explicitResultsPanel;
    }

    // Check calculator result card
    if (!resultContainer) {
      const card = document.getElementById('calculator-result-card');
      if (card && card.tagName !== 'BUTTON') {
        resultContainer = card;
      }
    }

    // Check CompactCalculatorWorkspace results column
    if (!resultContainer) {
      const workspace = document.querySelector('[data-calculator-workspace="true"]');
      if (workspace) {
        const cols = workspace.querySelectorAll(':scope > div > div');
        if (cols.length >= 2) {
          resultContainer = cols[1];
        }
      }
    }

    // Check dark summary card in specialized calculators
    if (!resultContainer) {
      const darkCards = Array.from(document.querySelectorAll('.bg-slate-900, [class*="bg-slate-900"]'));
      for (const el of darkCards) {
        if (el.tagName !== 'BUTTON' && !el.closest('[role="dialog"]') && !el.closest('header')) {
          resultContainer = el;
          break;
        }
      }
    }

    // 2. Identify calculator inputs container
    let inputsContainer: Element | null = null;
    const explicitInputsPanel = document.querySelector('[data-inputs-panel="true"]');
    if (explicitInputsPanel) {
      inputsContainer = explicitInputsPanel;
    } else {
      const workspace = document.querySelector('[data-calculator-workspace="true"]');
      if (workspace) {
        const cols = workspace.querySelectorAll(':scope > div > div');
        if (cols.length >= 1) {
          inputsContainer = cols[0];
        }
      }
    }

    // If still no result container, look for any container with text like "Results" or "Breakdown"
    if (!resultContainer) {
      const headings = Array.from(document.querySelectorAll('span, h3, h4, div')).filter((el) => {
        const text = el.textContent?.trim().toLowerCase();
        return text === 'results & projections' || text === 'calculated results' || text === 'breakdown';
      });
      if (headings.length > 0) {
        resultContainer = headings[0].closest('div.flex-col') || headings[0].parentElement;
      }
    }

    const outputs: CalculationMetric[] = [];

    if (resultContainer) {
      // Extract primary highlight output (.text-4xl, .text-3xl, .text-2xl, .font-black)
      const primaryCandidates = Array.from(
        resultContainer.querySelectorAll(
          '.text-4xl, .text-5xl, .text-3xl, [class*="text-4xl"], [class*="text-3xl"], .font-black'
        )
      );

      for (const prim of primaryCandidates) {
        if (prim.tagName === 'BUTTON' || prim.closest('button')) continue;
        const textVal = prim.textContent?.trim();
        // Check if it contains digits or currency
        if (textVal && /\d/.test(textVal) && textVal.length < 40) {
          // Look for adjacent or ancestor label
          let primLabel = 'Primary Result';
          const parent = prim.parentElement;
          if (parent) {
            const labelCand = parent.querySelector('.uppercase, .text-xs.font-bold, .text-slate-400, .text-blue-400, .text-amber-600, .text-slate-500');
            if (labelCand && labelCand !== prim && labelCand.textContent) {
              primLabel = labelCand.textContent.trim();
            } else if (parent.previousElementSibling) {
              const prevText = parent.previousElementSibling.textContent?.trim();
              if (prevText && prevText.length < 50) {
                primLabel = prevText;
              }
            }
          }

          outputs.push({
            label: primLabel.replace(/[:*]/g, '').trim(),
            value: textVal,
            isHighlight: true,
          });
          break;
        }
      }

      // Extract key-value breakdown rows
      const rowContainers = Array.from(
        resultContainer.querySelectorAll(
          '.grid > div, .space-y-3 > div, .space-y-2 > div, [class*="grid-cols"] > div, dl > div, .flex.justify-between'
        )
      );

      rowContainers.forEach((container) => {
        if (container.tagName === 'BUTTON' || container.closest('button') || container.closest('[role="dialog"]')) {
          return;
        }

        // Try to find label and value elements
        const labelCandidate = container.querySelector(
          '.text-xs:not(.font-bold), .text-sm:not(.font-bold), .text-slate-400, .text-slate-500, .text-slate-600, dt, span:first-child'
        );
        const valueCandidate = container.querySelector(
          '.font-bold, .font-semibold, .font-black, .text-white, .text-slate-900, .text-emerald-400, .text-blue-600, dd, span:last-child'
        );

        if (labelCandidate && valueCandidate && labelCandidate !== valueCandidate) {
          const lText = labelCandidate.textContent?.trim() || '';
          const vText = valueCandidate.textContent?.trim() || '';

          // Filter out buttons, empty values, or identical labels
          const isButtonOrAction = /^(share|reset|calculate|print|clear|copy|view|expand)$/i.test(lText);
          if (lText && vText && !isButtonOrAction && /\d|[a-zA-Z]/.test(vText) && vText.length < 60) {
            const cleanL = lText.replace(/[:*]/g, '').trim();
            if (!outputs.some((o) => o.label.toLowerCase() === cleanL.toLowerCase())) {
              outputs.push({
                label: cleanL,
                value: vText,
                isHighlight: false,
              });
            }
          }
        }
      });
    }

    // 3. Extract Inputs
    const inputs: CalculationMetric[] = [];
    const queryParams: Record<string, string> = {};

    const searchScope = inputsContainer || document;
    const inputElements = Array.from(
      searchScope.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]), select')
    );

    inputElements.forEach((el) => {
      // Ignore search bar or modal inputs
      if (
        el.id?.includes('search') ||
        el.id?.includes('modal') ||
        el.closest('[role="dialog"]') ||
        el.closest('header') ||
        el.closest('nav')
      ) {
        return;
      }

      const inputEl = el as HTMLInputElement | HTMLSelectElement;
      let val = '';
      let displayVal = '';

      if (inputEl.tagName === 'SELECT') {
        const selectEl = inputEl as HTMLSelectElement;
        if (selectEl.selectedIndex >= 0 && selectEl.options[selectEl.selectedIndex]) {
          val = selectEl.value;
          displayVal = selectEl.options[selectEl.selectedIndex].text.trim();
        }
      } else {
        val = inputEl.value?.trim() || '';
        displayVal = val;
      }

      if (!displayVal) return;

      // Find label
      let labelText = '';
      if (inputEl.id) {
        const labelEl = document.querySelector(`label[for="${inputEl.id}"]`);
        if (labelEl) labelText = labelEl.textContent?.trim() || '';
      }
      if (!labelText) {
        const parentWithLabel = inputEl.closest('.space-y-1\\.5, .space-y-1, .space-y-2, div');
        const siblingLabel = parentWithLabel?.querySelector('label');
        if (siblingLabel) labelText = siblingLabel.textContent?.trim() || '';
      }
      if (!labelText && inputEl.getAttribute('aria-label')) {
        labelText = inputEl.getAttribute('aria-label') || '';
      }
      if (!labelText && 'placeholder' in inputEl && (inputEl as HTMLInputElement).placeholder) {
        labelText = (inputEl as HTMLInputElement).placeholder;
      }

      if (labelText) {
        // Detect prefix or suffix if input element
        if (inputEl.tagName === 'INPUT') {
          const parent = inputEl.parentElement;
          if (parent) {
            const prefixEl = parent.querySelector('.absolute.left-3, span.text-slate-500');
            if (prefixEl && prefixEl.textContent && !displayVal.startsWith(prefixEl.textContent.trim())) {
              displayVal = `${prefixEl.textContent.trim()}${displayVal}`;
            }
            const suffixEl = parent.querySelector('.absolute.right-3, span.text-slate-400');
            if (suffixEl && suffixEl.textContent && !displayVal.endsWith(suffixEl.textContent.trim())) {
              displayVal = `${displayVal} ${suffixEl.textContent.trim()}`;
            }
          }
        }

        const cleanLabel = labelText.replace(/[:*]/g, '').trim();
        if (!inputs.some((i) => i.label.toLowerCase() === cleanLabel.toLowerCase())) {
          inputs.push({
            label: cleanLabel,
            value: displayVal,
          });

          const paramKey = cleanLabel
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .slice(0, 15);
          queryParams[paramKey] = val;
        }
      }
    });

    // Detect tool name from H1 or fallback
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const toolName = h1 || fallbackToolName;

    const extracted: CalculationShareData = {
      toolName,
      inputs,
      outputs,
      customUrlParams: queryParams,
    };

    // Cache the extracted data if non-empty
    if (inputs.length > 0 || outputs.length > 0) {
      setActiveCalculationData(extracted);
    }

    return extracted;
  } catch (err) {
    console.warn('DOM calculation extraction error:', err);
    return null;
  }
};
