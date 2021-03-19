import { Time, Moderation, File } from "./shared";

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
}
