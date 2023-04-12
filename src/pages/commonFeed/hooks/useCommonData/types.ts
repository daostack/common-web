import { LoadingState } from "@/shared/interfaces";
import { Common, CommonFeed, Governance } from "@/shared/models";

export interface Data {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  commonMembersAmount: number;
  sharedFeedItem: CommonFeed | null;
}

export type State = LoadingState<Data | null>;

export type CombinedState = LoadingState<Data | null>;
