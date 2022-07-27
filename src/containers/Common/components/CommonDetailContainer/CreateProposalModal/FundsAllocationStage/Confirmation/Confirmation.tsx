import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";
import { CurrencySymbol } from "../../../../../../../shared/models";

const getPrefix = (fund) => {
  switch (fund) {
    case "ILS":
      return CurrencySymbol.Shekel;
    case "Dollars":
      return CurrencySymbol.USD;
    default:
      // TODO icon for tokens
      return '&';
  }
}

interface ConfirmationProps {
  amount: number;
  fund: string
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { amount, fund, onSubmit, onCancel } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="assign-circle-confirmation">
      <img
        className="assign-circle-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="assign-circle-confirmation__title">Funds Allocation</h4>
      <p className="assign-circle-confirmation__circle-name">{getPrefix(fund)}{amount}</p>
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
