import React, { ReactElement, useMemo } from "react";
import classNames from "classnames";
import { StepProgress } from "@/shared/components";
import { CreationStep } from "../constants";
import { getStepData, getStepProgressItems } from "./helpers";
import "./index.scss";

interface ProgressProps {
  creationStep: CreationStep;
  isSubCommonCreation: boolean;
}

export const PROGRESS_RELATED_STEPS = [
  CreationStep.GeneralInfo,
  CreationStep.Rules,
  CreationStep.Funding,
  CreationStep.Review,
];

export default function Progress({
  creationStep,
  isSubCommonCreation,
}: ProgressProps): ReactElement {
  const allStepsData = useMemo(
    () => getStepData(isSubCommonCreation),
    [isSubCommonCreation]
  );
  const stepData = allStepsData[creationStep];
  const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
    (step) => step === creationStep
  );
  const items = useMemo(
    () => getStepProgressItems(allStepsData),
    [allStepsData]
  );

  return (
    <div className="create-common-steps-progress">
      {stepIndex !== -1 && (
        <StepProgress
          className="create-common-steps-progress__stepper"
          currentStep={stepIndex + 1}
          items={items}
        />
      )}
      <h4 className="create-common-steps-progress__title">{stepData.title}</h4>
      {stepData.description && (
        <p
          className={classNames(
            "create-common-steps-progress__description",
            stepData.descriptionClassName
          )}
        >
          {stepData.description}
        </p>
      )}
    </div>
  );
}
