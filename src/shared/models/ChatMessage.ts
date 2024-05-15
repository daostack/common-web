import { BaseEntity } from "./BaseEntity";
import { CommonLink } from "./Common";
import {
  LinkPreview,
  ParentDiscussionMessage,
  ReactionCounts,
} from "./DiscussionMessage";
import { Timestamp } from "./Timestamp";
import { User } from "./User";

export interface ChatMessage extends BaseEntity {
  chatChannelId: string;
  ownerId: string;
  ownerName: string;
  text: string;
  ownerAvatar: CommonLink;
  images?: CommonLink[];
  files?: CommonLink[];
  editedAt?: Timestamp;
  mentions: string[]; // userIds
  parentId?: string;

  owner?: User | null;
  parentMessage?: ParentDiscussionMessage | null;
  hasUncheckedItems: boolean;
  reactionCounts?: ReactionCounts;
  linkPreviews?: LinkPreview[];
}
