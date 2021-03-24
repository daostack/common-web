import { Common, Proposal, Discussion } from "../../../shared/models";

export interface CommonsStateType {
  commons: Common[];
  common: Common | null;
  page: number;
  proposals: Proposal[];
  discussions: Discussion[];
}
