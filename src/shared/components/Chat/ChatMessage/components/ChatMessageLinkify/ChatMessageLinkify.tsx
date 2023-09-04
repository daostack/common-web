import React, { FC, useCallback } from "react";
import {
  default as ReactLinkify,
  Props as ReactLinkifyProps,
} from "react-linkify";
import classNames from "classnames";
import { parseMessageLink, ParseMessageLinkData } from "./utils";
import styles from "./ChatMessageLinkify.module.scss";

interface ChatMessageLinkifyProps {
  className?: string;
  onInternalLinkClick?: (data: ParseMessageLinkData) => void;
}

const ChatMessageLinkify: FC<ChatMessageLinkifyProps> = (props) => {
  const { className, onInternalLinkClick, children } = props;
  const componentDecorator: ReactLinkifyProps["componentDecorator"] =
    useCallback(
      (decoratedHref, decoratedText, key) => {
        const linkClassName = classNames(styles.link, className);
        const parsedLinkData = parseMessageLink(decoratedHref);

        if (parsedLinkData && onInternalLinkClick) {
          return (
            <a
              key={key}
              className={linkClassName}
              onClick={() => onInternalLinkClick(parsedLinkData)}
            >
              {decoratedText}
            </a>
          );
        }

        return (
          <a
            key={key}
            className={linkClassName}
            href={decoratedHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {decoratedText}
          </a>
        );
      },
      [className, onInternalLinkClick],
    );

  return (
    <ReactLinkify componentDecorator={componentDecorator}>
      {children}
    </ReactLinkify>
  );
};

export default ChatMessageLinkify;
