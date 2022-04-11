import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { loadUserCards } from "@/containers/Common/store/actions";
import { Card } from "@/shared/models";
import { PaymentInformation } from "./PaymentInformation";
import "./index.scss";

interface CardsState {
  loading: boolean;
  fetched: boolean;
  cards: Card[];
}

const Billing: FC = () => {
  const dispatch = useDispatch();
  const [cardsState, setCardsState] = useState<CardsState>({
    loading: false,
    fetched: false,
    cards: [],
  });

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
      <div>
        <div>
          <PaymentInformation cards={cardsState.cards} />
        </div>
      </div>
    </div>
  );
};

export default Billing;
