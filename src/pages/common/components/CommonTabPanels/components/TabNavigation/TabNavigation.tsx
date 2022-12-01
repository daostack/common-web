import React, { FC } from "react";
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
}

const TabNavigation: FC<TabNavigationProps> = (props) => {
  const { className, activeTab, common, parentCommons } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <CommonBreadcrumbs
        activeTab={activeTab}
        common={common}
        parentCommons={parentCommons}
      />
    </div>
  );
};

export default TabNavigation;
