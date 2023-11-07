import { createTransform } from "redux-persist";
import { deserializeFeedLayoutItemWithFollowData } from "@/shared/interfaces";
import { convertObjectDatesToFirestoreTimestamps } from "@/shared/utils";
import { InboxItems, InboxState } from "./states/inbox";

export const inboxTransform = createTransform(
  (inboundState: InboxState) => inboundState,
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
      hasMore: true,
      data:
        outboundState.items.data &&
        outboundState.items.data.map(deserializeFeedLayoutItemWithFollowData),
    },
  }),
  { whitelist: ["inbox"] },
);
