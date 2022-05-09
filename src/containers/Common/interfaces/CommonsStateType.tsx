import { 
  Common,
  Discussion,
  Proposal,
  Card,
} from "@/shared/models";
import { Tabs } from "@/containers/Common";

export interface CommonsStateType {
  commons: Common[];
  common: Common | null;
  page: number;
  proposals: Proposal[];
  discussions: Discussion[];
  isDiscussionsLoaded: boolean;
  isProposalsLoaded: boolean;
  currentDiscussion: Discussion | null;
  currentProposal: Proposal | null;
  userProposals: Proposal[];
  cards: Card[];
  activeTab: Tabs | null;
}
