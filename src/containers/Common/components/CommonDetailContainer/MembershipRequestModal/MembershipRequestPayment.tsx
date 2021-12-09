import React, { useState, ReactElement } from "react";
import { useSelector } from "react-redux";

import {
  createCard,
  createRequestToJoin,
} from "../../../../../services/CirclePayService";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { ScreenSize } from "../../../../../shared/constants";
import { Loader } from "../../../../../shared/components";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { getScreenSize } from "../../../../../shared/store/selectors";

export default function MembershipRequestPayment(props: IStageProps): ReactElement {
  const { userData, setUserData, common } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [card_number, setCardNumber] = useState(0); // 4007400000000007
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState(0);
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

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">{isMobileView ? "Billing Details" : "Payment Details"}</div>
      <div className="sub-text">
        You are contributing <strong className="membership-request-payment__amount">{formatPrice(userData.contribution_amount, false)} ({contributionTypeText})</strong> to this Common.
      </div>
      <div className="membership-request-payment__loader">
        <Loader />
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
