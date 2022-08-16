import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  SubscriptionData,
  SubscriptionPayment,
  isSubscriptionPayment,
} from "@/containers/Common/interfaces";
import { makeMonthlyContribution as makeMonthlyContributionAction } from "@/containers/Common/store/actions";
import { subscribeToSubscription } from "@/containers/Common/store/api";
import { Subscription, SubscriptionStatus } from "@/shared/models";

interface State {
  isPaymentLoading: boolean;
  isReadyToSubscribe: boolean;
  monthlyPayment: SubscriptionPayment | null;
  payment: Subscription | null;
  errorText: string | null;
}

interface Return extends Omit<State, "isReadyToSubscribe"> {
  makeMonthlyContribution: (data: SubscriptionData) => void;
  resetMonthlyContribution: () => void;
  onReadyToSubscribe: () => void;
}

const INITIAL_STATE: State = {
  monthlyPayment: null,
  isPaymentLoading: false,
  isReadyToSubscribe: false,
  payment: null,
  errorText: null,
};

export const useMonthlyContribution = (): Return => {
  const dispatch = useDispatch();
  const [{ isReadyToSubscribe, ...state }, setState] =
    useState<State>(INITIAL_STATE);

  const makeMonthlyContribution = useCallback(
    async (data: SubscriptionData) => {
      if (
        state.monthlyPayment ||
        state.payment ||
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
        makeMonthlyContributionAction.request({
          payload: data,
          callback: (error, payment) => {
            const stateForUpdate: Partial<State> = {
              isPaymentLoading: false,
            };

            if (error || !payment) {
              stateForUpdate.errorText =
                error?.message || "Something went wrong";
            } else if (!isSubscriptionPayment(payment)) {
              stateForUpdate.payment = payment;
            } else {
              stateForUpdate.monthlyPayment = payment;
            }

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

  const resetMonthlyContribution = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const onReadyToSubscribe = useCallback(() => {
    setState((nextState) => ({
      ...nextState,
      isReadyToSubscribe: true,
    }));
  }, []);

  useEffect(() => {
    if (!isReadyToSubscribe || !state.monthlyPayment || state.payment) {
      return;
    }

    try {
      return subscribeToSubscription(
        state.monthlyPayment.paymentId,
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
  }, [isReadyToSubscribe, state.monthlyPayment, state.payment]);

  return {
    ...state,
    makeMonthlyContribution,
    resetMonthlyContribution,
    onReadyToSubscribe,
  };
};
