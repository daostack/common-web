import React from "react";
import classNames from "classnames";
import {
  Proposal,
  ProposalState as ProposalStateTypes,
} from "@/shared/models";
import {
  FundingAllocationStatus,
  isFundsAllocationProposal,
} from "@/shared/models/governance/proposals";
import {
  checkIsCountdownState,
  getProposalExpirationDate,
} from "@/shared/utils";
import ProposalCountDown from "../ProposalCountDown/ProposalCountDown";
import "./index.scss";

interface IProps {
  proposal: Proposal;
  hideCounter?: boolean;
  className?: string;
}

export default function ProposalState({
  proposal,
  hideCounter,
  className,
}: IProps) {
  const isUnclaimedProposal =
    isFundsAllocationProposal(proposal) &&
    proposal.data.tracker.status ===
      FundingAllocationStatus.EXPIRED_INVOICES_NOT_UPLOADED;
  const state =
    proposal.state === ProposalStateTypes.FAILED
      ? "Rejected"
      : isUnclaimedProposal
      ? "Unclaimed"
      : "Approved";
  const isCountdownState = checkIsCountdownState(proposal);

  return (
    <div className={classNames("proposal-state-wrapper", className)}>
      {isCountdownState && (
        <ProposalCountDown
          date={getProposalExpirationDate(proposal)}
          state={proposal.state}
          hideCounter={hideCounter}
        />
      )}
      {!isCountdownState && (
        <div className={`state-wrapper ${state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            {state !== "Unclaimed" && (
              <img
                src={`/icons/${state.toLocaleLowerCase()}.svg`}
                alt="proposal state"
              />
            )}
            <span className="state-name">{state}</span>
          </div>
        </div>
      )}
    </div>
  );
}
