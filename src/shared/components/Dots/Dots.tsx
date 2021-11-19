import React, { memo, FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface DotsProps {
  currentStep: number;
  stepsAmount: number;
}

const Dots: FC<DotsProps> = ({ currentStep, stepsAmount }) => {
  const dots = Array(stepsAmount).fill(null);

  return (
    <div className="dots">
      {dots.map((dot, index) => (
        <span
          className={classNames("dots__item", {
            "dots__item--active": currentStep === index + 1,
          })}
        />
      ))}
    </div>
  );
};

export default memo(Dots);
