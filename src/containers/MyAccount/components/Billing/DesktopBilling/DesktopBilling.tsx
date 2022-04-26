import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { BankAccount } from "../BankAccount";
import { Contributions } from "../Contributions";
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
    areContributionsLoading,
    contributions,
    subscriptions,
    commonNames,
  } = props;

  return (
    <div className="my-account-desktop-billing">
      <div className="my-account-desktop-billing__sections-wrapper">
        <section className="my-account-desktop-billing__payment-info">
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
        <section>
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
      <div className="my-account-desktop-billing__contributions-section-wrapper">
        <section className="my-account-desktop-billing__contributions">
          <h3 className="my-account-desktop-billing__section-title">
            Contributions
          </h3>
          {areContributionsLoading ? (
            <Loader />
          ) : (
            <Contributions
              contributions={contributions}
              subscriptions={subscriptions}
              commonNames={commonNames}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default DesktopBilling;
