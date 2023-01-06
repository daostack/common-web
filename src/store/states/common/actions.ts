import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import firebase from "@/shared/utils/firebase";
import { CommonActionType } from "./constants";
import { FeedItems } from "./types";

export const resetCommon = createStandardAction(
  CommonActionType.RESET_COMMON,
)();

export const setDiscussionCreationData = createStandardAction(
  CommonActionType.SET_DISCUSSION_CREATION_DATA,
)<NewDiscussionCreationFormValues | null>();

export const getFeedItems = createAsyncAction(
  CommonActionType.GET_FEED_ITEMS,
  CommonActionType.GET_FEED_ITEMS_SUCCESS,
  CommonActionType.GET_FEED_ITEMS_FAILURE,
)<
  {
    commonId: string;
    limit?: number;
  },
  Omit<FeedItems, "loading">,
  Error
>();

export const addNewFeedItems = createStandardAction(
  CommonActionType.ADD_NEW_FEED_ITEMS,
)<
  {
    commonFeedItem: CommonFeed;
    docSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed>;
  }[]
>();
