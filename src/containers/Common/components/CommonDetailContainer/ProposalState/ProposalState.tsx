import React from "react";
import classNames from "classnames";
import { Proposal, ProposalState as ProposalStateTypes } from "@/shared/models";
import { getProposalExpirationDate } from "@/shared/utils";
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
  const state =
    proposal.state === ProposalStateTypes.FAILED ? "Rejected" : "Approved";

  return (
    <div className={classNames("proposal-state-wrapper", className)}>
      {proposal.state === ProposalStateTypes.VOTING && (
        <ProposalCountDown
          date={getProposalExpirationDate(proposal)}
          hideCounter={hideCounter}
        />
      )}
      {proposal.state !== ProposalStateTypes.VOTING && (
        <div className={`state-wrapper ${state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            <img
              src={`/icons/${state.toLocaleLowerCase()}.svg`}
              alt="proposal state"
            />
            <span className="state-name">{state}</span>
          </div>
        </div>
      )}
    </div>
  );
}
