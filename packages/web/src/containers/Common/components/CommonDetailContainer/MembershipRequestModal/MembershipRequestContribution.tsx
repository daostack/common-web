import React from "react";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData } = props;

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">Personal Contribution</div>
      <div className="sub-text">Select the amount you would like to contribute ($10 min.)</div>
      <div className="options-wrapper">
        <button
          className={`${userData.contributionId === 0 ? "selected" : ""}`}
          onClick={() => setUserData({ ...userData, contributionAmount: 10, contributionId: 0 })}
        >
          $10
        </button>
        <button
          className={`${userData.contributionId === 1 ? "selected" : ""}`}
          onClick={() => setUserData({ ...userData, contributionAmount: 20, contributionId: 1 })}
        >
          $20
        </button>
        <button
          className={`${userData.contributionId === 2 ? "selected" : ""}`}
          onClick={() => setUserData({ ...userData, contributionAmount: 50, contributionId: 2 })}
        >
          $50
        </button>
      </div>
      <button
        disabled={!userData.contributionAmount}
        className="button-blue"
        onClick={() => setUserData({ ...userData, stage: 4 })}
      >
        Continue
      </button>
    </div>
  );
}
