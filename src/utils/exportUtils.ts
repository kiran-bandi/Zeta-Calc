/**
 * Export Utilities for Zeta Calculator
 * Provides 1-click export to CSV, print-friendly reports, and PDF downloads
 * for financial schedules, amortizations, investment breakdowns, and calculator results.
 */

export interface ExportDataRow {
  [key: string]: string | number;
}

/**
 * Exports tabular data as a clean, formatted CSV download file.
 */
export function exportToCSV(filename: string, rows: Record<string, any>[], headers?: string[]) {
  if (!rows || rows.length === 0) return;

  const actualHeaders = headers || Object.keys(rows[0]);
  
  // Format CSV header
  const csvRows: string[] = [];
  csvRows.push(actualHeaders.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Format CSV data rows
  for (const row of rows) {
    const values = actualHeaders.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\r\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename.replace(/[^a-z0-9_-]/gi, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports complete calculation summary including inputs, outputs, and amortization schedule to CSV.
 */
export function exportCalculationSummaryCSV(
  toolName: string,
  inputs: { label: string; value: string | number }[],
  outputs: { label: string; value: string | number }[],
  schedule?: { headers: string[]; rows: Record<string, any>[] }
) {
  const csvLines: string[] = [];

  // Header Banner
  csvLines.push(`"Zeta Calculator - Official Calculation Report"`);
  csvLines.push(`"Tool:","${toolName}"`);
  csvLines.push(`"Generated Date:","${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}"`);
  csvLines.push(`"Source:","https://zetacalculator.net"`);
  csvLines.push(``);

  // Section 1: Inputs
  csvLines.push(`"=== INPUT PARAMETERS ==="`);
  csvLines.push(`"Parameter","Value"`);
  for (const inp of inputs) {
    csvLines.push(`"${inp.label}","${String(inp.value).replace(/"/g, '""')}"`);
  }
  csvLines.push(``);

  // Section 2: Calculated Results
  csvLines.push(`"=== CALCULATED RESULTS ==="`);
  csvLines.push(`"Metric","Value"`);
  for (const out of outputs) {
    csvLines.push(`"${out.label}","${String(out.value).replace(/"/g, '""')}"`);
  }
  csvLines.push(``);

  // Section 3: Periodic Schedule / Amortization (if applicable)
  if (schedule && schedule.rows && schedule.rows.length > 0) {
    csvLines.push(`"=== AMORTIZATION / PERIODIC SCHEDULE ==="`);
    csvLines.push(schedule.headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
    for (const row of schedule.rows) {
      csvLines.push(
        schedule.headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
      );
    }
  }

  const csvString = csvLines.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${toolName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers standard browser print/PDF generation dialog with dedicated styling
 */
export function printCalculationReport() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
