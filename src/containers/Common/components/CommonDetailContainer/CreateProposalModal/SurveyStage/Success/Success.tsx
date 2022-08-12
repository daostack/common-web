import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  onBackToCommon: () => void;
  onViewProposal: () => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onBackToCommon, onViewProposal } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="survey-success">
      <img
        className="survey-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Avatar"
      />
      <h4 className="survey-success__title">Your proposal is live!</h4>
      <p className="survey-success__description">
        The Common members will now discuss the proposal and vote to accept or
        reject it. You will be notified when the voting ends.
      </p>
      <div className="survey-success__buttons-wrapper">
        <Button
          className="survey-success__back-button"
          onClick={onBackToCommon}
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
          shouldUseFullWidth
        >
          Back to Common
        </Button>
        <Button onClick={onViewProposal} shouldUseFullWidth>
          View proposal
        </Button>
      </div>
    </div>
  );
};

export default Success;
