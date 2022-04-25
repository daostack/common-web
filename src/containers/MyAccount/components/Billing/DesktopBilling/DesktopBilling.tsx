import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { BankAccount } from "../BankAccount";
import { PaymentInformation } from "../PaymentInformation";
import { BillingProps } from "../types";
import "./index.scss";

const DesktopBilling: FC<BillingProps> = (props) => {
  const {
    areCardsLoading,
    cards,
    isBankAccountLoading,
    bankAccount,
    changePaymentMethodState,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear,
    onBankAccountChange,
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
      <section className="my-account-desktop-billing__section my-account-desktop-billing__bank-account">
        <h3 className="my-account-desktop-billing__section-title">
          Bank account
        </h3>
        {isBankAccountLoading ? (
          <Loader />
        ) : (
          <BankAccount
            bankAccount={bankAccount}
            onBankAccountChange={onBankAccountChange}
          />
        )}
      </section>
    </div>
  );
};

export default DesktopBilling;
