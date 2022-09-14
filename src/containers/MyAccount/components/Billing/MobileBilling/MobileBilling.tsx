import React, { useState, FC } from "react";
import classNames from "classnames";
import { Loader, Tabs, Tab, TabPanel } from "@/shared/components";
import { isPayment, Payment, Subscription } from "@/shared/models";
import { ActiveContributionItem } from "../ActiveContributionItem";
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
    activeContribution,
    onActiveContributionSelect,
    onActiveSubscriptionUpdate,
  } = props;
  const [
    activeContributionTopOffset,
    setActiveContributionTopOffset,
  ] = useState<number>(0);
  const [tab, setTab] = useState(BillingTab.PaymentDetails);
  const commonId = activeContribution && activeContribution.commonId;
  const common =
    contributionCommons.find((common) => common.id === commonId) || null;
  const subscription =
    (activeContribution &&
      isPayment(activeContribution) &&
      subscriptions.find(
        (item) => item.id === activeContribution.subscriptionId
      )) ||
    null;

  const handleTabChange = (value: unknown) => {
    setTab(value as BillingTab);
  };

  const handleActiveContributionSelect = (
    contribution: Payment | Subscription | null,
    elementTopOffset?: number
  ) => {
    onActiveContributionSelect(contribution);
    setActiveContributionTopOffset((elementTopOffset || 0) - 250);
    window.scrollTo(0, 0);
  };

  const handleActiveItemBackClick = () => {
    onActiveContributionSelect(null);
    setTimeout(() => {
      window.scrollTo(0, activeContributionTopOffset);
    }, 0);
  };

  const loaderEl = (
    <div>
      <Loader />
    </div>
  );

  return (
    <div className="my-account-mobile-billing">
      <div
        className={classNames("my-account-mobile-billing__content-wrapper", {
          "my-account-mobile-billing__content-wrapper--hidden": activeContribution,
        })}
      >
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
                onChangePaymentMethodStateClear={
                  onChangePaymentMethodStateClear
                }
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
                activeContribution={activeContribution}
                contributions={contributions}
                subscriptions={subscriptions}
                commons={contributionCommons}
                onActiveContributionSelect={handleActiveContributionSelect}
              />
            )}
          </TabPanel>
        </div>
      </div>
      {activeContribution && common && (
        <ActiveContributionItem
          className="my-account-mobile-billing__active-contribution-item"
          contribution={activeContribution}
          subscription={subscription}
          common={common}
          onBackClick={handleActiveItemBackClick}
          onSubscriptionUpdate={onActiveSubscriptionUpdate}
        />
      )}
    </div>
  );
};

export default MobileBilling;
