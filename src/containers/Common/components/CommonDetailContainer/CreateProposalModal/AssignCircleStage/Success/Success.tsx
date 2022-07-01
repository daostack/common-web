import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface SuccessProps {
  onBackToCommon: () => void;
  onViewProposal: () => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onBackToCommon, onViewProposal } = props;

  return (
    <div className="assign-circle-success">
      <img
        className="assign-circle-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Avatar"
      />
      <h4 className="assign-circle-success__title">Your proposal is live!</h4>
      <p className="assign-circle-success__description">
        The Common members will now discuss the proposal and vote to accept or
        reject it. You will be notified when the voting ends.
      </p>
      <div className="assign-circle-success__buttons-wrapper">
        <Button
          onClick={onBackToCommon}
          variant={ButtonVariant.Secondary}
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
