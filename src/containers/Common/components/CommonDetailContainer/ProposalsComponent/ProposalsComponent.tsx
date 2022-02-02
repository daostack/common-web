import React from "react";

import { Common, Proposal } from "../../../../../shared/models";
import { EmptyTabComponent } from "../EmptyTabContent";
import "./index.scss";
import ProposalItemComponent from "./ProposalItemComponent";
interface DiscussionsComponentProps {
  proposals: Proposal[];
  loadProposalDetail: (payload: Proposal) => void;
  currentTab: string;
  common: Common;
  isCommonMember: boolean;
  isJoiningPending: boolean;
  onAddNewProposal: () => void;
}

export default function ProposalsComponent({
  proposals,
  loadProposalDetail,
  currentTab,
  common,
  isCommonMember,
  isJoiningPending,
  onAddNewProposal,
}: DiscussionsComponentProps) {
  return (
    <>
      <div className="proposal-title-wrapper">
        <div className="title">Proposals</div>
        {isCommonMember && (
          <div className="add-button" onClick={onAddNewProposal}>
            Add New Proposal
          </div>
        )}
      </div>
      <div className="proposals-component-wrapper">
        {proposals.length > 0 ? (
          <>
            {proposals.map((p) => (
              <ProposalItemComponent
                key={p.id}
                proposal={p}
                loadProposalDetail={loadProposalDetail}
              />
            ))}
          </>
        ) : (
          <EmptyTabComponent
            common={common}
            currentTab={currentTab}
            message={
              currentTab === "proposals"
                ? "This is where members can propose actions or request funding by creating proposals."
                : "This is where you will find approved/rejected proposals."
            }
            title={
              currentTab === "proposals"
                ? "No proposals yet"
                : "No past activity"
            }
            isCommonMember={isCommonMember}
            isJoiningPending={isJoiningPending}
          />
        )}
      </div>
    </>
  );
}
