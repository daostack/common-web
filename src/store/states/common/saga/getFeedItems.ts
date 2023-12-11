import { call, put, select } from "redux-saga/effects";
import { selectCommonStateById } from "@/pages/OldCommon/store/selectors";
import {
  CommonFeedService,
  DiscussionService,
  Logger,
  ProposalService,
} from "@/services";
import { InboxItemType } from "@/shared/constants";
import {
  Awaited,
  FeedItemFollowLayoutItem,
  LoadingState,
} from "@/shared/interfaces";
import { Common, CommonFeedType, Discussion, Proposal } from "@/shared/models";
import { isError } from "@/shared/utils";
import {
  cacheActions,
  selectDiscussionStateById,
  selectFeedStateByCommonId,
} from "@/store/states";
import * as actions from "../actions";
import { selectFeedItems, selectSearchValue } from "../selectors";
import { FeedItems } from "../types";

function* filterFeedItems(feedItems: FeedItemFollowLayoutItem[]) {
  const searchValue = (yield select(selectSearchValue)).toLowerCase();

  if (!searchValue) {
    return;
  }

  yield put(actions.setIsSearchingFeedItems(true));

  const resultFeedItemIds: string[] = [];
  const discussionIdsToFetch: string[] = [];
  const proposalIdsToFetch: string[] = [];

  for (const item of feedItems) {
    if (item.feedItem.data.type === CommonFeedType.Discussion) {
      const discussionId = item.feedItem.data.id;
      const discussionState = (yield select(
        selectDiscussionStateById(discussionId),
      )) as LoadingState<Discussion | null>;

      if (discussionState?.data?.title.toLowerCase().includes(searchValue)) {
        resultFeedItemIds.push(discussionId);
      } else {
        discussionIdsToFetch.push(discussionId);
      }
    }

    if (item.feedItem.data.type === CommonFeedType.Proposal) {
      const proposalId = item.feedItem.data.id;
      const proposalState = (yield select(
        selectDiscussionStateById(proposalId),
      )) as LoadingState<Proposal | null>;

      if (proposalState && proposalState.data) {
        const discussionState = (yield select(
          selectDiscussionStateById(proposalState.data.discussionId),
        )) as LoadingState<Discussion | null>;

        if (discussionState?.data?.title.toLowerCase().includes(searchValue)) {
          resultFeedItemIds.push(proposalId);
        } else {
          proposalIdsToFetch.push(proposalId);
        }
      } else {
        proposalIdsToFetch.push(proposalId);
      }
    }

    if (item.feedItem.data.type === CommonFeedType.Project) {
      const projectId = item.feedItem.data.id;
      const projectState = (yield select(
        selectCommonStateById(projectId),
      )) as LoadingState<Common | null>;

      if (projectState?.data?.name.toLowerCase().includes(searchValue)) {
        resultFeedItemIds.push(projectId);
      }
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
      actions.updateSearchFeedItems([
        ...resultFeedItemIds,
        ...resultFeedDiscussionIds,
      ]),
    );
  } catch (error) {
    Logger.error(error);
  } finally {
    yield put(actions.setIsSearchingFeedItems(false));
  }
}

export function* getFeedItems(
  action: ReturnType<typeof actions.getFeedItems.request>,
) {
  const {
    payload: { commonId, sharedFeedItemId, feedItemId, limit },
  } = action;

  try {
    const currentFeedItems = (yield select(selectFeedItems)) as FeedItems;
    const cachedFeedState = yield select(selectFeedStateByCommonId(commonId));

    if (!currentFeedItems.data && !feedItemId && cachedFeedState) {
      yield put(
        actions.setFeedState({
          data: cachedFeedState,
          sharedFeedItemId,
        }),
      );
      return;
    }

    const isFirstRequest = !currentFeedItems.lastDocTimestamp;
    const { data, firstDocTimestamp, lastDocTimestamp, hasMore } = (yield call(
      CommonFeedService.getCommonFeedItemsByUpdatedAt,
      commonId,
      {
        startAfter: currentFeedItems.lastDocTimestamp,
        feedItemId,
        limit,
      },
    )) as Awaited<
      ReturnType<typeof CommonFeedService.getCommonFeedItemsByUpdatedAt>
    >;
    const convertedData: FeedItemFollowLayoutItem[] = data.map((item) => ({
      type: InboxItemType.FeedItemFollow,
      itemId: item.id,
      feedItem: item,
    }));

    yield put(
      actions.getFeedItems.success({
        data: convertedData,
        lastDocTimestamp,
        hasMore,
        firstDocTimestamp: isFirstRequest
          ? firstDocTimestamp
          : currentFeedItems.firstDocTimestamp,
      }),
    );

    if (!isFirstRequest) {
      yield filterFeedItems(convertedData);
    }
  } catch (error) {
    if (isError(error)) {
      yield put(actions.getFeedItems.failure(error));
    }
  }
}
