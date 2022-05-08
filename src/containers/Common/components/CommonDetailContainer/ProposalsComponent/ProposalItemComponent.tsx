import React from "react";
import classNames from "classnames";

import { UserAvatar, ElementDropdown } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
import { Proposal, CurrencySymbol, } from "@/shared/models";
import { formatPrice, getUserName, getDaysAgo } from "@/shared/utils";
import { DynamicLinkType } from "@/shared/constants";
import { VotesComponent } from "../VotesComponent";
import ProposalState from "../ProposalState/ProposalState";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
  isCommonMember: boolean;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
  isCommonMember,
}: ProposalItemComponentProps) {
  const {
    ref: descriptionRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  } = useFullText();
  const date = new Date();
  const rawRequestedAmount = proposal.fundingRequest?.amount || proposal.join?.funding;
  //required custom fix since the using currency was changed - CW-411
  const fundingAmountPrefix = (
    (proposal?.createdAt || proposal?.createTime)?.toDate() < new Date("02/17/2022 12:00")
  ) && CurrencySymbol.USD;

  return (
    <div className="discussion-item-wrapper">
      <ProposalState proposal={proposal} />
      <div className="proposal-charts-wrapper">
        <div
          className="proposal-title"
          onClick={() => loadProposalDetail(proposal)}
          title={proposal.description.title}
        >
          {proposal.description.title}
        </div>
        <ElementDropdown
          linkType={DynamicLinkType.Proposal}
          elem={proposal}
          className="dropdown-menu"
          transparent
        />
        <div className="requested-amount">
          {!rawRequestedAmount ? (
            "No funding requested"
          ) : (
            <>
                Requested amount <span className="amount">
                  {
                    formatPrice(
                      rawRequestedAmount,
                      {
                        ...(
                          fundingAmountPrefix && {
                            prefix: fundingAmountPrefix
                          }
                        )
                      }
                    )
                  }
                </span>
            </>
          )}
        </div>
        <div className="votes">
          <VotesComponent proposal={proposal} isCommonMember={isCommonMember} />
        </div>
      </div>
      <div className="line" />
      <div className="discussion-top-bar">
        <div className="img-wrapper">
          <UserAvatar
            photoURL={proposal.proposer?.photoURL}
            nameForRandomAvatar={proposal.proposer?.email}
            userName={getUserName(proposal.proposer)}
          />
        </div>
        <div className="creator-information">
          <div className="name">{getUserName(proposal.proposer)}</div>
          <div className="days-ago">{getDaysAgo(date, proposal.createdAt)}</div>
        </div>
      </div>
      <div className="discussion-content">
        <div
          className={classNames("description", { full: shouldShowFullText })}
          ref={descriptionRef}
        >
          {proposal.description.description}
        </div>
        {!isFullTextShowing ? (
          <div className="read-more" onClick={showFullText}>
            Read More
          </div>
        ) : null}
        <div className="line"></div>
      </div>
      <div className="bottom-content">
        <div className="discussion-count">
          <img src="/icons/discussions.svg" alt="discussions" />
          <div className="count">{proposal.discussionMessage?.length || 0}</div>
        </div>
        {proposal && (
          <div
            className="view-all-discussions"
            onClick={() => loadProposalDetail(proposal)}
          >
            View proposal
          </div>
        )}
      </div>
    </div>
  );
}
