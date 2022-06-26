import React from "react";
import { useState } from "react";
import classNames from "classnames";
import { Proposals } from "@/shared/models/governance/proposals";
import { Proposal } from "@/shared/models";
import { calculateVoters, formatCamelSnakeCase } from "../../../../utils";
import "./index.scss";

interface IProps {
  proposalType: string;
  proposalData: Partial<Proposals>;
  circles: string[];
}

export default function WhitepaperProposalCard({ circles, proposalType, proposalData }: IProps) {
  const [toggle, setToggle] = useState(false);

  const voters = calculateVoters(circles, (proposalData as Proposal).global.weights).map((voter, index) => {
    return <span className="whitepaper-proposal-card__voter" key={index}>{voter}</span>
  });

  return (
    <div className="whitepaper-proposal-card-wrapper">
      <div className="whitepaper-proposal-card__top-wrapper" onClick={() => setToggle(!toggle)}>
        <div>{formatCamelSnakeCase(proposalType)}</div>
        <img src="/icons/up-arrow.svg" className={classNames("collapsed", { "expanded": toggle })} alt="arrow" />
      </div>
      {toggle && (
        <div className="whitepaper-proposal-card__content">
          <div className="whitepaper-proposal-card__content-sub-title">Duration:</div>
          <div className="whitepaper-proposal-card__content-duration-wrapper">
            <span>
              <b>{((proposalData as Proposal)).global.discussionDuration} hrs</b>
              <br />
              Discussion
            </span>
            <span className="whitepaper-proposal-card__voting">
              <b>{((proposalData as Proposal)).global.votingDuration} hrs</b>
              <br />
              Voting
            </span>
          </div>
          <div className="whitepaper-proposal-card__content-sub-title">Voting Model:</div>
          <span>Quorum: {((proposalData as Proposal)).global.quorum}%</span>
          <div className="whitepaper-proposal-card__voters-wrapper">
            <div className="whitepaper-proposal-card__content-sub-title">
              Voters:
            </div>
            {voters}
          </div>
          <span>
            <img className="arrow" src="/icons/down-arrow-light-purple.svg" alt="down arrow" />
            Support (min): {((proposalData as Proposal)).global.minApprove}%
            <img className="arrow object" src="/icons/up-arrow-purple.svg" alt="up arrow" />
            Object (max): {((proposalData as Proposal)).global.maxReject}%
          </span>
        </div>
      )}
    </div>
  )
}
