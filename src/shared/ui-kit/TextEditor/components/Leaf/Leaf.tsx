import React, { FC } from "react";
import classNames from "classnames";
import { RenderLeafProps } from "slate-react";
import { parseMessageLink } from "@/shared/components/Chat/ChatMessage/components/ChatMessageLinkify/utils";
import useOnInternalLinkClick from "@/shared/hooks/useOnInternalLinkClick";
import styles from "./Leaf.module.scss";

const Leaf: FC<RenderLeafProps> = (props) => {
  const { attributes, leaf, children } = props;
  const { onInternalLinkClick } = useOnInternalLinkClick();
  const className = classNames(styles.leaf, {
    [styles.bold]: leaf.bold,
    [styles.italic]: leaf.italic,
    [styles.underline]: leaf.underline,
  });
  let finalEl = children;

  const internalLink = parseMessageLink(leaf.text);
  if (internalLink) {
    finalEl = (
      <span
        onClick={() => onInternalLinkClick(internalLink)}
        className={styles.internalLink}
      >
        {children}
      </span>
    );
  }

  if (leaf.code) {
    finalEl = <code>{children}</code>;
  }

  return (
    <span className={className} {...attributes}>
      {finalEl}
    </span>
  );
};

export default Leaf;
