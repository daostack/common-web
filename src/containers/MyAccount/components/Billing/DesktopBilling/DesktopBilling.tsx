import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { PaymentInformation } from "../PaymentInformation";
import { BillingProps } from "../types";
import "./index.scss";

const DesktopBilling: FC<BillingProps> = (props) => {
  const {
    areCardsLoading,
    cards,
    changePaymentMethodState,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear,
  } = props;

  return (
    <div className="my-account-desktop-billing">
      <section className="my-account-desktop-billing__section my-account-desktop-billing__payment-info">
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
