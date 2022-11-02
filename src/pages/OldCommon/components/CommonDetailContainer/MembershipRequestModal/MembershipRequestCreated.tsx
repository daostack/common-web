import React from "react";

interface IProps {
  closeModal: () => void;
}

export default function MembershipRequestCreated(props: IProps) {
  return (
    <div className="membership-request-content membership-request-created">
      <img
        src="/assets/images/membership-request-created.svg"
        alt="introduce"
      />
      <div className="title">Membership request sent</div>
      <span>
        The common members will vote on your membership request. If it's
        approved, you will become a member with equal voting rights.
      </span>
      <button onClick={() => props.closeModal()}>Back to Common</button>
    </div>
  );
}
