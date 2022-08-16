import React from "react";
import { useState } from "react";
import classNames from "classnames";
import { Proposals } from "@/shared/models/governance/proposals";
import { Proposal } from "@/shared/models";
import { ProposalsTypes } from "@/shared/constants";
import { calculateVoters } from "../../../../utils";
import { getTextForProposalType } from "./helpers";
import "./index.scss";

interface IProps {
  proposalType: string;
  proposalData: Partial<Proposals>;
  circles: string[] | undefined;
}

// TODO: temporary until we have a better way to handle this
const CIRCLE_PROPOSAL_TYPES = [ProposalsTypes.ASSIGN_CIRCLE, ProposalsTypes.REMOVE_CIRCLE];

export default function WhitepaperProposalCard({ circles, proposalType, proposalData }: IProps) {
  const [toggle, setToggle] = useState(false);

  // TODO: for now we take the first index for "CIRCLE" proposal. Need to check this.
  const data = !CIRCLE_PROPOSAL_TYPES.includes(proposalType as ProposalsTypes)
    ? (proposalData as Proposal)
    : (proposalData[1] as Proposal);

  const voters = calculateVoters(circles, data.global.weights)?.map((voter, index) => {
    return <span className="whitepaper-proposal-card__voter" key={index}>{voter}</span>
  });

  return (
    <div className="whitepaper-proposal-card-wrapper">
      <div className="whitepaper-proposal-card__top-wrapper" onClick={() => setToggle(!toggle)}>
        <div>{getTextForProposalType(proposalType as ProposalsTypes)}</div>
        <img src="/icons/up-arrow.svg" className={classNames("collapsed", { "expanded": toggle })} alt="arrow" />
      </div>
      {toggle && (
        <div className="whitepaper-proposal-card__content">
          <div className="whitepaper-proposal-card__content-sub-title">Duration:</div>
          <div className="whitepaper-proposal-card__content-duration-wrapper">
            <span>
              <b>{data.global.discussionDuration} hrs</b>
              <br />
              Discussion
            </span>
            <span className="whitepaper-proposal-card__voting">
              <b>{data.global.votingDuration} hrs</b>
              <br />
              Voting
            </span>
          </div>
          <div className="whitepaper-proposal-card__content-sub-title">Voting Model:</div>
          <span>Quorum: {data.global.quorum}%</span>
          <div className="whitepaper-proposal-card__voters-wrapper">
            <div className="whitepaper-proposal-card__content-sub-title">
              Voters:
            </div>
            {voters}
          </div>
          <span>
            <img className="arrow" src="/icons/down-arrow-light-purple.svg" alt="down arrow" />
            Support (min): {data.global.minApprove}%
            <img className="arrow object" src="/icons/up-arrow-purple.svg" alt="up arrow" />
            Object (max): {data.global.maxReject}%
          </span>
        </div>
      )}
    </div>
  )
}
