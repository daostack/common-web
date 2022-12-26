import React, { FC } from "react";
import classNames from "classnames";
import { RenderLeafProps } from "slate-react";
import styles from "./Leaf.module.scss";

const Leaf: FC<RenderLeafProps> = (props) => {
  const { attributes, leaf, children } = props;
  const className = classNames(styles.leaf, {
    [styles.bold]: leaf.bold,
    [styles.italic]: leaf.italic,
    [styles.underline]: leaf.underline,
  });
  let finalEl = children;

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
