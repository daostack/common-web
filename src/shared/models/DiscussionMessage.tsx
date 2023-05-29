import firebase from "firebase/app";
import { DiscussionMessageOwnerType } from "@/shared/constants";
import { Moderation } from "@/shared/interfaces/Moderation";
import { BaseEntity } from "./BaseEntity";
import { Link } from "./Link";
import { User } from "./User";

export enum DiscussionMessageType {
  Message = "Message",
}

export enum DiscussionMessageFlag {
  Clear = "Clear",
  Reported = "Reported",
  Hidden = "Hidden",
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
  tags?: DiscussionMessageTag[];
  parentMessage: ParentDiscussionMessage | null;
  editedAt?: firebase.firestore.Timestamp;
  ownerType: DiscussionMessageOwnerType;
}

interface UserDiscussionMessage extends BaseDiscussionMessage {
  ownerType: DiscussionMessageOwnerType.User;
  ownerId: string;
  owner?: User;
}

interface SystemDiscussionMessage extends BaseDiscussionMessage {
  ownerType: DiscussionMessageOwnerType.System;
}

export type DiscussionMessage = UserDiscussionMessage | SystemDiscussionMessage;

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
