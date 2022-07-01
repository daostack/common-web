import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import { Circle } from "@/shared/models";
import "./index.scss";

interface ConfirmationProps {
  circle: Circle;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { circle, onSubmit, onCancel } = props;

  return (
    <div className="assign-circle-confirmation">
      <img
        className="assign-circle-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="assign-circle-confirmation__title">Assign Circle</h4>
      <p className="assign-circle-confirmation__circle-name">{circle.name}</p>
      <div className="assign-circle-confirmation__buttons-wrapper">
        <Button
          onClick={onCancel}
          variant={ButtonVariant.Secondary}
          shouldUseFullWidth
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} shouldUseFullWidth>
          Create Proposal
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
