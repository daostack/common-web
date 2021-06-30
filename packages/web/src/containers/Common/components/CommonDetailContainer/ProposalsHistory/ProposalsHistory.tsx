import React from "react";
import { Common, Proposal } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";

interface ProposalsHistoryProps {
  proposals: Proposal[];
  common: Common;
}

export default function ProposalsHistory({ proposals, common }: ProposalsHistoryProps) {
  const rejected = proposals.filter((p) => p.state === "failed").length;
  const approved = proposals.filter((p) => p.state !== "failed").length;
  return (
    <div className="proposals-history-wrapper">
      <div className="history-header">
        <div className="title">Proposals History</div>
      </div>
      <div className="history-content">
        <div className="block-item">
          <div className="value">{approved}</div>
          <div className="title">Approved</div>
        </div>
        <div className="block-item">
          <div className="value">{rejected}</div>
          <div className="title">Rejected</div>
        </div>
        <div className="block-item">
          <div className="value">{formatPrice(common.raised - common.balance)}</div>
          <div className="title">Spent</div>
        </div>
      </div>
    </div>
  );
}
