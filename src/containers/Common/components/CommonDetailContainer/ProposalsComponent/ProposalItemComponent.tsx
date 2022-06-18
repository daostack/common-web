import React from "react";
import classNames from "classnames";

import { UserAvatar, ElementDropdown } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
import { CommonMember, Proposal, ProposalLink } from "@/shared/models";
import { formatPrice, getUserName, getDaysAgo } from "@/shared/utils";
import { DynamicLinkType, ScreenSize } from "@/shared/constants";
import { VotesComponent } from "../VotesComponent";
import ProposalState from "../ProposalState/ProposalState";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { getScreenSize } from "@/shared/store/selectors";
import { FundsAllocationArgs } from "@/shared/models/governance/proposals";
import {MODERATION_TYPES} from "@/containers/Common/interfaces";


interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
  commonMember: CommonMember | null;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
  commonMember,
}: ProposalItemComponentProps) {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const imagePreviewLength = isMobileView ? 1 : 2;
  const {
    ref: descriptionRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  } = useFullText();
  const date = new Date();
  const rawRequestedAmount = (proposal.data.args as FundsAllocationArgs)
    ?.amount;
  const images = proposal.data.args.images ?? [];

  const imagesChunk = images.filter((image, index) => {
    if (index < imagePreviewLength) {
      return image;
    }
    return false;
  });

  return (
    <div className="discussion-item-wrapper">
      <ProposalState proposal={proposal} />
      <div className="proposal-charts-wrapper">
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
            <div className="days-ago">
              {getDaysAgo(date, proposal.createdAt)}
            </div>
          </div>
        </div>
        <div
          className="proposal-title"
          onClick={() => loadProposalDetail(proposal)}
          title={proposal.data.args.title}
        >
          {proposal.data.args.title}
        </div>
        <ElementDropdown
          linkType={DynamicLinkType.Proposal}
          elem={proposal}
          elemType={MODERATION_TYPES.proposals}
          className="dropdown-menu"
          transparent
          commonMember={commonMember}
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
          <VotesComponent proposal={proposal} commonMember={commonMember} />
        </div>
      </div>
      <div className="line" />

      <div className="discussion-content">
        <div className="proposal-pitch-title">Proposal Pitch</div>
        <div
          className={classNames("description", { full: shouldShowFullText })}
          ref={descriptionRef}
        >
          {proposal.data.args.description}
        </div>
        <div className="additional-information">
          {proposal.data.args.links.length > 0 && (
            <div className="links">
              {proposal.data.args.links.map((link) => (
                <a
                  href={link.value}
                  key={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
          {proposal.data.args.images?.length > 0 && (
            <div className="images-wrapper">
              {imagePreviewLength < images.length ? (
                <Swiper
                  spaceBetween={30}
                  pagination
                  navigation
                  slidesPerView={imagePreviewLength}
                >
                  {images.map((imageURL: ProposalLink, index) => (
                    <SwiperSlide key={imageURL.value} className="image-item">
                      <img src={imageURL.value} alt={imageURL.title} />
                      <div className="image-title">{imageURL.title}</div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="images-list">
                  {imagesChunk.map((i) => (
                    <div className="image-item" key={i.value}>
                      <img src={i.value} alt={i.title} />
                      <div className="image-title">{i.title}</div>
                    </div>
                  ))}
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
