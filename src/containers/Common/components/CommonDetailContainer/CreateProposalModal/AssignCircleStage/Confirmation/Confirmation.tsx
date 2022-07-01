import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Circle } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface ConfirmationProps {
  circle: Circle;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { circle, onSubmit, onCancel } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

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
          className="assign-circle-confirmation__cancel-button"
          onClick={onCancel}
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
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
