import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { CommonTab } from "@/pages/common/constants";
import { Common } from "@/shared/models";
import { CommonBreadcrumbs } from "../../../CommonBreadcrumbs";
import styles from "./TabNavigation.module.scss";

interface TabNavigationProps {
  className?: string;
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
  rightContent?: ReactNode;
}

const TabNavigation: FC<TabNavigationProps> = (props) => {
  const { className, activeTab, common, parentCommons, rightContent } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <CommonBreadcrumbs
        activeTab={activeTab}
        common={common}
        parentCommons={parentCommons}
      />
      {rightContent}
    </div>
  );
};

export default TabNavigation;
