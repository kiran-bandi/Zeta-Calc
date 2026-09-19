import React from 'react';
import {
  PhysicsMechanicsViews,
  PHYSICS_MECHANICS_SLUGS,
} from './physics/PhysicsMechanicsViews';
import {
  PhysicsEnergyAndFieldsViews,
  PHYSICS_ENERGY_FIELDS_SLUGS,
} from './physics/PhysicsEnergyAndFieldsViews';

export const PHYSICS_TOOL_SLUGS = [
  ...PHYSICS_MECHANICS_SLUGS,
  ...PHYSICS_ENERGY_FIELDS_SLUGS,
];

interface Props {
  toolSlug: string;
}

export const PhysicsCalculatorsWorkspaceView: React.FC<Props> = ({ toolSlug }) => {
  if (PHYSICS_MECHANICS_SLUGS.includes(toolSlug)) {
    return <PhysicsMechanicsViews toolSlug={toolSlug} />;
  }
  if (PHYSICS_ENERGY_FIELDS_SLUGS.includes(toolSlug)) {
    return <PhysicsEnergyAndFieldsViews toolSlug={toolSlug} />;
  }
  return null;
};
