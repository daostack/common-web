import React, { useCallback, FC } from "react";
import classNames from "classnames";
import {
  default as ReactLinkify,
  Props as ReactLinkifyProps,
} from "react-linkify";
import "./index.scss";

interface LinkifyProps {
  linkClassName?: string;
}

const Linkify: FC<LinkifyProps> = (props) => {
  const { linkClassName, children } = props;
  const componentDecorator: ReactLinkifyProps["componentDecorator"] = useCallback(
    (decoratedHref, decoratedText, key) => (
      <a
        className={classNames("linkify-link", linkClassName)}
        href={decoratedHref}
        key={key}
        target="_blank"
        rel="noopener noreferrer"
      >
        {decoratedText}
      </a>
    ),
    [linkClassName]
  );

  return (
    <ReactLinkify componentDecorator={componentDecorator}>
      {children}
    </ReactLinkify>
  );
};

export default Linkify;
