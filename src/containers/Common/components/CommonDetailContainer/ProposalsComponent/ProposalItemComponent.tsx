import React from "react";
import { UserAvatar, ElementDropdown } from "@/shared/components";
import { Proposal } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { DynamicLinkType, ScreenSize } from "@/shared/constants";
import ProposalState from "../ProposalState/ProposalState";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
}: ProposalItemComponentProps) {

  return (
    <div className="proposal-item-wrapper">
      <div className="proposal-item-header">
        <div
          onClick={() => loadProposalDetail(proposal)}
          className="proposal-title"
          title={proposal.data.args.title}
        >
          {proposal.data.args.title}
        </div>
        <ElementDropdown
          linkType={DynamicLinkType.Proposal}
          elem={proposal}
          transparent
        />
      </div>
      <div className="proposal-item-body">
        <div className="user-info-wrapper">
          <UserAvatar
            photoURL={proposal.proposer?.photoURL}
            nameForRandomAvatar={proposal.proposer?.email}
            userName={getUserName(proposal.proposer)}
          />
          <div className="name-and-proposal-state">
            <div className="user-name">{getUserName(proposal.proposer)}</div>
            <ProposalState proposal={proposal} />
          </div>
        </div>
        <div className="proposal-item-bottom">
          <div className="discussion-count-wrapper">
            <img src="/icons/discussions.svg" alt="discussions" />
            <div className="discussion-count">{proposal.discussionMessage?.length || 0}</div>
          </div>
        </div>
      </div>






      {/* <ProposalState proposal={proposal} />
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
      </div> */}
    </div>
  );
}
