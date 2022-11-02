import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { getPrefix } from "../helpers";
import { FundType } from "../types";
import "./index.scss";

interface ConfirmationProps {
  amount: number;
  fund: FundType;
  to: string;
  recipientName?: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { amount, fund, onSubmit, to, recipientName, isLoading, onCancel } =
    props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="funds-allocation-confirmation">
      <img
        className="funds-allocation-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="funds-allocation-confirmation__title">Fund allocation</h4>
      <p className="funds-allocation-confirmation__circle-name">
        {getPrefix(fund)}
        {amount}
      </p>
      <p className="funds-allocation-confirmation__circle-name">
        To {to}: {recipientName}
      </p>
      <div className="funds-allocation-confirmation__buttons-wrapper">
        <Button
          className="funds-allocation-confirmation__cancel-button"
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
        <Button onClick={onSubmit} disabled={isLoading} shouldUseFullWidth>
          Create Proposal
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
