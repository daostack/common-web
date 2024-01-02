import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { TopNavigation } from "@/shared/ui-kit";
import styles from "./TopNavigationWithBlocks.module.scss";

interface TopNavigationWithBlocksProps {
  className?: string;
  leftElement?: ReactNode;
  centralElement?: ReactNode;
  rightElement?: ReactNode;
}

const TopNavigationWithBlocks: FC<TopNavigationWithBlocksProps> = (props) => {
  const { className, leftElement, centralElement, rightElement } = props;
  const emptyBlockEl = <div className={styles.emptyBlock} />;

  return (
    <TopNavigation className={classNames(styles.container, className)}>
      {leftElement ?? emptyBlockEl}
      {centralElement}
      {rightElement ?? emptyBlockEl}
    </TopNavigation>
  );
};

export default TopNavigationWithBlocks;
