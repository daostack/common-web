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
      <div className="top-votes-side">
        <div className="for">
          <img src="/icons/user-for.svg" alt="vote-for" />
          <span>{proposal.votesFor}</span>
        </div>
        <div className="count">{`${votes} ${votes === 1 ? "vote" : "votes"}`}</div>
        <div className="against">
          <span>{proposal.votesAgainst}</span>
          <img src="/icons/user-rejected.svg" alt="vote-against" />
        </div>
      </div>
      <div className="progress">
        <div className="for" style={{ width: `${((proposal.votesFor || 0) * 100) / votes}%` }}></div>
        <div className="against" style={{ width: `${((proposal.votesAgainst || 0) * 100) / votes}%` }}></div>
      </div>
    </div>
  ) : null;
}
