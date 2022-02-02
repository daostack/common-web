import React from "react";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestRules(props: IStageProps) {
  const { userData, setUserData, common } = props;

  return (
    <div className="membership-request-content membership-request-rules">
      <div className="sub-title">Accept Common Rules</div>
      <div className="sub-text">
        If the Common approves your request you will <br /> become a member with
        equal voting rights
      </div>
      <ol className="membership-request-rules__rules-wrapper">
        {common?.rules.map((rule, index) => (
          <li
            key={index}
            className="membership-request-rules__rules-item-wrapper"
          >
            <div className="membership-request-rules__rules-item">
              <h4 className="membership-request-rules__rules-item-title">
                {rule.title}
              </h4>
              <p className="membership-request-rules__rules-item-description">
                {rule.value}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <button
        onClick={() => setUserData({ ...userData, stage: 3 })}
        className="button-blue"
      >
        Accept Rules
      </button>
    </div>
  );
}
