import { createStandardAction } from "typesafe-actions";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CommonActionType } from "./constants";

export const resetCommon = createStandardAction(
  CommonActionType.RESET_COMMON,
)();

export const setDiscussionCreationData = createStandardAction(
  CommonActionType.SET_DISCUSSION_CREATION_DATA,
)<NewDiscussionCreationFormValues | null>();
