import React from "react";
import { StepProgress, StepProgressItem } from "../../../../../../shared/components/StepProgress";

interface IProps {
  currentStage: number;
}

const STEPS: StepProgressItem[] = [
  {
    title: "General Info",
    activeImageSource: "/icons/create-common/general-info-current.svg",
    inactiveImageSource: "/icons/create-common/general-info-current.svg",
  },
  {
    title: "Funding",
    activeImageSource: "/icons/create-common/funding-current.svg",
    inactiveImageSource: "/icons/create-common/funding-gray.svg",
  },
  {
    title: "Rules",
    activeImageSource: "/icons/create-common/rules-current.svg",
    inactiveImageSource: "/icons/create-common/rules-gray.svg",
  },
  {
    title: "Review",
    activeImageSource: "/icons/create-common/review-current.svg",
    inactiveImageSource: "/icons/create-common/review-gray.svg",
  },
];

export default function CreateCommonProgressBar({ currentStage }: IProps) {
  return (
    <StepProgress
      className="create-common-progress-bar"
      currentStep={currentStage}
      items={STEPS}
    />
  )
}
