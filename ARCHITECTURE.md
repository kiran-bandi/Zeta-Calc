# Zeta Calculator — Platform Architecture & Engineering Guidelines

## Executive Architecture Summary
Zeta Calculator is a schema-driven, deterministic, client-first calculation and decision platform with reusable domain engines, shared normalization services, and a centralized calculator registry.

### Core Architectural Principles
1. **Existing functionality is protected**: No architecture improvement alters an existing calculator's formula, input meaning, result, route, or category unless fixing an intentional bug.
2. **One source of truth**: Reusable concepts have one authoritative implementation:
   - Units → `UnitRegistry` (`/src/platform/units/`)
   - Currencies → `CurrencyRegistry` (`/src/platform/currency/`)
   - Durations → `DurationEngine` (`/src/platform/duration/`)
   - Rates → `InterestRateNormalizer` (`/src/platform/rates/`)
   - Validation → `ValidationEngine` (`/src/platform/validation/`)
   - Primitives → `CashFlowEngine`, `TimelineEngine`, `ScenarioEngine`, `GoalEngine` (`/src/platform/timeline/`)
3. **Calculation code independent of UI**: Pure TypeScript engines receive inputs and return structured results with zero coupling to React, Tailwind, DOM, or localStorage.
4. **No country-first architecture**: Domain taxonomy (Finance, Property, Health, etc.) remains the primary hierarchy. Country-specific rules are applied as localized configurations rather than root-level routing.
5. **Deterministic client-side compute**: All calculations run locally in the browser sandbox. No user inputs are sent to calculation servers.

## How to Add a New Calculator
1. **Define Schema**: Specify input types (`currency`, `number`, `percentage`, `measurement`, `duration`, `date`), boundaries, and required flags.
2. **Create Engine**: Implement a pure deterministic calculation function in `/src/engine/<domain>.ts`.
3. **Register in Registry**: Add the calculator definition to `toolsRegistry.ts` with complete metadata, SEO, formulas, FAQ, and related tools.
4. **Add Unit & Contract Tests**: Add deterministic test cases to `/src/engine/__tests__/`.
5. **Run Verification**: Execute `npm test` to verify zero regression across all tools.
