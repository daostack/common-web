import React, { FC } from "react";
import classNames from "classnames";
import { parseMessageLink } from "@/shared/components/Chat/ChatMessage/components/ChatMessageLinkify/utils";
import useInternalLink from "@/shared/hooks/useInternalLink";
import { LinkElement } from "../../../../types";
import { ElementAttributes } from "../../types";
import { InlineChromiumBugfix } from "../InlineChromiumBugfix";
import styles from "./Link.module.scss";

interface LinkProps {
  attributes: ElementAttributes;
  element: LinkElement;
}

const Link: FC<LinkProps> = (props) => {
  const { attributes, element, children } = props;
  const { onInternalLinkClick } = useInternalLink();
  const internalLink = parseMessageLink(element.url);

  if (internalLink) {
    return (
      <a
        {...attributes}
        className={classNames(styles.link, attributes.className)}
        onClick={() => onInternalLinkClick(internalLink)}
      >
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </a>
    );
  }

  return (
    <a
      {...attributes}
      className={classNames(styles.link, attributes.className)}
      href={element.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

export default Link;
