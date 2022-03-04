import React from "react";
import { Proposal, ProposalState as ProposalStateTypes } from "@/shared/models";
import { getProposalExpirationDate } from "@/shared/utils";
import ProposalCountDown from "../ProposalCountDown/ProposalCountDown";
import "./index.scss";

interface IProps {
  proposal: Proposal
}

export default function ProposalState({ proposal }: IProps) {

  const state = proposal.state === ProposalStateTypes.REJECTED ? "Rejected" :
    proposal.state === ProposalStateTypes.EXPIRED_INVOCIES_NOT_UPLOADED ? "Unclaimed" : "Approved";

  return (
    <div className="proposal-state-wrapper">
      {proposal.state === ProposalStateTypes.COUNTDOWN && <ProposalCountDown date={getProposalExpirationDate(proposal)} />}
      {proposal.state !== ProposalStateTypes.COUNTDOWN && (
        <div className={`state-wrapper ${state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            {state !== "Unclaimed" && <img src={`/icons/${state.toLocaleLowerCase()}.svg`} alt="proposal state" />}
            <span className="state-name">{state}</span>
          </div>
        </div>
      )}
    </div>
  )
}
