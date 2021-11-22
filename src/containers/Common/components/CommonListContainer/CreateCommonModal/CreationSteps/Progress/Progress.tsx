import React, { ReactElement } from "react";

import { StepProgress, StepProgressItem } from "../../../../../../../shared/components/StepProgress";
import { CreationStep } from "../constants";
import "./index.scss";

interface ProgressProps {
  creationStep: CreationStep;
}

const STEP_DATA: Record<CreationStep, { title: string; description?: string }> = {
  [CreationStep.GeneralInfo]: {
    title: 'General Info',
    description: 'Describe your cause and let the community learn more about your plans and goals.',
  },
  [CreationStep.Funding]: {
    title: 'Funding',
    description: 'Control how this Common will collect and manage funds.',
  },
  [CreationStep.Rules]: {
    title: 'Rules',
    description: 'Add rules of conduct. New members must agree to the rules before joining the Common.',
  },
  [CreationStep.Review]: {
    title: 'Final touches and review',
  },
};

const ITEMS: StepProgressItem[] = [
  {
    title: STEP_DATA[CreationStep.GeneralInfo].title,
    activeImageSource: '/icons/common-creation/general-info-current.svg',
    inactiveImageSource: '/icons/common-creation/general-info-current.svg',
  },
  {
    title: STEP_DATA[CreationStep.Funding].title,
    activeImageSource: '/icons/common-creation/funding-current.svg',
    inactiveImageSource: '/icons/common-creation/funding-next.svg',
  },
  {
    title: STEP_DATA[CreationStep.Rules].title,
    activeImageSource: '/icons/common-creation/rules-current.svg',
    inactiveImageSource: '/icons/common-creation/rules-next.svg',
  },
  {
    title: STEP_DATA[CreationStep.Review].title,
    activeImageSource: '/icons/common-creation/review-current.svg',
    inactiveImageSource: '/icons/common-creation/review-next.svg',
  },
];
export const PROGRESS_RELATED_STEPS = [CreationStep.GeneralInfo, CreationStep.Funding, CreationStep.Rules, CreationStep.Review];

export default function Progress({ creationStep }: ProgressProps): ReactElement {
  const stepData = STEP_DATA[creationStep];
  const stepIndex = PROGRESS_RELATED_STEPS.findIndex(step => step === creationStep);

  return (
    <div className="create-common-steps-progress">
      {stepIndex !== -1 && (
        <StepProgress
          className="create-common-steps-progress__stepper"
          currentStep={stepIndex + 1}
          items={ITEMS}
        />
      )}
      <h4 className="create-common-steps-progress__title">{stepData.title}</h4>
      {stepData.description && <p className="create-common-steps-progress__description">{stepData.description}</p>}
    </div>
  );
}
