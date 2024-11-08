import { ContributionSourceType, PaymentStatus, PaymentAmount } from "./Payment";
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
  price: PaymentAmount;
  commonId: string;
  paymentFailures?: SubscriptionPayment[];
  charges: number;
  lastChargedAt: Time;
  canceledAt?: Time;
}
