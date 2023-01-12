import { NewCollaborationMenuItem, ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { BreadcrumbItem } from "@/shared/ui-kit";
import { CommonTab } from "../../../constants";
import { getCommonTabName } from "../../../utils";

const NEW_COLLABORATION_ITEM_TO_TEXT_MAP: Record<
  NewCollaborationMenuItem,
  string
> = {
  [NewCollaborationMenuItem.NewProposal]: "New proposal",
  [NewCollaborationMenuItem.NewDiscussion]: "New discussion",
  [NewCollaborationMenuItem.NewContribution]: "New contribution",
};

export const getBreadcrumbItems = ({
  activeTab,
  common,
  parentCommons,
  newCollaborationMenuItem,
}: {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
  newCollaborationMenuItem: NewCollaborationMenuItem | null;
}): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = parentCommons
    .map<BreadcrumbItem>((parentCommon) => ({
      id: parentCommon.id,
      text: parentCommon.name,
      url: ROUTE_PATHS.COMMON.replace(":id", parentCommon.id),
    }))
    .concat({ text: common.name }, { text: getCommonTabName(activeTab) });

  if (newCollaborationMenuItem && activeTab === CommonTab.Feed) {
    items.push({
      text: NEW_COLLABORATION_ITEM_TO_TEXT_MAP[newCollaborationMenuItem],
    });
  }

  return items;
};
