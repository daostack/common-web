import { useDispatch } from "react-redux";
import { CommonAction } from "@/shared/constants";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { commonActions } from "@/store/states";
import { DiscussionCardMenuItem } from "../constants";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

interface Actions {
  report: () => void;
  share: () => void;
}

export const useMenuItems = (options: Options, actions: Actions): Item[] => {
  const dispatch = useDispatch();
  const { discussion, governanceCircles } = options;
  const { report, share } = actions;
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: DiscussionCardMenuItem.Share,
      text: "Share",
      onClick: share,
    },
    {
      id: DiscussionCardMenuItem.Report,
      text: "Report",
      onClick: report,
    },
    {
      id: DiscussionCardMenuItem.Edit,
      text: "Edit",
      onClick: () => {
        if (!discussion || !governanceCircles) {
          return;
        }

        const circles = Object.values(governanceCircles).filter((circle) =>
          discussion.circleVisibility?.includes(circle.id),
        );
        const circle = null;

        dispatch(
          commonActions.setDiscussionCreationData({
            circle: null,
            title: discussion.title,
            content: parseStringToTextEditorValue(discussion.message),
            images: [],
          }),
        );
        dispatch(commonActions.setCommonAction(CommonAction.EditDiscussion));
      },
    },
    {
      id: DiscussionCardMenuItem.Remove,
      text: "Remove",
      onClick: () => {
        console.log(DiscussionCardMenuItem.Remove);
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as DiscussionCardMenuItem),
  );
};
