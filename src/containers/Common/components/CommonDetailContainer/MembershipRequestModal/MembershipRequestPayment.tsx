import React, { useCallback, useEffect, useState, ReactElement } from "react";
import { useSelector } from "react-redux";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import PayMeService from "../../../../../services/PayMeService";
import { Loader } from "../../../../../shared/components";
import { CommonPayment } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { subscribeToCard } from "../../../store/api";

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

export default function MembershipRequestPayment(
  props: IStageProps
): ReactElement {
  const { userData, setUserData, common } = props;
  const user = useSelector(selectUser());
  const [
    {
      commonPayment,
      isCommonPaymentLoading,
      isPaymentIframeLoaded,
    },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const contributionTypeText =
    common?.metadata.contributionType === CommonContributionType.Monthly
      ? "monthly"
      : "one-time";

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  useEffect(() => {
    (async () => {
      if (commonPayment || isCommonPaymentLoading || !common || !user?.uid) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isCommonPaymentLoading: true,
        }));

        const createdCommonPayment = await PayMeService.createBuyerTokenPage({
          cardId: userData.cardId,
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
  }, [commonPayment, isCommonPaymentLoading, userData, common, user]);

  useEffect(() => {
    if (!isPaymentIframeLoaded) {
      return;
    }

    try {
      return subscribeToCard(userData.cardId, (card) => {
        if (card) {
          setUserData((nextUserData) => ({ ...nextUserData, stage: 6 }));
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, userData.cardId, setUserData]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing{" "}
        <strong className="membership-request-payment__amount">
          {formatPrice(userData.contribution_amount, false)} (
          {contributionTypeText})
        </strong>{" "}
        to this Common.
      </div>
      <div className="membership-request-payment__content">
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
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
