import React, { FC } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { BreadcrumbItem, Breadcrumbs } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { getCommonTabName } from "../../utils";

interface CommonBreadcrumbsProps {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
}

const CommonBreadcrumbs: FC<CommonBreadcrumbsProps> = (props) => {
  const { activeTab, common, parentCommons } = props;
  const items: BreadcrumbItem[] = parentCommons
    .map<BreadcrumbItem>((parentCommon) => ({
      id: parentCommon.id,
      text: parentCommon.name,
      url: ROUTE_PATHS.COMMON.replace(":id", parentCommon.id),
    }))
    .concat({ text: common.name }, { text: getCommonTabName(activeTab) });

  return <Breadcrumbs items={items} />;
};

export default CommonBreadcrumbs;
