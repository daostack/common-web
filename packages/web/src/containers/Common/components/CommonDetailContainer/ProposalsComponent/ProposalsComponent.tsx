import React from "react";
import { Proposal } from "../../../../../shared/models";
import { formatPrice, getDaysAgo, getUserName } from "../../../../../shared/utils";
import { EmptyTabComponent } from "../EmptyTabContent";
import { ProposalCountDown } from "../ProposalCountDown";
import { VotesComponent } from "../VotesComponent";
import "./index.scss";
interface DiscussionsComponentProps {
  proposals: Proposal[];
  loadProposalDetail: Function;
  currentTab: string;
}

export default function ProposalsComponent({ proposals, loadProposalDetail, currentTab }: DiscussionsComponentProps) {
  const date = new Date();
  return (
    <div className="proposals-component-wrapper">
      {proposals.length > 0 ? (
        <>
          {proposals.map((d) => (
            <div className="discussion-item-wrapper" key={d.id}>
              {d.state === "countdown" ? (
                <ProposalCountDown date={new Date((d?.createdAt.seconds + d.countdownPeriod) * 1000)} />
              ) : (
                <div className={`state-wrapper ${d.state}`}>
                  <div className="state-inner-wrapper">
                    <img
                      src={d.state === "failed" ? "/icons/declined.svg" : "/icons/approved.svg"}
                      alt="state-wrapper"
                    />
                    <span className="state-name">{d.state === "failed" ? "Rejected" : "Approved"}</span>
                  </div>
                </div>
              )}
              <div className="proposal-charts-wrapper">
                <div className="proposal-title" onClick={() => loadProposalDetail(d)}>
                  {d.description.title}
                </div>
                <div className="requested-amount">
                  Requested amount
                  <div className="amount">{formatPrice(d.fundingRequest?.amount || d.join?.funding)}</div>
                </div>
                <div className="votes">
                  <VotesComponent proposal={d} />
                </div>
                <div className="line"></div>
              </div>
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
                <div className="description">{d.description.description}</div>
                <div className="read-more" onClick={() => loadProposalDetail(d)}>
                  Read More
                </div>
                <div className="line"></div>
              </div>
              <div className="bottom-content">
                <div className="discussion-count">
                  <img src="/icons/discussions.svg" alt="discussions" />
                  <div className="count">{d.discussionMessage?.length || 0}</div>
                </div>
                {(d?.discussionMessage?.length || 0) > 0 && (
                  <div className="view-all-discussions" onClick={() => loadProposalDetail(d)}>
                    View proposal
                  </div>
                )}
              </div>
            </div>
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
