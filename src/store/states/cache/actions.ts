import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LoadingState, PayloadWithOptionalCallback } from "@/shared/interfaces";
import { Discussion, Proposal, User } from "@/shared/models";
import { CacheActionType } from "./constants";

export const getUserStateById = createAsyncAction(
  CacheActionType.GET_USER_STATE_BY_ID,
  CacheActionType.GET_USER_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_USER_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { userId: string; force?: boolean },
    User | null,
    Error
  >,
  User | null,
  Error
>();

export const updateUserStateById = createStandardAction(
  CacheActionType.UPDATE_USER_STATE_BY_ID,
)<{
  userId: string;
  state: LoadingState<User | null>;
}>();

export const getDiscussionStateById = createAsyncAction(
  CacheActionType.GET_DISCUSSION_STATE_BY_ID,
  CacheActionType.GET_DISCUSSION_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_DISCUSSION_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { discussionId: string; force?: boolean },
    Discussion | null,
    Error
  >,
  Discussion | null,
  Error
>();

export const updateDiscussionStateById = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_ID,
)<{
  discussionId: string;
  state: LoadingState<Discussion | null>;
}>();

export const getProposalStateById = createAsyncAction(
  CacheActionType.GET_PROPOSAL_STATE_BY_ID,
  CacheActionType.GET_PROPOSAL_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_PROPOSAL_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { proposalId: string; force?: boolean },
    Proposal | null,
    Error
  >,
  Proposal | null,
  Error
>();

export const updateProposalStateById = createStandardAction(
  CacheActionType.UPDATE_PROPOSAL_STATE_BY_ID,
)<{
  proposalId: string;
  state: LoadingState<Proposal | null>;
}>();
