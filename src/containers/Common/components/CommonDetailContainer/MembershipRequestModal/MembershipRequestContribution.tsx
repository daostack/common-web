import React from "react";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">Personal Contribution</div>
      <div className="sub-text">{`Select the amount you would like to contribute (${formatPrice(
        common?.fundingMinimumAmount
      )} min.)`}</div>
      <div className="options-wrapper">
        <button
          className={`${userData.contribution_id === 0 ? "selected" : ""}`}
          onClick={() =>
            setUserData({
              ...userData,
              contribution_amount: common?.fundingMinimumAmount,
              contribution_id: 0,
            })
          }
        >
          {formatPrice(common?.fundingMinimumAmount)}
        </button>
        <button
          className={`${userData.contribution_id === 1 ? "selected" : ""}`}
          onClick={() =>
            setUserData({
              ...userData,
              contribution_amount: 20,
              contribution_id: 1,
            })
          }
        >
          {formatPrice(2000)}
        </button>
        <button
          className={`${userData.contribution_id === 2 ? "selected" : ""}`}
          onClick={() =>
            setUserData({
              ...userData,
              contribution_amount: 50,
              contribution_id: 2,
            })
          }
        >
          {formatPrice(5000)}
        </button>{" "}
      </div>
      <button
        disabled={!userData.contribution_amount}
        className="button-blue"
        onClick={() => setUserData({ ...userData, stage: 4 })}
      >
        Continue
      </button>
    </div>
  );
}
