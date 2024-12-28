import { createTransform } from "redux-persist";
import {
  deserializeFeedLayoutItemWithFollowData,
  LoadingState,
} from "@/shared/interfaces";
import { convertObjectDatesToFirestoreTimestamps } from "@/shared/utils";
import { MultipleSpacesLayoutState } from "@/store/states";
import { getFeedLayoutItemDateForSorting } from "@/store/states/inbox/utils";
import { CacheState, INITIAL_CACHE_STATE } from "./states/cache";
import {
  InboxItems,
  InboxState,
  INITIAL_INBOX_ITEMS,
  INITIAL_INBOX_STATE,
} from "./states/inbox";

const clearNonFinishedStates = <T extends unknown>(
  states: Record<string, LoadingState<T>>,
): Record<string, LoadingState<T>> =>
  Object.entries(states).reduce((acc, [key, value]) => {
    if (value.loading || !value.fetched || !value.data) {
      return acc;
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

export const inboxTransform = createTransform(
  (inboundState: InboxState) => {
    if (inboundState.items.unread) {
      return {
        ...inboundState,
        lastReadState: null,
        lastUnreadState: null,
        items: { ...INITIAL_INBOX_ITEMS },
      };
    }

    const data =
      inboundState.items.data && inboundState.items.data;

    return {
      ...inboundState,
      lastReadState: null,
      lastUnreadState: null,
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
  (outboundState: InboxState) => {
    if (outboundState.items.unread !== INITIAL_INBOX_ITEMS.unread) {
      return { ...INITIAL_INBOX_STATE };
    }

    return {
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
    };
  },
  { whitelist: ["inbox"] },
);

export const cacheTransform = createTransform(
  (inboundState: CacheState) => {
    const chatChannelMessagesStates = Object.entries(
      clearNonFinishedStates(inboundState.chatChannelMessagesStates),
    ).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          loading: true,
          data: value.data.slice(-20),
        },
      }),
      {},
    );

    return {
      ...INITIAL_CACHE_STATE,
      userStates: clearNonFinishedStates(inboundState.userStates),
      governanceByCommonIdStates: clearNonFinishedStates(
        inboundState.governanceByCommonIdStates,
      ),
      discussionStates: clearNonFinishedStates(inboundState.discussionStates),
      proposalStates: clearNonFinishedStates(inboundState.proposalStates),
      chatChannelMessagesStates,
      commonMembersState: clearNonFinishedStates(
        inboundState.commonMembersState,
      ),
      feedByCommonIdStates: inboundState.feedByCommonIdStates,
      feedItemUserMetadataStates: clearNonFinishedStates(
        inboundState.feedItemUserMetadataStates,
      ),
      chatChannelUserStatusStates: clearNonFinishedStates(
        inboundState.chatChannelUserStatusStates,
      ),
      commonMemberByUserAndCommonIdsStates: clearNonFinishedStates(
        inboundState.commonMemberByUserAndCommonIdsStates,
      ),
    };
  },
  (outboundState: CacheState) => outboundState,
  { whitelist: ["cache"] },
);

export const multipleSpacesLayoutTransform = createTransform(
  (inboundState: MultipleSpacesLayoutState) => ({
    ...inboundState,
    breadcrumbs: null,
    backUrl: null,
  }),
  (outboundState: MultipleSpacesLayoutState) => outboundState,
  { whitelist: ["multipleSpacesLayout"] },
);
