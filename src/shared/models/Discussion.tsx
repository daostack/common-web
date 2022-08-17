import firebase from "@/shared/utils/firebase";
import { BaseEntity } from "./BaseEntity";
import { DiscussionMessage } from "./DiscussionMessage";
import { User } from "./User";
import { Moderation } from "./shared";

export interface DiscussionFile {
  /**
   * The URL of where the file is
   */
  value: string;
}

export interface DiscussionImage {
  /**
   * The URL of where the image is
   */
  value: string;
}

export interface Discussion extends BaseEntity {
  title: string;
  message: string;
  ownerId: string;
  owner?: User;
  commonId: string;
  createTime: firebase.firestore.Timestamp;
  lastMessage: firebase.firestore.Timestamp;
  files: DiscussionFile[];
  images: DiscussionImage[];
  followers: string[];
  moderation?: Moderation;
  messageCount: number;
  discussionMessages: DiscussionMessage[];

  /**
   * A discussion can be linked to a proposal, if it does - proposalId will exist.
   */
  proposalId?: string;

  /**
   * If array is empty, everyone in common can view.
   * If discussion is attached to a proposal, this field will be not exist.
   */
  circleVisibility?: string[];
}

export interface DiscussionWithOwnerInfo extends Discussion {
  owner: User;
}

export interface DiscussionWithHighlightedMessage extends Discussion {
  highlightedMessageId: string;
}

export const isDiscussionWithHighlightedMessage = (
  discussion: any
): discussion is DiscussionWithHighlightedMessage =>
  discussion && discussion.highlightedMessageId;
