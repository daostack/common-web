import { createAsyncAction, createStandardAction } from "typesafe-actions";
import {
  CreateDiscussionDto,
  CreateProposalWithFiles,
  EditDiscussionDto,
} from "@/pages/OldCommon/interfaces";
import { CommonAction, ProposalsTypes } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
  PayloadWithOptionalCallback,
  RecentAssignedCircle,
  UploadFile,
} from "@/shared/interfaces";
import {
  CommonFeed,
  CommonMember,
  Discussion,
  Governance,
  Proposal,
} from "@/shared/models";
import { CommonActionType } from "./constants";
import { FeedItems, PinnedFeedItems } from "./types";

export const resetCommon = createStandardAction(
  CommonActionType.RESET_COMMON,
)();

export const setCommonAction = createStandardAction(
  CommonActionType.SET_COMMON_ACTION,
)<CommonAction | null>();

export const setCommonMember = createStandardAction(
  CommonActionType.SET_COMMON_MEMBER,
)<CommonMember | null>();

export const setCommonGovernance = createStandardAction(
  CommonActionType.SET_COMMON_GOVERNANCE,
)<Governance | null>();

export const setDiscussionCreationData = createStandardAction(
  CommonActionType.SET_DISCUSSION_CREATION_DATA,
)<NewDiscussionCreationFormValues | null>();

export const setProposalCreationData = createStandardAction(
  CommonActionType.SET_PROPOSAL_CREATION_DATA,
)<NewProposalCreationFormValues | null>();

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
  >,
  Discussion,
  Error
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
  >,
  Discussion,
  Error
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
  >,
  Proposal,
  Error
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
  >,
  Proposal,
  Error
>();

export const getFeedItems = createAsyncAction(
  CommonActionType.GET_FEED_ITEMS,
  CommonActionType.GET_FEED_ITEMS_SUCCESS,
  CommonActionType.GET_FEED_ITEMS_FAILURE,
  CommonActionType.GET_FEED_ITEMS_CANCEL,
)<
  {
    commonId: string;
    resourceId?: string;
    limit?: number;
  },
  Omit<FeedItems, "loading">,
  Error,
  string
>();

export const getPinnedFeedItems = createAsyncAction(
  CommonActionType.GET_PINNED_FEED_ITEMS,
  CommonActionType.GET_PINNED_FEED_ITEMS_SUCCESS,
  CommonActionType.GET_PINNED_FEED_ITEMS_FAILURE,
  CommonActionType.GET_PINNED_FEED_ITEMS_CANCEL,
)<
  {
    commonId: string;
  },
  Omit<PinnedFeedItems, "loading">,
  Error,
  string
>();

export const addNewFeedItems = createStandardAction(
  CommonActionType.ADD_NEW_FEED_ITEMS,
)<
  {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[]
>();

export const addNewPinnedFeedItems = createStandardAction(
  CommonActionType.ADD_NEW_PINNED_FEED_ITEMS,
)<
  {
    commonFeedItem: CommonFeed;
    statuses: {
      isAdded: boolean;
      isRemoved: boolean;
    };
  }[]
>();

export const unpinFeedItems = createStandardAction(
  CommonActionType.UNPIN_FEED_ITEMS,
)<string[]>();

export const updateFeedItem = createStandardAction(
  CommonActionType.UPDATE_FEED_ITEM,
)<{
  item: Partial<CommonFeed> & { id: string };
  isRemoved?: boolean;
}>();

export const resetFeedItems = createStandardAction(
  CommonActionType.RESET_FEED_ITEMS,
)();

export const setIsNewProjectCreated = createStandardAction(
  CommonActionType.SET_IS_NEW_PROJECT_CREATED,
)<boolean>();

export const setSharedFeedItemId = createStandardAction(
  CommonActionType.SET_SHARED_FEED_ITEM_ID,
)<string | null>();

export const setSharedFeedItem = createStandardAction(
  CommonActionType.SET_SHARED_FEED_ITEM,
)<CommonFeed | null>();

export const setRecentStreamId = createStandardAction(
  CommonActionType.SET_RECENT_STREAM_ID,
)<string>();

export const setRecentAssignedCircle = createStandardAction(
  CommonActionType.SET_RECENT_ASSIGNED_CIRCLE,
)<RecentAssignedCircle | null>();
