import React, { FC } from "react";

import { Proposal } from "@/shared/models";
import { UserAvatar, Separator } from "@/shared/components";
import { VotesComponent, ProposalCountDown } from "../../CommonDetailContainer";
import {
    getUserName,
    getDaysAgo,
    getProposalExpirationDate,
    formatPrice,
} from "@/shared/utils";
import "./index.scss";

interface ProposalListItemInterface {
  proposal: Proposal;
}

const ProposalListItem: FC<ProposalListItemInterface> = ({ proposal }: ProposalListItemInterface) => {

    return (
        <div className="proposal-item">
            <div className="proposal-item_header">
                <span>New</span>
            </div>
            <div className="proposal-item_content-wrapper">
                <div className="proposal-item_description">
                    <p>
                        {
                            proposal.title
                            || proposal.description.title
                            || proposal.description.description
                        }
                    </p>
                    <div className="proposal-item_vertical-menu" />
                </div>
                <div className="proposal-item_info">
                    <div className="proposal-item_info-proposer-wrapper">
                        <UserAvatar
                            photoURL={proposal.proposer?.photoURL}
                            nameForRandomAvatar={proposal.proposer?.email}
                            userName={getUserName(proposal.proposer)}
                        />
                        <div className="proposal-item_info-proposer">
                            <div className="user-fullname">{getUserName(proposal.proposer)}</div>
                            <div className="days-ago">{getDaysAgo(new Date(), proposal.createdAt || proposal.createTime)}</div>
                        </div>
                    </div>
                    <div className="proposal-item_info-amount-countdown">
                        <div className="amount">
                            {formatPrice(proposal.fundingRequest?.amount, { shouldRemovePrefixFromZero: false })}
                        </div>
                        <ProposalCountDown
                            date={getProposalExpirationDate(proposal)}
                            preview
                        />
                    </div>
                </div>
                <div className="proposal-item_voting">
                    <VotesComponent
                        proposal={proposal}
                        compactCard
                    />
                </div>
            </div>
            <Separator className="proposal-item_separator" />
            <div className="proposal-item_footer">
                <div className="proposal-item_footer-wrapper">
                    <div className="proposal-item_footer-discussions">
                        <img
                            src="/icons/discussions.svg"
                            alt="discussions"
                        />
                        <div className="count">{proposal.discussionMessage?.length || 0}</div>
                    </div>
                    <div
                        className="proposal-item_footer-viewall"
                        onClick={() => true}
                    >
                        <div>View proposal</div>
                        <img src="/icons/right-arrow.svg" alt="right-arrow" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalListItem;
