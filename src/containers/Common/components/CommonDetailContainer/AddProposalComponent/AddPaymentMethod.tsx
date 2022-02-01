import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CommonPayment } from "@/shared/models";
import { Loader } from "@/shared/components";
import PayMeService from "@/services/PayMeService";
import { subscribeToCardChange } from "@/containers/Common/store/api";
import { useDispatch } from "react-redux";
import { checkUserPaymentMethod } from "@/containers/Common/store/actions";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
  cardId: string;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentIframeLoaded: false,
  cardId: "",
};

export const AddPaymentMethod = ({
  onPaymentMethod,
}: {
  onPaymentMethod: () => void;
}) => {
  const [
    { commonPayment, isCommonPaymentLoading, isPaymentIframeLoaded, cardId },
    setState,
  ] = useState<State>(INITIAL_STATE);

  const dispatch = useDispatch();

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  useEffect(() => {
    (async () => {
      if (commonPayment || isCommonPaymentLoading) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isCommonPaymentLoading: true,
        }));

        const cardId = uuidv4();

        const createdCommonPayment = await PayMeService.createBuyerTokenPage({
          cardId: cardId,
        });

        setState((nextState) => ({
          ...nextState,
          commonPayment: createdCommonPayment,
          isCommonPaymentLoading: false,
          cardId,
        }));
      } catch (error) {
        console.error("Error during payment page creation");
      }
    })();
  }, [commonPayment, isCommonPaymentLoading]);

  useEffect(() => {
    if (!isPaymentIframeLoaded) {
      return;
    }

    try {
      return subscribeToCardChange(cardId, (card) => {
        if (card) {
          dispatch(checkUserPaymentMethod.success(true));
          onPaymentMethod();
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, onPaymentMethod, dispatch, cardId]);

  return (
    <div className="add-payment-method-wrapper">
      <div className="add-payment-title">Add Bank Account</div>
      <div className="add-payment-description">
        The following details are required inorder to transfer funds <br /> to
        you after your proposal is approved
      </div>
      <div className="add-payment-content">
        {!isPaymentIframeLoaded && (
          <Loader className="membership-request-payment__loader" />
        )}
        {commonPayment && (
          <iframe
            className="membership-request-payment__payment-iframe"
            src={commonPayment.link}
            frameBorder="0"
            title="Payment Details"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
};
