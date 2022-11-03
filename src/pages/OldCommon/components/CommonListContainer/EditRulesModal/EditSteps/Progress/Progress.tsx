import React, { ReactElement, useMemo } from "react";
import classNames from "classnames";
import { StepProgress } from "@/shared/components";
import { EditStep } from "../constants";
import { getStepData, getStepProgressItems } from "./helpers";
import "./index.scss";

interface ProgressProps {
  creationStep: EditStep;
}

export const PROGRESS_RELATED_STEPS = [EditStep.Rules, EditStep.Review];

export default function Progress({
  creationStep,
}: ProgressProps): ReactElement {
  const allStepsData = useMemo(() => getStepData(), []);
  const stepData = allStepsData[creationStep];
  const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
    (step) => step === creationStep,
  );
  const items = useMemo(
    () => getStepProgressItems(allStepsData),
    [allStepsData],
  );

  return (
    <div className="update-rules-steps-progress">
      {stepIndex !== -1 && (
        <StepProgress
          className="update-rules-steps-progress__stepper"
          currentStep={stepIndex + 1}
          items={items}
        />
      )}
      <h4 className="update-rules-steps-progress__title">{stepData.title}</h4>
      {stepData.description && (
        <p
          className={classNames(
            "update-rules-steps-progress__description",
            stepData.descriptionClassName,
          )}
        >
          {stepData.description}
        </p>
      )}
    </div>
  );
}
