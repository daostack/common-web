import React, { FC } from "react";
import classNames from "classnames";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import styles from "./PureCommonTopNavigation.module.scss";

interface PureCommonTopNavigationProps {
  className?: string;
}

const PureCommonTopNavigation: FC<PureCommonTopNavigationProps> = (props) => {
  const { className } = props;

  return (
    <TopNavigation className={classNames(styles.container, className)}>
      <TopNavigationOpenSidenavButton />
    </TopNavigation>
  );
};

export default PureCommonTopNavigation;
