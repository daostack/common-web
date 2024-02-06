import React, { FC, useCallback } from "react";
import {
  default as ReactLinkify,
  Props as ReactLinkifyProps,
} from "react-linkify";
import classNames from "classnames";
import { parseMessageLink, InternalLinkData } from "@/shared/utils";
import styles from "./InternalLink.module.scss";

interface InternalLinkProps {
  className?: string;
  onInternalLinkClick?: (data: InternalLinkData) => void;
  link: string;
}

export const InternalLink: FC<InternalLinkProps> = (props) => {
  const { className, onInternalLinkClick, children, link } = props;
  const componentDecorator: ReactLinkifyProps["componentDecorator"] =
    useCallback(
      (_, decoratedText, key) => {
        const linkClassName = classNames(styles.link, className);
        const parsedLinkData = parseMessageLink(link);

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
            href={link}
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
