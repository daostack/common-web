import { put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  LoadingState,
  checkIsChatChannelLayoutItem,
} from "@/shared/interfaces";
import {
  CommonFeedType,
  Discussion,
  PredefinedTypes,
  Proposal,
  User,
} from "@/shared/models";
import {
  selectDiscussionStates,
  selectProposalStates,
  selectUserStates,
} from "@/store/states";
import * as actions from "../actions";
import { selectInboxItems } from "../selectors";
import { InboxItems } from "../types";
import { doesUserMatchSearchValue } from "./searchFetchedInboxItems";

export function* getFilterBySearchValueFn(searchValue: string) {
  const discussionStates = yield select(selectDiscussionStates);
  const proposalStates = yield select(selectProposalStates);
  const userStates = yield select(selectUserStates);
  const user = yield select(selectUser());
  const userId = user?.uid;

  return (item) => {
    if (checkIsChatChannelLayoutItem(item)) {
      return item.chatChannel.participants.some((participantId) => {
        if (participantId === userId) {
          return false;
        }

        const participantState: LoadingState<User | null> =
          userStates[participantId];
        const participant: User | null = participantState.data;

        if (!participant) {
          return false;
        }

        return doesUserMatchSearchValue(participant, searchValue);
      });
    } else {
      const { feedItem } = item;

      if (feedItem.data.type === CommonFeedType.Discussion) {
        const discussionState: LoadingState<Discussion | null> =
          discussionStates[feedItem.data.id];
        const title =
          discussionState?.data?.predefinedType === PredefinedTypes.General
            ? item.feedItemFollowWithMetadata.commonName
            : discussionState.data?.title;

        return title?.toLowerCase().includes(searchValue);
      }

      if (feedItem.data.type === CommonFeedType.Proposal) {
        const proposalState: LoadingState<Proposal | null> =
          proposalStates[feedItem.data.id];

        if (!proposalState || !proposalState.data) {
          return false;
        }

        const discussionState: LoadingState<Discussion | null> =
          discussionStates[proposalState.data.discussionId];
        return discussionState.data?.title.toLowerCase().includes(searchValue);
      }
    }
  };
}

export function* searchInboxItems(
  action: ReturnType<typeof actions.searchInboxItems>,
) {
  const searchValue = action.payload.toLowerCase();

  if (!searchValue) {
    yield put(actions.resetSearchState());
    return;
  }

  yield put(actions.setIsSearchingInboxItems(true));

  const inboxItems = (yield select(selectInboxItems)) as InboxItems;
  const filteredInboxItems =
    inboxItems.data?.filter(yield getFilterBySearchValueFn(searchValue)) || [];

  yield put(
    actions.setSearchState({
      searchValue,
      isSearching: false,
      items: filteredInboxItems,
    }),
  );
}
