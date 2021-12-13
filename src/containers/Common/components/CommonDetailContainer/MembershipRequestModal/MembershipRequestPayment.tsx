import React, { useCallback, useEffect, useState, ReactElement } from "react";
import { useSelector } from "react-redux";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import PayMeService from "../../../../../services/PayMeService";
import { Loader } from "../../../../../shared/components";
import { CommonPayment, PaymentStatus } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { subscribeToPaymentChange } from "../../../store/api";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
  isPaymentFailed: boolean;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentIframeLoaded: false,
  isPaymentFailed: false,
};

export default function MembershipRequestPayment(props: IStageProps): ReactElement {
  const { userData, setUserData, common } = props;
  const user = useSelector(selectUser());
  const [
    { commonPayment, isCommonPaymentLoading, isPaymentIframeLoaded, isPaymentFailed },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const contributionTypeText = common?.metadata.contributionType === CommonContributionType.Monthly ? "monthly" : "one-time";

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  useEffect(() => {
    (async () => {
      if (commonPayment || isCommonPaymentLoading || !common || !user?.uid) {
        return;
      }

      try {
        setState((nextState) => ({ ...nextState, isCommonPaymentLoading: true }));

        const createdCommonPayment = await PayMeService.createPaymentPageWithoutCharging({
          sale_price: userData.contribution_amount || 0,
          product_name: common.name,
          currency: "ILS",
          user_id: user.uid,
          transaction_id: userData.transactionId,
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
    if (!isPaymentIframeLoaded || isPaymentFailed) {
      return;
    }

    try {
      return subscribeToPaymentChange(userData.transactionId, (payment) => {
        if (payment?.status === PaymentStatus.TokenCreated) {
          setUserData((nextUserData) => ({ ...nextUserData, stage: 6 }));
        } else if (payment?.status === PaymentStatus.Failed) {
          setState((nextState) => ({ ...nextState, isPaymentFailed: true }));
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, isPaymentFailed, userData.transactionId, setUserData]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing <strong className="membership-request-payment__amount">{formatPrice(userData.contribution_amount, false)} ({contributionTypeText})</strong> to this Common.
      </div>
      <div className="membership-request-payment__content">
        {!isPaymentIframeLoaded && <Loader className="membership-request-payment__loader" />}
        {commonPayment && (
          <iframe
            className="membership-request-payment__payment-iframe"
            src={commonPayment.link}
            frameBorder="0"
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
