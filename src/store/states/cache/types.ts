import { FeedItemFollowLayoutItem, LoadingState } from "@/shared/interfaces";
import {
  ChatChannelUserStatus,
  ChatMessage,
  CirclesPermissions,
  CommonFeedObjectUserUnique,
  CommonMember,
  Discussion,
  DiscussionMessage,
  Governance,
  Proposal,
  User,
} from "@/shared/models";
import { FeedItems, PinnedFeedItems } from "../common";

export type FeedState = {
  feedItems: FeedItems;
  pinnedFeedItems: PinnedFeedItems;
  sharedFeedItem: FeedItemFollowLayoutItem | null;
};

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
  governanceByCommonIdStates: Record<string, LoadingState<Governance | null>>;
  discussionStates: Record<string, LoadingState<Discussion | null>>;
  proposalStates: Record<string, LoadingState<Proposal | null>>;
  discussionMessagesStates: Record<
    string,
    LoadingState<DiscussionMessage[] | null>
  >;
  chatChannelMessagesStates: Record<string, LoadingState<ChatMessage[]>>;
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
