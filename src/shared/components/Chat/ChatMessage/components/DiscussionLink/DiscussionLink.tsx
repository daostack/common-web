import React, { FC } from "react";
import classNames from "classnames";
import styles from "../../ChatMessage.module.scss";
import { InternalLinkData, parseMessageLink } from "@/shared/utils";

interface DiscussionLinkProps {
  link: string;
  title: string;
  mentionTextClassName?: string;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

export const DiscussionLink: FC<DiscussionLinkProps> = (props) => {
  const {  title, link, mentionTextClassName, onInternalLinkClick } =
    props;


  const handleInternalLinkClick = () => {
    if (onInternalLinkClick && link) {
      const data = parseMessageLink(link);
      data && onInternalLinkClick(data);
    }
  };

  return (
    <>
      <span
        className={classNames(styles.mentionText, mentionTextClassName)}
        onClick={handleInternalLinkClick}
      >
        @{title}
      </span>
    </>
  );
};

