import React from "react";
import classNames from "classnames";
import {
  Moderation,
  Proposal,
  ProposalState as ProposalStateTypes,
} from "@/shared/models";
import { getProposalExpirationDate } from "@/shared/utils";
import ProposalCountDown from "../ProposalCountDown/ProposalCountDown";
import "./index.scss";

interface IProps {
  proposal: Proposal;
  moderation?: Moderation;
  hideCounter?: boolean;
  className?: string;
}

export default function ProposalState({
  proposal,
  moderation,
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
          <div
            className={`state-inner-wrapper ${
              moderation && moderation.reporter ? "moderation" : ""
            }`}
          >
            <span className="state-name">
              <img
                src={`/icons/${state.toLocaleLowerCase()}.svg`}
                alt="proposal state"
              />
              {state}
            </span>
            {moderation && moderation.reporter && (
              <div className="moderation">
                The proposal was reporter by {moderation.reporter}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
