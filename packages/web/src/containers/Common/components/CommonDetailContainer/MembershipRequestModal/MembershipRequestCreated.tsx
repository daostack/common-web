import React from "react";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestCreated(props: IStageProps) {
  return (
    <div className="membership-request-content membership-request-created">
      <img src="/assets/images/membership-request-created.svg" alt="introduce" />
      <div className="title">Membership request sent</div>
      <span>
        The common members will vote on your membership request. If it's approved, you will become a member with equal
        voting rights.
      </span>
      <button>Back to Common</button>
    </div>
  );
}
