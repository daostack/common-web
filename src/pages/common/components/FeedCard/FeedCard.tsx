import React, { FC } from "react";
import classNames from "classnames";
import { CommonCard } from "../CommonCard";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  className?: string;
  isActive?: boolean;
}

export const FeedCard: FC<FeedCardProps> = (props) => {
  const { className, isActive = false, children } = props;

  return (
    <CommonCard
      className={classNames(
        styles.container,
        {
          [styles.containerActive]: isActive,
        },
        className,
      )}
    >
      {children}
    </CommonCard>
  );
};
