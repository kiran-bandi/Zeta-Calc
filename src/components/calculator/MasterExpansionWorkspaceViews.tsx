import React from 'react';
import { DebtAndRetirementViews, DEBT_RETIREMENT_SLUGS } from './masterExpansion/DebtAndRetirementViews';
import { PropertyAndBusinessViews, PROPERTY_BUSINESS_SLUGS } from './masterExpansion/PropertyAndBusinessViews';
import { SalaryAndEducationViews, SALARY_EDUCATION_SLUGS } from './masterExpansion/SalaryAndEducationViews';
import { VehicleAndHealthViews, VEHICLE_HEALTH_SLUGS } from './masterExpansion/VehicleAndHealthViews';
import { HealthFoodHomeViews, HEALTH_FOOD_HOME_SLUGS } from './masterExpansion/HealthFoodHomeViews';
import { MathAndDateTimeViews, MATH_DATETIME_SLUGS } from './masterExpansion/MathAndDateTimeViews';
import { DigitalAndDecisionViews, DIGITAL_DECISION_SLUGS } from './masterExpansion/DigitalAndDecisionViews';

interface Props {
  toolSlug: string;
}

export const MASTER_EXPANSION_SLUGS = [
  ...DEBT_RETIREMENT_SLUGS,
  ...PROPERTY_BUSINESS_SLUGS,
  ...SALARY_EDUCATION_SLUGS,
  ...VEHICLE_HEALTH_SLUGS,
  ...HEALTH_FOOD_HOME_SLUGS,
  ...MATH_DATETIME_SLUGS,
  ...DIGITAL_DECISION_SLUGS,
];

export const MasterExpansionWorkspaceViews: React.FC<Props> = ({ toolSlug }) => {
  if (DEBT_RETIREMENT_SLUGS.includes(toolSlug)) {
    return <DebtAndRetirementViews toolSlug={toolSlug} />;
  }
  if (PROPERTY_BUSINESS_SLUGS.includes(toolSlug)) {
    return <PropertyAndBusinessViews toolSlug={toolSlug} />;
  }
  if (SALARY_EDUCATION_SLUGS.includes(toolSlug)) {
    return <SalaryAndEducationViews toolSlug={toolSlug} />;
  }
  if (VEHICLE_HEALTH_SLUGS.includes(toolSlug)) {
    return <VehicleAndHealthViews toolSlug={toolSlug} />;
  }
  if (HEALTH_FOOD_HOME_SLUGS.includes(toolSlug)) {
    return <HealthFoodHomeViews toolSlug={toolSlug} />;
  }
  if (MATH_DATETIME_SLUGS.includes(toolSlug)) {
    return <MathAndDateTimeViews toolSlug={toolSlug} />;
  }
  if (DIGITAL_DECISION_SLUGS.includes(toolSlug)) {
    return <DigitalAndDecisionViews toolSlug={toolSlug} />;
  }

  return null;
};
