import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CommonContributionType, CommonPayment } from "@/shared/models";
import { Loader, ModalHeaderContent } from "@/shared/components";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Progress } from "../Progress";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import { formatPrice } from "@/shared/utils";
import PayMeService from "@/services/PayMeService";
import { subscribeToCardChange } from "@/containers/Common/store/api";
import { PaymentInitDataType } from "../Payment";
import { IntermediateCreateCommonPayload } from "@/containers/Common/interfaces";
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

interface IStageProps {
  paymentData: PaymentInitDataType;
  setPaymentData: (paymentData: PaymentInitDataType) => void;
  currentStep: number;
  onFinish?: () => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function RequestPayment(props: IStageProps): ReactElement {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const { creationData, currentStep, paymentData } = props;
  const selectedAmount = paymentData.selectedAmount;
  const user = useSelector(selectUser());
  const [
    { commonPayment, isCommonPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);
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
          // setUserData((nextUserData) => ({ ...nextUserData, stage: 5 }));
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, paymentData.cardId]);
  const progressEl = <Progress creationStep={currentStep} />;
  return (
    <div className="create-common-payment">
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      {isMobileView && progressEl}
      <div className="create-common-payment__sub-title">Payment Details</div>
      <div className="create-common-payment__sub-text-wrapper">
        <div className="create-common-payment__sub-text">
          You are contributing{" "}
          <strong className="create-common-payment__amount">
            {formatPrice(selectedAmount, { shouldMillify: false })} (
            {contributionTypeText})
          </strong>{" "}
          to this Common. You will not be charged until another member joins the
          Common.
        </div>
      </div>
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
