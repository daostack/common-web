import React, { useState } from "react";

import { createCard } from "../../../../../services/CirclePayService";
import { GRAPH_QL_URL } from "../../../../../shared/constants";
import { createApolloClient } from "../../../../../shared/utils";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import {
  formatPrice,
  getTodayDate,
  luhnAlgo,
  validateCreditCardProvider,
  validateCVV,
} from "../../../../../shared/utils/shared";

const apollo = createApolloClient(GRAPH_QL_URL || "", localStorage.token || "");

export default function MembershipRequestPayment(props: IStageProps) {
  const { userData, setUserData } = props;
  const [card_number, setCardNumber] = useState(0); // 4007400000000007
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState(0);
  const [showCCNumberError, setShowCCNumberError] = useState(false);

  const onCCNumberChange = (value: string) => {
    setCardNumber(Number(value));
    if (!validateCreditCardProvider(value) || !luhnAlgo(value)) {
      setShowCCNumberError(true);
    } else {
      setShowCCNumberError(false);
    }
  };

  const createJoinProposal = async (formData: any) => {
    try {
      // return await apollo.mutate({
      //   mutation: CreateJoinProposalDocument,
      //   variables: {
      //     proposal: formData,
      //   },
      //   errorPolicy: "none",
      // });
    } catch (err) {
      console.error("Error while trying to create a new Join Proposal");
      throw err;
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
        title: `User join for common ${props.common?.name}`,
        description: formData.intro,
        fundingAmount: formData.contribution_amount,
        commonId: `${window.location.pathname.split("/")[2]}`,
      };

      //console.log(data);

      setUserData({ ...userData, stage: 6 });

      const createdCard = await createCard({
        ...formData,
      });

      //console.log(createdCard);

      // const createJoinProposalResponse = await createJoinProposal({
      //   ...data,
      //   cardId: createdCard.data.createCard.id,
      // });

      //console.log(createJoinProposalResponse);

      //const proposalId = createJoinProposalResponse.data.createJoinProposal.id;
      // console.log(proposalId);

      setUserData({ ...userData, stage: 7 });
      // TODO: show the proposalId somewhere?
    } catch (e) {
      console.error("We couldn't create your proposal");
    }
  };

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">{`You are contributing ${formatPrice(
        userData.contribution_amount
      )} (monthly or one-time) to this Common`}</div>
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
      <div className="circle-wrapper">
        <span>Powered by</span>
        <img src="/icons/membership-request/circle-pay.png" alt="circle pay" />
      </div>
    </div>
  );
}
