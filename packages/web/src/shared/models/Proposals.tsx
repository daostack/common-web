import { DiscussionMessage, Rules, User } from ".";
import { Time, Moderation, File } from "./shared";

export interface Proposal {
  commonId: string;
  countdownPeriod: number;
  createdAt: Time;
  description: { description: string; links: Rules[]; images: File[]; files: File[]; title: string };
  fundingRequest: { funded: boolean; amount: number };
  fundingState: string;
  id: string;
  moderation: Moderation;
  paymentState: string;
  proposerId: string;
  quietEndingPeriod: 10800;
  state: string;
  type: string;
  updatedAt: Time;

  proposer?: User;
  discussionMessage?: DiscussionMessage[];
}
