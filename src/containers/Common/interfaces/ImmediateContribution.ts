import { ContributionType } from "@/shared/constants";
import { Payment } from "@/shared/models";

export interface ImmediateContributionData {
  amount: number;
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
  | Payment;

export const isImmediateContributionPayment = (
  response: ImmediateContributionResponse
): response is ImmediateContributionPayment =>
  Boolean((response as ImmediateContributionPayment).link);
