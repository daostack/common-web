import React from "react";
import { useState } from "react";
import classNames from "classnames";
import { Proposals } from "@/shared/models/governance/proposals";
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
          PROPOSAL DATA INFO
        </div>
      )}
    </div>
  )
}
