import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface DotsProps {
  className?: string;
  currentStep: number;
  stepsAmount: number;
  shouldHighlightUnfinishedSteps?: boolean;
}

const Dots: FC<DotsProps> = (props) => {
  const { className, currentStep, stepsAmount, shouldHighlightUnfinishedSteps = false } = props;
  const dots = Array(stepsAmount).fill(null);

  return (
    <div className={classNames("dots", className)}>
      {dots.map((dot, index) => (
        <span
          key={index}
          className={classNames("dots__item", {
            "dots__item--unfinished": shouldHighlightUnfinishedSteps && (currentStep < index + 1),
            "dots__item--active": currentStep === index + 1,
          })}
        />
      ))}
    </div>
  );
};

export default Dots;
