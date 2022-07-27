import React, { useState } from "react";
import { CommonShare, Linkify } from "@/shared/components";
import { Colors, ScreenSize, ShareViewType } from "@/shared/constants";
import { Common } from "@/shared/models";
import { CommonWhitepaper } from "../CommonWhitepaper";
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
  const [expanded] = useState(false);
  return (
    <div className="about-name-wrapper">
      <div className="description">
        <Linkify>{expanded ? common.description : common.description.substring(0, 200)}</Linkify>
      </div>
      <CommonWhitepaper />
      {common?.links?.length > 0 && expanded && (
        <div className="links">
          <div className="title">Links</div>
          {common.links.map((link) => (
            <a href={link.value} key={link.title} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          ))}
        </div>
      )}

      {shouldShowJoinToCommonButton && (
        <>
          <div className="line"></div>
          <div className="join-wrapper">
            <div className="title">Join this Common</div>
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
          </div>
        </>
      )}
    </div>
  );
}
