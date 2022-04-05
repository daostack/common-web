import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { Loader, Separator } from "@/shared/components";
import {
  Common,
  CommonContributionType,
  Payment,
  PaymentStatus,
} from "@/shared/models";
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

interface PaymentMethodChangeProps {
  common: Common;
  contributionAmount: number;
  onFinish: (payment: Payment) => void;
  onError: (errorText: string) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const PaymentMethodChange: FC<PaymentMethodChangeProps> = (props) => {
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
            contributionType: CommonContributionType.OneTime,
            amount: contributionAmount,
            saveCard: true,
          },
          callback: (error, payment) => {
            if (error || !payment) {
              onError(error?.message || "Something went wrong");
              return;
            }
            if (!isImmediateContributionPayment(payment)) {
              onFinish(payment);
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
    <section className="payment-method-change-my-contributions-stage">
      <h3 className="payment-method-change-my-contributions-stage__title">
        Payment details
      </h3>
      <p className="payment-method-change-my-contributions-stage__description">
        Update your payment details below.
      </p>
      <Separator className="payment-method-change-my-contributions-stage__separator" />
      <div className="payment-method-change-my-contributions-stage__content">
        {!isPaymentIframeLoaded && (
          <Loader className="payment-method-change-my-contributions-stage__loader" />
        )}
        {payment && (
          <iframe
            className="payment-method-change-my-contributions-stage__iframe"
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

export default PaymentMethodChange;
