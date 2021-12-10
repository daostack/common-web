import React, { useCallback, useEffect, useState, ReactElement } from "react";
import { useSelector } from "react-redux";

import {
  createCard,
  createRequestToJoin,
} from "../../../../../services/CirclePayService";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import PayMeService from "../../../../../services/PayMeService";
import { ScreenSize } from "../../../../../shared/constants";
import { ButtonLink, Loader } from "../../../../../shared/components";
import { CommonPayment } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { getScreenSize } from "../../../../../shared/store/selectors";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentPageOpen: boolean;
  shouldShowPaymentPageLink: boolean;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentPageOpen: false,
  shouldShowPaymentPageLink: false,
};

export default function MembershipRequestPayment(props: IStageProps): ReactElement {
  const { userData, setUserData, common } = props;
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [card_number, setCardNumber] = useState(0); // 4007400000000007
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState(0);
  const [
    { commonPayment, isCommonPaymentLoading, isPaymentPageOpen, shouldShowPaymentPageLink },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const contributionTypeText = common?.metadata.contributionType === CommonContributionType.Monthly ? "monthly" : "one-time";

  const pay = async () => {
    try {
      const formData = {
        ...userData,
        card_number,
        expiration_date,
        cvv,
      };

      const data = {
        description: formData.intro,
        funding: formData?.contribution_amount || 0,
        commonId: `${window.location.pathname.split("/")[2]}`,
      };

      setUserData({ ...userData, stage: 6 });

      const createdCard = await createCard({
        ...formData,
      });

      await createRequestToJoin({
        ...data,
        cardId: createdCard.id as string,
      });

      setUserData({ ...userData, stage: 7 });
      // TODO: show the proposalId somewhere?
    } catch (e) {
      console.error("We couldn't create your proposal");
    }
  };

  const handlePaymentPageLinkClick = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentPageOpen: true }));
  }, []);

  useEffect(() => {
    (async () => {
      if (commonPayment || isCommonPaymentLoading || !common || !user?.uid) {
        return;
      }

      try {
        setState((nextState) => ({ ...nextState, isCommonPaymentLoading: true }));

        const createdCommonPayment = await PayMeService.createPaymentPage({
          sale_price: userData.contribution_amount || 0,
          product_name: common.name,
          capture_buyer: 1,
          currency: "ILS",
          commonId: common.id,
          installments: 1,
          userId: user.uid,
          proposalId: userData.proposalId,
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
    if (!commonPayment || isPaymentPageOpen || shouldShowPaymentPageLink) {
      return;
    }

    // 1. Open new tab/window for user to enter card details
    if (window.open) {
      const openFeatures = isMobileView ? "" : "popup=yes,fullscreen=no,width=600,height=600";

      if (window.open(commonPayment.link, "_blank", openFeatures)) {
        setState((nextState) => ({ ...nextState, isPaymentPageOpen: true }));
        return;
      }
    }

    setState((nextState) => ({ ...nextState, shouldShowPaymentPageLink: true }));
    // 2. Subscribe to payment status update
    // 3. Once status is good for us => change the stage to 6 where we should create a proposal using our custom proposal id
    // 4. Remove subscription
  }, [commonPayment, isPaymentPageOpen, shouldShowPaymentPageLink]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing <strong className="membership-request-payment__amount">{formatPrice(userData.contribution_amount, false)} ({contributionTypeText})</strong> to this Common.
      </div>
      <div className="membership-request-payment__content">
        {(!shouldShowPaymentPageLink || isPaymentPageOpen) && <Loader className="membership-request-payment__loader" />}
        {commonPayment && shouldShowPaymentPageLink && !isPaymentPageOpen && (
          <ButtonLink
            href={commonPayment.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePaymentPageLinkClick}
          >
            Open Payment Details Page
          </ButtonLink>
        )}
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
