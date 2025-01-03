import { BaseEntity } from "./BaseEntity";
import { DiscussionMessage } from "./DiscussionMessage";
import { Link } from "./Link";
import { SoftDeleteEntity } from "./SoftDeleteEntity";
import { Timestamp } from "./Timestamp";
import { User } from "./User";
import { Moderation } from "./shared";

export enum PredefinedTypes {
  General = "general",
}

export interface Discussion extends BaseEntity, SoftDeleteEntity {
  title: string;
  message: string;
  ownerId: string;
  owner?: User;
  commonId: string;
  lastMessage: Timestamp;
  files: Link[];
  images: Link[];
  followers: string[];
  moderation?: Moderation;
  messageCount: number;
  discussionMessages: DiscussionMessage[];
  predefinedType?: PredefinedTypes;
  notionByCommon?: Record<string, DiscussionNotion>;

  /**
   * List of common IDs that are have linked this discussion
   */
  linkedCommonIds: string[];

  /**
   * A discussion can be linked to a proposal, if it does - proposalId will exist.
   */
  proposalId?: string;

  /**
   * If array is empty, everyone in common can view.
   * If discussion is attached to a proposal, this field will be not exist.
   */
  circleVisibility?: string[];

  /**
   * If array is empty, everyone in common can view.
   * If discussion is attached to a proposal, this field is null.
   */
  circleVisibilityByCommon: Record<string, string[]> | null;
}

export interface DiscussionWithOwnerInfo extends Discussion {
  owner: User;
}

export interface DiscussionWithHighlightedMessage extends Discussion {
  highlightedMessageId: string;
}

export interface DiscussionNotion {
  pageId: string;
}

export const isDiscussionWithHighlightedMessage = (
  discussion: any,
): discussion is DiscussionWithHighlightedMessage =>
  discussion && discussion.highlightedMessageId;
