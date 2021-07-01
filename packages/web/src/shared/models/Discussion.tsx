import { DiscussionMessage } from "./DiscussionMessage";
import { Time, Moderation, File } from "./shared";
import { User } from "./User";

export interface Discussion {
  commonId: string;
  createTime: Date;
  files: File[];
  follower: [];
  images: File[];
  lastMessage: Date;
  message: string;
  moderation?: Moderation;
  ownerId: string;
  title: string;
  updatedAt: Date;
  id: string;
  owner?: User;
  messages?: DiscussionMessage[];
  isLoaded?: boolean;

  description: string;
}
