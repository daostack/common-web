import React, { FC, useMemo } from "react";
import classNames from "classnames";
import "./index.scss";

interface ProgressBarProps {
  completedPercentage: number;
  minPercentCondition?: number;
  maxPercentCondition?: number;
}

const ProgressBar: FC<ProgressBarProps> = (
  {
    completedPercentage,
    minPercentCondition,
    maxPercentCondition,
  }
) => {
  const isProgressCompleted = useMemo((): boolean => {
    if (minPercentCondition === 0) return true;
    switch (true) {
      case Boolean(minPercentCondition):
        return Boolean(minPercentCondition && (completedPercentage >= minPercentCondition));
      case Boolean(maxPercentCondition):
        return Boolean(maxPercentCondition && (completedPercentage <= maxPercentCondition));
      default:
        return false;
    }
  }, [completedPercentage, minPercentCondition, maxPercentCondition]);

  return (
    <div className="progress-bar__wrapper">
      <div className="progress-bar__container">
        <div
          className={
            classNames(
              "progress-bar__filler",
              {
                completed: isProgressCompleted,
                incompleted: !isProgressCompleted,
                neutral: minPercentCondition !== 0 && !minPercentCondition && !maxPercentCondition,
              }
            )
          }
          style={
            {
              width: `${completedPercentage}%`
            }
          }
        />
        {
          (
            minPercentCondition
            || maxPercentCondition
          ) && <img
            src="/icons/progress-serif-mark.svg"
            alt="serif-mark"
            className="progress-bar__serif-mark"
            style={
              {
                left: `${minPercentCondition || maxPercentCondition}%`
              }
            }
          />
        }
      </div>
      <div className="progress-bar__completed-caption">
        {completedPercentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
