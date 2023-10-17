import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { getBankDetails, loadUserCards } from "@/pages/OldCommon/store/actions";
import {
  usePaymentMethodChange,
  useUserContributions,
} from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { BankAccountDetails, Payment, Subscription } from "@/shared/models";
import { DesktopBilling } from "./DesktopBilling";
import { MobileBilling } from "./MobileBilling";
import { Header } from "./components";
import { BankAccountState, BillingProps, CardsState } from "./types";
import styles from "./Billing.module.scss";
import "./index.scss";

const Billing: FC = () => {
  const dispatch = useDispatch();
  const isMobileView = useIsTabletView();
  const [cardsState, setCardsState] = useState<CardsState>({
    loading: false,
    fetched: false,
    cards: [],
  });
  const [bankAccountState, setBankAccountState] = useState<BankAccountState>({
    loading: false,
    fetched: false,
    bankAccount: null,
  });
  const [activeContribution, setActiveContribution] = useState<
    Payment | Subscription | null
  >(null);
  const {
    changePaymentMethodState,
    onPaymentMethodChange,
    reset: resetPaymentMethodChange,
  } = usePaymentMethodChange();
  const {
    loading: areContributionsLoading,
    contributions,
    subscriptions,
    commons: contributionCommons,
    updateSubscription,
  } = useUserContributions();

  const handleBankAccountChange = (data: BankAccountDetails | null) => {
    setBankAccountState((nextState) => ({
      ...nextState,
      bankAccount: data,
    }));
  };
  const handleActiveSubscriptionUpdate = (subscription: Subscription) => {
    setActiveContribution(subscription);
    updateSubscription(subscription);
  };

  useEffect(() => {
    if (cardsState.loading || cardsState.fetched) {
      return;
    }

    setCardsState((state) => ({
      ...state,
      loading: true,
    }));
    dispatch(
      loadUserCards.request({
        callback: (error, cards) => {
          setCardsState({
            loading: false,
            fetched: true,
            cards: !error && cards ? cards : [],
          });
        },
      }),
    );
  }, [dispatch, cardsState]);

  useEffect(() => {
    if (bankAccountState.loading || bankAccountState.fetched) {
      return;
    }

    setBankAccountState((state) => ({
      ...state,
      loading: true,
    }));
    dispatch(
      getBankDetails.request({
        callback: (error, bankAccount) => {
          setBankAccountState({
            loading: false,
            fetched: true,
            bankAccount: !error && bankAccount ? bankAccount : null,
          });
        },
      }),
    );
  }, [dispatch, bankAccountState]);

  useEffect(() => {
    const card = changePaymentMethodState.createdCard;

    if (!card) {
      return;
    }

    if (cardsState.cards.length === 0) {
      resetPaymentMethodChange();
    }
    setCardsState((nextState) => ({
      ...nextState,
      cards: [{ ...card }],
    }));
  }, [
    changePaymentMethodState.createdCard,
    cardsState.cards.length,
    resetPaymentMethodChange,
  ]);

  const Component = isMobileView ? MobileBilling : DesktopBilling;
  const billingProps: BillingProps = {
    areCardsLoading: !cardsState.fetched,
    cards: cardsState.cards,
    isBankAccountLoading: !bankAccountState.fetched,
    bankAccount: bankAccountState.bankAccount,
    changePaymentMethodState: changePaymentMethodState,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear: resetPaymentMethodChange,
    onBankAccountChange: handleBankAccountChange,
    areContributionsLoading,
    contributions,
    subscriptions,
    contributionCommons,
    activeContribution,
    onActiveContributionSelect: setActiveContribution,
    onActiveSubscriptionUpdate: handleActiveSubscriptionUpdate,
  };

  return (
    <div className={styles.container}>
      <div className="route-content my-account-billing">
        <Header className={styles.header} isMobileVersion={isMobileView} />
        <Component {...billingProps} />
      </div>
    </div>
  );
};

export default Billing;
