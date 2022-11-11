import { StepProgressItem } from "@/shared/components";
import { commonTypeText } from "@/shared/utils";
import { EditStep } from "../constants";

export const getStepData = (isSubCommon = false): Record<
  EditStep,
  {
    title: string;
    description?: string;
    descriptionClassName?: string;
  }
> => ({
  [EditStep.Rules]: {
    title: "Rules",
    description:
      `Add rules of conduct. New members must agree to the rules before joining the ${commonTypeText(isSubCommon)}.`,
  },
  [EditStep.Review]: {
    title: "Final touches and review",
  },
});

export const getStepProgressItems = (
  allStepsData: ReturnType<typeof getStepData>,
): StepProgressItem[] => [
  {
    title: allStepsData[EditStep.Rules].title,
    activeImageSource: "/icons/common-creation/rules-current.svg",
    inactiveImageSource: "/icons/common-creation/rules-next.svg",
  },
  {
    title: allStepsData[EditStep.Review].title,
    activeImageSource: "/icons/common-creation/review-current.svg",
    inactiveImageSource: "/icons/common-creation/review-next.svg",
  },
];
