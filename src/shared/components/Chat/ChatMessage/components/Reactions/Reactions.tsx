import React, { FC } from "react";
import { ReactionCounts } from "@/shared/models";
import styles from "./Reactions.module.scss";

interface ReactionsProps {
  reactions?: ReactionCounts | null;
}

export const Reactions: FC<ReactionsProps> = (props) => {
  const { reactions } = props;

  if (!reactions) {
    return null;
  }

  const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);
  const emojis = Object.keys(reactions).join("");

  return (
    <div className={styles.container}>
      {totalCount > 1 ? `${totalCount} ${emojis}` : emojis}
    </div>
  );
};
