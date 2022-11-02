import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
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
  props: IStageProps,
): ReactElement {
  const { setUserData, governance } = props;
  const {
    fetched: areUserCardsFetched,
    data: cards,
    fetchUserCards,
  } = useUserCards();
  const { changePaymentMethodState, onPaymentMethodChange } =
    usePaymentMethodChange();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const hasPaymentMethod = areUserCardsFetched && cards.length > 0;
  const shouldDisplayPaymentMethod =
    hasPaymentMethod &&
    !changePaymentMethodState.payment &&
    !changePaymentMethodState.isPaymentLoading;

  const contributionInfo = useMemo(() => {
    const limitations = governance?.proposals?.MEMBER_ADMITTANCE?.limitations;

    if (limitations?.minFeeMonthly) {
      return {
        amount: limitations?.minFeeMonthly.amount,
        contributionType: ContributionType.Monthly,
      };
    } else {
      return {
        amount: limitations?.minFeeOneTime?.amount,
        contributionType: ContributionType.OneTime,
      };
    }
  }, [governance]);

  const finishPayment = useCallback(
    (newCardId) => {
      const cardId = hasPaymentMethod && cards[0]?.id;
      setUserData((nextUserData) => ({
        ...nextUserData,
        cardId: newCardId || cardId,
        stage: MembershipRequestStage.Creating,
        [contributionInfo.contributionType === ContributionType.Monthly
          ? "feeMonthly"
          : "feeOneTime"]: contributionInfo.amount,
      }));
    },
    [setUserData, hasPaymentMethod, cards],
  );

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

  useEffect(() => {
    const cardId = changePaymentMethodState.createdCard?.id;
    if (cardId) {
      finishPayment(cardId);
    }
  }, [changePaymentMethodState.createdCard]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing{" "}
        <strong className="membership-request-payment__amount">
          {formatPrice(contributionInfo.amount, { shouldMillify: false })} (
          {contributionInfo.contributionType})
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
