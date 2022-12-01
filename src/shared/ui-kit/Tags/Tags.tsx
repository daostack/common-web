import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Tags.module.scss";

interface TagsProps {
  className?: string;
  tags?: string[];
}

const Tags: FC<TagsProps> = (props) => {
  const { className, tags = [] } = props;

  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={classNames(styles.list, className)}>
      {tags.map((tag, index) => (
        <li key={index} className={styles.item}>
          {tag}
        </li>
      ))}
    </ul>
  );
};

export default Tags;
