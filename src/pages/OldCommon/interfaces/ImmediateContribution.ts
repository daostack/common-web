import { ContributionType } from "@/shared/constants";
import { Payment, PaymentAmount, Subscription } from "@/shared/models";

export interface ImmediateContributionData {
  price: PaymentAmount;
  commonId: string;
  contributionType: ContributionType;
  saveCard?: boolean;
}

export interface ImmediateContributionPayment {
  link: string;
  paymentId: string;
}

export type ImmediateContributionResponse =
  | ImmediateContributionPayment
  | Payment
  | Subscription;

export const isImmediateContributionPayment = (
  response: ImmediateContributionResponse,
): response is ImmediateContributionPayment =>
  Boolean((response as ImmediateContributionPayment).link);
