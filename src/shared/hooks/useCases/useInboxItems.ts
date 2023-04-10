import { useDispatch, useSelector } from "react-redux";
import { inboxActions, InboxItems, selectInboxItems } from "@/store/states";

interface Return extends Pick<InboxItems, "data" | "loading" | "hasMore"> {
  fetch: () => void;
}

export const useInboxItems = (idsForNotListening?: string[]): Return => {
  const dispatch = useDispatch();
  const inboxItems = useSelector(selectInboxItems);

  const fetch = () => {
    dispatch(
      inboxActions.getInboxItems.request({
        limit: 15,
      }),
    );
  };

  // useEffect(() => {
  //   if (!inboxItems.firstDocTimestamp) {
  //     return;
  //   }
  //
  //   const unsubscribe = CommonFeedService.subscribeToNewUpdatedCommonFeedItems(
  //     inboxItems.firstDocTimestamp,
  //     (data) => {
  //       if (data.length === 0) {
  //         return;
  //       }
  //
  //       const finalData =
  //         idsForNotListening && idsForNotListening.length > 0
  //           ? data.filter(
  //               (item) => !idsForNotListening.includes(item.commonFeedItem.id),
  //             )
  //           : data;
  //
  //       dispatch(commonActions.addNewFeedItems(finalData));
  //     },
  //   );
  //
  //   return unsubscribe;
  // }, [inboxItems.firstDocTimestamp, idsForNotListening]);

  return {
    ...inboxItems,
    fetch,
  };
};
