import React, { ReactElement, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  IFrame,
  Loader,
  ModalFooter,
  PaymentMethod,
} from "@/shared/components";
import { ContributionType, ScreenSize } from "@/shared/constants";
import { usePaymentMethodChange, useUserCards } from "@/shared/hooks/useCases";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

export default function MembershipRequestPayment(
  props: IStageProps
): ReactElement {
  const { userData, setUserData, common } = props;
  const {
    fetched: areUserCardsFetched,
    data: cards,
    fetchUserCards,
  } = useUserCards();
  const { changePaymentMethodState, onPaymentMethodChange } =
    usePaymentMethodChange();
  const contributionType =
    Math.random() < 0.5 ? ContributionType.OneTime : ContributionType.Monthly;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const contributionTypeText =
    contributionType === ContributionType.Monthly ? "monthly" : "one-time";
  const hasPaymentMethod = areUserCardsFetched && cards.length > 0;
  const shouldDisplayPaymentMethod =
    hasPaymentMethod &&
    !changePaymentMethodState.payment &&
    !changePaymentMethodState.isPaymentLoading;
  const contributionAmount = 5000;

  const finishPayment = useCallback(() => {
    // const cardId = hasPaymentMethod && cards[0]?.id;
    // setUserData((nextUserData) => ({
    //   ...nextUserData,
    //   cardId: cardId || nextUserData.cardId,
    //   stage: MembershipRequestStage.Creating,
    // }));
  }, [setUserData, hasPaymentMethod, cards]);

  useEffect(() => {
    fetchUserCards();
  }, [fetchUserCards]);

  useEffect(() => {
    if (
      !areUserCardsFetched ||
      cards.length > 0 ||
      changePaymentMethodState.payment ||
      changePaymentMethodState.isPaymentLoading
    ) {
      return;
    }

    onPaymentMethodChange();
  }, [
    areUserCardsFetched,
    cards.length,
    changePaymentMethodState.payment,
    changePaymentMethodState.isPaymentLoading,
    onPaymentMethodChange,
  ]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing{" "}
        <strong className="membership-request-payment__amount">
          {formatPrice(contributionAmount, { shouldMillify: false })} (
          {contributionTypeText})
        </strong>{" "}
        to this Common.
      </div>
      <div className="membership-request-payment__content">
        {(!areUserCardsFetched ||
          changePaymentMethodState.isPaymentLoading) && (
          <Loader className="membership-request-payment__loader" />
        )}
        {shouldDisplayPaymentMethod && (
          <PaymentMethod
            card={cards[0]}
            onReplacePaymentMethod={onPaymentMethodChange}
          />
        )}
        {changePaymentMethodState.payment && (
          <IFrame
            src={changePaymentMethodState.payment.link}
            frameBorder="0"
            title="Payment Details"
          />
        )}
      </div>
      {shouldDisplayPaymentMethod && (
        <ModalFooter sticky>
          <div className="membership-request-payment__continue-button-wrapper">
            <Button
              key="membership-request-payment-continue"
              className="membership-request-payment__continue-button"
              shouldUseFullWidth={isMobileView}
              onClick={finishPayment}
            >
              Continue
            </Button>
          </div>
        </ModalFooter>
      )}
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
