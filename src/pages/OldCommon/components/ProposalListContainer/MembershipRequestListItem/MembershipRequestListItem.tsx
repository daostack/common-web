import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Separator } from "@/shared/components";
import { Common, ProposalListItem } from "@/shared/models";
import { getDaysAgo } from "@/shared/utils";
import { fetchCommonDetail } from "../../../store/api";
import { VotesComponent, ProposalState } from "../../CommonDetailContainer";
import "./index.scss";

const MembershipRequestListItem: FC<ProposalListItem> = ({
  proposal,
  loadProposalDetails,
}: ProposalListItem) => {
  const dispatch = useDispatch();
  const [common, setCommon] = useState<Common | null>(null);

  useEffect(() => {
    (async () => {
      if (!proposal) return;

      const proposalCommon = await fetchCommonDetail(
        proposal.data.args.commonId,
      );

      setCommon(proposalCommon);
    })();
  }, [dispatch, proposal]);

  return (
    <>
      {!common ? null : (
        <div className="membership-request-item">
          <ProposalState
            proposal={proposal}
            hideCounter
            className="membership-request-item__header"
          />
          <div className="membership-request-item__content-wrapper">
            <div className="membership-request-item__info">
              <div className="membership-request-item__common-info">
                <img
                  className="common-icon"
                  src="/assets/images/common-sign.svg"
                  alt="Commons icon"
                />
                <div className="common-title">{common?.name}</div>
              </div>
              <div className="membership-request-item__info-join">
                <div className="days-ago">
                  {getDaysAgo(new Date(), proposal.createdAt, {
                    withExactTime: true,
                  })}
                </div>
              </div>
            </div>
            <div className="membership-request-item__voting">
              <VotesComponent proposal={proposal} compactCard />
            </div>
          </div>
          <Separator className="membership-request-item__separator" />
          <div className="membership-request-item__footer">
            <div className="membership-request-item__footer-wrapper">
              <div className="membership-request-item__footer-discussions">
                <img src="/icons/discussions.svg" alt="discussions" />
                <div className="count">
                  {proposal.discussion?.messageCount || 0}
                </div>
              </div>
              <div
                className="membership-request-item__footer-viewall"
                onClick={() => loadProposalDetails(proposal)}
              >
                <div>View request</div>
                <img src="/icons/right-arrow-hover.svg" alt="right-arrow" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MembershipRequestListItem;
