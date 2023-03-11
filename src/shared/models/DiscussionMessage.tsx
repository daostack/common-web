import firebase from "firebase/app";
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
  text: string;
  moderation?: Moderation;
}

export interface DiscussionMessage extends BaseEntity {
  discussionId: string;
  commonId: string;
  ownerId: string;
  ownerName: string;
  owner?: User;
  text: string;
  ownerAvatar: string;
  moderation?: Moderation;
  parentId?: string;
  images?: Link[];
  tags?: DiscussionMessageTag[];
  parentMessage: ParentDiscussionMessage | null;
  editedAt: firebase.firestore.Timestamp;
}

export enum PendingMessageStatus {
  Sending,
  Failed,
  Success,
}

export interface PendingMessage {
  id: string;
  text: string;
  status: PendingMessageStatus;
}
