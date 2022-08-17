import { Moderation } from "@/shared/interfaces/Moderation";
import firebase from "@/shared/utils/firebase";
import { User } from "./User";

export enum DiscussionMessageType {
  Message = "Message",
}

export enum DiscussionMessageFlag {
  Clear = "Clear",
  Reported = "Reported",
  Hidden = "Hidden",
}

export interface DiscussionMessageImage {
  value: string;
}

export interface DiscussionMessageTag {
  value: string;
}

export interface DiscussionMessage {
  id: string;
  discussionId: string;
  commonId: string;
  ownerId: string;
  ownerName: string;
  owner?: User;
  text: string;
  createTime: firebase.firestore.Timestamp;
  ownerAvatar: string;
  moderation?: Moderation;
  parentId?: string;
  images?: DiscussionMessageImage[];
  tags?: DiscussionMessageTag[];
}
