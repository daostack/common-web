import React, { useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBankDetails,
  loadUserCards,
} from "@/containers/Common/store/actions";
import { ScreenSize } from "@/shared/constants";
import {
  usePaymentMethodChange,
  useUserContributions,
} from "@/shared/hooks/useCases";
import { BankAccountDetails } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { DesktopBilling } from "./DesktopBilling";
import { MobileBilling } from "./MobileBilling";
import { BankAccountState, BillingProps, CardsState } from "./types";
import "./index.scss";

const Billing: FC = () => {
  const dispatch = useDispatch();
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
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
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
  } = useUserContributions();

  const handleBankAccountChange = (data: BankAccountDetails) => {
    setBankAccountState((nextState) => ({
      ...nextState,
      bankAccount: data,
    }));
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
      })
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
      })
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
  };

  return (
    <div className="route-content my-account-billing">
      <header className="my-account-billing__header">
        <h2 className="route-title">Billing</h2>
      </header>
      <Component {...billingProps} />
    </div>
  );
};

export default Billing;
