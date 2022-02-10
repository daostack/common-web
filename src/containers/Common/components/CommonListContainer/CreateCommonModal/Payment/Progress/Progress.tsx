import React, { ReactElement } from "react";
import { StepProgress } from "@/shared/components/StepProgress";
import { PaymentStep } from "../constants";
import "./index.scss";

interface ProgressProps {
  creationStep: PaymentStep;
}

interface StepProgressItem {
  activeImageSource: string;
  inactiveImageSource: string;
}

const ITEMS: StepProgressItem[] = [
  {
    activeImageSource: "/icons/membership-request/contribution-current.svg",
    inactiveImageSource: "/icons/membership-request/contribution-gray.svg",
  },
  {
    activeImageSource: "/icons/membership-request/payment-current.svg",
    inactiveImageSource: "/icons/membership-request/payment-gray.svg",
  },
];
export const PROGRESS_RELATED_STEPS = [
  PaymentStep.PersonalContribution,
  PaymentStep.PaymentDetails,
];

export default function Progress({
  creationStep,
}: ProgressProps): ReactElement {
  const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
    (step) => step === creationStep
  );

  return (
    <div className="create-common-payment-steps-progress">
      {stepIndex !== -1 && (
        <StepProgress
          className="create-common-payment-steps-progress__stepper"
          currentStep={stepIndex + 1}
          items={ITEMS}
        />
      )}
    </div>
  );
}
