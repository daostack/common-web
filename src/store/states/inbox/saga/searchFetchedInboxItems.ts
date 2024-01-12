import { call, put, select } from "redux-saga/effects";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  DiscussionService,
  Logger,
  ProposalService,
  UserService,
} from "@/services";
import {
  ChatChannelLayoutItem,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItemWithFollowData,
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
  cacheActions,
  selectDiscussionStateById,
  selectUserStateById,
} from "../../cache";
import * as actions from "../actions";
import { selectInboxSearchValue } from "../selectors";

export function doesUserMatchSearchValue(
  user: User,
  searchValue: string,
): boolean {
  const displayName = user.displayName || `${user.firstName} ${user.lastName}`;

  return displayName.toLowerCase().includes(searchValue);
}

function* doesDiscussionMatchSearchValue(
  searchValue: string,
  discussionId: string,
  item: FeedItemFollowLayoutItemWithFollowData,
) {
  const discussionState = (yield select(
    selectDiscussionStateById(discussionId),
  )) as LoadingState<Discussion | null>;

  if (!discussionState?.data) {
    return false;
  }

  const title =
    discussionState.data.predefinedType === PredefinedTypes.General
      ? item.feedItemFollowWithMetadata.commonName
      : discussionState.data.title;

  return Boolean(title?.toLowerCase().includes(searchValue));
}

function* doesProposalMatchSearchValue(
  searchValue: string,
  proposalId: string,
  item: FeedItemFollowLayoutItemWithFollowData,
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
    item,
  );
}

export function* getParticipantById(participantId: string) {
  const participantState: LoadingState<User | null> | null =
    yield selectUserStateById(participantId);

  return participantState?.data;
}

function* doesChatChannelMatchSearchValue(
  searchValue: string,
  item: ChatChannelLayoutItem,
) {
  const user = yield select(selectUser());
  const userId = user?.uid;

  for (const participantId of item.chatChannel.participants) {
    if (participantId !== userId) {
      const participant = yield getParticipantById(participantId);

      if (participant) {
        return doesUserMatchSearchValue(participant, searchValue);
      }
    }
  }

  return false;
}

function* getChatChannelParticipantsToFetch(item: ChatChannelLayoutItem) {
  const user = yield select(selectUser());
  const userId = user?.uid;
  const userIdsToFetch: string[] = [];

  for (const participantId of item.chatChannel.participants) {
    if (participantId !== userId) {
      const participant = yield getParticipantById(participantId);

      if (!participant) {
        userIdsToFetch.push(participantId);
      }
    }
  }

  return userIdsToFetch;
}

export function* searchFetchedInboxFeedItems(
  inboxItems: FeedItemFollowLayoutItemWithFollowData[],
  searchValue: string,
) {
  const resultInboxItemIds: string[] = [];
  const discussionIdsToFetch: string[] = [];
  const proposalIdsToFetch: string[] = [];

  for (const item of inboxItems) {
    const feedItemId = item.feedItem.data.id;

    switch (item.feedItem.data.type) {
      case CommonFeedType.Discussion:
        (yield doesDiscussionMatchSearchValue(searchValue, feedItemId, item))
          ? resultInboxItemIds.push(feedItemId)
          : discussionIdsToFetch.push(feedItemId);
        break;
      case CommonFeedType.Proposal:
        (yield doesProposalMatchSearchValue(searchValue, feedItemId, item))
          ? resultInboxItemIds.push(feedItemId)
          : proposalIdsToFetch.push(feedItemId);
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

    const resultInboxDiscussionIds = discussions
      .filter(
        (discussion) =>
          discussion && discussion.title.toLowerCase().includes(searchValue),
      )
      .map((discussion) => discussion!.id);

    yield put(
      actions.updateSearchInboxItems([
        ...resultInboxItemIds,
        ...resultInboxDiscussionIds,
      ]),
    );
  } catch (error) {
    Logger.error(error);
  }
}

export function* searchFetchedInboxChatChannels(
  inboxItems: ChatChannelLayoutItem[],
  searchValue: string,
) {
  const user = yield select(selectUser());
  const userId = user?.uid;
  const resultInboxItemIds: string[] = [];
  const userIdsToFetch: string[] = [];
  const chatChannelItemsToTest: ChatChannelLayoutItem[] = [];

  for (const item of inboxItems) {
    const idsToFetch: string[] = yield getChatChannelParticipantsToFetch(item);

    if (idsToFetch.length) {
      userIdsToFetch.push(...idsToFetch);
      chatChannelItemsToTest.push(item);
    } else if (yield doesChatChannelMatchSearchValue(searchValue, item)) {
      resultInboxItemIds.push(item.itemId);
    }
  }

  try {
    let users: Array<User | null> = [];

    if (userIdsToFetch.length) {
      users = yield call(
        UserService.getUsersByIds,
        Array.from(new Set(userIdsToFetch)),
      );
      yield put(cacheActions.updateUserStates(users));
    }

    const resultInboxChatChannelIds = chatChannelItemsToTest
      .filter((item) =>
        item.chatChannel.participants.some((participantId) => {
          if (participantId === userId) {
            return false;
          }

          const participant = users.find((u) => u?.uid === participantId);

          if (!participant) {
            return false;
          }

          return doesUserMatchSearchValue(participant, searchValue);
        }),
      )
      .map((item) => item.itemId);

    yield put(
      actions.updateSearchInboxItems([
        ...resultInboxItemIds,
        ...resultInboxChatChannelIds,
      ]),
    );
  } catch (error) {
    Logger.error(error);
  }
}

export function* searchFetchedInboxItems(
  inboxItems: FeedLayoutItemWithFollowData[],
) {
  const searchValue = (yield select(selectInboxSearchValue)).toLowerCase();

  if (!searchValue) {
    return;
  }

  yield put(actions.setIsSearchingInboxItems(true));

  const feedItems: FeedItemFollowLayoutItemWithFollowData[] = [];
  const chatChannels: ChatChannelLayoutItem[] = [];

  for (const item of inboxItems) {
    if (checkIsChatChannelLayoutItem(item)) {
      chatChannels.push(item);
    } else {
      feedItems.push(item);
    }
  }

  try {
    if (feedItems.length) {
      yield searchFetchedInboxFeedItems(feedItems, searchValue);
    }

    if (chatChannels.length) {
      yield searchFetchedInboxChatChannels(chatChannels, searchValue);
    }
  } catch (error) {
    Logger.error(error);
  } finally {
    yield put(actions.setIsSearchingInboxItems(false));
  }
}
