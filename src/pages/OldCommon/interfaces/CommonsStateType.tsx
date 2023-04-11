import { Tabs } from "@/pages/OldCommon";
import { LoadingState } from "@/shared/interfaces";
import {
  Common,
  Discussion,
  Governance,
  Proposal,
  Card,
  CommonMember,
} from "@/shared/models";

export interface CommonsStateType {
  commons: Common[];
  common: Common | null;
  governance: Governance | null;
  page: number;
  proposals: Proposal[];
  discussions: Discussion[];
  isCommonsLoaded: boolean;
  isProposalsLoaded: boolean;
  isUserProposalsLoaded: boolean;
  isDiscussionsLoaded: boolean;
  currentDiscussion: Discussion | null;
  currentProposal: Proposal | null;
  userProposals: Proposal[];
  cards: Card[];
  activeTab: Tabs | null;
  commonStates: Record<string, LoadingState<Common | null>>;
  commonMember: CommonMember | null;
  recentFeedItemId: string;
}
