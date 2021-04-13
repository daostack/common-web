import { DiscussionMessage, Rules, User } from ".";
import { Time, Moderation, File } from "./shared";

export interface Proposal {
  commonId: string;
  countdownPeriod: number;
  createdAt: Time;
  description: { description: string; links: Rules[]; images: File[]; files: File[]; title: string };
  fundingRequest?: { funded: boolean; amount: number };
  fundingState: string;
  id: string;
  moderation: Moderation;
  paymentState: string;
  proposerId: string;
  quietEndingPeriod: number;
  state: string;
  type: string;
  updatedAt: Time;
  votesAgainst?: number;
  votesFor?: number;
  proposer?: User;
  discussionMessage?: DiscussionMessage[];
  isLoaded?: boolean;
  join?: {
    cardId: string;
    funding: number;
    fundingType: string;
    ip: string;
  };
}
