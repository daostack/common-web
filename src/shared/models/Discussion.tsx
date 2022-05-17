import { DiscussionMessage } from "./DiscussionMessage";
import { Moderation, File, Time } from "./shared";
import { User } from "./User";

export interface Discussion {
  commonId: string;
  createdAt: Time;
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
  isLoaded?: boolean;
  description: string;
}

export interface DiscussionWithHighlightedMessage extends Discussion {
  highlightedMessageId: string;
}

export const isDiscussionWithHighlightedMessage = (discussion: any): discussion is DiscussionWithHighlightedMessage =>
  (discussion && discussion.highlightedMessageId);
