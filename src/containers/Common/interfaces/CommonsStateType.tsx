import {
  Common,
  Discussion,
  Governance,
  Proposal,
  Card,
} from "@/shared/models";
import { Tabs } from "@/containers/Common";
import {ModerateModalAction} from "@/containers/Common/interfaces/ModerateContent";

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
  moderateModal:ModerateModalAction | null;
}
