import { FeedLayoutItemWithFollowData } from "@/pages/commonFeed";
import { LoadingState } from "@/shared/interfaces";

export interface Data {
  sharedInboxItem: FeedLayoutItemWithFollowData | null;
}

export type State = LoadingState<Data | null>;

export type CombinedState = LoadingState<Data | null>;
