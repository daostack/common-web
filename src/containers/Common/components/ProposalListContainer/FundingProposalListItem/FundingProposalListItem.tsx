import React, { FC } from "react";

import {
  ProposalListItem,
  ProposalState as ProposalStateTypes
} from "@/shared/models";
import { isFundsAllocationProposal } from "@/shared/models/governance/proposals";
import {
  UserAvatar,
  Separator,
  ElementDropdown,
} from "@/shared/components";
import { DynamicLinkType } from "@/shared/constants";
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
import {MODERATION_TYPES} from "@/containers/Common/interfaces";

const FundingProposalListItem: FC<ProposalListItem> = (
  {
      proposal,
      loadProposalDetails,
      commonMember,
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
            proposal.data.args.title
            || proposal.data.args.description
          }
        </p>
        <ElementDropdown
          linkType={DynamicLinkType.Proposal}
          elem={proposal}
          elemType={MODERATION_TYPES.proposals}
          className="dropdown-menu"
          transparent
          commonMember={commonMember}
        />
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
            <div className="days-ago">{getDaysAgo(new Date(), proposal.createdAt)}</div>
          </div>
        </div>
        <div className="proposal-item__info-amount-countdown">
          <div className="amount">
            {formatPrice(
              isFundsAllocationProposal(proposal)
                ? proposal.data.args.amount
                : 0,
              { shouldRemovePrefixFromZero: false }
            )}
          </div>
          {
            (proposal.state === ProposalStateTypes.VOTING)
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
