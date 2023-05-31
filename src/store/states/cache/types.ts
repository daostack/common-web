import { LoadingState } from "@/shared/interfaces";
import {
  ChatMessageUserStatus,
  CommonFeedObjectUserUnique,
  Discussion,
  DiscussionMessage,
  Governance,
  Proposal,
  User,
} from "@/shared/models";

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
  governanceByCommonIdStates: Record<string, LoadingState<Governance | null>>;
  discussionStates: Record<string, LoadingState<Discussion | null>>;
  proposalStates: Record<string, LoadingState<Proposal | null>>;
  discussionMessagesStates: Record<
    string,
    LoadingState<DiscussionMessage[] | null>
  >;
  // key: {commonId}_{userId}_{feedObjectId}
  feedItemUserMetadataStates: Record<
    string,
    LoadingState<CommonFeedObjectUserUnique | null>
  >;
  // key: {userId}_{chatChannelId}
  chatMessageUserStatusStates: Record<
    string,
    LoadingState<ChatMessageUserStatus | null>
  >;
}
