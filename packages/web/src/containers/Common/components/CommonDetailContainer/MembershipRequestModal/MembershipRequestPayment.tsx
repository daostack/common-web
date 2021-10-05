import React, { useState } from "react";
import { CreateJoinProposalDocument } from "../../../../../graphql";
import { createCard } from "../../../../../services/CirclePayService";
import { GRAPH_QL_URL } from "../../../../../shared/constants";
import { createApolloClient } from "../../../../../shared/utils";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

const apollo = createApolloClient(GRAPH_QL_URL || "", localStorage.token || "");

// TODO: should be in utils
const getTodayDate = () => {
  const today = new Date();
  let dd: number | string = today.getDate();
  let mm: number | string = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
};

export default function MembershipRequestPayment(props: IStageProps) {
  const { userData, setUserData } = props;
  const [card_number, setCardNumber] = useState(4007400000000007);
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState(0);

  const createJoinProposal = async (formData: any) => {
    try {
      return await apollo.mutate({
        mutation: CreateJoinProposalDocument,
        variables: {
          proposal: formData,
        },
        errorPolicy: "none",
      });
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
        title: `User join for common COMMON_NAME`,
        description: formData.intro,
        fundingAmount: formData.contribution_amount,
        commonId: `${window.location.pathname.split("/")[2]}`,
      };

      setUserData({ ...userData, stage: 6 });

      const createdCard = await createCard({
        ...formData,
      });

      const createJoinProposalResponse = await createJoinProposal({
        ...data,
        cardId: createdCard.data.createCard.id,
      });

      const proposalId = createJoinProposalResponse.data.createJoinProposal.id;

      // Need to disable temporary timeout in MembershipRequestCreating and change view to MembershipRequestCreated and show the proposalId
    } catch (e) {
      console.error("We couldn't create your proposal");
    }
  };

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">You are contributing $?? (monthly or one-time) to this Common</div>
      <label>Card Number</label>
      <input type="number" value={card_number} onChange={(e) => setCardNumber(Number(e.target.value))} />
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
          <input type="number" value={cvv} onChange={(e) => setCvv(Number(e.target.value))} />
        </div>
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be charged.
      </span>
      <button disabled={!card_number || !expiration_date || !cvv} className="button-blue" onClick={() => pay()}>
        Pay Now
      </button>
      <div className="circle-wrapper">
        <span>Powered by</span>
        <img src="/icons/membership-request/circle-pay.png" alt="circle pay" />
      </div>
    </div>
  );
}
