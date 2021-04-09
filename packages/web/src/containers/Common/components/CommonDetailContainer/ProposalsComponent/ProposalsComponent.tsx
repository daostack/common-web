import React from "react";
import { Proposal } from "../../../../../shared/models";
import { getDaysAgo, getUserName } from "../../../../../shared/utils";

interface DiscussionsComponentProps {
  proposals: Proposal[];
  loadProposalDetail: Function;
}

export default function ProposalsComponent({ proposals, loadProposalDetail }: DiscussionsComponentProps) {
  const date = new Date();
  return (
    <div className="discussions-component-wrapper">
      {proposals.map((d) => (
        <div className="discussion-item-wrapper" key={d.id}>
          <div className="discussion-top-bar">
            <div className="img-wrapper">
              <img src={d.proposer?.photoURL} alt={getUserName(d.proposer)} />
            </div>
            <div className="creator-information">
              <div className="name">{getUserName(d.proposer)}</div>
              <div className="days-ago">{getDaysAgo(date, d.createdAt)} </div>
            </div>
          </div>
          <div className="discussion-content">
            <div className="title">{d.description.title}</div>
            <div className="description">{d.description.description}</div>
            {/* <div className="read-more">Read More</div> */}
            <div className="line"></div>
          </div>
          <div className="bottom-content">
            <div className="discussion-count">
              <img src="/icons/discussions.svg" alt="discussions" />
              <div className="count">{d.discussionMessage?.length || 0}</div>
            </div>
            {(d?.discussionMessage?.length || 0) > 0 && (
              <div className="view-all-discussions" onClick={() => loadProposalDetail(d)}>
                View proposals
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
