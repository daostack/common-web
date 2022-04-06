import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { IFrame, Loader, Separator } from "@/shared/components";
import { CommonPayment } from "@/shared/models";
import { createBuyerTokenPage } from "../../../../../store/actions";
import { subscribeToCardChange } from "../../../../../store/api";
import "./index.scss";

interface State {
  payment: CommonPayment | null;
  isPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  payment: null,
  isPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

interface PaymentMethodChangeProps {
  cardId: string;
  onFinish: () => void;
  onError: (errorText: string) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const PaymentMethodChange: FC<PaymentMethodChangeProps> = (props) => {
  const { cardId, onFinish, onError, setShouldShowGoBackButton } = props;
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
      if (payment || isPaymentLoading) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        createBuyerTokenPage.request({
          payload: { cardId },
          callback: (error, payment) => {
            if (error || !payment) {
              onError(error?.message || "Something went wrong");
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
  }, [dispatch, cardId, payment, isPaymentLoading, onFinish, onError]);

  useEffect(() => {
    if (!isPaymentIframeLoaded || !payment) {
      return;
    }

    try {
      return subscribeToCardChange(cardId, (card) => {
        if (card) {
          onFinish();
        }
      });
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [isPaymentIframeLoaded, payment, onFinish, cardId]);

  useEffect(() => {
    setShouldShowGoBackButton(true);
  }, [setShouldShowGoBackButton]);

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

export default PaymentMethodChange;
