import React, { useState, FC } from "react";
import { Loader, Tabs, Tab, TabPanel } from "@/shared/components";
import { BankAccount } from "../BankAccount";
import { Contributions } from "../Contributions";
import { PaymentInformation } from "../PaymentInformation";
import { BillingProps } from "../types";
import "./index.scss";

enum BillingTab {
  PaymentDetails = "payment-details",
  BankAccount = "bank-account",
  Contributions = "contributions",
}

const MobileBilling: FC<BillingProps> = (props) => {
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
    contributionCommons,
  } = props;
  const [tab, setTab] = useState(BillingTab.PaymentDetails);

  const handleTabChange = (value: unknown) => {
    setTab(value as BillingTab);
  };

  const loaderEl = (
    <div>
      <Loader />
    </div>
  );

  return (
    <div className="my-account-mobile-billing">
      <Tabs
        className="my-account-mobile-billing__tabs-wrapper"
        value={tab}
        onChange={handleTabChange}
      >
        <Tab label="Payment details" value={BillingTab.PaymentDetails} />
        <Tab label="Bank account" value={BillingTab.BankAccount} />
        <Tab label="Contributions" value={BillingTab.Contributions} />
      </Tabs>
      <div className="my-account-mobile-billing__tab-panels">
        <TabPanel
          className="my-account-mobile-billing__tab-panel"
          value={tab}
          panelValue={BillingTab.PaymentDetails}
        >
          {areCardsLoading ? (
            loaderEl
          ) : (
            <PaymentInformation
              cards={cards}
              changePaymentMethodState={changePaymentMethodState}
              onPaymentMethodChange={onPaymentMethodChange}
              onChangePaymentMethodStateClear={onChangePaymentMethodStateClear}
            />
          )}
        </TabPanel>
        <TabPanel
          className="my-account-mobile-billing__tab-panel"
          value={tab}
          panelValue={BillingTab.BankAccount}
        >
          {isBankAccountLoading ? (
            loaderEl
          ) : (
            <BankAccount
              bankAccount={bankAccount}
              onBankAccountChange={onBankAccountChange}
            />
          )}
        </TabPanel>
        <TabPanel
          className="my-account-mobile-billing__tab-panel my-account-mobile-billing__contributions-tab-panel"
          value={tab}
          panelValue={BillingTab.Contributions}
        >
          {areContributionsLoading ? (
            loaderEl
          ) : (
            <Contributions
              contributions={contributions}
              subscriptions={subscriptions}
              commons={contributionCommons}
            />
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default MobileBilling;
