import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import "./index.scss";

interface ConfirmationProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { onSubmit, onCancel } = props;

  return (
    <div className="delete-common-confirmation">
      <img
        className="delete-common-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="delete-common-confirmation__title">Delete Common</h4>
      <div className="delete-common-confirmation__buttons-wrapper">
        <Button onClick={onCancel} variant={ButtonVariant.PrimaryGray}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant={ButtonVariant.PrimaryPink}>
          Create Proposal
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
