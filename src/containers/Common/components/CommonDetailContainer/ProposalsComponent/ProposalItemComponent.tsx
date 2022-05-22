import React, { useState } from "react";
import classNames from "classnames";

import { UserAvatar, ElementDropdown } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
import { Proposal, ProposalLink } from "@/shared/models";
import { formatPrice, getUserName, getDaysAgo } from "@/shared/utils";
import { DynamicLinkType } from "@/shared/constants";
import { VotesComponent } from "../VotesComponent";
import ProposalState from "../ProposalState/ProposalState";
import { Swiper, SwiperSlide } from "swiper/react";

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
  const rawRequestedAmount =
    proposal.fundingRequest?.amount || proposal.join?.funding;

  const [swipperState, setSwipperState] = useState(false);

  const images = proposal?.description.images ?? [];

  const imagesChunk = images.filter((image, index) => {
    if (index < 2) {
      return image;
    }
    return false;
  });

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
              Requested amount
              <span className="amount">{formatPrice(rawRequestedAmount)}</span>
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
        <div className="additional-information">
          {proposal.description?.links?.length > 0 && (
            <div className="links">
              {proposal.description.links.map((link) => (
                <a
                  href={link.value}
                  key={link.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
          {proposal.description?.images?.length > 0 && (
            <div className="images-wrapper">
              {swipperState ? (
                <Swiper spaceBetween={30} pagination navigation>
                  {images.map((imageURL: ProposalLink, index) => (
                    <SwiperSlide key={index} className="image-item">
                      <img src={imageURL.value} alt={imageURL.title} />
                      <div className="image-title">{imageURL.title}</div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="images-list">
                  {imagesChunk.map((i) => (
                    <div className="image-item">
                      <img src={i.value} alt={i.title} />
                      <div className="image-title">{i.title}</div>
                    </div>
                  ))}
                  {images.length > 2 && (
                    <div
                      className="pagination-item"
                      onClick={() => setSwipperState(true)}
                    >
                      +{images.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
