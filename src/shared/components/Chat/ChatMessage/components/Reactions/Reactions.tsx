import React, { FC } from "react";
import { isEmpty } from "lodash";
import { ReactionCounts } from "@/shared/models";
import styles from "./Reactions.module.scss";

interface ReactionsProps {
  reactions?: ReactionCounts | null;
}

export const Reactions: FC<ReactionsProps> = (props) => {
  const { reactions } = props;

  if (!reactions || isEmpty(reactions)) {
    return null;
  }

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);

  if (totalCount === 0) {
    return null;
  }

  const emojis = Object.keys(reactions)
    .filter((key) => reactions[key] > 0)
    .map((emoji, index) => <span key={index}>{emoji}</span>);

  return (
    <div className={styles.container}>
      {totalCount > 1 && (
        <span className={styles.totalCount}>{totalCount}</span>
      )}
      {emojis}
    </div>
  );
};
