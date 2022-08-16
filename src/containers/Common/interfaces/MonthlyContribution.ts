import { ContributionType } from "@/shared/constants";
import { Subscription } from "@/shared/models";

export interface SubscriptionData {
  amount: number;
  commonId: string;
  contributionType: ContributionType;
  saveCard?: boolean;
}

export interface SubscriptionPayment {
  link: string;
  paymentId: string;
}

export type SubscriptionResponse =
  | SubscriptionPayment
  | Subscription;

export const isSubscriptionPayment = (
  response: SubscriptionResponse
): response is SubscriptionPayment =>
  Boolean((response as SubscriptionPayment).link);
