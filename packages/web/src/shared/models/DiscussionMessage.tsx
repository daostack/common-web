import { Time, Moderation } from "./shared";
import { User } from "./User";

export interface DiscussionMessage {
  commonId: string;
  createTime: Time;
  discussionId: string;
  id: string;
  moderation: Moderation;
  ownerId: string;
  text: string;
  updatedAt: Time;
  owner?: User;
}
