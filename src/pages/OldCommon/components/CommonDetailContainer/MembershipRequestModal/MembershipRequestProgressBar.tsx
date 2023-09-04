import React from "react";
import {
  StepProgress,
  StepProgressItem,
} from "@/shared/components/StepProgress";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

interface IProps {
  currentStage: MembershipRequestStage;
  steps: StepProgressItem[];
}

export default function MembershipRequestProgressBar(props: IProps) {
  const { currentStage, steps } = props;

  return (
    <StepProgress
      className="membership-request-progress-bar"
      currentStep={currentStage}
      items={steps}
    />
  );
}
