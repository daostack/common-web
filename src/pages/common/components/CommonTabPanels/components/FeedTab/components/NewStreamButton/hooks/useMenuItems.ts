import { useDispatch } from "react-redux";
import { animateScroll } from "react-scroll";
import { CommonAction } from "@/shared/constants";
import { MenuItem as Item } from "@/shared/interfaces";
import { commonActions } from "@/store/states";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

export const useMenuItems = (options: Options): Item[] => {
  const dispatch = useDispatch();
  const allowedMenuItems = getAllowedItems(options);

  const setMenuItem = (menuItem: CommonAction) => {
    dispatch(commonActions.setCommonAction(menuItem));
    animateScroll.scrollToTop({ containerId: document.body, smooth: true });
  };

  const items: Item[] = [
    {
      id: CommonAction.NewDiscussion,
      text: "New Discussion",
      onClick: () => {
        setMenuItem(CommonAction.NewDiscussion);
      },
    },
    {
      id: CommonAction.NewProposal,
      text: "New Proposal",
      onClick: () => {
        setMenuItem(CommonAction.NewProposal);
      },
    },
    {
      id: CommonAction.NewContribution,
      text: "New Contribution",
      onClick: () => {
        setMenuItem(CommonAction.NewContribution);
      },
    },
    {
      id: CommonAction.NewSpace,
      text: "New Space",
      onClick: () => {
        options.onNewSpace?.();
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as CommonAction),
  );
};
