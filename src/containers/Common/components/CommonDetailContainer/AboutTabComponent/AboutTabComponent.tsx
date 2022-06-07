import React from "react";
import { CommonShare, Linkify } from "@/shared/components";
import { Colors, ScreenSize, ShareViewType } from "@/shared/constants";
import { Common } from "@/shared/models";
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
  const shouldShowJoinToCommonButton = screenSize === ScreenSize.Desktop && !isCommonMember && !isJoiningPending;
  return (
    <div className="about-name-wrapper">
      <div className="description">
        <Linkify>{common.description}</Linkify>
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
        {shouldShowJoinToCommonButton && (
          <div className="social-wrapper">
            <button className={`button-blue`} onClick={onOpenJoinModal}>
              Join the effort
            </button>
            <CommonShare
              common={common}
              type={ShareViewType.Popup}
              color={Colors.lightPurple}
            />
          </div>
        )}
      </div>
    </div>
  );
}
