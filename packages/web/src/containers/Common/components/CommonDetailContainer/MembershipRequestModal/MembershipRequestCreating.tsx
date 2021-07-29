import React, { useEffect } from "react";
import { Loader } from "../../../../../shared/components";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestCreating(props: IStageProps) {
  const { userData, setUserData } = props;

  // TODO: this is temporary to stimulate requescreating
  useEffect(() => {
    const tempTimeout = setTimeout(() => setUserData({ ...userData, stage: 7 }), 3000);
    return () => {
      clearTimeout(tempTimeout);
    };
  }, [setUserData, userData]);

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
