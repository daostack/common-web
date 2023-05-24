import { BaseEntity } from "./BaseEntity";
import { CommonLink } from "./Common";
import { Timestamp } from "./Timestamp";

export interface ChatChannel extends BaseEntity {
  name: string;
  description: string;
  participants: string[]; // userIds
  lastMessage?: {
    text: string;
    createdAt: Timestamp;
    ownerName: string;
    ownerAvatar: CommonLink;
    id: string;
  };
  messageCount: number;
  createdBy: string;
}
