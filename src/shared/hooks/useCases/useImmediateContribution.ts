import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ImmediateContributionData,
  ImmediateContributionPayment,
  isImmediateContributionPayment,
} from "@/pages/OldCommon/interfaces";
import { makeImmediateContribution as makeImmediateContributionAction } from "@/pages/OldCommon/store/actions";
import { subscribeToPayment } from "@/pages/OldCommon/store/api";
import { Payment, PaymentStatus, Subscription } from "@/shared/models";

interface State {
  isPaymentLoading: boolean;
  isReadyToSubscribe: boolean;
  intermediatePayment: ImmediateContributionPayment | null;
  payment: Payment | Subscription | null;
  errorText: string | null;
}

interface Return extends Omit<State, "isReadyToSubscribe"> {
  makeImmediateContribution: (data: ImmediateContributionData) => void;
  resetImmediateContribution: () => void;
  onReadyToSubscribe: () => void;
}

const INITIAL_STATE: State = {
  intermediatePayment: null,
  isPaymentLoading: false,
  isReadyToSubscribe: false,
  payment: null,
  errorText: null,
};

export const useImmediateContribution = (): Return => {
  const dispatch = useDispatch();
  const [{ isReadyToSubscribe, ...state }, setState] =
    useState<State>(INITIAL_STATE);

  const makeImmediateContribution = useCallback(
    async (data: ImmediateContributionData) => {
      if (
        state.intermediatePayment ||
        state.payment ||
        state.isPaymentLoading ||
        !data.price
      ) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        makeImmediateContributionAction.request({
          payload: data,
          callback: (error, payment) => {
            const stateForUpdate: Partial<State> = {
              isPaymentLoading: false,
            };

            if (error || !payment) {
              stateForUpdate.errorText =
                error?.message || "Something went wrong";
            } else if (!isImmediateContributionPayment(payment)) {
              stateForUpdate.payment = payment;
            } else {
              stateForUpdate.intermediatePayment = payment;
            }

            setState((nextState) => ({
              ...nextState,
              ...stateForUpdate,
            }));
          },
        }),
      );
    },
    [dispatch, state],
  );

  const resetImmediateContribution = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const onReadyToSubscribe = useCallback(() => {
    setState((nextState) => ({
      ...nextState,
      isReadyToSubscribe: true,
    }));
  }, []);

  useEffect(() => {
    if (!isReadyToSubscribe || !state.intermediatePayment || state.payment) {
      return;
    }

    try {
      return subscribeToPayment(
        state.intermediatePayment.paymentId,
        (payment) => {
          if (payment?.status === PaymentStatus.Confirmed) {
            setState((nextState) => ({
              ...nextState,
              payment,
              isPaymentLoading: false,
            }));
          } else if (payment?.status === PaymentStatus.Failed) {
            setState((nextState) => ({
              ...nextState,
              errorText: "Payment failed",
              isPaymentLoading: false,
            }));
          }
        },
      );
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isReadyToSubscribe, state.intermediatePayment, state.payment]);

  return {
    ...state,
    makeImmediateContribution,
    resetImmediateContribution,
    onReadyToSubscribe,
  };
};
