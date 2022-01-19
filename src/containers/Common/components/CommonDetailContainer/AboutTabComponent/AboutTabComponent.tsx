import React from "react";

import { Linkify, Share } from "../../../../../shared/components";
import { BASE_URL, Colors, ROUTE_PATHS, ScreenSize } from "../../../../../shared/constants";
import { Common } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";

interface AboutTabComponentProps {
  common: Common;
  screenSize: string;
  onOpenJoinModal: () => void;
  isCommonMember?: boolean;
  isJoiningPending: boolean;
}

export default function AboutTabComponent({
  common,
  screenSize,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: AboutTabComponentProps) {
  const shouldShowJoinToCommonButton = screenSize === ScreenSize.Desktop && !isCommonMember;
  const renderContributionType = (type: string) => {
    return <b>{type}</b>;
  };
  return (
    <div className="about-name-wrapper">
      <div className="description">
        <Linkify>{common.metadata.description}</Linkify>
      </div>
      {common?.links?.length > 0 && (
        <div className="links">
          <div className="title">Links</div>
          {common.links.map((link) => (
            <a href={link.value} key={link.title} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          ))}
        </div>
      )}
      <div className="line"></div>
      <div className="join-wrapper">
        <div className="title">Join this Common</div>
        <div className="contribution">
          Minimum contribution for new members:
          <br />
          {formatPrice(common.metadata.minFeeToJoin) + " "}
          {renderContributionType(common.metadata.contributionType || "")} contribution
        </div>
        {shouldShowJoinToCommonButton && (
          <div className="social-wrapper">
            <button className={`button-blue`} onClick={onOpenJoinModal} disabled={isJoiningPending}>
              {isJoiningPending ? "Pending approval" : "Join the effort"}
            </button>
            <Share url={`${BASE_URL}${ROUTE_PATHS.COMMON_LIST}/${common.id}`} type="popup" color={Colors.lightPurple} />
          </div>
        )}
      </div>
    </div>
  );
}
