import { LoadingState } from "@/shared/interfaces";
import {
  ChatChannelUserStatus,
  CirclesPermissions,
  CommonFeedObjectUserUnique,
  CommonMemberWithUserInfo,
  CommonMember,
  Discussion,
  DiscussionMessage,
  Governance,
  Proposal,
  User,
} from "@/shared/models";
import { CommonState } from "../common";

export type FeedState = Pick<
  CommonState,
  "feedItems" | "pinnedFeedItems" | "sharedFeedItem"
>;

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
  governanceByCommonIdStates: Record<string, LoadingState<Governance | null>>;
  discussionStates: Record<string, LoadingState<Discussion | null>>;
  proposalStates: Record<string, LoadingState<Proposal | null>>;
  discussionMessagesStates: Record<
    string,
    LoadingState<DiscussionMessage[] | null>
  >;
  commonMembersState: Record<string, LoadingState<CommonMember[] | null>>;
  feedByCommonIdStates: Record<string, FeedState>;
  // key: {commonId}_{userId}_{feedObjectId}
  feedItemUserMetadataStates: Record<
    string,
    LoadingState<CommonFeedObjectUserUnique | null>
  >;
  // key: {userId}_{chatChannelId}
  chatChannelUserStatusStates: Record<
    string,
    LoadingState<ChatChannelUserStatus | null>
  >;
  // key: {userId}_{commonId}
  commonMemberByUserAndCommonIdsStates: Record<
    string,
    LoadingState<(CommonMember & CirclesPermissions) | null>
  >;
  externalCommonUsers: User[];
}
