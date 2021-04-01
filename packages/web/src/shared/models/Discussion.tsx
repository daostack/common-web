import { DiscussionMessage } from "./DiscussionMessage";
import { Time, Moderation, File } from "./shared";
import { User } from "./User";

export interface Discussion {
  commonId: string;
  createTime: Time;
  files: File[];
  follower: [];
  images: File[];
  lastMessage: Time;
  message: string;
  moderation?: Moderation;
  ownerId: string;
  title: string;
  updatedAt: Time;
  id: string;
  owner?: User;
  discussionMessage?: DiscussionMessage[];
}
