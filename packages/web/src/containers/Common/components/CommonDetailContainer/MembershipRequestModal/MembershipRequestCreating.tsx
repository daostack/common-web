import React from "react";
import { Loader } from "../../../../../shared/components";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestCreating(props: IStageProps) {
  return (
    <div className="membership-request-content membership-request-creating">
      <img src="/assets/images/membership-request-creating.svg" alt="introduce" />
      <div className="title">Creating your membership request</div>
      <div className="loader-container">
        <Loader />
      </div>
    </div>
  );
}
