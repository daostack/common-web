import { createAsyncAction, createStandardAction } from "typesafe-actions";
import {
  CreateDiscussionDto,
  CreateProposalWithFiles,
  EditDiscussionDto,
} from "@/pages/OldCommon/interfaces";
import { CommonAction, ProposalsTypes } from "@/shared/constants";
import {
  FeedItemFollowLayoutItem,
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
  PayloadWithOptionalCallback,
  UploadFile,
} from "@/shared/interfaces";
import {
  Circle,
  CommonFeed,
  CommonMember,
  Discussion,
  Governance,
  LastMessageContentWithMessageId,
  Proposal,
} from "@/shared/models";
import { CommonActionType } from "./constants";
import {
  CommonSearchState,
  FeedItems,
  FeedItemsPayload,
  PinnedFeedItems,
} from "./types";

export const resetCommon = createStandardAction(
  CommonActionType.RESET_COMMON,
)();

export const setCommonAction = createStandardAction(
  CommonActionType.SET_COMMON_ACTION,
)<CommonAction | null>();

export const setCommonMember = createStandardAction(
  CommonActionType.SET_COMMON_MEMBER,
)<{
  commonId: string;
  member: CommonMember | null;
}>();

export const setCommonGovernance = createStandardAction(
  CommonActionType.SET_COMMON_GOVERNANCE,
)<{
  commonId: string;
  governance: Governance | null;
}>();

export const setDiscussionCreationData = createStandardAction(
  CommonActionType.SET_DISCUSSION_CREATION_DATA,
)<{
  commonId: string;
  data: NewDiscussionCreationFormValues | null;
}>();

export const setProposalCreationData = createStandardAction(
  CommonActionType.SET_PROPOSAL_CREATION_DATA,
)<{
  commonId: string;
  data: NewProposalCreationFormValues | null;
}>();

export const createDiscussion = createAsyncAction(
  CommonActionType.CREATE_DISCUSSION,
  CommonActionType.CREATE_DISCUSSION_SUCCESS,
  CommonActionType.CREATE_DISCUSSION_FAILURE,
)<
  PayloadWithOptionalCallback<
    Omit<CreateDiscussionDto, "files" | "images"> & {
      files?: UploadFile[];
      images?: UploadFile[];
    },
    Discussion,
    Error
  > & { commonId: string },
  { commonId: string; discussion: Discussion },
  { commonId: string; error: Error }
>();

export const editDiscussion = createAsyncAction(
  CommonActionType.EDIT_DISCUSSION,
  CommonActionType.EDIT_DISCUSSION_SUCCESS,
  CommonActionType.EDIT_DISCUSSION_FAILURE,
)<
  PayloadWithOptionalCallback<
    Omit<EditDiscussionDto, "files" | "images"> & {
      files?: UploadFile[];
      images?: UploadFile[];
    },
    Discussion,
    Error
  > & { commonId: string },
  { commonId: string; discussion: Discussion },
  { commonId: string; error: Error }
>();

export const createSurveyProposal = createAsyncAction(
  CommonActionType.CREATE_PROPOSAL,
  CommonActionType.CREATE_PROPOSAL_SUCCESS,
  CommonActionType.CREATE_PROPOSAL_FAILURE,
)<
  PayloadWithOptionalCallback<
    CreateProposalWithFiles<ProposalsTypes.SURVEY>,
    Proposal,
    Error
  > & { commonId: string },
  { commonId: string; proposal: Proposal },
  { commonId: string; error: Error }
>();

export const createFundingProposal = createAsyncAction(
  CommonActionType.CREATE_FUNDING_PROPOSAL,
  CommonActionType.CREATE_FUNDING_PROPOSAL_SUCCESS,
  CommonActionType.CREATE_FUNDING_PROPOSAL_FAILURE,
)<
  PayloadWithOptionalCallback<
    CreateProposalWithFiles<ProposalsTypes.FUNDS_ALLOCATION>,
    Proposal,
    Error
  > & { commonId: string },
  { commonId: string; proposal: Proposal },
  { commonId: string; error: Error }
>();

export const getFeedItems = createAsyncAction(
  CommonActionType.GET_FEED_ITEMS,
  CommonActionType.GET_FEED_ITEMS_SUCCESS,
  CommonActionType.GET_FEED_ITEMS_FAILURE,
  CommonActionType.GET_FEED_ITEMS_CANCEL,
)<
  { commonId: string } & FeedItemsPayload,
  { commonId: string } & Omit<FeedItems, "loading" | "batchNumber">,
  { commonId: string; error: Error },
  { commonId: string }
