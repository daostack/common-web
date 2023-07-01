import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { InboxItemType } from "@/shared/constants";
import { FeedLayoutItemChangeDataWithType } from "@/shared/interfaces";
import { multipleSpacesLayoutActions } from "@/store/states";

export const useActiveItemDataChange = (): ((
  data: FeedLayoutItemChangeDataWithType,
) => void) => {
  const dispatch = useDispatch();

  return useCallback((data: FeedLayoutItemChangeDataWithType) => {
    if (data.type === InboxItemType.ChatChannel) {
      dispatch(
        multipleSpacesLayoutActions.configureBreadcrumbsData({
          type: data.type,
          activeItem: {
            id: data.itemId,
            name: data.title,
            image: data.image,
          },
        }),
      );
    }
    if (data.type === InboxItemType.FeedItemFollow) {
      dispatch(
        multipleSpacesLayoutActions.configureBreadcrumbsData({
          type: data.type,
          activeItem: {
            id: data.itemId,
            name: data.title,
          },
          activeCommonId: data.commonId,
        }),
      );
    }
  }, []);
};
