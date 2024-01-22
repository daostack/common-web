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
}

export interface UserDiscussionMessage extends BaseDiscussionMessage {
  ownerType: DiscussionMessageOwnerType.User;
  ownerId: string;
  owner?: User;
}

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

export type SystemDiscussionMessage =
  | CommonCreatedSystemMessage
  | CommonMemberAddedSystemMessage
  | CommonEditedSystemMessage
  | CommonDeletedSystemMessage
  | CommonFeedItemCreatedSystemMessage
  | CommonFeedItemDeletedSystemMessage;

export type DiscussionMessage = UserDiscussionMessage | SystemDiscussionMessage;

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

export const checkIsSystemDiscussionMessage = (
  discussionMessage?: BaseDiscussionMessage,
): discussionMessage is SystemDiscussionMessage =>
  discussionMessage?.ownerType === DiscussionMessageOwnerType.System;
