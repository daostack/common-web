import { put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  getChatChannelUserStatusKey,
  getFeedItemUserMetadataKey,
} from "@/shared/constants";
import {
  FeedLayoutItemWithFollowData,
  checkIsChatChannelLayoutItem,
} from "@/shared/interfaces";
import {
  ChatChannelUserStatus,
  CommonFeedObjectUserUnique,
} from "@/shared/models";
import {
  selectChatChannelUserStatusStates,
  selectFeedItemUserMetadataStates,
} from "@/store/states";
import * as actions from "../actions";
import { selectFilteredInboxItems } from "../selectors";
import { getFilterBySearchValueFn } from "./searchInboxItems";

export function* searchUnreadInboxItems(searchValue: string) {
  yield put(actions.setIsSearchingInboxItems(true));

  const items: FeedLayoutItemWithFollowData[] = yield select(
    selectFilteredInboxItems,
  );
  const feedItemUserMetadataStates = yield select(
    selectFeedItemUserMetadataStates,
  );
  const chatChannelUserStatusStates = yield select(
    selectChatChannelUserStatusStates,
  );
  const user = yield select(selectUser());
  const userId = user?.uid;

  const filteredInboxItems = items
    .filter((item) => {
      if (checkIsChatChannelLayoutItem(item)) {
        const key = getChatChannelUserStatusKey({
          userId,
          chatChannelId: item.chatChannel.id,
        });
        const chatChannelUserStatus: ChatChannelUserStatus | undefined =
          chatChannelUserStatusStates[key]?.data;

        if (!chatChannelUserStatus) {
          return false;
        }

        return (
          Boolean(chatChannelUserStatus.notSeenCount) ||
          !chatChannelUserStatus.seen
        );
      } else {
        const key = getFeedItemUserMetadataKey({
          userId,
          commonId: item.feedItemFollowWithMetadata.commonId,
          feedObjectId: item.itemId,
        });
        const feedItemUserMetadata: CommonFeedObjectUserUnique | undefined =
          feedItemUserMetadataStates[key]?.data;

        if (!feedItemUserMetadata) {
          return false;
        }

        return (
          Boolean(feedItemUserMetadata.count) || !feedItemUserMetadata.seen
        );
      }
    })
    .filter(yield getFilterBySearchValueFn(searchValue));

  yield put(
    actions.setSearchState({
      searchValue,
      isSearching: false,
      items: filteredInboxItems,
    }),
  );
}
