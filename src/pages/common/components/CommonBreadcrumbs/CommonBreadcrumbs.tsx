import React, { FC } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { useCommonDataContext } from "../../providers";
import { getBreadcrumbItems } from "./utils";
import styles from "./CommonBreadcrumbs.module.scss";

interface CommonBreadcrumbsProps {
  activeTab: CommonTab;
}

const CommonBreadcrumbs: FC<CommonBreadcrumbsProps> = (props) => {
  const { activeTab } = props;
  const { common, parentCommons, newCollaborationMenuItem } =
    useCommonDataContext();
  const items: BreadcrumbItem[] = getBreadcrumbItems({
    activeTab,
    common,
    parentCommons,
    newCollaborationMenuItem,
  });

  return (
    <Breadcrumbs
      items={items}
      styles={{
        listItemWrapper: styles.breadcrumbListItemWrapper,
        item: styles.breadcrumbItem,
      }}
    />
  );
};

export default CommonBreadcrumbs;
