import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { IFrame, Loader, Separator } from "@/shared/components";
import { ContributionType } from "@/shared/constants";
import { Common, Subscription, Payment, PaymentStatus } from "@/shared/models";
import {
  isImmediateContributionPayment,
  ImmediateContributionPayment,
} from "../../../../../interfaces";
import { makeImmediateContribution } from "../../../../../store/actions";
import { subscribeToPayment } from "../../../../../store/api";
import "./index.scss";

interface State {
  subscription: ImmediateContributionPayment | null;
  isPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  subscription: null,
  isPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

interface PaymentStepProps {
  common: Common;
  contributionAmount: number;
  onFinish: (payment: Subscription | Payment) => void;
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
    { subscription, isPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);

  const handleIframeLoad = () => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  };

  useEffect(() => {
    (async () => {
      if (subscription || isPaymentLoading || !contributionAmount) {
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
            contributionType: ContributionType.Monthly,
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
              subscription: {...payment},
              isPaymentLoading: false,
            }));
          },
        })
      );
    })();
  }, [
    dispatch,
    commonId,
    subscription,
    isPaymentLoading,
    contributionAmount,
    onFinish,
    onError,
  ]);

  useEffect(() => {
    if (!isPaymentIframeLoaded || !subscription) {
      return;
    }


    try {
      return subscribeToPayment(subscription.paymentId, (payment) => {
  
        if (payment?.status === PaymentStatus.Confirmed) {
          onFinish(payment);
        } else if (payment?.status === PaymentStatus.Failed) {
          onError("Payment failed");
        }
      });
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isPaymentIframeLoaded, subscription, onFinish, onError]);

  useEffect(() => {
    setShouldShowGoBackButton(Boolean(isPaymentIframeLoaded && subscription));
  }, [setShouldShowGoBackButton, isPaymentIframeLoaded, subscription]);

  return (
    <section className="monthly-payment-my-contributions-stage">
      <h3 className="monthly-payment-my-contributions-stage__title">
        Payment details
      </h3>
      <p className="monthly-payment-my-contributions-stage__description">
        Update your payment details below.
      </p>
      <Separator className="monthly-payment-my-contributions-stage__separator" />
      <div className="monthly-payment-my-contributions-stage__content">
        {!isPaymentIframeLoaded && (
          <Loader className="monthly-payment-my-contributions-stage__loader" />
        )}
        {subscription && (
          <IFrame
            src={subscription.link}
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
