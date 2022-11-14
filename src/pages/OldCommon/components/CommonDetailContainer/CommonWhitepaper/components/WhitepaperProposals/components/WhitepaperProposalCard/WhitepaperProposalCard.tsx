import React from "react";
import { useState } from "react";
import classNames from "classnames";
import { ProposalsTypes } from "@/shared/constants";
import { Circles, Proposal } from "@/shared/models";
import { Proposals } from "@/shared/models/governance/proposals";
import { getTextForProposalType } from "@/shared/utils";
import { calculateVoters } from "../../../../utils";
import "./index.scss";

interface IProps {
  proposalType: string;
  proposalData: Partial<Proposals>;
  circles?: Circles;
  isSubCommon: boolean;
}

// TODO: temporary until we have a better way to handle this
const CIRCLE_PROPOSAL_TYPES = [
  ProposalsTypes.ASSIGN_CIRCLE,
  ProposalsTypes.REMOVE_CIRCLE,
];

export default function WhitepaperProposalCard({
  circles,
  proposalType,
  proposalData,
  isSubCommon,
}: IProps) {
  const [toggle, setToggle] = useState(false);

  // TODO: for now we take the first index for "CIRCLE" proposal. Need to check this.
  const data = !CIRCLE_PROPOSAL_TYPES.includes(proposalType as ProposalsTypes)
    ? (proposalData as Proposal)
    : (Object.values(proposalData)[0] as Proposal);

  const voters = calculateVoters(data.global.weights, circles)?.map(
    (voter, index) => {
      return (
        <span className="whitepaper-proposal-card__voter" key={index}>
          {voter}
        </span>
      );
    },
  );

  return (
    <div className="whitepaper-proposal-card-wrapper">
      <div
        className="whitepaper-proposal-card__top-wrapper"
        onClick={() => setToggle(!toggle)}
      >
        <div>
          {getTextForProposalType(proposalType as ProposalsTypes, isSubCommon)}
        </div>
        <img
          src="/icons/up-arrow.svg"
          className={classNames("collapsed", { expanded: toggle })}
          alt="arrow"
        />
      </div>
      {toggle && (
        <div className="whitepaper-proposal-card__content">
          <div className="whitepaper-proposal-card__content-sub-title">
            Duration:
          </div>
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
          <div className="whitepaper-proposal-card__content-sub-title">
            Voting Model:
          </div>
          <span>Quorum: {data.global.quorum}%</span>
          <div className="whitepaper-proposal-card__voters-wrapper">
            <div className="whitepaper-proposal-card__content-sub-title">
              Voters:
            </div>
            {voters}
          </div>
          <span>
            <img
              className="arrow"
              src="/icons/down-arrow-light-purple.svg"
              alt="down arrow"
            />
            Support (min): {data.global.minApprove}%
            <img
              className="arrow object"
              src="/icons/up-arrow-purple.svg"
              alt="up arrow"
            />
            Object (max): {data.global.maxReject}%
          </span>
        </div>
      )}
    </div>
  );
}
