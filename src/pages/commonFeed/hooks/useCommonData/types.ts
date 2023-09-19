import { LoadingState } from "@/shared/interfaces";
import { Common, CommonFeed, CommonMember, Governance } from "@/shared/models";

export interface Data {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  commonMembersAmount: number;
  sharedFeedItem: CommonFeed | null;
  rootCommon?: Common | null;
  rootCommonMember: CommonMember | null;
  rootCommonGovernance: Governance | null;
  parentCommon?: Common;
  parentCommonMember: CommonMember | null;
}

export type State = LoadingState<Data | null>;

export type CombinedState = LoadingState<Data | null>;
