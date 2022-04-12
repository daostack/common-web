import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { Card } from "@/shared/models";
import { PaymentInformation } from "../PaymentInformation";
import { ChangePaymentMethodState } from "../types";
import "./index.scss";

interface DesktopBillingProps {
  areCardsLoading: boolean;
  cards: Card[];
  changePaymentMethodState: ChangePaymentMethodState;
  onPaymentMethodChange: () => void;
  onChangePaymentMethodStateClear: () => void;
}

const DesktopBilling: FC<DesktopBillingProps> = (props) => {
  const {
    areCardsLoading,
    cards,
    changePaymentMethodState,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear,
  } = props;

  return (
    <div className="my-account-desktop-billing">
      <section className="my-account-desktop-billing__section">
        <h3 className="my-account-desktop-billing__section-title">
          Payment information
        </h3>
        {areCardsLoading ? (
          <Loader />
        ) : (
          <PaymentInformation
            cards={cards}
            changePaymentMethodState={changePaymentMethodState}
            onPaymentMethodChange={onPaymentMethodChange}
            onChangePaymentMethodStateClear={onChangePaymentMethodStateClear}
          />
        )}
      </section>
    </div>
  );
};

export default DesktopBilling;
