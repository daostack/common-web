import React, { FC } from "react";
import styles from "./Tags.module.scss";

interface TagsProps {
  tags: string[];
}

const Tags: FC<TagsProps> = (props) => {
  const { tags } = props;

  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {tags.map((tag, index) => (
        <li key={index} className={styles.item}>
          {tag}
        </li>
      ))}
    </ul>
  );
};

export default Tags;
