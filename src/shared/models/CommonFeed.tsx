import { DiscussionMessageOwnerType } from "@/shared/constants";
import { BaseEntity } from "./BaseEntity";
import { Discussion } from "./Discussion";
import { SoftDeleteEntity } from "./SoftDeleteEntity";

export enum CommonFeedType {
  Proposal = "Proposal",
  Discussion = "Discussion",
  OptimisticDiscussion = "OptimisticDiscussion",
  OptimisticProposal = "OptimisticProposal",
  Project = "Project",
  PayIn = "PayIn",
  ProjectCreation = "ProjectCreation",
  JoinCommon = "JoinCommon",
  JoinProjectInCommon = "JoinProjectInCommon",
}

export enum OptimisticFeedItemState {
  loading = 'loading',
  rejected = 'failed',
  fulfilled = 'fulfilled'
}

export interface LastMessageContent {
  userName: string;
  ownerId: string;
  content: string;
  ownerType?: DiscussionMessageOwnerType;
}

export interface LastMessageContentWithMessageId {
  userName: string;
  ownerId: string;
  content: string;
  ownerType?: DiscussionMessageOwnerType;
  messageId: string;
}

export type DiscussionWithOptimisticData = Discussion & {
  state?: OptimisticFeedItemState; // Optional state property
  lastMessageContent: LastMessageContent; // Additional property
  shouldFocus: boolean;
};

export interface CommonFeed extends BaseEntity, SoftDeleteEntity {
  userId: string;
  commonId: string;
  data: Record<string, unknown> & {
    type: CommonFeedType;
    id: string;
    discussionId: string | null;
    lastMessage?: LastMessageContent;
    hasFiles?: boolean;
    hasImages?: boolean;
  };
  optimisticData?: DiscussionWithOptimisticData;
  circleVisibility: string[];
}
