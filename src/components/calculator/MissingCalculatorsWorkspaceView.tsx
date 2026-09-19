import React from 'react';
import { MathPhaseViews, MATH_PHASE_SLUGS } from './missing/MathPhaseViews';
import { HealthPhaseViews, HEALTH_PHASE_SLUGS } from './missing/HealthPhaseViews';
import { EnergyPhaseViews, ENERGY_PHASE_SLUGS } from './missing/EnergyPhaseViews';
import { PropertyPhaseViews, PROPERTY_PHASE_SLUGS } from './missing/PropertyPhaseViews';
import { DebtPhaseViews, DEBT_PHASE_SLUGS } from './missing/DebtPhaseViews';
import { SalaryEducationPhaseViews, SALARY_EDUCATION_PHASE_SLUGS } from './missing/SalaryEducationPhaseViews';
import { PhysicsPhase2Views, PHYSICS_PHASE2_SLUGS } from './missing/PhysicsPhase2Views';

export const MISSING_CALCULATORS_WORKSPACE_SLUGS = [
  ...MATH_PHASE_SLUGS,
  ...HEALTH_PHASE_SLUGS,
  ...ENERGY_PHASE_SLUGS,
  ...PROPERTY_PHASE_SLUGS,
  ...DEBT_PHASE_SLUGS,
  ...SALARY_EDUCATION_PHASE_SLUGS,
  ...PHYSICS_PHASE2_SLUGS,
];

interface Props {
  toolSlug: string;
}

export const MissingCalculatorsWorkspaceView: React.FC<Props> = ({ toolSlug }) => {
  if (MATH_PHASE_SLUGS.includes(toolSlug)) {
    return <MathPhaseViews toolSlug={toolSlug} />;
  }
  if (HEALTH_PHASE_SLUGS.includes(toolSlug)) {
    return <HealthPhaseViews toolSlug={toolSlug} />;
  }
  if (ENERGY_PHASE_SLUGS.includes(toolSlug)) {
    return <EnergyPhaseViews toolSlug={toolSlug} />;
  }
  if (PROPERTY_PHASE_SLUGS.includes(toolSlug)) {
    return <PropertyPhaseViews toolSlug={toolSlug} />;
  }
  if (DEBT_PHASE_SLUGS.includes(toolSlug)) {
    return <DebtPhaseViews toolSlug={toolSlug} />;
  }
  if (SALARY_EDUCATION_PHASE_SLUGS.includes(toolSlug)) {
    return <SalaryEducationPhaseViews toolSlug={toolSlug} />;
  }
  if (PHYSICS_PHASE2_SLUGS.includes(toolSlug)) {
    return <PhysicsPhase2Views toolSlug={toolSlug} />;
  }
  return null;
};
