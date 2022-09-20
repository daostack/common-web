import { CreationStep } from "../constants";
import { StepProgressItem } from "@/shared/components";

export const getStepData = (
  isSubCommonCreation: boolean
): Record<
  CreationStep,
  {
    title: string;
    description?: string;
    descriptionClassName?: string;
  }
> => ({
  [CreationStep.GeneralInfo]: {
    title: "General Info",
    description: isSubCommonCreation
      ? "Sub-Common is based on a circle from its parent common and serve as a separate space for its members to collaborate on their goals."
      : "Describe your cause and let the community learn more about your plans and goals.",
    descriptionClassName: isSubCommonCreation
      ? "create-common-steps-progress__description--sub-common"
      : "",
  },
  [CreationStep.UserAcknowledgment]: {
    title: "User Acknowledgment",
    description: "Before creating a Common, please make sure that:",
  },
  [CreationStep.Rules]: {
    title: "Rules",
    description:
      "Control how this Common will collect and manage funds.",
  },
  [CreationStep.Funding]: {
    title: "Funding",
  },
  [CreationStep.Review]: {
    title: "Final touches and review",
  },
});

export const getStepProgressItems = (
  allStepsData: ReturnType<typeof getStepData>,
  isSubCommonCreation: boolean
): StepProgressItem[] => {
  
  const progressItems = [
    {
      title: allStepsData[CreationStep.GeneralInfo].title,
      activeImageSource: "/icons/common-creation/general-info-current.svg",
      inactiveImageSource: "/icons/common-creation/general-info-current.svg",
    },
    {
      title: allStepsData[CreationStep.Rules].title,
      activeImageSource: "/icons/common-creation/rules-current.svg",
      inactiveImageSource: "/icons/common-creation/rules-next.svg",
    },
    {
      title: allStepsData[CreationStep.Funding].title,
      activeImageSource: "/icons/common-creation/funding-current.svg",
      inactiveImageSource: "/icons/common-creation/funding-next.svg",
    },
    {
      title: allStepsData[CreationStep.Review].title,
      activeImageSource: "/icons/common-creation/review-current.svg",
      inactiveImageSource: "/icons/common-creation/review-next.svg",
    },
  ];

  if (isSubCommonCreation) {
    progressItems.splice(2,1);
  }

  return progressItems;
};
