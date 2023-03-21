import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import styles from "./PureCommonTopNavigation.module.scss";

interface PureCommonTopNavigationProps {
  className?: string;
  openSidenavButtonClassName?: string;
  iconEl?: ReactNode;
}

const PureCommonTopNavigation: FC<PureCommonTopNavigationProps> = (props) => {
  const { className, openSidenavButtonClassName, iconEl } = props;

  return (
    <TopNavigation className={classNames(styles.container, className)}>
      <TopNavigationOpenSidenavButton
        className={openSidenavButtonClassName}
        iconEl={iconEl}
      />
    </TopNavigation>
  );
};

export default PureCommonTopNavigation;
