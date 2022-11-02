import { StepProgressItem } from "@/shared/components";
import { EditStep } from "../constants";

export const getStepData = (): Record<
  EditStep,
  {
    title: string;
    description?: string;
    descriptionClassName?: string;
  }
> => ({
  [EditStep.GeneralInfo]: {
    title: "General Info",
    description:
      "Describe your cause and let the community learn more about your plans and goals.",
    descriptionClassName: "",
  },
  /*[EditStep.Rules]: {
    title: "Rules",
    description:
      "Add rules of conduct. New members must agree to the rules before joining the Common.",
  },*/
  [EditStep.Review]: {
    title: "Final touches and review",
  },
});

export const getStepProgressItems = (
  allStepsData: ReturnType<typeof getStepData>,
): StepProgressItem[] => [
  {
    title: allStepsData[EditStep.GeneralInfo].title,
    activeImageSource: "/icons/common-creation/general-info-current.svg",
    inactiveImageSource: "/icons/common-creation/general-info-current.svg",
  },
  /*{
    title: allStepsData[EditStep.Rules].title,
    activeImageSource: "/icons/common-creation/rules-current.svg",
    inactiveImageSource: "/icons/common-creation/rules-next.svg",
  },*/
  {
    title: allStepsData[EditStep.Review].title,
    activeImageSource: "/icons/common-creation/review-current.svg",
    inactiveImageSource: "/icons/common-creation/review-next.svg",
  },
];
