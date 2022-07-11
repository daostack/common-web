import React from "react";
import { Tabs } from "@/containers/Common/containers/CommonDetailContainer/CommonDetailContainer";
import { Common, CommonMember, Governance, Proposal } from "@/shared/models";
import { EmptyTabComponent } from "../EmptyTabContent";
import "./index.scss";
import ProposalItemComponent from "./ProposalItemComponent";

interface DiscussionsComponentProps {
  proposals: Proposal[];
  loadProposalDetail: (payload: Proposal) => void;
  currentTab: Tabs;
  common: Common;
  governance: Governance;
  commonMember: CommonMember | null;
  isCommonMemberFetched: boolean;
  isJoiningPending: boolean;
  onAddNewProposal: () => void;
}

export default function ProposalsComponent({
  proposals,
  loadProposalDetail,
  currentTab,
  common,
  governance,
  commonMember,
  isCommonMemberFetched,
  isJoiningPending,
  onAddNewProposal,
}: DiscussionsComponentProps) {
  return (
    <>
      <div className="proposal-title-wrapper">
        <div className="title">Proposals</div>
        {commonMember && currentTab === Tabs.Proposals && (
          <div className="add-button" onClick={onAddNewProposal}>
            <img src="/icons/add-proposal.svg" alt="add-proposal" />
            <span>Add New Proposal</span>
          </div>
        )}
      </div>
      <div className="proposals-component-wrapper">
        {proposals.length > 0 ? (
          <>
            {proposals.map((proposal) => (
              <ProposalItemComponent
                key={proposal.id}
                proposal={proposal}
                loadProposalDetail={loadProposalDetail}
              />
            ))}
          </>
        ) : (
          <EmptyTabComponent
            common={common}
            governance={governance}
            currentTab={currentTab}
            message={
              currentTab === Tabs.Proposals
                ? "This is where members can propose actions or request funding by creating proposals."
                : "This is where you will find approved/rejected proposals."
            }
            title={
              currentTab === Tabs.Proposals
                ? "No proposals yet"
                : "No past activity"
            }
            isCommonMember={Boolean(commonMember)}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
          />
        )}
      </div>
    </>
  );
}
