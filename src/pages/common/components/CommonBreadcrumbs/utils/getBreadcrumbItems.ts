import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { BreadcrumbItem } from "@/shared/ui-kit";
import { CommonTab } from "../../../constants";
import { getCommonTabName } from "../../../utils";

export const getBreadcrumbItems = ({
  activeTab,
  common,
  parentCommons,
}: {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
}): BreadcrumbItem[] =>
  parentCommons
    .map<BreadcrumbItem>((parentCommon) => ({
      id: parentCommon.id,
      text: parentCommon.name,
      url: ROUTE_PATHS.COMMON.replace(":id", parentCommon.id),
    }))
    .concat({ text: common.name }, { text: getCommonTabName(activeTab) });
