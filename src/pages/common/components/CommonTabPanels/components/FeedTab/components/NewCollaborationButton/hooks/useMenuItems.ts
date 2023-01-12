import { useDispatch } from "react-redux";
import { NewCollaborationMenuItem } from "@/shared/constants";
import { MenuItem as Item } from "@/shared/interfaces";
import { commonActions } from "@/store/states";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const dispatch = useDispatch();
  const allowedMenuItems = getAllowedItems(options);

  const setMenuItem = (menuItem: NewCollaborationMenuItem) => {
    dispatch(commonActions.setNewCollaborationMenuItem(menuItem));
  };

  const items: Item[] = [
    {
      id: NewCollaborationMenuItem.NewProposal,
      text: "New Proposal",
      onClick: () => {
        setMenuItem(NewCollaborationMenuItem.NewProposal);
      },
    },
    {
      id: NewCollaborationMenuItem.NewDiscussion,
      text: "New Discussion",
      onClick: () => {
        setMenuItem(NewCollaborationMenuItem.NewDiscussion);
      },
    },
    {
      id: NewCollaborationMenuItem.NewContribution,
      text: "New Contribution",
      onClick: () => {
        setMenuItem(NewCollaborationMenuItem.NewContribution);
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as NewCollaborationMenuItem),
  );
};
