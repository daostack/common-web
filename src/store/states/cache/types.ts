import { LoadingState } from "@/shared/interfaces";
import {
  CommonFeedObjectUserUnique,
  Discussion,
  DiscussionMessage,
  Proposal,
  User,
} from "@/shared/models";

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
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
}
