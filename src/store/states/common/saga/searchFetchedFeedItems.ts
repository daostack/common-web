import { call, put, select } from "redux-saga/effects";
import { selectCommonStateById } from "@/pages/OldCommon/store/selectors";
import { DiscussionService, Logger, ProposalService } from "@/services";
import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";
import { Common, CommonFeedType, Discussion, Proposal } from "@/shared/models";
import { cacheActions, selectDiscussionStateById } from "../../cache";
import * as actions from "../actions";
import { selectFeedSearchValue } from "../selectors";

function* doesDiscussionMatchSearchValue(
  searchValue: string,
  discussionId: string,
) {
  const discussionState = (yield select(
    selectDiscussionStateById(discussionId),
  )) as LoadingState<Discussion | null>;

  return Boolean(
    discussionState?.data?.title.toLowerCase().includes(searchValue),
  );
}

function* doesProposalMatchSearchValue(
  searchValue: string,
  proposalId: string,
) {
  const proposalState = (yield select(
    selectDiscussionStateById(proposalId),
  )) as LoadingState<Proposal | null>;

  if (!proposalState?.data) {
    return false;
  }

  return yield doesDiscussionMatchSearchValue(
    searchValue,
    proposalState.data.discussionId,
  );
}

function* doesProjectMatchSearchValue(searchValue: string, projectId: string) {
  const projectState = (yield select(
    selectCommonStateById(projectId),
  )) as LoadingState<Common | null>;

  return Boolean(projectState?.data?.name.toLowerCase().includes(searchValue));
}

export function* searchFetchedFeedItems({
  data: feedItems,
  commonId,
}: {
  data: FeedItemFollowLayoutItem[];
  commonId: string;
}) {
  const searchValue = (yield select(
    selectFeedSearchValue(commonId),
  )).toLowerCase();

  if (!searchValue) {
    return;
  }

  yield put(actions.setIsSearchingFeedItems({ isSearching: true, commonId }));

  const resultFeedItemIds: string[] = [];
  const discussionIdsToFetch: string[] = [];
  const proposalIdsToFetch: string[] = [];

  for (const item of feedItems) {
    const feedItemId = item.feedItem.data.id;

    switch (item.feedItem.data.type) {
      case CommonFeedType.Discussion:
        (yield doesDiscussionMatchSearchValue(searchValue, feedItemId))
          ? resultFeedItemIds.push(feedItemId)
          : discussionIdsToFetch.push(feedItemId);
        break;
      case CommonFeedType.Proposal:
        (yield doesProposalMatchSearchValue(searchValue, feedItemId))
          ? resultFeedItemIds.push(feedItemId)
          : proposalIdsToFetch.push(feedItemId);
        break;
      case CommonFeedType.Project:
        if (yield doesProjectMatchSearchValue(searchValue, feedItemId)) {
          resultFeedItemIds.push(feedItemId);
        }
        break;
    }
  }

  try {
    let proposals: Array<Proposal | null> = [];
    let discussions: Array<Discussion | null> = [];

    if (proposalIdsToFetch.length) {
      proposals = yield call(
        ProposalService.getProposalsByIds,
        proposalIdsToFetch,
      );
      yield put(cacheActions.updateProposalStates(proposals));
    }

    const proposalDiscussionIds = proposals
      .filter(Boolean)
      .map((proposal) => proposal!.discussionId);
    discussionIdsToFetch.push(...proposalDiscussionIds);

    if (discussionIdsToFetch.length) {
      discussions = yield call(
        DiscussionService.getDiscussionsByIds,
        discussionIdsToFetch,
      );
      yield put(cacheActions.updateDiscussionStates(discussions));
    }

    const resultFeedDiscussionIds = discussions
      .filter(
        (discussion) =>
          discussion && discussion.title.toLowerCase().includes(searchValue),
      )
      .map((discussion) => discussion!.id);

    yield put(
      actions.updateSearchFeedItems({
        itemIds: [...resultFeedItemIds, ...resultFeedDiscussionIds],
        commonId,
      }),
    );
  } catch (error) {
    Logger.error(error);
  } finally {
    yield put(
      actions.setIsSearchingFeedItems({ isSearching: false, commonId }),
    );
  }
}
