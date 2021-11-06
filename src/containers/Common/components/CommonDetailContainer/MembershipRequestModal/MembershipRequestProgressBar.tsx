import React from "react";
import "./index.scss";

interface IProps {
  currentStage: number;
}

export default function MembershipRequestProgressBar(props: IProps) {
  const { currentStage } = props;

  const getIconSuffix = (stage: number, currentStage: number): string => {
    if (currentStage === stage) {
      return "current";
    } else if (currentStage > stage) {
      return "done";
    } else {
      return "gray";
    }
  };

  const stageSeperatorClass = (stage: number, currentStage: number): string => {
    if (currentStage > stage) {
      return "line";
    } else return "line gray";
  };

  return (
    <div className="membership-request-progress-bar">
      <img src={`/icons/membership-request/introduce-${getIconSuffix(1, currentStage)}.svg`} alt="introduce" />
      <span className={stageSeperatorClass(1, currentStage)} />
      <img src={`/icons/membership-request/rules-${getIconSuffix(2, currentStage)}.svg`} alt="rules" />
      <span className={stageSeperatorClass(2, currentStage)} />
      <img src={`/icons/membership-request/contribution-${getIconSuffix(3, currentStage)}.svg`} alt="contribution" />
      <span className={stageSeperatorClass(3, currentStage)} />
      <img src={`/icons/membership-request/billing-${getIconSuffix(4, currentStage)}.svg`} alt="billing" />
      <span className={stageSeperatorClass(4, currentStage)} />
      <img src={`/icons/membership-request/payment-${getIconSuffix(5, currentStage)}.svg`} alt="payment" />
    </div>
  );
}
