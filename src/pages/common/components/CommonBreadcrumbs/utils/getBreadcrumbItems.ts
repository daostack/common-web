import { CommonAction, ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { BreadcrumbItem } from "@/shared/ui-kit";
import { CommonTab } from "../../../constants";
import { getCommonTabName } from "../../../utils";

const COMMON_ACTION_TO_TEXT_MAP: Record<CommonAction, string> = {
  [CommonAction.NewProposal]: "New proposal",
  [CommonAction.NewDiscussion]: "New discussion",
  [CommonAction.EditDiscussion]: "Edit discussion",
  [CommonAction.NewContribution]: "New contribution",
};

export const getBreadcrumbItems = ({
  activeTab,
  common,
  parentCommons,
  commonAction,
}: {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
  commonAction: CommonAction | null;
}): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = parentCommons
    .map<BreadcrumbItem>((parentCommon) => ({
      id: parentCommon.id,
      text: parentCommon.name,
      url: ROUTE_PATHS.COMMON.replace(":id", parentCommon.id),
    }))
    .concat({ text: common.name }, { text: getCommonTabName(activeTab) });

  if (commonAction && activeTab === CommonTab.Feed) {
    items.push({
      text: COMMON_ACTION_TO_TEXT_MAP[commonAction],
    });
  }

  return items;
};
