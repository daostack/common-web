import React, { useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserCards } from "@/containers/Common/store/actions";
import { ScreenSize } from "@/shared/constants";
import { usePaymentMethodChange } from "@/shared/hooks/useCases";
import { getScreenSize } from "@/shared/store/selectors";
import { DesktopBilling } from "./DesktopBilling";
import { MobileBilling } from "./MobileBilling";
import { CardsState } from "./types";
import "./index.scss";

const Billing: FC = () => {
  const dispatch = useDispatch();
  const [cardsState, setCardsState] = useState<CardsState>({
    loading: false,
    fetched: false,
    cards: [],
  });
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const {
    changePaymentMethodState,
    onPaymentMethodChange,
    reset: resetPaymentMethodChange,
  } = usePaymentMethodChange();

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
  const billingProps = {
    areCardsLoading: !cardsState.fetched,
    cards: cardsState.cards,
    changePaymentMethodState: changePaymentMethodState,
    onPaymentMethodChange: onPaymentMethodChange,
    onChangePaymentMethodStateClear: resetPaymentMethodChange,
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
