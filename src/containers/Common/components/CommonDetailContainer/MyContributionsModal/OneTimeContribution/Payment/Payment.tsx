import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { IFrame, Loader, Separator } from "@/shared/components";
import { ContributionType } from "@/shared/constants";
import { Common, Currency, Payment, PaymentStatus } from "@/shared/models";
import {
  isImmediateContributionPayment,
  ImmediateContributionPayment,
} from "../../../../../interfaces";
import { makeImmediateContribution } from "../../../../../store/actions";
import { subscribeToPayment } from "../../../../../store/api";
import "./index.scss";

interface State {
  payment: ImmediateContributionPayment | null;
  isPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  payment: null,
  isPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

interface PaymentStepProps {
  common: Common;
  contributionAmount: number;
  onFinish: (payment: Payment) => void;
  onError: (errorText: string) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const {
    common,
    contributionAmount,
    onFinish,
    onError,
    setShouldShowGoBackButton,
  } = props;
  const { id: commonId } = common;
  const dispatch = useDispatch();
  const [
    { payment, isPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);

  const handleIframeLoad = () => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  };

  useEffect(() => {
    (async () => {
      if (payment || isPaymentLoading || !contributionAmount) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        makeImmediateContribution.request({
          payload: {
            commonId,
            contributionType: ContributionType.OneTime,
            price: { amount: contributionAmount, currency: Currency.ILS },
            saveCard: true,
          },
          callback: (error, payment) => {
            if (error || !payment) {
              onError(error?.message || "Something went wrong");
              return;
            }
            if (!isImmediateContributionPayment(payment)) {
              onFinish(payment as Payment);
              return;
            }

            setState((nextState) => ({
              ...nextState,
              payment,
              isPaymentLoading: false,
            }));
          },
        })
      );
    })();
  }, [
    dispatch,
    commonId,
    payment,
    isPaymentLoading,
    contributionAmount,
    onFinish,
    onError,
  ]);

  useEffect(() => {
    if (!isPaymentIframeLoaded || !payment) {
      return;
    }

    try {
      return subscribeToPayment(payment.paymentId, (payment) => {
        if (payment?.status === PaymentStatus.Confirmed) {
          onFinish(payment);
        } else if (payment?.status === PaymentStatus.Failed) {
          onError("Payment failed");
        }
      });
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isPaymentIframeLoaded, payment, onFinish, onError]);

  useEffect(() => {
    setShouldShowGoBackButton(Boolean(isPaymentIframeLoaded && payment));
  }, [setShouldShowGoBackButton, isPaymentIframeLoaded, payment]);

  return (
    <section className="one-time-payment-my-contributions-stage">
      <h3 className="one-time-payment-my-contributions-stage__title">
        Payment details
      </h3>
      <p className="one-time-payment-my-contributions-stage__description">
        Update your payment details below.
      </p>
      <Separator className="one-time-payment-my-contributions-stage__separator" />
      <div className="one-time-payment-my-contributions-stage__content">
        {!isPaymentIframeLoaded && (
          <Loader className="one-time-payment-my-contributions-stage__loader" />
        )}
        {payment && (
          <IFrame
            src={payment.link}
            frameBorder="0"
            title="Payment Details"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </section>
  );
};

export default PaymentStep;
