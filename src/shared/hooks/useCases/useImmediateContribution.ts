import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ImmediateContributionData,
  ImmediateContributionPayment,
  isImmediateContributionPayment,
} from "@/containers/Common/interfaces";
import { makeImmediateContribution as makeImmediateContributionAction } from "@/containers/Common/store/actions";
import { subscribeToPayment } from "@/containers/Common/store/api";
import { Payment, PaymentStatus } from "@/shared/models";

interface State {
  isPaymentLoading: boolean;
  isReadyToSubscribe: boolean;
  intermediatePayment: ImmediateContributionPayment | null;
  payment: Payment | null;
  error: string | null;
}

interface Return extends Omit<State, "isReadyToSubscribe"> {
  makeImmediateContribution: (data: ImmediateContributionData) => void;
  onReadyToSubscribe: () => void;
}

const INITIAL_STATE: State = {
  intermediatePayment: null,
  isPaymentLoading: false,
  isReadyToSubscribe: false,
  payment: null,
  error: null,
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
        !data.amount
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
              stateForUpdate.error = error?.message || "Something went wrong";
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
        })
      );
    },
    [dispatch, state]
  );

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
              error: "Payment failed",
              isPaymentLoading: false,
            }));
          }
        }
      );
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isReadyToSubscribe, state.intermediatePayment, state.payment]);

  return {
    ...state,
    makeImmediateContribution,
    onReadyToSubscribe,
  };
};
