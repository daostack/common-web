import React, { memo, FC, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";

interface Styles {
  separator?: {
    default?: string;
    active?: string;
    short?: string;
  };
  image?: {
    default?: string;
    active?: string;
  };
}

export interface StepProgressItem {
  title?: string;
  activeImageSource: string;
  inactiveImageSource: string;
}

interface StepProgressProps {
  className?: string;
  currentStep: number;
  items: StepProgressItem[];
  styles?: Styles;
}

const getImageSource = (
  item: StepProgressItem,
  step: number,
  currentStep: number
) => {
  if (step === currentStep) {
    return item.activeImageSource;
  }

  return step < currentStep
    ? "/icons/completed-step.svg"
    : item.inactiveImageSource;
};

const StepProgress: FC<StepProgressProps> = (props) => {
  const { className, currentStep, items, styles } = props;

  return (
    <div className={classNames("step-progress", className)}>
      {items.reduce<ReactNode[]>((acc, item, index) => {
        const result = [...acc];
        const step = index + 1;

        if (step !== 1) {
          result.push(
            <span
              key={`separator-${step}`}
              className={classNames(
                "step-progress__separator",
                styles?.separator?.default,
                {
                  [classNames(
                    "step-progress__separator--active",
                    styles?.separator?.active
                  )]: step <= currentStep,
                  [classNames(
                    "step-progress__separator--short",
                    styles?.separator?.short
                  )]: step === currentStep || step === currentStep + 1,
                }
              )}
            />
          );
        }

        result.push(
          <img
            key={`separator-image-${step}`}
            className={classNames(
              "step-progress__image",
              styles?.image?.default,
              {
                [classNames(
                  "step-progress__image--active",
                  styles?.image?.active
                )]: step === currentStep,
              }
            )}
            src={getImageSource(item, step, currentStep)}
            alt={item.title}
          />
        );

        return result;
      }, [])}
    </div>
  );
};

export default memo(StepProgress);
