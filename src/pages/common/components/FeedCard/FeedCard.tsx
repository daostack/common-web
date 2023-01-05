import React, { FC } from "react";
import classNames from "classnames";
import { CommonCard } from "../CommonCard";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  isActive?: boolean;
}

export const FeedCard: FC<FeedCardProps> = (props) => {
  const { isActive = false, children } = props;

  return (
    <CommonCard
      className={classNames(styles.container, {
        [styles.containerActive]: isActive,
      })}
    >
      {children}
    </CommonCard>
  );
};
