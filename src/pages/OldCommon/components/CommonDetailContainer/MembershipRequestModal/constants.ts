import { StepProgressItem } from "@/shared/components";

export enum MembershipRequestStage {
  Welcome,
  Introduce,
  Rules,
  Payment,
  Creating,
  Created,
}

export enum MembershipRequestStep {
  Introduce = "Introduce",
  Rules = "Rules",
  Payment = "Payment",
}

export const STEPS: StepProgressItem[] = [
  {
    title: MembershipRequestStep.Introduce,
    activeImageSource: "/icons/membership-request/introduce-current.svg",
    inactiveImageSource: "/icons/membership-request/introduce-current.svg",
  },
  {
    title: MembershipRequestStep.Rules,
    activeImageSource: "/icons/membership-request/rules-current.svg",
    inactiveImageSource: "/icons/membership-request/rules-gray.svg",
  },
  {
    title: MembershipRequestStep.Payment,
    activeImageSource: "/icons/membership-request/payment-current.svg",
    inactiveImageSource: "/icons/membership-request/payment-gray.svg",
  },
];
