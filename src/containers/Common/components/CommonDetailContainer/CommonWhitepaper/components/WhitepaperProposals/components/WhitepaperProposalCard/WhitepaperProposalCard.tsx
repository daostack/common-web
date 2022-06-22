import React from "react";
import { useState } from "react";
import classNames from "classnames";
import { Proposals } from "@/shared/models/governance/proposals";
import { Proposal } from "@/shared/models";
import { formatCamelSnakeCase } from "../../../../utils";
import "./index.scss";

interface IProps {
  proposalType: string;
  proposalData: Partial<Proposals>;
}

export default function WhitepaperProposalCard({ proposalType, proposalData }: IProps) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="whitepaper-proposal-card-wrapper">
      <div className="whitepaper-proposal-card__top-wrapper" onClick={() => setToggle(!toggle)}>
        <div>{formatCamelSnakeCase(proposalType)}</div>
        <img src="/icons/up-arrow.svg" className={classNames("collapsed", { "expanded": toggle })} alt="arrow" />
      </div>
      {toggle && (
        <div className="whitepaper-proposal-card__content">
          <div className="whitepaper-proposal-card__content-sub-title">Duration:</div>
          <span>{(proposalData as Proposal).global.quorum} hrs</span>
          <div className="whitepaper-proposal-card__content-sub-title">Voting Model:</div>
          <span>Quorum: {(proposalData as Proposal).global.quorum}%</span>
          <div className="whitepaper-proposal-card__content-sub-title">Voters:</div>

          <span>Support (min): {(proposalData as Proposal).global.minApprove}%&nbsp;&nbsp;Object (max): {(proposalData as Proposal).global.maxReject}%</span>
        </div>
      )}
    </div>
  )
}
