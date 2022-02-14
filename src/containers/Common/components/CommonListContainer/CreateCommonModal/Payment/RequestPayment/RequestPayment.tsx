import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import PayMeService from "@/services/PayMeService";
import { Loader, ModalHeaderContent, Separator } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { CommonContributionType, CommonPayment } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../../../interfaces";
import { subscribeToCardChange } from "../../../../../store/api";
import { Progress } from "../Progress";
import "./index.scss";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

interface RequestPaymentProps {
  currentStep: number;
  onFinish: () => void;
  paymentData: PaymentPayload;
  creationData: IntermediateCreateCommonPayload;
}

export default function RequestPayment(
  props: RequestPaymentProps
): ReactElement {
  const { creationData, currentStep, paymentData, onFinish } = props;
  const [
    { commonPayment, isCommonPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const selectedAmount = paymentData.contributionAmount;
  const contributionTypeText =
    creationData.contributionType === CommonContributionType.Monthly
      ? "monthly"
      : "one-time";

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  useEffect(() => {
    (async () => {
      if (commonPayment || isCommonPaymentLoading || !user?.uid) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isCommonPaymentLoading: true,
        }));

        const createdCommonPayment = await PayMeService.createBuyerTokenPage({
          cardId: paymentData.cardId,
        });

        setState((nextState) => ({
          ...nextState,
          commonPayment: createdCommonPayment,
          isCommonPaymentLoading: false,
        }));
      } catch (error) {
        console.error("Error during payment page creation");
      }
    })();
  }, [commonPayment, isCommonPaymentLoading, paymentData.cardId, user]);

  useEffect(() => {
    if (!isPaymentIframeLoaded) {
      return;
    }

    try {
      return subscribeToCardChange(paymentData.cardId, (card) => {
        if (card) {
          onFinish();
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, paymentData.cardId, onFinish]);

  const progressEl = <Progress paymentStep={currentStep} />;

  return (
    <div className="create-common-payment">
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      {isMobileView && progressEl}
      <h4 className="create-common-payment__sub-title">Payment Details</h4>
      <p className="create-common-payment__sub-text">
        You are contributing{" "}
        <strong className="create-common-payment__amount">
          {formatPrice(selectedAmount, { shouldMillify: false })} (
          {contributionTypeText})
        </strong>{" "}
        to this Common.
      </p>
      <Separator className="create-common-payment__separator" />
      <div className="create-common-payment__content">
        {!isPaymentIframeLoaded && (
          <Loader className="create-common-payment__loader" />
        )}
        {commonPayment && (
          <iframe
            className="create-common-payment__iframe"
            src={commonPayment.link}
            frameBorder="0"
            title="Payment Details"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
}
