import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { CommonTab } from "@/pages/common/constants";
import { Common } from "@/shared/models";
import { CommonBreadcrumbs } from "../../../CommonBreadcrumbs";
import styles from "./TabNavigation.module.scss";

interface TabNavigationProps {
  className?: string;
  activeTab: CommonTab;
  rightContent?: ReactNode;
}

const TabNavigation: FC<TabNavigationProps> = (props) => {
  const { className, activeTab, rightContent } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <CommonBreadcrumbs activeTab={activeTab} />
      {rightContent}
    </div>
  );
};

export default TabNavigation;
