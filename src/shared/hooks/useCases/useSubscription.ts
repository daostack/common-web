import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  SubscriptionData,
  SubscriptionPayment,
} from "@/containers/Common/interfaces";
import { createSubscription as createSubscriptionAction } from "@/containers/Common/store/actions";
import { subscribeToSubscription } from "@/containers/Common/store/api";
import { Subscription, SubscriptionStatus } from "@/shared/models";

interface State {
  isPaymentLoading: boolean;
  isReadyToSubscribe: boolean;
  subscription: Subscription | null;
  errorText: string | null;
}

interface Return extends Omit<State, "isReadyToSubscribe"> {
  createSubscription: (data: SubscriptionData) => void;
  resetSubscription: () => void;
  onReadyToSubscribe: () => void;
}

const INITIAL_STATE: State = {
  isPaymentLoading: false,
  isReadyToSubscribe: false,
  subscription: null,
  errorText: null,
};

export const useSubscription = (): Return => {
  const dispatch = useDispatch();
  const [{ isReadyToSubscribe, ...state }, setState] =
    useState<State>(INITIAL_STATE);

  const createSubscription = useCallback(
    async (data: SubscriptionData) => {
      if (
        state.subscription ||
        state.isPaymentLoading ||
        !data.amount
      ) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        createSubscriptionAction.request({
          payload: data,
          callback: (error, payment) => {
            const stateForUpdate: Partial<State> = {
              isPaymentLoading: false,
            };

            console.log('useSubscription', payment)

            if (error || !payment) {
              stateForUpdate.errorText =
                error?.message || "Something went wrong";
            } else {
              stateForUpdate.subscription = payment;
            }


            /*else if (!isSubscriptionPayment(payment)) {
              stateForUpdate.payment = payment;
            } else {
              stateForUpdate.monthlyPayment = payment;
            }*/

            setState((nextState) => ({
              ...nextState,
              ...stateForUpdate,
            }));
          },
        })
      );
    },
    [dispatch, state]
  );

  const resetSubscription = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const onReadyToSubscribe = useCallback(() => {
    setState((nextState) => ({
      ...nextState,
      isReadyToSubscribe: true,
    }));
  }, []);

  useEffect(() => {
    if (!isReadyToSubscribe || !state.subscription) {
      return;
    }

    try {
      return subscribeToSubscription(
        state.subscription.id,
        (payment) => {
          if (payment?.status === SubscriptionStatus.Active) {
            setState((nextState) => ({
              ...nextState,
              payment,
              isPaymentLoading: false,
            }));
          } else if (payment?.status === SubscriptionStatus.PaymentFailed) {
            setState((nextState) => ({
              ...nextState,
              errorText: "Payment failed",
              isPaymentLoading: false,
            }));
          }
        }
      );
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isReadyToSubscribe, state.subscription]);

  return {
    ...state,
    createSubscription,
    resetSubscription,
    onReadyToSubscribe,
  };
};
