import firebase from "@/shared/utils/firebase";
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

export interface Discussion {
  id: string;
  title: string;
  message: string;
  ownerId: string;
  commonId: string;
  createTime: firebase.firestore.Timestamp;
  lastMessage: firebase.firestore.Timestamp;
  files: DiscussionFile[];
  images: DiscussionImage[];
  followers: string[];
  moderation?: Moderation;
  messageCount: number;

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
