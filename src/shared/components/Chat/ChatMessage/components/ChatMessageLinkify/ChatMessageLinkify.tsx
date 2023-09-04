import React, { FC, useCallback } from "react";
import {
  default as ReactLinkify,
  Props as ReactLinkifyProps,
} from "react-linkify";
import classNames from "classnames";
import styles from "./ChatMessageLinkify.module.scss";

interface ChatMessageLinkifyProps {
  className?: string;
}

const ChatMessageLinkify: FC<ChatMessageLinkifyProps> = (props) => {
  const { className, children } = props;
  const componentDecorator: ReactLinkifyProps["componentDecorator"] =
    useCallback(
      (decoratedHref, decoratedText, key) => (
        <a
          className={classNames(styles.link, className)}
          href={decoratedHref}
          key={key}
          target="_blank"
          rel="noopener noreferrer"
        >
          {decoratedText}
        </a>
      ),
      [className],
    );

  return (
    <ReactLinkify componentDecorator={componentDecorator}>
      {children}
    </ReactLinkify>
  );
};

export default ChatMessageLinkify;
