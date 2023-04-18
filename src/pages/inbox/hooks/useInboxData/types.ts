import { LoadingState } from "@/shared/interfaces";
import { FeedItemFollowWithMetadata } from "@/shared/models";

export interface Data {
  sharedInboxItem: FeedItemFollowWithMetadata | null;
}

export type State = LoadingState<Data | null>;

export type CombinedState = LoadingState<Data | null>;
