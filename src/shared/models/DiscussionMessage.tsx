import {
  DiscussionMessageOwnerType,
  SystemDiscussionMessageType,
} from "@/shared/constants";
import { Moderation } from "@/shared/interfaces/Moderation";
import { BaseEntity } from "./BaseEntity";
import { CommonFeedType } from "./CommonFeed";
import { Link } from "./Link";
import { Timestamp } from "./Timestamp";
import { User } from "./User";

export enum DiscussionMessageType {
  Message = "Message",
}

export enum DiscussionMessageFlag {
  Clear = "Clear",
  Reported = "Reported",
  Hidden = "Hidden",
}

export enum SystemMessageCommonType {
  Common = "common",
  Space = "space",
}

export enum SystemMessageStreamType {
  Discussion = "discussion",
  Proposal = "proposal",
}

export interface DiscussionMessageTag {
  value: string;
}

export interface ParentDiscussionMessage {
  id: string;
  ownerName: string;
  ownerId?: string;
  text: string;
  moderation?: Moderation;
  images?: Link[];
  files?: Link[];
  createdAt: Timestamp;
}

export interface LinkPreview {
  hidden?: boolean;
  title?: string;
  description?: string;
  image?: {
    height?: number;
    type?: string;
    url: string;
    width?: number;
    alt?: string;
  };
  url: string;
}

interface BaseDiscussionMessage extends BaseEntity {
  discussionId: string;
  commonId: string;
  ownerName: string;
  text: string;
  ownerAvatar: string;
  moderation?: Moderation;
  parentId?: string;
  images?: Link[];
  files?: Link[];
  tags?: DiscussionMessageTag[];
  parentMessage: ParentDiscussionMessage | null;
  editedAt?: Timestamp;
  ownerType: DiscussionMessageOwnerType;
  hasUncheckedItems: boolean;
  linkPreviews?: LinkPreview[];
}

export interface ReactionCounts {
  [key: string]: number;
}

export interface UserDiscussionMessage extends BaseDiscussionMessage {
  ownerType: DiscussionMessageOwnerType.User;
  ownerId: string;
  owner?: User | null;
  reactionCounts?: ReactionCounts;
}

type BotDiscussionMessage = BaseDiscussionMessage & {
  ownerType: DiscussionMessageOwnerType.Bot;
  ownerId: string;
  owner?: User | null;
};

interface BaseSystemDiscussionMessage extends BaseDiscussionMessage {
  ownerType: DiscussionMessageOwnerType.System;
  systemMessageType: SystemDiscussionMessageType;
  systemMessageData: unknown;
}

export interface CommonCreatedSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.CommonCreated;
  systemMessageData: {
    commonType: SystemMessageCommonType;
    commonId: string;
    userId: string;
  };
}

export interface CommonMemberAddedSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.CommonMemberAdded;
  systemMessageData: {
    commonType: SystemMessageCommonType;
    commonId: string;
    userId: string;
  };
}

export interface CommonEditedSystemMessage extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.CommonEdited;
  systemMessageData: {
    commonType: SystemMessageCommonType;
    commonId: string;
    userId: string;
  };
}

export interface CommonDeletedSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.CommonDeleted;
  systemMessageData: {
    commonType: SystemMessageCommonType;
    commonId: string;
    userId?: string;
  };
}

export interface CommonFeedItemCreatedSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.FeedItemCreated;
  systemMessageData: {
    userId: string;
    commonId: string;
    feedItemId: string;
    feedItemType: CommonFeedType;
    feedItemDataId: string;
  };
}

export interface CommonFeedItemDeletedSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.FeedItemDeleted;
  systemMessageData: {
    userId: string;
    commonId: string;
    feedItemId: string;
    feedItemType: CommonFeedType;
    feedItemDataId: string;
  };
}

export interface StreamMovedInternalSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamMovedInternal;
  systemMessageData: {
    type: SystemMessageStreamType;
    sourceCommonId: string;
    targetCommonId: string;
    userId: string;
  };
}

export interface StreamMovedSourceSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamMovedSource;
  systemMessageData: {
    type: SystemMessageStreamType;
    sourceCommonId: string;
    targetCommonId: string;
    feedItemDataId: string;
    userId: string;
  };
}

export interface StreamMovedTargetSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamMovedTarget;
  systemMessageData: StreamMovedSourceSystemMessage["systemMessageData"];
}

export interface StreamLinkedTargetSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamLinkedTarget;
  systemMessageData: StreamMovedSourceSystemMessage["systemMessageData"];
}

export interface StreamLinkedInternalSystemMessage
  extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamLinkedInternal;
  systemMessageData: StreamMovedInternalSystemMessage["systemMessageData"];
}

/**
 * Represents a system message indicating that the current stream was mentioned in another stream
 * @interface StreamMentionedSystemMessage
 * @extends {BaseSystemDiscussionMessage}
 */
export interface StreamMentionedSystemMessage extends BaseSystemDiscussionMessage {
  systemMessageType: SystemDiscussionMessageType.StreamMentioned;
  systemMessageData: {
    userId: string;
    sourceStreamId: string;
    sourceStreamName: string;
  };
}

export type SystemDiscussionMessage =
  | CommonCreatedSystemMessage
  | CommonMemberAddedSystemMessage
  | CommonEditedSystemMessage
  | CommonDeletedSystemMessage
  | CommonFeedItemCreatedSystemMessage
  | CommonFeedItemDeletedSystemMessage
  | StreamMovedInternalSystemMessage
  | StreamMovedSourceSystemMessage
  | StreamMovedTargetSystemMessage
  | StreamLinkedTargetSystemMessage
  | StreamLinkedInternalSystemMessage;

export type DiscussionMessage =
  | UserDiscussionMessage
  | BotDiscussionMessage
  | SystemDiscussionMessage;

export type Text = string | JSX.Element;

export type DiscussionMessageWithParsedText = DiscussionMessage & {
  parsedText: Text[];
};

export enum PendingMessageStatus {
  Sending,
  Failed,
  Success,
}

export interface PendingMessage {
  id: string;
  text: string;
  status: PendingMessageStatus;
  feedItemId: string;
}

export const checkIsUserDiscussionMessage = (
  discussionMessage?: BaseDiscussionMessage,
): discussionMessage is UserDiscussionMessage =>
  discussionMessage?.ownerType === DiscussionMessageOwnerType.User;

export const checkIsBotDiscussionMessage = (
  discussionMessage?: BaseDiscussionMessage,
): discussionMessage is BotDiscussionMessage =>
  discussionMessage?.ownerType === DiscussionMessageOwnerType.Bot;

export const checkIsSystemDiscussionMessage = (
  discussionMessage?: BaseDiscussionMessage,
): discussionMessage is SystemDiscussionMessage =>
  discussionMessage?.ownerType === DiscussionMessageOwnerType.System;

/**
 * TEST CASES for Stream Mention System:
 * 
 * 1. Basic Functionality:
 *    - Mention a stream in a message
 *    - Verify system message appears in mentioned stream
 *    - Verify links are clickable and navigate correctly
 * 
 * 2. Edge Cases:
 *    - Multiple mentions of the same stream in one message
 *    - Mention in a message with other content
 *    - Mention in a message with other types of mentions (@user)
 * 
 * 3. Error Cases:
 *    - Mention a non-existent stream
 *    - Malformed stream mention syntax
 *    - Network issues during system message creation
 * 
 * 4. Performance:
 *    - Multiple stream mentions in one message
 *    - Rapid stream mentions
 *    - Large message content with stream mentions
 */
