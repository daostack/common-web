import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createBuyerTokenPage } from "@/pages/Common/store/actions";
import { subscribeToCardChange } from "@/pages/Common/store/api";
import { Card, CommonPayment } from "@/shared/models";

export interface ChangePaymentMethodState {
  payment: CommonPayment | null;
  isPaymentLoading: boolean;
  cardId: string;
  createdCard: Card | null;
}

interface Return {
  changePaymentMethodState: ChangePaymentMethodState;
  onPaymentMethodChange: () => void;
  reset: () => void;
}

const usePaymentMethodChange = (): Return => {
  const dispatch = useDispatch();
  const [changePaymentMethodState, setChangePaymentMethodState] =
    useState<ChangePaymentMethodState>(() => ({
      payment: null,
      isPaymentLoading: false,
      cardId: uuidv4(),
      createdCard: null,
    }));

  const onPaymentMethodChange = useCallback(() => {
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
      }),
    );
  }, [dispatch, changePaymentMethodState.cardId]);

  const reset = useCallback(() => {
    setChangePaymentMethodState({
      payment: null,
      isPaymentLoading: false,
      cardId: uuidv4(),
      createdCard: null,
    });
  }, []);

  useEffect(() => {
    if (!changePaymentMethodState.payment) {
      return;
    }

    try {
      return subscribeToCardChange(changePaymentMethodState.cardId, (card) => {
        if (card) {
          setChangePaymentMethodState((nextState) => ({
            ...nextState,
            createdCard: card,
          }));
        }
      });
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [changePaymentMethodState.payment, changePaymentMethodState.cardId]);

  return {
    changePaymentMethodState,
    onPaymentMethodChange,
    reset,
  };
};

export default usePaymentMethodChange;
