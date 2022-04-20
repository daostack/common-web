import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
    Proposal,
    Common,
    CommonContributionType,
} from "@/shared/models";
import { Separator } from "@/shared/components";
import { fetchCommonDetail } from "../../../../Common/store/api";
import {
    VotesComponent,
    ProposalState,
} from "../../CommonDetailContainer";
import {
    getDaysAgo,
    formatPrice,

} from "@/shared/utils";
import "./index.scss";

interface ProposalListItemInterface {
    proposal: Proposal;
    loadProposalDetails: (payload: Proposal) => void;
}

const MembershipRequestListItem: FC<ProposalListItemInterface> = (
    {
        proposal,
        loadProposalDetails
    }: ProposalListItemInterface
) => {
    const dispatch = useDispatch();
    const [common, setCommon] = useState<Common | null>(null);

    useEffect(() => {
        (async () => {
            if (!proposal) return;

            const proposalCommon = await fetchCommonDetail(proposal.commonId);

            setCommon(proposalCommon);
        })();
    }, [dispatch, proposal]);

    return (
        <>
            {
                !common
                ? null
                : <div className="membership-request-item">
                    <ProposalState
                        proposal={proposal}
                        hideCounter
                        className="membership-request-item_header"
                    />
                    <div className="membership-request-item_content-wrapper">
                        <div className="membership-request-item_info">
                            <div className="membership-request-item_common-info">
                                <img
                                    className="common-icon"
                                    src="/assets/images/common-sign.svg"
                                    alt="Commons icon"
                                />
                                <div className="common-title">
                                    {common?.name}
                                </div>
                            </div>
                            <div className="membership-request-item_info-join">
                                <div className="amount">
                                        {
                                            formatPrice(proposal.join?.funding,
                                                {
                                                    shouldRemovePrefixFromZero: false,
                                                    bySubscription: proposal.join?.fundingType === CommonContributionType.Monthly
                                                }
                                            )
                                        }
                                </div>
                                <div className="days-ago">
                                    {
                                        getDaysAgo(
                                            new Date(),
                                            proposal.createdAt || proposal.createTime,
                                            { withExactTime: true },
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="membership-request-item_voting">
                            <VotesComponent
                                proposal={proposal}
                                compactCard
                            />
                        </div>
                    </div>
                    <Separator className="membership-request-item_separator" />
                    <div className="membership-request-item_footer">
                        <div className="membership-request-item_footer-wrapper">
                            <div className="membership-request-item_footer-discussions">
                                <img
                                    src="/icons/discussions.svg"
                                    alt="discussions"
                                />
                                <div className="count">{proposal.discussionMessage?.length || 0}</div>
                            </div>
                            <div
                                className="membership-request-item_footer-viewall"
                                onClick={() => loadProposalDetails(proposal)}
                            >
                                <div>View request</div>
                                <img
                                    src="/icons/right-arrow-hover.svg"
                                    alt="right-arrow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MembershipRequestListItem;
