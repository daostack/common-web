import { Currency } from "./Currency";

export enum PaymentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Failed = "failed",
  NotRelevant = "notRelevant",
}

export enum ContributionSourceType {
  JoinProposal = "joinProposal",
  CommonImmediate = "commonImmediate",
}

export interface PaymentAmount {
  amount: number;
  currency: Currency;
}

export interface PaymentFees {
  amount: number;
  currency: Currency;
  error?: string;
}

export interface PaymentSource {
  id: string;
  saleId?: string;
  provider: string;
}

export interface PaymentError {
  code: number;
  details: string;
}

export interface Payment {
  id: string;
  type: "one-time" | "subscription";
  status: PaymentStatus;
  contributionSourceType: ContributionSourceType;
  paymentMethod: "card";
  amount: PaymentAmount;
  fees: PaymentFees;
  source: PaymentSource;
  proposalId?: string;
  commonId?: string;
  subscriptionId?: string | null;
  userId: string;
  error?: PaymentError;
}
