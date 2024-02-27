import React, { FC, useMemo } from "react";
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

  /**
   * TODO: improve.
   */
  const reactionsString = useMemo(() => {
    let emojis = "";
    let totalCount = 0;
    for (const [key, value] of Object.entries(reactions)) {
      totalCount += value;
      emojis += key;
    }

    return totalCount > 1 ? `${totalCount} ${emojis}` : emojis;
  }, [reactions]);

  return <div className={styles.container}>{reactionsString}</div>;
};
