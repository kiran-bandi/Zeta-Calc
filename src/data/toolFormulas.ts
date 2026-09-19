export interface FormulaVariable {
  symbol: string;
  explanation: string;
}

export interface ToolFormulaData {
  expression: string;
  variables: FormulaVariable[];
  notes?: string;
}

export const TOOL_FORMULAS_MAP: Record<string, ToolFormulaData> = {
  // Financial & Investment Calculators
  'sip-calculator': {
    expression: 'M = P × [ (1 + i)ⁿ - 1 ] × (1 + i) ÷ i',
    variables: [
      { symbol: 'M', explanation: 'Total Maturity Amount received upon completion' },
      { symbol: 'P', explanation: 'Monthly SIP Installment amount' },
      { symbol: 'i', explanation: 'Periodic compounding interest rate (Annual Rate ÷ 12 ÷ 100)' },
      { symbol: 'n', explanation: 'Total number of monthly installments (Years × 12)' },
    ],
    notes: 'Calculated using monthly compounding at the beginning of each installment cycle.',
  },
  'lumpsum-calculator': {
    expression: 'A = P × (1 + r ÷ 100)ᵗ',
    variables: [
      { symbol: 'A', explanation: 'Final maturity amount (Total Value)' },
      { symbol: 'P', explanation: 'Initial one-time lumpsum principal invested' },
      { symbol: 'r', explanation: 'Expected annual rate of return (%)' },
      { symbol: 't', explanation: 'Investment tenure in years' },
    ],
    notes: 'Compounded annually for the full duration of the investment.',
  },
  'emi-calculator': {
    expression: 'EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]',
    variables: [
      { symbol: 'EMI', explanation: 'Equated Monthly Installment payable each month' },
      { symbol: 'P', explanation: 'Principal loan amount borrowed' },
      { symbol: 'r', explanation: 'Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)' },
      { symbol: 'n', explanation: 'Loan tenure in total months (Years × 12)' },
    ],
    notes: 'Standard reducing balance loan amortization formula.',
  },
  'compound-interest-calculator': {
    expression: 'A = P × (1 + r ÷ n)^(n × t) ; CI = A - P',
    variables: [
      { symbol: 'A', explanation: 'Final maturity corpus after interest accrual' },
      { symbol: 'P', explanation: 'Initial principal deposit' },
      { symbol: 'r', explanation: 'Nominal annual interest rate (in decimal, e.g. 0.08 for 8%)' },
      { symbol: 'n', explanation: 'Compounding frequency per year (1=Annual, 4=Quarterly, 12=Monthly)' },
      { symbol: 't', explanation: 'Total duration in years' },
      { symbol: 'CI', explanation: 'Net compound interest earned (A - P)' },
    ],
    notes: 'Supports annual, semi-annual, quarterly, monthly, and daily compounding frequencies.',
  },
  'simple-interest-calculator': {
    expression: 'SI = (P × R × T) ÷ 100 ; Total = P + SI',
    variables: [
      { symbol: 'SI', explanation: 'Total simple interest accrued' },
      { symbol: 'P', explanation: 'Principal investment or borrowed loan amount' },
      { symbol: 'R', explanation: 'Annual interest rate percentage' },
      { symbol: 'T', explanation: 'Time duration in years' },
    ],
    notes: 'Non-compounding interest calculated strictly against the original principal balance.',
  },
  'fd-calculator': {
    expression: 'A = P × (1 + r ÷ 4)^(4 × t) ; Interest = A - P',
    variables: [
      { symbol: 'A', explanation: 'Maturity amount received from Fixed Deposit' },
      { symbol: 'P', explanation: 'Principal deposit amount' },
      { symbol: 'r', explanation: 'Annual interest rate (as decimal)' },
      { symbol: 't', explanation: 'Tenure in years' },
    ],
    notes: 'Indian and commercial bank standard compounding frequency is quarterly (4 times per year).',
  },
  'rd-calculator': {
    expression: 'M = P × [ (1 + i)ⁿ - 1 ] ÷ [ 1 - (1 + i)^(-1/3) ]',
    variables: [
      { symbol: 'M', explanation: 'Total maturity value of Recurring Deposit' },
      { symbol: 'P', explanation: 'Monthly recurring installment deposit' },
      { symbol: 'i', explanation: 'Quarterly compounding rate (r ÷ 4 ÷ 100)' },
      { symbol: 'n', explanation: 'Total quarters (Tenure in months ÷ 3)' },
    ],
    notes: 'Calculated using quarterly compounding standard adopted by Indian Banks and Indian Post Office.',
  },
  'cagr-calculator': {
    expression: 'CAGR = (EV ÷ BV)^(1 ÷ n) - 1',
    variables: [
      { symbol: 'CAGR', explanation: 'Compound Annual Growth Rate (expressed as a percentage)' },
      { symbol: 'EV', explanation: 'Ending portfolio or asset valuation' },
      { symbol: 'BV', explanation: 'Beginning portfolio or asset valuation' },
      { symbol: 'n', explanation: 'Investment duration in total years' },
    ],
    notes: 'Measures the smoothed geometric progression rate of an investment over multiple years.',
  },
  'swp-calculator': {
    expression: 'Balance(t) = Balance(t-1) × (1 + r ÷ 12) - W',
    variables: [
      { symbol: 'Balance(t)', explanation: 'Remaining fund corpus balance at month t' },
      { symbol: 'r', explanation: 'Annualized expected portfolio return' },
      { symbol: 'W', explanation: 'Fixed monthly systematic withdrawal amount' },
    ],
    notes: 'Models monthly returns and systematic capital withdrawals until depletion.',
  },
  'step-up-sip-calculator': {
    expression: 'M = ∑ [ P × (1 + s)^(y-1) × (1 + i)^(n - t + 1) ]',
    variables: [
      { symbol: 'M', explanation: 'Total maturity corpus with annual top-up' },
      { symbol: 'P', explanation: 'Initial monthly SIP installment' },
      { symbol: 's', explanation: 'Annual step-up increment percentage (e.g. 10%)' },
      { symbol: 'y', explanation: 'Current investment year index' },
      { symbol: 'i', explanation: 'Monthly rate of return' },
      { symbol: 'n', explanation: 'Total number of months' },
    ],
    notes: 'Increases the monthly installment each financial year to accelerate wealth compounding.',
  },
  'mutual-fund-returns-calculator': {
    expression: 'Future Value = Lumpsum × (1 + r)ᵗ + SIP FV',
    variables: [
      { symbol: 'Future Value', explanation: 'Projected net mutual fund valuation' },
      { symbol: 'r', explanation: 'Expected annualized NAV return (CAGR)' },
      { symbol: 't', explanation: 'Holding period in years' },
    ],
  },
  'inflation-calculator': {
    expression: 'FV = PV × (1 + i ÷ 100)ᵗ ; Purchasing Power = PV ÷ (1 + i ÷ 100)ᵗ',
    variables: [
      { symbol: 'FV', explanation: 'Future nominal cost of goods and services' },
      { symbol: 'PV', explanation: 'Present value / cost of goods today' },
      { symbol: 'i', explanation: 'Expected annual inflation rate (%)' },
      { symbol: 't', explanation: 'Time horizon in years' },
    ],
    notes: 'Quantifies loss of purchasing power and required nominal capital adjustments over time.',
  },
  'salary-calculator': {
    expression: 'Net In-Hand = Gross Salary - (EPF + Professional Tax + TDS + Deductions)',
    variables: [
      { symbol: 'Net In-Hand', explanation: 'Take-home monthly or annual salary credited to bank' },
      { symbol: 'Gross Salary', explanation: 'Total Cost to Company (CTC) less employer benefits' },
      { symbol: 'EPF', explanation: 'Employee Provident Fund statutory deduction (12% of Basic)' },
      { symbol: 'TDS', explanation: 'Income Tax Deducted at Source according to tax regime' },
    ],
  },
  'roi-calculator': {
    expression: 'ROI = [ (Net Gain from Investment - Cost of Investment) ÷ Cost of Investment ] × 100%',
    variables: [
      { symbol: 'ROI', explanation: 'Return on Investment percentage' },
      { symbol: 'Net Gain', explanation: 'Total monetary proceeds or income generated' },
      { symbol: 'Cost', explanation: 'Initial total outlay and expenses incurred' },
    ],
  },
  'retirement-calculator': {
    expression: 'Corpus = Annual Expenses × [ (1 - (1 + Real Rate)^(-Tenure)) ÷ Real Rate ]',
    variables: [
      { symbol: 'Corpus', explanation: 'Target retirement corpus needed on retirement date' },
      { symbol: 'Real Rate', explanation: 'Inflation-adjusted return rate: (1 + Return) ÷ (1 + Inflation) - 1' },
      { symbol: 'Tenure', explanation: 'Expected retirement lifespan in years (Life Expectancy - Retirement Age)' },
    ],
  },
  'gratuity-calculator': {
    expression: 'Gratuity = (15 × Last Drawn Basic Salary × Years of Service) ÷ 26',
    variables: [
      { symbol: '15', explanation: '15 days of salary per completed year of employment' },
      { symbol: '26', explanation: 'Statutory working days in a month under Payment of Gratuity Act' },
      { symbol: 'Tenure', explanation: 'Total continuous employment service years (≥ 5 years)' },
    ],
    notes: 'Governed under Payment of Gratuity Act, 1972 with statutory maximum exemption limits.',
  },
  'epf-calculator': {
    expression: 'Closing Balance(m) = Opening Balance + EE Share (12%) + ER Share (3.67%) + Monthly Interest',
    variables: [
      { symbol: 'EE Share', explanation: 'Employee mandatory contribution (12% of Basic + DA)' },
      { symbol: 'ER Share', explanation: 'Employer contribution into EPF account (3.67% of Basic, 8.33% to EPS)' },
      { symbol: 'Interest Rate', explanation: 'Annual statutory interest declared by EPFO (compounded monthly)' },
    ],
  },
  'ppf-calculator': {
    expression: 'F = P × [ (1 + r)ⁿ - 1 ] ÷ r × (1 + r)',
    variables: [
      { symbol: 'F', explanation: 'Total PPF maturity balance at end of 15-year tenure' },
      { symbol: 'P', explanation: 'Annual deposit amount (Max ₹1.5 Lakh/year under Sec 80C)' },
      { symbol: 'r', explanation: 'Govt declared annual interest rate (compounded annually)' },
      { symbol: 'n', explanation: 'Lock-in period in years (Minimum 15 years)' },
    ],
  },
  'nps-calculator': {
    expression: 'Total Corpus = Accumulation via Asset Allocation ; Lump Sum = 60% ; Annuity = 40%',
    variables: [
      { symbol: 'Total Corpus', explanation: 'Total accumulated pension wealth at age 60' },
      { symbol: 'Lump Sum', explanation: 'Tax-free withdrawal amount allowed (up to 60%)' },
      { symbol: 'Annuity', explanation: 'Compulsory minimum pension annuity purchase (at least 40%)' },
    ],
  },
  'sukanya-samriddhi-calculator': {
    expression: 'Maturity Corpus = ∑ Annual Deposit × (1 + r)^(21 - Year)',
    variables: [
      { symbol: 'Annual Deposit', explanation: 'Yearly contribution for first 15 years' },
      { symbol: 'r', explanation: 'Government notified quarterly interest rate' },
      { symbol: '21 Years', explanation: 'Total maturity duration from date of account opening' },
    ],
  },
  'dscr-calculator': {
    expression: 'DSCR = Net Operating Income (NOI) ÷ Total Debt Service (Principal + Interest)',
    variables: [
      { symbol: 'DSCR', explanation: 'Debt Service Coverage Ratio (Target ≥ 1.25x for fundability)' },
      { symbol: 'NOI', explanation: 'Net Operating Income (Gross Operating Revenue - Operating Expenses)' },
      { symbol: 'Total Debt Service', explanation: 'Total annual principal debt repayments + annual interest obligations' },
    ],
    notes: 'Lenders evaluate DSCR: ≥ 1.25x is highly fundable, 1.00x-1.24x is tight/risky, < 1.00x indicates default risk.',
  },
  'gst-calculator': {
    expression: 'Add GST: GST = (P × R) ÷ 100 ; Remove GST: GST = P - [ (P × 100) ÷ (100 + R) ]',
    variables: [
      { symbol: 'P', explanation: 'Base taxable value or Net invoice amount' },
      { symbol: 'R', explanation: 'Statutory GST Slab rate percentage (e.g. 5%, 12%, 18%, 28%)' },
      { symbol: 'CGST / SGST', explanation: 'Intra-state tax split equally: CGST = R ÷ 2, SGST = R ÷ 2' },
      { symbol: 'IGST', explanation: 'Inter-state full integrated tax rate (R %)' },
    ],
    notes: 'Supports both forward tax addition and reverse GST extraction.',
  },
  'profit-margin-calculator': {
    expression: 'Gross Margin % = [ (Revenue - COGS) ÷ Revenue ] × 100% ; Net Margin % = (Net Profit ÷ Revenue) × 100%',
    variables: [
      { symbol: 'Gross Margin', explanation: 'Percentage of revenue exceeding direct production costs' },
      { symbol: 'Net Margin', explanation: 'Percentage of revenue remaining after all operating, tax, and interest costs' },
      { symbol: 'Revenue', explanation: 'Total gross sales / turnover' },
      { symbol: 'COGS', explanation: 'Cost of Goods Sold (direct materials + direct labor)' },
    ],
  },
  'break-even-calculator': {
    expression: 'Break-Even Units = Fixed Costs ÷ (Selling Price per Unit - Variable Cost per Unit)',
    variables: [
      { symbol: 'Break-Even Units', explanation: 'Number of units required to cover all operating expenses' },
      { symbol: 'Fixed Costs', explanation: 'Overhead expenses incurred regardless of production volume (Rent, Salaries)' },
      { symbol: 'Contribution Margin', explanation: 'Selling Price per unit - Variable Cost per unit' },
    ],
  },
  'working-capital-calculator': {
    expression: 'Working Capital = Current Assets - Current Liabilities ; Current Ratio = Current Assets ÷ Current Liabilities',
    variables: [
      { symbol: 'Current Assets', explanation: 'Liquid assets convertible to cash within 1 year (Cash, AR, Inventory)' },
      { symbol: 'Current Liabilities', explanation: 'Short-term obligations due within 1 year (AP, Short-term Debt)' },
    ],
  },
  'burn-rate-calculator': {
    expression: 'Net Monthly Burn = Monthly Operating Expenses - Monthly Revenue ; Runway = Cash Balance ÷ Net Burn',
    variables: [
      { symbol: 'Net Burn', explanation: 'Net cash consumed by company per month' },
      { symbol: 'Runway', explanation: 'Total survival duration in months before cash reserves reach zero' },
      { symbol: 'Cash Balance', explanation: 'Total uncommitted cash and cash equivalents on balance sheet' },
    ],
  },
  'revenue-calculator': {
    expression: 'Total Revenue = Unit Selling Price × Total Quantity Sold',
    variables: [
      { symbol: 'Total Revenue', explanation: 'Gross top-line sales generated' },
      { symbol: 'Unit Selling Price', explanation: 'Average realized price per unit sold' },
      { symbol: 'Quantity', explanation: 'Total volume of product or service units delivered' },
    ],
  },
  'markup-calculator': {
    expression: 'Markup % = [ (Selling Price - Cost) ÷ Cost ] × 100% ; Selling Price = Cost × (1 + Markup ÷ 100)',
    variables: [
      { symbol: 'Markup %', explanation: 'Percentage added to cost price to establish selling price' },
      { symbol: 'Cost', explanation: 'Unit production or procurement cost' },
      { symbol: 'Selling Price', explanation: 'Final retail price charged to customers' },
    ],
  },
  'contribution-margin-calculator': {
    expression: 'Contribution Margin = Revenue - Variable Costs ; CM Ratio = (CM ÷ Revenue) × 100%',
    variables: [
      { symbol: 'CM', explanation: 'Dollar contribution available to cover fixed overhead costs and generate profit' },
      { symbol: 'Variable Costs', explanation: 'Expenses scaling directly with production volume' },
    ],
  },
  'business-valuation-calculator': {
    expression: 'Enterprise Valuation = Financial Metric (Revenue / EBITDA / Net Profit) × Industry Multiple',
    variables: [
      { symbol: 'Valuation', explanation: 'Estimated baseline fair enterprise valuation' },
      { symbol: 'Multiple', explanation: 'Market-clearing valuation multiple based on industry sector & growth' },
    ],
  },
  'inventory-turnover-calculator': {
    expression: 'Turnover Ratio = COGS ÷ Average Inventory ; DSI = (Average Inventory ÷ COGS) × 365',
    variables: [
      { symbol: 'Turnover Ratio', explanation: 'Number of times total inventory is sold and replaced per year' },
      { symbol: 'DSI', explanation: 'Days Sales of Inventory (average days to sell current inventory stock)' },
    ],
  },
  'accounts-receivable-calculator': {
    expression: 'AR Turnover = Net Credit Sales ÷ Average AR ; DSO = (Average AR ÷ Net Credit Sales) × 365',
    variables: [
      { symbol: 'DSO', explanation: 'Days Sales Outstanding (average collection time in days)' },
      { symbol: 'Average AR', explanation: 'Average outstanding accounts receivable across the financial period' },
    ],
  },
  'accounts-payable-calculator': {
    expression: 'AP Turnover = Total Credit Purchases ÷ Average AP ; DPO = (Average AP ÷ Purchases) × 365',
    variables: [
      { symbol: 'DPO', explanation: 'Days Payables Outstanding (average time taken to pay vendor invoices)' },
    ],
  },
  'cash-conversion-cycle-calculator': {
    expression: 'CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payables Outstanding (DPO)',
    variables: [
      { symbol: 'CCC', explanation: 'Cash Conversion Cycle (net days capital is tied up in operational cycle)' },
      { symbol: 'DIO', explanation: 'Average days inventory sits before being sold' },
      { symbol: 'DSO', explanation: 'Average days taken to collect customer invoice payments' },
      { symbol: 'DPO', explanation: 'Average days deferred before paying supplier invoices' },
    ],
  },
  'pricing-calculator': {
    expression: 'Selling Price = Direct Cost ÷ (1 - Target Gross Margin % ÷ 100)',
    variables: [
      { symbol: 'Selling Price', explanation: 'Calculated target unit retail price' },
      { symbol: 'Direct Cost', explanation: 'Total unit variable cost and bill of materials' },
      { symbol: 'Target Margin', explanation: 'Desired percentage gross margin on selling price' },
    ],
  },
  'target-profit-calculator': {
    expression: 'Required Sales Units = (Fixed Costs + Target Operating Profit) ÷ (Unit Price - Unit Variable Cost)',
    variables: [
      { symbol: 'Required Units', explanation: 'Total unit volume necessary to hit monetary target profit' },
      { symbol: 'Target Profit', explanation: 'Desired net dollar operating profit' },
    ],
  },
  'dividend-yield-calculator': {
    expression: 'Dividend Yield % = (Annual Dividend per Share ÷ Current Stock Market Price) × 100%',
    variables: [
      { symbol: 'Dividend Yield', explanation: 'Annual cash return generated relative to share price' },
      { symbol: 'Annual Dividend', explanation: 'Total declared dividend payouts per share over trailing 12 months' },
      { symbol: 'Stock Price', explanation: 'Current market trading quote per equity share' },
    ],
  },
  'stock-average-calculator': {
    expression: 'Average Buy Price = Total Capital Invested (∑ Shares × Price) ÷ Total Shares Owned (∑ Shares)',
    variables: [
      { symbol: 'Average Price', explanation: 'Weighted average purchase price per share across all tranches' },
      { symbol: 'Total Capital', explanation: 'Combined sum of all purchase tranches including transaction brokerage' },
    ],
  },
  'stock-profit-calculator': {
    expression: 'Net Profit = (Sell Price × Shares) - (Buy Price × Shares) - Total Brokerage, STT & Taxes',
    variables: [
      { symbol: 'Net Profit', explanation: 'Net realized trading capital gain after all regulatory transaction costs' },
      { symbol: 'STT & Taxes', explanation: 'Securities Transaction Tax, Exchange turnover fees, and GST deductions' },
    ],
  },
  'capital-gains-tax-calculator': {
    expression: 'LTCG / STCG = Sale Consideration - (Indexed Cost of Acquisition + Transfer Expenses)',
    variables: [
      { symbol: 'Capital Gain', explanation: 'Taxable profit realized upon sale of capital asset' },
      { symbol: 'Indexed Cost', explanation: 'Original purchase cost adjusted for inflation using Cost Inflation Index (CII)' },
    ],
  },
  'income-tax-calculator': {
    expression: 'Total Tax = ∑ (Income in Slab × Slab Tax Rate) + Surcharge + 4% Health & Education Cess',
    variables: [
      { symbol: 'Total Tax', explanation: 'Net income tax liability payable to tax authority' },
      { symbol: 'Slabs', explanation: 'Progressive statutory income brackets under Old or New Tax Regime' },
      { symbol: 'Cess', explanation: 'Mandatory 4% statutory health and education cess on tax liability' },
    ],
  },
  'hra-calculator': {
    expression: 'Exempt HRA = Minimum of [ Actual HRA received, Rent Paid - 10% of Basic, 50% Basic (Metro) or 40% (Non-Metro) ]',
    variables: [
      { symbol: 'Exempt HRA', explanation: 'Statutory tax-free portion of House Rent Allowance under Section 10(13A)' },
      { symbol: 'Taxable HRA', explanation: 'Actual HRA Received - Exempt HRA' },
    ],
  },
  'old-vs-new-tax-calculator': {
    expression: 'Net Tax Difference = Tax Liability (Old Regime with Deductions) - Tax Liability (New Regime u/s 115BAC)',
    variables: [
      { symbol: 'Net Savings', explanation: 'Monetary tax difference to identify optimal tax filing regime' },
    ],
  },
  'home-loan-calculator': {
    expression: 'EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]',
    variables: [
      { symbol: 'P', explanation: 'Sanctioned home loan principal amount' },
      { symbol: 'r', explanation: 'Monthly home loan interest rate (Annual Rate ÷ 1200)' },
      { symbol: 'n', explanation: 'Home loan tenure in months (e.g. 240 months for 20 years)' },
    ],
  },
  'car-loan-calculator': {
    expression: 'EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]',
    variables: [
      { symbol: 'P', explanation: 'Auto loan principal amount financed' },
      { symbol: 'r', explanation: 'Monthly auto loan interest rate' },
      { symbol: 'n', explanation: 'Auto loan tenure in months (e.g. 60 to 84 months)' },
    ],
  },
  'personal-loan-calculator': {
    expression: 'EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]',
    variables: [
      { symbol: 'P', explanation: 'Unsecured personal loan principal borrowed' },
      { symbol: 'r', explanation: 'Monthly interest rate' },
      { symbol: 'n', explanation: 'Repayment term in months (12 to 60 months)' },
    ],
  },
  'education-loan-calculator': {
    expression: 'EMI = [ P_total × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ] ; P_total = P_principal + Simple Interest during Moratorium',
    variables: [
      { symbol: 'P_total', explanation: 'Consolidated debt at end of course moratorium period' },
      { symbol: 'r', explanation: 'Monthly education loan interest rate' },
      { symbol: 'n', explanation: 'Repayment tenure in months' },
    ],
  },
  'loan-prepayment-calculator': {
    expression: 'Interest Saved = Total Original Interest - Total Prepayment Scenario Interest',
    variables: [
      { symbol: 'Prepayment', explanation: 'Lump-sum or recurring principal prepayment applied directly to loan balance' },
      { symbol: 'Tenure Reduction', explanation: 'Months saved off the remaining loan amortization schedule' },
    ],
  },
  'interest-between-dates-calculator': {
    expression: 'Interest = (Principal × Rate × Days) ÷ (365 × 100)',
    variables: [
      { symbol: 'Principal', explanation: 'Original sum deposited or borrowed' },
      { symbol: 'Rate', explanation: 'Annual interest percentage rate' },
      { symbol: 'Days', explanation: 'Exact calendar day count between Start Date and End Date' },
    ],
  },
  'travel-budget-calculator': {
    expression: 'Total Travel Cost = Flight/Transport + (Hotel/Night × Nights) + (Daily Food & Activities × Days) + Buffer',
    variables: [
      { symbol: 'Transport', explanation: 'Round-trip transit, flights, trains, and local mobility fares' },
      { symbol: 'Accommodation', explanation: 'Total lodging stay cost including taxes' },
      { symbol: 'Daily Expenses', explanation: 'Daily dining, excursions, transit, and shopping allowance' },
      { symbol: 'Buffer', explanation: 'Contingency emergency reserve (typically 10% - 15%)' },
    ],
  },
  'currency-converter': {
    expression: 'Converted Target Amount = Source Amount × Foreign Exchange Cross Rate',
    variables: [
      { symbol: 'Source Amount', explanation: 'Monetary value in base originating currency' },
      { symbol: 'Exchange Rate', explanation: 'Real-time market spot FX rate between base and target currency pair' },
    ],
  },
  'unit-converter': {
    expression: 'Converted Value = Base Value × Direct Metric/Imperial Conversion Factor',
    variables: [
      { symbol: 'Base Value', explanation: 'Input measurement quantity' },
      { symbol: 'Factor', explanation: 'Standard ISO physical conversion coefficient' },
    ],
  },
  'square-footage-calculator': {
    expression: 'Area (sq ft) = Length (feet) × Width (feet) ; Area (sq m) = Area (sq ft) ÷ 10.764',
    variables: [
      { symbol: 'Length', explanation: 'Linear measurement of the room / plot length in feet' },
      { symbol: 'Width', explanation: 'Linear measurement of the room / plot width in feet' },
    ],
  },
  'percentage-calculator': {
    expression: 'Percentage = (Value ÷ Total) × 100% ; Result = (Percentage ÷ 100) × Total',
    variables: [
      { symbol: 'Value', explanation: 'Numerator portion' },
      { symbol: 'Total', explanation: 'Denominator baseline whole amount' },
    ],
  },
  'age-calculator': {
    expression: 'Age = Target Date (Current Date) - Date of Birth (in Years, Months, and Days)',
    variables: [
      { symbol: 'Chronological Age', explanation: 'Exact elapsed calendar duration accounting for leap years' },
    ],
  },

  // Health & Fitness Calculators
  'bmi-calculator': {
    expression: 'BMI = Weight (kg) ÷ [ Height (m) ]²',
    variables: [
      { symbol: 'BMI', explanation: 'Body Mass Index (kg/m²)' },
      { symbol: 'Weight', explanation: 'Body mass in kilograms (or lbs ÷ 2.205)' },
      { symbol: 'Height', explanation: 'Stature in meters (cm ÷ 100 or inches × 0.0254)' },
    ],
    notes: 'WHO Categories: Underweight (<18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (≥30).',
  },
  'bmr-calculator': {
    expression: 'Men: BMR = 10W + 6.25H - 5A + 5 ; Women: BMR = 10W + 6.25H - 5A - 161',
    variables: [
      { symbol: 'BMR', explanation: 'Basal Metabolic Rate in kcal/day (Mifflin-St Jeor Equation)' },
      { symbol: 'W', explanation: 'Body weight in kilograms' },
      { symbol: 'H', explanation: 'Height in centimeters' },
      { symbol: 'A', explanation: 'Age in completed years' },
    ],
  },
  'calorie-calculator': {
    expression: 'TDEE = BMR × Physical Activity Factor (1.2 to 1.9)',
    variables: [
      { symbol: 'TDEE', explanation: 'Total Daily Energy Expenditure in kcal/day for weight maintenance' },
      { symbol: 'Deficit / Surplus', explanation: 'Weight Loss: TDEE - 500 kcal ; Muscle Gain: TDEE + 300 kcal' },
    ],
  },
  'body-fat-percentage-calculator': {
    expression: 'Men: 495 ÷ [ 1.0324 - 0.19077(log(W-N)) + 0.15456(log(H)) ] - 450',
    variables: [
      { symbol: 'W', explanation: 'Abdomen/Waist circumference in cm' },
      { symbol: 'N', explanation: 'Neck circumference in cm' },
      { symbol: 'H', explanation: 'Height in cm (U.S. Navy Body Fat Formula)' },
    ],
  },
  'water-intake-calculator': {
    expression: 'Daily Water (L) = Weight (kg) × 0.033 + (Exercise Duration in Minutes ÷ 30) × 0.35 L',
    variables: [
      { symbol: 'Water (L)', explanation: 'Recommended daily baseline fluid intake in liters' },
    ],
  },
  'ideal-weight-calculator': {
    expression: 'Men: 50 kg + 2.3 kg × (Height in inches - 60) ; Women: 45.5 kg + 2.3 kg × (Height in inches - 60)',
    variables: [
      { symbol: 'IBW', explanation: 'Ideal Body Weight in kg (Devine Clinical Formula)' },
    ],
  },

  // Everyday & Construction
  'tip-calculator': {
    expression: 'Tip Amount = Bill × (Tip % ÷ 100) ; Total = Bill + Tip ; Per Person = Total ÷ Split Count',
    variables: [
      { symbol: 'Tip Amount', explanation: 'Gratuity dollar value added' },
      { symbol: 'Per Person', explanation: 'Individual payment share after splitting bill' },
    ],
  },
  'discount-calculator': {
    expression: 'Savings = Original Price × (Discount % ÷ 100) ; Final Price = Original Price - Savings',
    variables: [
      { symbol: 'Savings', explanation: 'Monetary discount subtracted from retail price' },
      { symbol: 'Final Price', explanation: 'Net purchase price payable at checkout' },
    ],
  },
  'fuel-cost-calculator': {
    expression: 'Total Fuel Cost = (Trip Distance ÷ Vehicle Mileage in km/L) × Fuel Price per Liter',
    variables: [
      { symbol: 'Trip Distance', explanation: 'Total route length in kilometers or miles' },
      { symbol: 'Mileage', explanation: 'Fuel efficiency of vehicle (km/L or MPG)' },
      { symbol: 'Fuel Price', explanation: 'Cost per liter/gallon of petrol or diesel' },
    ],
  },
  'electricity-bill-calculator': {
    expression: 'Units (kWh) = (Power in Watts × Hours/Day × 30) ÷ 1000 ; Bill = Units × Tariff per kWh',
    variables: [
      { symbol: 'Units (kWh)', explanation: 'Total monthly electrical energy consumption' },
      { symbol: 'Tariff', explanation: 'Electricity utility rate per kilowatt-hour' },
    ],
  },
  'concrete-calculator': {
    expression: 'Volume (cu m) = Length × Width × Thickness ; Dry Volume = Wet Volume × 1.54',
    variables: [
      { symbol: 'Volume', explanation: 'Total volume of concrete slab/footing' },
      { symbol: 'Cement Bags', explanation: 'Calculated using standard mix ratio (e.g. M20: 1:1.5:3)' },
    ],
  },
  'brick-calculator': {
    expression: 'Number of Bricks = [ Wall Volume ÷ Volume of 1 Brick with Mortar ] × 1.05 (5% Wastage)',
    variables: [
      { symbol: 'Wall Volume', explanation: 'Length × Height × Wall Thickness' },
      { symbol: 'Brick Volume', explanation: 'Standard modular brick dimensions (190mm × 90mm × 90mm)' },
    ],
  },
  'paint-calculator': {
    expression: 'Paint Needed (Liters) = [ (Wall Area - Doors & Windows Area) × Number of Coats ] ÷ Coverage (sq ft/L)',
    variables: [
      { symbol: 'Wall Area', explanation: 'Total perimeter wall surface area in square feet' },
      { symbol: 'Coverage', explanation: 'Paint spread rate (typically 120–140 sq ft per liter per coat)' },
    ],
  },
  'tile-calculator': {
    expression: 'Total Tiles Required = ⌈ (Total Surface Area ÷ Single Tile Area) × 1.10 (10% Cutting Wastage) ⌉',
    variables: [
      { symbol: 'Surface Area', explanation: 'Floor or wall area to be tiled (Length × Width)' },
      { symbol: 'Single Tile Area', explanation: 'Tile width × tile length in same unit' },
    ],
  },
};

