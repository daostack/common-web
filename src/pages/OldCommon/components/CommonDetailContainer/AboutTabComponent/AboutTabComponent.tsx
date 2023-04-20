import React, { useMemo } from "react";
import classNames from "classnames";
import { CommonShare } from "@/shared/components";
import { Colors, ScreenSize, ShareViewType } from "@/shared/constants";
import { useFullText } from "@/shared/hooks";
import { Common, UnstructuredRules } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  TextEditor,
} from "@/shared/ui-kit";
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
  const {
    setRef: setDescriptionRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText<HTMLElement>();
  const parsedDescription = useMemo(
    () => parseStringToTextEditorValue(common.description),
    [common.description],
  );
  const isSubCommon = Boolean(common?.directParent);
  const isDescriptionEmpty = checkIsTextEditorValueEmpty(parsedDescription);
  const shouldDisplaySeeMoreButton =
    (shouldShowFullText || !isFullTextShowing) && !isDescriptionEmpty;
  const shouldShowJoinToCommonButton =
    screenSize === ScreenSize.Desktop &&
    !isCommonMember &&
    !isJoiningPending &&
    !isSubCommon;

  return (
    <div className="about-name-wrapper">
      <TextEditor
        editorRef={setDescriptionRef}
        editorClassName={classNames("about-name-wrapper__description", {
          "about-name-wrapper__description--shortened": !shouldShowFullText,
        })}
        value={parsedDescription}
        readOnly
      />
      {shouldDisplaySeeMoreButton && (
        <a className="about-name-wrapper__see-more" onClick={toggleFullText}>
          See {shouldShowFullText ? "less <" : "more >"}
        </a>
      )}
      <CommonWhitepaper common={common} isSubCommon={isSubCommon} />
      <Rules rules={unstructuredRules} isSubCommon={isSubCommon} />
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
