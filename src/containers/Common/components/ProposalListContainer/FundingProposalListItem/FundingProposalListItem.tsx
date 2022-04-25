import React, { FC } from "react";

import {
  ProposalListItem,
  ProposalState as ProposalStateTypes
} from "@/shared/models";
import { UserAvatar, Separator } from "@/shared/components";
import {
    VotesComponent,
    ProposalCountDown,
    ProposalState,
} from "../../CommonDetailContainer";
import {
    getUserName,
    getDaysAgo,
    getProposalExpirationDate,
    formatPrice,
} from "@/shared/utils";
import "./index.scss";

const FundingProposalListItem: FC<ProposalListItem> = (
  {
      proposal,
      loadProposalDetails
  }: ProposalListItem
) => (
  <div className="proposal-item">
    <ProposalState
      proposal={proposal}
      hideCounter
      className="proposal-item__header"
    />
    <div className="proposal-item__content-wrapper">
      <div className="proposal-item__description">
        <p>
          {
            proposal.title
            || proposal.description.title
            || proposal.description.description
          }
        </p>
        {/* TODO: need to clarify what to action on clicking this dots-menu btn */}
        {/* <div className="proposal-item__vertical-menu" /> */}
      </div>
      <div className="proposal-item__info">
        <div className="proposal-item__info-proposer-wrapper">
          <UserAvatar
            photoURL={proposal.proposer?.photoURL}
            nameForRandomAvatar={proposal.proposer?.email}
            userName={getUserName(proposal.proposer)}
          />
          <div className="proposal-item__info-proposer">
            <div className="user-fullname">{getUserName(proposal.proposer)}</div>
            <div className="days-ago">{getDaysAgo(new Date(), proposal.createdAt || proposal.createTime)}</div>
          </div>
        </div>
        <div className="proposal-item__info-amount-countdown">
          <div className="amount">
            {formatPrice(proposal.fundingRequest?.amount, { shouldRemovePrefixFromZero: false })}
          </div>
          {
            (proposal.state === ProposalStateTypes.COUNTDOWN)
            && <ProposalCountDown
              date={getProposalExpirationDate(proposal)}
              preview
            />
          }
        </div>
      </div>
      <div className="proposal-item__voting">
        <VotesComponent
          proposal={proposal}
          compactCard
        />
      </div>
    </div>
    <Separator className="proposal-item__separator" />
    <div className="proposal-item__footer">
      <div className="proposal-item__footer-wrapper">
        <div className="proposal-item__footer-discussions">
          <img
            src="/icons/discussions.svg"
            alt="discussions"
          />
          <div className="count">{proposal.discussionMessage?.length || 0}</div>
        </div>
        <div
          className="proposal-item__footer-viewall"
          onClick={() => loadProposalDetails(proposal)}
        >
          <div>View proposal</div>
          <img
            src="/icons/right-arrow-hover.svg"
            alt="right-arrow"
          />
        </div>
      </div>
    </div>
  </div>
);

export default FundingProposalListItem;