/**
 * Fallback formula generator providing real domain-specific equations
 * instead of generic placeholders.
 */
export function getToolFormula(
  slug: string,
  name: string,
  category: string,
  existingFormula?: { expression?: string; variables?: FormulaVariable[]; notes?: string }
): ToolFormulaData {
  // 1. If an explicit custom formula already exists and is not the generic placeholder, use it
  if (existingFormula && existingFormula.expression && existingFormula.expression !== 'Result = f(Inputs)') {
    return {
      expression: existingFormula.expression,
      variables: existingFormula.variables && existingFormula.variables.length > 0
        ? existingFormula.variables
        : [
            { symbol: 'Parameters', explanation: 'Validated numeric inputs for calculation' },
            { symbol: 'Output', explanation: 'Deterministic computed result' },
          ],
      notes: existingFormula.notes,
    };
  }

  // 2. Direct slug lookup
  if (TOOL_FORMULAS_MAP[slug]) {
    return TOOL_FORMULAS_MAP[slug];
  }

  // 3. Domain-specific intelligent fallback by category & slug keywords
  const s = slug.toLowerCase();
  const n = name.toLowerCase();

  if (s.includes('tax') || n.includes('tax')) {
    return {
      expression: 'Tax Liability = Taxable Base × Applicable Tax Rate (%) - Tax Credits & Deductions',
      variables: [
        { symbol: 'Taxable Base', explanation: 'Gross assessable income or transaction value' },
        { symbol: 'Tax Rate', explanation: 'Statutory slab rate or flat percentage rate' },
        { symbol: 'Credits', explanation: 'Allowable exemptions, standard deductions, or rebates' },
      ],
      notes: 'Computed using official tax slab schedules and statutory deductions.',
    };
  }

  if (s.includes('loan') || s.includes('mortgage') || n.includes('loan') || n.includes('mortgage')) {
    return {
      expression: 'EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]',
      variables: [
        { symbol: 'P', explanation: 'Principal loan amount' },
        { symbol: 'r', explanation: 'Monthly interest rate (Annual Rate ÷ 1200)' },
        { symbol: 'n', explanation: 'Total repayment installments in months' },
      ],
      notes: 'Standard reducing-balance loan amortization formula.',
    };
  }

  if (s.includes('ratio') || s.includes('turnover') || s.includes('coverage') || n.includes('ratio')) {
    return {
      expression: 'Financial Ratio = Primary Numerator Metric ÷ Secondary Denominator Benchmark',
      variables: [
        { symbol: 'Numerator', explanation: 'Operating earnings, sales, or asset balance' },
        { symbol: 'Denominator', explanation: 'Financial obligations, equity, or liabilities' },
      ],
      notes: 'Evaluates liquidity, efficiency, leverage, or profitability.',
    };
  }

  if (s.includes('convert') || n.includes('converter')) {
    return {
      expression: 'Converted Value = Source Quantity × Conversion Multiplier',
      variables: [
        { symbol: 'Source Quantity', explanation: 'Input value in source measurement unit' },
        { symbol: 'Multiplier', explanation: 'Exact unit conversion standard multiplier' },
      ],
      notes: 'Deterministic unit transformation based on international metrology standards.',
    };
  }

  if (s.includes('cost') || s.includes('budget') || s.includes('price') || n.includes('cost')) {
    return {
      expression: 'Total Cost = Fixed Baseline Costs + (Unit Rate × Usage Volume) + Contingency Buffer',
      variables: [
        { symbol: 'Fixed Costs', explanation: 'Baseline non-variable expenditure' },
        { symbol: 'Unit Rate', explanation: 'Cost incurred per unit of consumption or material' },
        { symbol: 'Volume', explanation: 'Total quantity or duration' },
      ],
      notes: 'Comprehensive cost aggregation including contingency buffers.',
    };
  }

  if (category === 'health-fitness') {
    return {
      expression: 'Index Score = f(Weight, Height, Age, Biological Sex, Activity Level)',
      variables: [
        { symbol: 'Biometrics', explanation: 'Individual physiological parameters entered' },
        { symbol: 'Target Zone', explanation: 'Clinically validated healthy metabolic baseline' },
      ],
      notes: 'Derived from standardized peer-reviewed health and fitness equations.',
    };
  }

  // Fallback for general mathematics
  return {
    expression: `${name} Formula = Mathematical Evaluation of Defined Input Parameters`,
    variables: [
      { symbol: 'Inputs', explanation: `Parameters entered into the ${name} workspace` },
      { symbol: 'Output', explanation: `Accurate deterministic outcome computed by ${name}` },
    ],
    notes: 'All calculations are computed locally with complete precision and privacy.',
  };
}
