import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  createBuyerTokenPage,
  loadUserCards,
} from "@/containers/Common/store/actions";
import { DesktopBilling } from "./DesktopBilling";
import { CardsState, ChangePaymentMethodState } from "./types";
import "./index.scss";

const Billing: FC = () => {
  const dispatch = useDispatch();
  const [cardsState, setCardsState] = useState<CardsState>({
    loading: false,
    fetched: false,
    cards: [],
  });
  const [
    changePaymentMethodState,
    setChangePaymentMethodState,
  ] = useState<ChangePaymentMethodState>(() => ({
    payment: null,
    isPaymentLoading: false,
    cardId: uuidv4(),
  }));

  const handlePaymentMethodChange = () => {
    setChangePaymentMethodState((nextState) => ({
      ...nextState,
      isPaymentLoading: true,
    }));

    dispatch(
      createBuyerTokenPage.request({
        payload: {
          cardId: changePaymentMethodState.cardId,
        },
        callback: (error, payment) => {
          if (error || !payment) {
            // onError(error?.message || "Something went wrong");
            return;
          }

          setChangePaymentMethodState((nextState) => ({
            ...nextState,
            payment,
            isPaymentLoading: false,
          }));
        },
      })
    );
  };

  const handleChangePaymentMethodStateClear = () => {
    setChangePaymentMethodState({
      payment: null,
      isPaymentLoading: false,
      cardId: uuidv4(),
    });
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

  return (
    <div className="route-content my-account-billing">
      <header className="my-account-billing__header">
        <h2 className="route-title">Billing</h2>
      </header>
      <DesktopBilling
        areCardsLoading={!cardsState.fetched}
        cards={cardsState.cards}
        changePaymentMethodState={changePaymentMethodState}
        onPaymentMethodChange={handlePaymentMethodChange}
        onChangePaymentMethodStateClear={handleChangePaymentMethodStateClear}
      />
    </div>
  );
};

export default Billing;
