import React, { useState } from "react";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestPayment(props: IStageProps) {
  const { userData, setUserData } = props;
  const [card, setCard] = useState(0);
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState(0);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">You are contributing $?? (monthly or one-time) to this Common</div>
      <label>Card Number</label>
      <input type="number" value={card} onChange={(e) => setCard(Number(e.target.value))} />
      <div className="expiration-cvv-wrapper">
        <div>
          <label>Expiration date</label>
          <input type="string" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
        </div>
        <div>
          <label>CVV</label>
          <input type="number" value={cvv} onChange={(e) => setCvv(Number(e.target.value))} />
        </div>
      </div>
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be charged.
      </span>
      <button
        disabled={!card || !expiration || !cvv}
        className="button-blue"
        onClick={() => setUserData({ ...userData, stage: 6 })}
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
