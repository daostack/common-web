import React, { useCallback, useEffect, useState, ReactElement } from "react";
import { useSelector } from "react-redux";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import PayMeService from "../../../../../services/PayMeService";
import { Loader } from "../../../../../shared/components";
import { ModalFooter } from "../../../../../shared/components/Modal";
import { CommonPayment, PaymentMethod, PaymentStatus } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { subscribeToPaymentChange } from "../../../store/api";
import MembershipRequestPaymentMethod from "./MembershipRequestPaymentMethod";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
  isPaymentFailed: boolean;
  paymentMethod: PaymentMethod | null;
  isPaymentMethodLoading: boolean;
  isPaymentMethodFetched: boolean;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentIframeLoaded: false,
  isPaymentFailed: false,
  paymentMethod: null,
  isPaymentMethodLoading: false,
  isPaymentMethodFetched: false,
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
      isPaymentFailed,
      paymentMethod,
      isPaymentMethodLoading,
      isPaymentMethodFetched,
    },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const shouldShowLoader = !isPaymentIframeLoaded && !paymentMethod;
  const contributionTypeText =
    common?.metadata.contributionType === CommonContributionType.Monthly
      ? "monthly"
      : "one-time";

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  const handlePaymentMethodConfirm = useCallback(() => {
    if (!paymentMethod) {
      return;
    }

    setUserData((nextUserData) => ({
      ...nextUserData,
      transactionId: paymentMethod.cardId,
      stage: 6,
    }));
  }, [paymentMethod, setUserData]);

  useEffect(() => {
    (async () => {
      if (isPaymentMethodLoading || isPaymentMethodFetched) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isPaymentMethodLoading: true,
        }));

        // Fetch payment method

        setState((nextState) => ({
          ...nextState,
          paymentMethod: null,
          isPaymentMethodLoading: false,
          isPaymentMethodFetched: true,
        }));
      } catch (error) {
        console.error("Error during payment method fetch");
      }
    })();
  }, [isPaymentMethodLoading, isPaymentMethodFetched]);

  useEffect(() => {
    (async () => {
      if (
        commonPayment ||
        isCommonPaymentLoading ||
        !common ||
        !user?.uid ||
        paymentMethod ||
        !isPaymentMethodFetched
      ) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isCommonPaymentLoading: true,
        }));

        const createdCommonPayment = await PayMeService.createBuyerTokenPage({
          cardId: userData.transactionId,
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
  }, [
    commonPayment,
    isCommonPaymentLoading,
    userData,
    common,
    user,
    paymentMethod,
    isPaymentMethodFetched,
  ]);

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
  }, [
    isPaymentIframeLoaded,
    isPaymentFailed,
    userData.transactionId,
    setUserData,
  ]);

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
        {shouldShowLoader && (
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
        {paymentMethod && (
          <>
            <MembershipRequestPaymentMethod />
            <ModalFooter sticky>
              <div className="membership-request-payment__modal-footer">
                <button
                  className="button-blue"
                  onClick={handlePaymentMethodConfirm}
                >
                  Confirm Payment
                </button>
              </div>
            </ModalFooter>
          </>
        )}
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
