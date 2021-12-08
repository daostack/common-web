import React, { useState, ReactElement } from "react";

import {
  createCard,
  createRequestToJoin,
} from "../../../../../services/CirclePayService";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import {
  formatPrice,
  getTodayDate,
  luhnAlgo,
  validateCreditCardProvider,
  validateCVV,
} from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";

export default function MembershipRequestPayment(props: IStageProps): ReactElement {
  const { userData, setUserData, common } = props;
  const [card_number, setCardNumber] = useState(0); // 4007400000000007
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState(0);
  const [showCCNumberError, setShowCCNumberError] = useState(false);
  const contributionTypeText = common?.metadata.contributionType === CommonContributionType.Monthly ? "monthly" : "one-time";

  const onCCNumberChange = (value: string) => {
    setCardNumber(Number(value));
    if (!validateCreditCardProvider(value) || !luhnAlgo(value)) {
      setShowCCNumberError(true);
    } else {
      setShowCCNumberError(false);
    }
  };

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
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing <strong className="membership-request-payment__amount">{formatPrice(userData.contribution_amount, false)} ({contributionTypeText})</strong> to this Common.
      </div>
      <label>Card Number</label>
      <input
        type="number"
        value={card_number}
        onChange={(e) => onCCNumberChange(e.target.value)}
      />
      {showCCNumberError && (
        <span className="error">
          Enter a valid credit card number. Only Visa is currently supported.
        </span>
      )}
      <div className="expiration-cvv-wrapper">
        <div>
          <label>Expiration date</label>
          <input
            type="date"
            min={getTodayDate()}
            value={expiration_date}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div>
          <label>CVV</label>
          <input
            type="number"
            value={cvv}
            onChange={(e) => setCvv(Number(e.target.value))}
          />
        </div>
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
      <button
        disabled={
          !validateCreditCardProvider(card_number) ||
          !luhnAlgo(card_number) ||
          !validateCVV(cvv) ||
          !expiration_date
        }
        className="button-blue"
        onClick={() => pay()}
      >
        Pay Now
      </button>
    </div>
  );
}
