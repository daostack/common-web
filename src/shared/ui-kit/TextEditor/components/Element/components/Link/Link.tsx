import React, { FC } from "react";
import classNames from "classnames";
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
