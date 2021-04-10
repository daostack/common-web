import React from "react";
import { Proposal } from "../../../../../shared/models";
import "./index.scss";

interface VotesComponentProps {
  proposal: Proposal;
}

export default function VotesComponent({ proposal }: VotesComponentProps) {
  const votes = (proposal.votesAgainst || 0) + (proposal.votesFor || 0);
  return votes > 0 ? (
    <div className="votes-wrapper">
      <div className="top-side">
        <div className="for"></div>
        <div className="count">{votes}</div>
        <div className="against"></div>
        {proposal.votesFor}-{votes}-{proposal.votesAgainst}
      </div>
      <div className="progress">
        <div className="for" style={{ width: `${((proposal.votesFor || 0) * 100) / votes}%` }}></div>
        <div className="against" style={{ width: `${((proposal.votesAgainst || 0) * 100) / votes}%` }}></div>
      </div>
    </div>
  ) : null;
}
