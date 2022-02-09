import React, { ReactElement } from "react";
import {
  StepProgress,
  StepProgressItem,
} from "@/shared/components/StepProgress";
import { PaymentStep } from "@/containers/Common/components/CommonListContainer/CreateCommonModal/Payment/constants";
import "./index.scss";

interface ProgressProps {
  creationStep: PaymentStep;
}

const STEP_DATA: Record<
  PaymentStep,
  { title: string; description?: string }
> = {
  [PaymentStep.PersonalContribution]: {
    title: "Monthly Payment",
    description:
      "Select the amount for your personal contribution to this Common. Payment to this Common" +
        " ($10/mo min.) You will not be charged until another member joins the Common.",
  },
  [PaymentStep.PaymentDetails]: {
    title: "Payment Details",
    description: "Billing Details",
  },
};

const ITEMS: StepProgressItem[] = [
  {
    title: STEP_DATA[PaymentStep.PersonalContribution].title,
    activeImageSource: "/icons/membership-request/contribution-current.svg",
    inactiveImageSource: "/icons/membership-request/contribution-gray.svg",
  },
  {
    title: STEP_DATA[PaymentStep.PaymentDetails].title,
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
