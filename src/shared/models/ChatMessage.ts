import { BaseEntity } from "./BaseEntity";
import { CommonLink } from "./Common";
import { Timestamp } from "./Timestamp";

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
}
