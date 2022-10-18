import React, { useState } from "react";
import classNames from "classnames";
import { CommonShare, Linkify } from "@/shared/components";
import { Colors, ScreenSize, ShareViewType } from "@/shared/constants";
import { Common, UnstructuredRules } from "@/shared/models";
import { isRTL } from "@/shared/utils";
import { CommonWhitepaper } from "../CommonWhitepaper";
import { Rules } from "./Rules";
import "./index.scss";

interface AboutTabComponentProps {
  common: Common;
  unstructuredRules: UnstructuredRules;
  screenSize: string;
  onOpenJoinModal: () => void;
  isCommonMember?: boolean;
  isJoiningPending: boolean;
}

export default function AboutTabComponent({
  common,
  unstructuredRules,
  screenSize,
  onOpenJoinModal,
  isCommonMember,
  isJoiningPending,
}: AboutTabComponentProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const isSubCommon = Boolean(common?.directParent);
  const shouldShowJoinToCommonButton =
    screenSize === ScreenSize.Desktop &&
    !isCommonMember &&
    !isJoiningPending &&
    !isSubCommon;
  const descriptionParts = common.description.split("\n");
  const filteredDescriptionParts = isDescriptionExpanded
    ? descriptionParts
    : [(descriptionParts[0] || "").substring(0, 200)];
  const shouldAllowSeeMoreDescription =
    common.description !== filteredDescriptionParts[0];

  const toggleDescription = () => {
    setIsDescriptionExpanded((isExpanded) => !isExpanded);
  };

  return (
    <div className="about-name-wrapper">
      <div className="description">
        {filteredDescriptionParts.map((text, index) =>
          text ? (
            <p
              className={classNames("about-name-wrapper__description-part", {
                "about-name-wrapper__description-part--rtl": isRTL(text),
              })}
              key={index}
            >
              <Linkify>{text}</Linkify>
            </p>
          ) : (
            <br key={index} />
          )
        )}
      </div>
      {shouldAllowSeeMoreDescription && (
        <a className="about-name-wrapper__see-more" onClick={toggleDescription}>
          See {isDescriptionExpanded ? "less <" : "more >"}
        </a>
      )}
      <CommonWhitepaper common={common} />
      <Rules rules={unstructuredRules} />
      {common?.links?.length > 0 && (
        <div className="links">
          <div className="title">Links</div>
          {common.links.map((link) => (
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
