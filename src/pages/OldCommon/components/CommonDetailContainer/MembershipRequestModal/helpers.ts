import { StepProgressItem } from "@/shared/components";
import { ProposalsTypes } from "@/shared/constants";
import { Governance } from "@/shared/models";
import { STEPS, MembershipRequestStep } from "./constants";

export const shouldShowRulesStep = (governance: Governance): boolean =>
  governance.unstructuredRules.length > 0;

export const shouldShowPaymentStep = (governance: Governance): boolean =>
  Boolean(
    governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE]?.limitations
      .paymentMustGoThrough,
  );

export const getSteps = (governance: Governance): StepProgressItem[] => {
  const stepsToExclude: MembershipRequestStep[] = [];

  if (!shouldShowRulesStep(governance)) {
    stepsToExclude.push(MembershipRequestStep.Rules);
  }

  if (!shouldShowPaymentStep(governance)) {
    stepsToExclude.push(MembershipRequestStep.Payment);
  }

  return STEPS.filter(
    ({ title }) => !stepsToExclude.includes(title as MembershipRequestStep),
  );
};
