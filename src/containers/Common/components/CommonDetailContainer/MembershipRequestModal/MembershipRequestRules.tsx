import React from "react";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestRules(props: IStageProps) {
  const { userData, setUserData } = props;

  return (
    <div className="membership-request-content membership-request-rules">
      <div className="sub-title">Accept Common Rules</div>
      <div className="sub-text">
        If the Common approves your request you will <br /> become a member with
        equal voting rights
      </div>
      <ol>
        <li>No promotions or spam</li>
        <span>
          We created this community to help you along your journey. Links to
          sponsored content or brands will vote you out.
        </span>
        <li>Be courteous and kind to others</li>
        <span>
          We're all in this together to create a nurturing enviroment. Let's
          teat everyone with resprct. Healthy debates are natural, but kindness
          is required.
        </span>
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
