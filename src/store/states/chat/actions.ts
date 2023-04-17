import { createStandardAction } from "typesafe-actions";
import { DiscussionMessage } from "@/shared/models";
import { ChatActionTypes } from "./constants";
import { FileInfo } from "./types";

export const setCurrentDiscussionMessageReply = createStandardAction(
  ChatActionTypes.SET_DISCUSSION_MESSAGE_REPLY,
)<DiscussionMessage>();

export const clearCurrentDiscussionMessageReply = createStandardAction(
  ChatActionTypes.CLEAR_DISCUSSION_MESSAGE_REPLY,
)();

export const setFilesPreview = createStandardAction(
  ChatActionTypes.SET_FILES_PREVIEW,
)<FileInfo[]>();

export const clearFilesPreview = createStandardAction(
  ChatActionTypes.CLEAR_FILES_PREVIEW,
)();

