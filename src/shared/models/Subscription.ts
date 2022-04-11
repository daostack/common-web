import { ContributionSourceType, PaymentStatus } from "./Payment";
import { Time } from "./shared";

export enum SubscriptionStatus {
  Pending = "Pending",
  Active = "Active",
  CanceledByUser = "CanceledByUser",
  CanceledByPaymentFailure = "CanceledByPaymentFailure",
  PaymentFailed = "PaymentFailed",
}

export interface SubscriptionMetadata {
  common: {
    id: string;
    name: string;
  };
}

export interface SubscriptionPayment {
  paymentId: string;
  paymentStatus: PaymentStatus;
}

export interface Subscription {
  id: string;
  createdAt: Time;
  updatedAt: Time;
  cardId: string;
  userId: string;
  contributionSourceType: ContributionSourceType;
  proposalId?: string;
  dueDate: Time;
  status: SubscriptionStatus;
  amount: number;
  metadata: SubscriptionMetadata;
  paymentFailures?: SubscriptionPayment[];
  revoked: boolean;
  charges: number;
  lastChargedAt: Time;
}
