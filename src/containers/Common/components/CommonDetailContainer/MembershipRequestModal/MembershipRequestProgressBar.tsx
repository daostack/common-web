import React from "react";
import {
  StepProgress,
  StepProgressItem,
} from "@/shared/components/StepProgress";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

interface IProps {
  currentStage: MembershipRequestStage;
}

const STEPS: StepProgressItem[] = [
  {
    title: "Introduce",
    activeImageSource: "/icons/membership-request/introduce-current.svg",
    inactiveImageSource: "/icons/membership-request/introduce-current.svg",
  },
  {
    title: "Rules",
    activeImageSource: "/icons/membership-request/rules-current.svg",
    inactiveImageSource: "/icons/membership-request/rules-gray.svg",
  },
  {
    title: "Contribution",
    activeImageSource: "/icons/membership-request/contribution-current.svg",
    inactiveImageSource: "/icons/membership-request/contribution-gray.svg",
  },
];

export default function MembershipRequestProgressBar(props: IProps) {
  const { currentStage } = props;

  return (
    <StepProgress
      className="membership-request-progress-bar"
      currentStep={currentStage}
      items={STEPS}
    />
  );
}
