import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useRoutesContext } from "@/shared/contexts";
import { BreadcrumbItem, Breadcrumbs } from "@/shared/ui-kit";
import { selectCommonAction } from "@/store/states";
import { CommonTab } from "../../constants";
import { useCommonDataContext } from "../../providers";
import { getBreadcrumbItems } from "./utils";
import styles from "./CommonBreadcrumbs.module.scss";

interface CommonBreadcrumbsProps {
  activeTab: CommonTab;
}

const CommonBreadcrumbs: FC<CommonBreadcrumbsProps> = (props) => {
  const { activeTab } = props;
  const { getCommonPagePath } = useRoutesContext();
  const { common, parentCommons } = useCommonDataContext();
  const commonAction = useSelector(selectCommonAction(common.id));
  const items: BreadcrumbItem[] = getBreadcrumbItems({
    activeTab,
    common,
    parentCommons,
    commonAction,
    generatePagePath: getCommonPagePath,
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