>();

export const getPinnedFeedItems = createAsyncAction(
  CommonActionType.GET_PINNED_FEED_ITEMS,
  CommonActionType.GET_PINNED_FEED_ITEMS_SUCCESS,
  CommonActionType.GET_PINNED_FEED_ITEMS_FAILURE,
  CommonActionType.GET_PINNED_FEED_ITEMS_CANCEL,
)<
  { commonId: string },
  { commonId: string } & Omit<PinnedFeedItems, "loading">,
  { commonId: string; error: Error },
  { commonId: string }
>();

export const setFeedState = createStandardAction(
  CommonActionType.SET_FEED_STATE,
)<{
  commonId: string;
  data: {
    feedItems: FeedItems;
    pinnedFeedItems: PinnedFeedItems;
    sharedFeedItem: FeedItemFollowLayoutItem;
  };
  sharedFeedItemId?: string | null;
}>();

export const addNewFeedItems = createStandardAction(
  CommonActionType.ADD_NEW_FEED_ITEMS,
)<{
  commonId: string;
  items: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[];
}>();

export const addNewPinnedFeedItems = createStandardAction(
  CommonActionType.ADD_NEW_PINNED_FEED_ITEMS,
)<{
  commonId: string;
  items: {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[];
}>();

export const unpinFeedItems = createStandardAction(
  CommonActionType.UNPIN_FEED_ITEMS,
)<{
  commonId: string;
  itemIds: string[];
}>();

export const updateFeedItem = createStandardAction(
  CommonActionType.UPDATE_FEED_ITEM,
)<{
  commonId: string;
  item: Partial<CommonFeed> & { id: string };
  isRemoved?: boolean;
}>();

export const resetFeedItems = createStandardAction(
  CommonActionType.RESET_FEED_ITEMS,
)<{
  commonId: string;
}>();

export const searchFeedItems = createStandardAction(
  CommonActionType.SEARCH_FEED_ITEMS,
)<{
  commonId: string;
  searchValue: string;
}>();

export const setSearchState = createStandardAction(
  CommonActionType.SET_SEARCH_STATE,
)<{
  commonId: string;
  state: CommonSearchState;
}>();

export const resetSearchState = createStandardAction(
  CommonActionType.RESET_SEARCH_STATE,
)<{
  commonId: string;
}>();

export const updateSearchFeedItems = createStandardAction(
  CommonActionType.UPDATE_SEARCH_FEED_ITEMS,
)<{
  commonId: string;
  itemIds: string[];
}>();

export const setIsSearchingFeedItems = createStandardAction(
  CommonActionType.SET_IS_SEARCHING_FEED_ITEMS,
)<{
  commonId: string;
  isSearching: boolean;
}>();

export const setIsNewProjectCreated = createStandardAction(
  CommonActionType.SET_IS_NEW_PROJECT_CREATED,
)<{
  commonId: string;
  isCreated: boolean;
}>();

export const setSharedFeedItemId = createStandardAction(
  CommonActionType.SET_SHARED_FEED_ITEM_ID,
)<{
  commonId: string;
  sharedFeedItemId: string | null;
}>();

export const setSharedFeedItem = createStandardAction(
  CommonActionType.SET_SHARED_FEED_ITEM,
)<{
  commonId: string;
  feedItem: CommonFeed | null;
}>();

export const setRecentStreamId = createStandardAction(
  CommonActionType.SET_RECENT_STREAM_ID,
)<string>();

export const setPendingFeedItemId = createStandardAction(
  CommonActionType.SET_PENDING_FEED_ITEM_ID,
)<string | null>();

export const setRecentAssignedCircleByMember = createStandardAction(
  CommonActionType.SET_RECENT_ASSIGNED_CIRCLE_BY_MEMBER,
)<{
  commonId: string;
  memberId: string;
  circle: Circle;
}>();

export const resetRecentAssignedCircleByMember = createStandardAction(
  CommonActionType.RESET_RECENT_ASSIGNED_CIRCLE_BY_MEMBER,
)<{
  commonId: string;
}>();

export const setFeedItemUpdatedAt = createStandardAction(
  CommonActionType.SET_FEED_ITEM_UPDATED_AT,
)<{
  commonId: string;
  feedItemId: string;
  lastMessage: LastMessageContentWithMessageId;
}>();
