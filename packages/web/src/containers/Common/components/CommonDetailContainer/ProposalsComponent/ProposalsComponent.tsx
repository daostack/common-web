import React from "react";
import { Proposal } from "../../../../../shared/models";
import { EmptyTabComponent } from "../EmptyTabContent";
import "./index.scss";
import ProposalItemComponent from "./ProposalItemComponent";
interface DiscussionsComponentProps {
  proposals: Proposal[];
  loadProposalDetail: Function;
  currentTab: string;
}

export default function ProposalsComponent({ proposals, loadProposalDetail, currentTab }: DiscussionsComponentProps) {
  return (
    <div className="proposals-component-wrapper">
      {proposals.length > 0 ? (
        <>
          {proposals.map((p) => (
            <ProposalItemComponent key={p.id} proposal={p} loadProposalDetail={loadProposalDetail} />
          ))}
        </>
      ) : (
        <EmptyTabComponent
          currentTab={currentTab}
          message={
            currentTab === "proposals"
              ? "This is where members can propose actions or request funding by creating proposals."
              : "This is where you will find approved/rejected proposals."
          }
          title={currentTab === "proposals" ? "No proposals yet" : "No past activity"}
        />
      )}
    </div>
  );
}
