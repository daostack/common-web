import React, { useState, FC } from "react";
import { Loader, Tabs, Tab, TabPanel } from "@/shared/components";
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
    changePaymentMethodState,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear,
  } = props;
  const [tab, setTab] = useState(BillingTab.PaymentDetails);

  const handleTabChange = (value: unknown) => {
    setTab(value as BillingTab);
  };

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
      <div>
        <TabPanel value={tab} panelValue={BillingTab.PaymentDetails}>
          <div className="my-account-mobile-billing__payment-details-tab">
            {areCardsLoading ? (
              <div>
                <Loader />
              </div>
            ) : (
              <PaymentInformation
                cards={cards}
                changePaymentMethodState={changePaymentMethodState}
                onPaymentMethodChange={onPaymentMethodChange}
                onChangePaymentMethodStateClear={
                  onChangePaymentMethodStateClear
                }
              />
            )}
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default MobileBilling;
