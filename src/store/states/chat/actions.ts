import { createStandardAction } from "typesafe-actions";
import { DiscussionMessage } from "@/shared/models";
import { ChatActionTypes } from "./constants";

export const setCurrentDiscussionMessageReply = createStandardAction(
  ChatActionTypes.SET_DISCUSSION_MESSAGE_REPLY,
)<DiscussionMessage>();

export const clearCurrentDiscussionMessageReply = createStandardAction(
  ChatActionTypes.CLEAR_DISCUSSION_MESSAGE_REPLY,
)();
