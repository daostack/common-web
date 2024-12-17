import { put, select } from "redux-saga/effects";
import { selectCommonStates } from "@/pages/OldCommon/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Common, CommonFeedType, Discussion, Proposal } from "@/shared/models";
import { selectDiscussionStates, selectProposalStates } from "@/store/states";
import * as actions from "../actions";
import { selectFeedItems, selectPinnedFeedItems } from "../selectors";
import { FeedItems } from "../types";

export function* searchFeedItems(
  action: ReturnType<typeof actions.searchFeedItems>,
) {
  const searchValue = action.payload.searchValue.toLowerCase();
  const commonId = action.payload.commonId;

  if (!searchValue) {
    yield put(actions.resetSearchState({ commonId }));
    return;
  }

  const feedItems = (yield select(selectFeedItems)) as FeedItems;
  const pinnedFeedItems = (yield select(
    selectPinnedFeedItems(commonId),
  )) as FeedItems;
  const discussionStates = yield select(selectDiscussionStates);
  const proposalStates = yield select(selectProposalStates);
  const projectStates = yield select(selectCommonStates());

  const filterFn = ({ feedItem }) => {
    if (feedItem.data.type === CommonFeedType.Discussion) {
      const discussionState: LoadingState<Discussion | null> =
        discussionStates[feedItem.data.id];
      return discussionState?.data?.title.toLowerCase().includes(searchValue);
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

    if (feedItem.data.type === CommonFeedType.Project) {
      const projectState: LoadingState<Common | null> =
        projectStates[feedItem.data.id];
      return projectState?.data?.name.toLowerCase().includes(searchValue);
    }

    return false;
  };

  const filteredFeedItems = feedItems.data?.filter(filterFn) || [];
  const filteredPinnedFeedItems = pinnedFeedItems.data?.filter(filterFn) || [];

  yield put(
    actions.setSearchState({
      state: {
        searchValue,
        isSearching: false,
        feedItems: filteredFeedItems,
        pinnedFeedItems: filteredPinnedFeedItems,
      },
      commonId,
    }),
  );
}
