import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { IFrame, Loader, Separator } from "@/shared/components";
import { ContributionType } from "@/shared/constants";
import { Common, Subscription, SubscriptionStatus } from "@/shared/models";
import {
  //isSubscriptionPayment,
  SubscriptionPayment,
} from "../../../../../interfaces";
import { createSubscription } from "../../../../../store/actions";
import { subscribeToSubscription } from "../../../../../store/api";
import { useSubscription } from "@/shared/hooks/useCases";
import "./index.scss";

interface State {
  subscription: SubscriptionPayment | null;
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
  onFinish: (payment: Subscription) => void;
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
    {/* subscription, isPaymentLoading, */isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);

  const {
    isPaymentLoading,
    onReadyToSubscribe,
    subscription,
    errorText
  } = useSubscription();

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
        createSubscription.request({
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
            console.log('Payment payment', payment)
            /*if (!isSubscriptionPayment(payment)) {
              
              return;
            }*/

            onFinish(payment);

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
      return subscribeToSubscription(subscription.id, (payment) => {

        if (payment?.status === SubscriptionStatus.Active) {
          onFinish(payment);
        } else if (payment?.status === SubscriptionStatus.PaymentFailed) {
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
        {/*subscription && (
          <IFrame
            src={subscription.link}
            frameBorder="0"
            title="Payment Details"
            onLoad={handleIframeLoad}
          />
        )*/}
      </div>
    </section>
  );
};

export default PaymentStep;
