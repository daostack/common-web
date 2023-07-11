import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import "./index.scss";

interface SuccessProps {
  onBackToCommon: () => void;
  onViewProposal: () => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onBackToCommon, onViewProposal } = props;

  return (
    <div className="delete-common-success">
      <img
        className="delete-common-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Avatar"
      />
      <h4 className="delete-common-success__title">Your proposal is live!</h4>
      <p className="delete-common-success__description">
        The Common members will now discuss the proposal and vote to accept or
        reject it. You will be notified when the voting ends.
      </p>
      <div className="delete-common-success__buttons-wrapper">
        <Button variant={ButtonVariant.PrimaryGray} onClick={onBackToCommon}>
          Back to Common
        </Button>
        <Button variant={ButtonVariant.PrimaryPink} onClick={onViewProposal}>
          View proposal
        </Button>
      </div>
    </div>
  );
};

export default Success;
