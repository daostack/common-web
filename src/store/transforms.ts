import { createTransform } from "redux-persist";
import { deserializeFeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { convertObjectDatesToFirestoreTimestamps } from "@/shared/utils";
import { getFeedLayoutItemDateForSorting } from "@/store/states/inbox/utils";
import { CommonLayoutState } from "./states/commonLayout";
import { InboxItems, InboxState } from "./states/inbox";

export const inboxTransform = createTransform(
  (inboundState: InboxState) => {
    const data =
      inboundState.items.data && inboundState.items.data.slice(0, 30);

    return {
      ...inboundState,
      items: {
        ...inboundState.items,
        data,
        loading: false,
        hasMore: true,
        firstDocTimestamp: data?.[0]
          ? getFeedLayoutItemDateForSorting(data[0])
          : null,
        lastDocTimestamp: data?.[data.length - 1]
          ? getFeedLayoutItemDateForSorting(data[data.length - 1])
          : null,
      },
    };
  },
  (outboundState: InboxState) => ({
    ...outboundState,
    sharedItem:
      outboundState.sharedItem &&
      deserializeFeedLayoutItemWithFollowData(outboundState.sharedItem),
    chatChannelItems: [],
    items: {
      ...convertObjectDatesToFirestoreTimestamps<InboxItems>(
        outboundState.items,
        ["firstDocTimestamp", "lastDocTimestamp"],
      ),
      data:
        outboundState.items.data &&
        outboundState.items.data.map(deserializeFeedLayoutItemWithFollowData),
    },
  }),
  { whitelist: ["inbox"] },
);

export const lastCommonFromFeedTransform = createTransform(
  (inboundState: CommonLayoutState) => {
    const rootCommon = inboundState.lastCommonFromFeed?.data?.rootCommon;

    return {
      ...inboundState,
      lastCommonFromFeed: rootCommon
        ? {
            id: rootCommon.id,
            data: rootCommon.data && {
              ...rootCommon.data,
              rootCommon: null,
            },
          }
        : inboundState.lastCommonFromFeed,
    };
  },
  (outboundState: CommonLayoutState) => outboundState,
  { whitelist: ["commonLayout"] },
);
